// src/utils/caseConverter.ts
// --------- 工具：轉換函式 ---------

// camelCase ← snake_case
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      acc[camelKey] = toCamelCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
};

// snake_case ← camelCase
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      acc[snakeKey] = toSnakeCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
};

const caseConverter = {
  toCamelCase,
  toSnakeCase,
};
export default caseConverter;