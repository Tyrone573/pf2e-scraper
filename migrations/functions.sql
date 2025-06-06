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