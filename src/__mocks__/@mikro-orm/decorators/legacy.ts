// Mock MikroORM decorators for Jest (CJS mode can't handle ESM-only @mikro-orm packages)
const noop = () => () => {};
const noopClass = () => (target: any) => target;

export const Entity = noopClass;
export const Property = noop;
export const PrimaryKey = noop;
export const Unique = noopClass;
