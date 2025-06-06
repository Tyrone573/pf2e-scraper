-- Function to create the migrations table
CREATE OR REPLACE FUNCTION create_migrations_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
END;
$$;

-- Function to execute arbitrary SQL
CREATE OR REPLACE FUNCTION execute_sql(sql_string TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_string;
END;
$$;

-- Function to run a migration and record it
CREATE OR REPLACE FUNCTION run_migration(migration_name TEXT, migration_sql TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Execute the migration SQL
  EXECUTE migration_sql;
  
  -- Record the migration
  INSERT INTO migrations (name) VALUES (migration_name);
END;
$$;

-- Function to create the migration procedure
CREATE OR REPLACE FUNCTION create_migration_procedure()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function exists to be called by the migration script
  -- It ensures that the other functions exist
  RETURN;
END;
$$;

-- Function to create traits table
CREATE OR REPLACE FUNCTION create_traits_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS traits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    category TEXT,
    is_legacy BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create categories table
CREATE OR REPLACE FUNCTION create_categories_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create trait_categories junction table
CREATE OR REPLACE FUNCTION create_trait_categories_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS trait_categories (
    trait_id UUID REFERENCES traits(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (trait_id, category_id)
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create sources table
CREATE OR REPLACE FUNCTION create_sources_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    last_scraped_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- Function to enable RLS
CREATE OR REPLACE FUNCTION enable_rls()
RETURNS void AS $$
BEGIN
  ALTER TABLE traits ENABLE ROW LEVEL SECURITY;
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE trait_categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql;

-- Function to create policies
CREATE OR REPLACE FUNCTION create_policies()
RETURNS void AS $$
BEGIN
  -- Traits policies
  DROP POLICY IF EXISTS "Allow public read access on traits" ON traits;
  CREATE POLICY "Allow public read access on traits" ON traits
    FOR SELECT USING (true);

  -- Categories policies
  DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
  CREATE POLICY "Allow public read access on categories" ON categories
    FOR SELECT USING (true);

  -- Trait categories policies
  DROP POLICY IF EXISTS "Allow public read access on trait_categories" ON trait_categories;
  CREATE POLICY "Allow public read access on trait_categories" ON trait_categories
    FOR SELECT USING (true);

  -- Sources policies
  DROP POLICY IF EXISTS "Allow public read access on sources" ON sources;
  CREATE POLICY "Allow public read access on sources" ON sources
    FOR SELECT USING (true);
END;
$$ LANGUAGE plpgsql;