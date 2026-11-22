import { GraphQLString } from "graphql";

// Exposes a Date entity field as an ISO-8601 string.
export const isoDateField = <T extends object>(key: keyof T & string) => ({
  type: GraphQLString,
  resolve: (parent: T): string | null => {
    const value = parent[key] as unknown;
    if (value instanceof Date) return value.toISOString();
    return value == null ? null : String(value);
  },
});
