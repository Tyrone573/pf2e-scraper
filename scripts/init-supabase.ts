import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, TABLES, POLICIES } from '../src/config/supabase';

const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey
);

async function initializeDatabase() {
  try {
    console.log('Initializing Supabase database...');

    // Create tables
    const { error: traitsError } = await supabase.rpc('create_traits_table');
    if (traitsError) throw traitsError;

    const { error: categoriesError } = await supabase.rpc('create_categories_table');
    if (categoriesError) throw categoriesError;

    const { error: traitCategoriesError } = await supabase.rpc('create_trait_categories_table');
    if (traitCategoriesError) throw traitCategoriesError;

    const { error: sourcesError } = await supabase.rpc('create_sources_table');
    if (sourcesError) throw sourcesError;

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('enable_rls');
    if (rlsError) throw rlsError;

    // Create policies
    const { error: policiesError } = await supabase.rpc('create_policies');
    if (policiesError) throw policiesError;

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 