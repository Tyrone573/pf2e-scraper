export const supabaseConfig = {
  // These values will be replaced with actual values from your Supabase project
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

// Database schema version
export const SCHEMA_VERSION = '1.0.0';

// Table names
export const TABLES = {
  TRAITS: 'traits',
  CATEGORIES: 'categories',
  TRAIT_CATEGORIES: 'trait_categories',
  SOURCES: 'sources',
} as const;

// RLS Policies
export const POLICIES = {
  PUBLIC_READ: 'Allow public read access',
  AUTHENTICATED_WRITE: 'Allow authenticated users to write',
} as const; 