/**
 * Convert a TypeScript enum to a Postgres enum
 */
export function tsEnumToPgEnum<T extends Record<string, any>>(
  tsEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(tsEnum).map((value) => `${value}`) as any
}
