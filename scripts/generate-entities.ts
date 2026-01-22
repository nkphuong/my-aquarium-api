import * as fs from 'fs';
import * as path from 'path';
import { camel, pascal } from 'radash';

const SCHEMA_PATH = path.join(process.cwd(), 'prisma/schema.prisma');
const MODULES_DIR = path.join(process.cwd(), 'src/modules');

// Mapping Prisma types to TS types
const TYPE_MAPPING: Record<string, string> = {
    String: 'string',
    Int: 'number',
    BigInt: 'number', // We use number for IDs in entities
    Boolean: 'boolean',
    DateTime: 'Date',
    Decimal: 'number',
    Float: 'number',
    Json: 'any',
};

async function generate() {
    console.log('🔄 Syncing Entities with Prisma Schema...');

    const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    const models = parsePrismaSchema(schemaContent);

    for (const model of models) {
        const moduleName = findModuleForModel(model.name);
        if (!moduleName) {
            console.warn(`⚠️  No module found for model ${model.name}`);
            continue;
        }

        const entityPath = path.join(MODULES_DIR, moduleName, 'entities', `${camel(model.name)}.entity.ts`);
        const kebabEntityPath = path.join(MODULES_DIR, moduleName, 'entities', `${toKebab(model.name)}.entity.ts`);

        // Check both camel and kebab case filenames
        let targetPath = fs.existsSync(entityPath) ? entityPath : fs.existsSync(kebabEntityPath) ? kebabEntityPath : null;

        if (targetPath) {
            updateEntityFile(targetPath, model);
            console.log(`✅ Updated ${model.name} in ${path.relative(process.cwd(), targetPath)}`);
        } else {
            console.log(`ℹ️  Skipping ${model.name} (Entity file not found)`);
        }
    }
}

function parsePrismaSchema(content: string) {
    const models: { name: string; fields: any[] }[] = [];
    const lines = content.split('\n');
    let currentModel: any = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('model ')) {
            const name = trimmed.split(' ')[1];
            currentModel = { name, fields: [] };
            models.push(currentModel);
        } else if (trimmed === '}') {
            currentModel = null;
        } else if (currentModel && trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('@@')) {
            // Parse field
            const parts = trimmed.split(/\s+/);
            const name = parts[0];
            const type = parts[1];
            const modifiers = trimmed;

            // Skip relations (types that are not in our mapping)
            const isRelation = !TYPE_MAPPING[type.replace('?', '').replace('[]', '')];

            if (!isRelation) {
                currentModel.fields.push({
                    name: camel(name), // Convert snake_case DB field to camelCase prop
                    originalName: name,
                    type: type,
                    isOptional: type.includes('?') || modifiers.includes('default') || modifiers.includes('@updatedAt'),
                    isNullable: type.includes('?'),
                });
            }
        }
    }
    return models;
}

function updateEntityFile(filePath: string, model: any) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract custom code (everything after the properties)
    const classRegex = new RegExp(`export class ${model.name} extends BaseEntity \\{([\\s\\S]*?)\\}`);
    const match = content.match(classRegex);

    if (!match) return;

    const existingBody = match[1];

    // We will assume everything after "// ===== Business Methods =====" is custom.
    const separator = '  // ===== Business Methods =====';
    const parts = existingBody.split(separator);
    let customCode = parts.length > 1 ? parts[1] : '';

    // If separator missing, try to rescue methods (heuristic)
    if (parts.length === 1) {
        // If no separator, assume everything is property block if it looks like one, or try to keep methods.
        // For safety in this project, we rely on the separator. 
        // If missing, we might lose custom code if it's mixed.
        // But previous execution added the separator, so we are safe.
        if (existingBody.includes('archive()')) { // Heuristic check for known method
            // fallback: try to find first method
        }
    }

    const propsBlock = model.fields.map((f: any) => {
        // Skip properties already in BaseEntity
        if (['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at'].includes(f.name)) return '';

        const cleanType = TYPE_MAPPING[f.type.replace('?', '')] || 'any';
        const nullType = f.isNullable ? ' | null' : '';
        // isOptional means property is optional on class instance (?)
        // If database column is optional OR has default, it can be undefined in partial
        const optional = '?';

        // Special cases
        if (f.name === 'isArchived') return `  isArchived: boolean = false;`;

        return `  ${f.name}${optional}: ${cleanType}${nullType};`;
    }).filter(Boolean).join('\n');

    const newContent = content.replace(classRegex, `export class ${model.name} extends BaseEntity {\n${propsBlock}\n\n${separator}${customCode}\n}`);
    fs.writeFileSync(filePath, newContent);
}

function findModuleForModel(modelName: string): string | null {
    const map: Record<string, string> = {
        User: 'auth',
        Tank: 'tank',
        Livestock: 'livestock',
        Fish: 'fish',
        FishSpecies: 'fish-species',
        WaterParameter: 'water-parameter',
    };
    return map[modelName] || camel(modelName);
}

function toKebab(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

generate();
