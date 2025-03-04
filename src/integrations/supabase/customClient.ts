
import { supabase } from './client';

// Custom typed wrapper for Supabase operations
// This bypasses TypeScript's strict type checking for Supabase tables
// while still maintaining our own type definitions

/**
 * Get a reference to a table with type safety bypass
 * @param table The table name
 * @returns A PostgrestQueryBuilder for the specified table
 */
export const fromTable = (table: string) => {
  return supabase.from(table as any);
};

/**
 * Insert data into a table with type safety bypass
 * @param table The table name
 * @param data The data to insert
 * @returns A PostgrestFilterBuilder for the insert operation
 */
export const insertIntoTable = (table: string, data: any | any[]) => {
  const dataArray = Array.isArray(data) ? data : [data];
  return fromTable(table).insert(dataArray as any);
};

/**
 * Update data in a table with type safety bypass
 * @param table The table name
 * @param data The data to update
 * @returns A PostgrestFilterBuilder for the update operation
 */
export const updateTable = (table: string, data: any) => {
  return fromTable(table).update(data as any);
};

/**
 * Upsert data in a table with type safety bypass
 * @param table The table name
 * @param data The data to upsert
 * @returns A PostgrestFilterBuilder for the upsert operation
 */
export const upsertIntoTable = (table: string, data: any) => {
  return fromTable(table).upsert(data as any);
};

/**
 * Delete data from a table with type safety bypass
 * @param table The table name
 * @returns A PostgrestFilterBuilder for the delete operation
 */
export const deleteFromTable = (table: string) => {
  return fromTable(table).delete();
};

// Supabase storage helper
export const { storage } = supabase;
