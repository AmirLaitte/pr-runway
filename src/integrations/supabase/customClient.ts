
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
  // Cast the supabase instance to any to bypass type checking
  return (supabase as any).from(table);
};

/**
 * Insert data into a table with type safety bypass
 * @param table The table name
 * @param data The data to insert
 * @returns A PostgrestFilterBuilder for the insert operation
 */
export const insertIntoTable = (table: string, data: any | any[]) => {
  const dataArray = Array.isArray(data) ? data : [data];
  return fromTable(table).insert(dataArray);
};

/**
 * Update data in a table with type safety bypass
 * @param table The table name
 * @param data The data to update
 * @returns A PostgrestFilterBuilder for the update operation
 */
export const updateTable = (table: string, data: any) => {
  return fromTable(table).update(data);
};

/**
 * Upsert data in a table with type safety bypass
 * @param table The table name
 * @param data The data to upsert
 * @returns A PostgrestFilterBuilder for the upsert operation
 */
export const upsertIntoTable = (table: string, data: any) => {
  return fromTable(table).upsert(data);
};

/**
 * Delete data from a table with type safety bypass
 * @param table The table name
 * @returns A PostgrestFilterBuilder for the delete operation
 */
export const deleteFromTable = (table: string) => {
  return fromTable(table).delete();
};

// Create the avatars bucket if it doesn't exist
const ensureAvatarsBucketExists = async () => {
  try {
    // First check if bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      throw error;
    }
    
    // If avatars bucket doesn't exist, create it
    if (!buckets.find(b => b.name === 'avatars')) {
      const { error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB limit
      });
      
      if (createError) {
        console.error('Error creating avatars bucket:', createError);
        throw createError;
      }
      
      console.log('Avatars bucket created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring avatars bucket exists:', error);
    return false;
  }
};

// Supabase storage helper functions
export const storage = {
  ...supabase.storage,
  // Helper method to upload avatar with error handling
  uploadAvatar: async (file: File, userId: string) => {
    try {
      // Check if file is valid
      if (!file) {
        throw new Error('No file provided');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      // Ensure bucket exists before upload
      await ensureAvatarsBucketExists();
      
      // Upload to avatars bucket
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      return { path: fileName, url: publicUrl };
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  },
  
  // Get public URL for an avatar
  getAvatarUrl: (path: string) => {
    if (!path) return null;
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    
    return publicUrl;
  }
};
