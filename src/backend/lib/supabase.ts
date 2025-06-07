import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Trait = {
  id: string;
  elastic_id?: string;
  name: string;
  description: string;
  source: string;
  source_url: string;
  is_legacy: boolean;
  created_at: string;
  updated_at: string;
  primary_source?: string;
  primary_source_raw?: string;
  primary_source_category?: string;
  rarity?: string;
  rarity_id?: number;
  release_date?: string;
  summary?: string;
  trait_group?: string[];
  trait_markdown?: string;
  trait_raw?: string[];
  type?: string;
  url?: string;
  category?: string[];
  source_raw?: string[];
  source_category?: string[];
  source_markdown?: string;
  search_markdown?: string;
  markdown?: string;
  summary_markdown?: string;
  text?: string;
  is_replaced?: boolean;
};

export type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export type Source = {
  id: string
  name: string
  url: string
  last_scraped_at: string | null
  created_at: string
}