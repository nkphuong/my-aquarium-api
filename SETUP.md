# Setup Guide

## Initial Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your Supabase credentials:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
  - Go to Supabase Project → Settings → Database
  - Connection string format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
- `PORT`: Application port (default: 3000)

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Migrations (Optional)

If you have migrations or want to create the database schema:

```bash
# Push schema to database (for development)
npx prisma db push

# Or create a migration
npx prisma migrate dev --name init
```

### 5. Run the Application

```bash
# Development mode with hot-reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## Project Structure

This project uses **Clean Architecture** with **DDD** and **Hexagonal Architecture** patterns.

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

See [CLAUDE.md](CLAUDE.md) for development guidelines and step-by-step feature implementation.

## Example: Testing the Fish API

Once the application is running, you can test the Fish API:

### Create a Fish
```bash
curl -X POST http://localhost:3000/fish \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nemo",
    "species": "Clownfish"
  }'
```

### Get All Fish
```bash
curl http://localhost:3000/fish
```

## Development Workflow

### Adding a New Feature

1. **Define Domain Model** (`src/domain/entities/`)
2. **Create Repository Interface** (`src/domain/repositories/`)
3. **Update Prisma Schema** (`prisma/schema.prisma`)
4. **Generate Prisma Client** (`npx prisma generate`)
5. **Implement Repository** (`src/infrastructure/repositories/`)
6. **Create DTOs** (`src/application/dtos/`)
7. **Implement Use Cases** (`src/application/use-cases/`)
8. **Create Controller** (`src/presentation/controllers/`)
9. **Wire Module** (`src/modules/`)
10. **Register in AppModule** (`src/app.module.ts`)

See [CLAUDE.md](CLAUDE.md) for detailed code examples.

## Useful Commands

```bash
# Development
pnpm run start:dev          # Start in watch mode
pnpm run build              # Build for production
pnpm run lint               # Lint code
pnpm run format             # Format code with Prettier

# Testing
pnpm run test               # Run unit tests
pnpm run test:e2e           # Run e2e tests
pnpm run test:cov           # Generate coverage report

# Database
npx prisma generate         # Generate Prisma Client
npx prisma studio           # Open Prisma Studio (DB GUI)
npx prisma migrate dev      # Create and apply migration
npx prisma db push          # Push schema without migration
npx prisma db pull          # Pull schema from database
```

## Troubleshooting

### Prisma Client not found
Run `npx prisma generate` to generate the Prisma Client.

### Database connection error
- Verify `DATABASE_URL` in `.env` is correct
- Check Supabase database is running
- Ensure your IP is whitelisted in Supabase (if applicable)

### TypeScript errors after adding new models
- Run `npx prisma generate` to regenerate Prisma types
- Restart your TypeScript server in your IDE

## Next Steps

- Add more aggregates (Tank, WaterParameter, etc.)
- Implement domain events
- Add validation with class-validator
- Implement authentication
- Add API documentation with Swagger
- Write unit and integration tests
