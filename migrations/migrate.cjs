#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create migrations table if it doesn't exist
async function initMigrationsTable() {
  const { error } = await supabase.rpc('create_migrations_table', {});

  if (error && !error.message.includes('already exists')) {
    console.error('Error creating migrations table:', error);
    process.exit(1);
  }

  // Create the stored procedure if it doesn't exist
  const { error: procError } = await supabase.rpc('create_migration_procedure', {});

  if (procError && !procError.message.includes('already exists')) {
    console.error('Error creating migration procedure:', procError);
    process.exit(1);
  }
}

// Get all migrations from the database
async function getAppliedMigrations() {
  const { data, error } = await supabase
    .from('migrations')
    .select('name, applied_at')
    .order('applied_at', { ascending: true });

  if (error) {
    console.error('Error fetching migrations:', error);
    process.exit(1);
  }

  return data || [];
}

// Get all migration directories
function getMigrationDirectories() {
  return fs.readdirSync(__dirname)
    .filter(file => {
      const stats = fs.statSync(path.join(__dirname, file));
      return stats.isDirectory() && /^\d+_/.test(file);
    })
    .sort();
}

// Apply a migration
async function applyMigration(migrationName) {
  const upSqlPath = path.join(__dirname, migrationName, 'up.sql');

  if (!fs.existsSync(upSqlPath)) {
    console.error(`Error: up.sql not found for migration ${migrationName}`);
    return false;
  }

  const upSql = fs.readFileSync(upSqlPath, 'utf8');

  console.log(`Applying migration: ${migrationName}`);

  // Execute the migration SQL
  const { error } = await supabase.rpc('run_migration', {
    migration_name: migrationName,
    migration_sql: upSql
  });

  if (error) {
    console.error(`Error applying migration ${migrationName}:`, error);
    return false;
  }

  console.log(`Migration applied: ${migrationName}`);
  return true;
}

// Revert a migration
async function revertMigration(migrationName) {
  const downSqlPath = path.join(__dirname, migrationName, 'down.sql');

  if (!fs.existsSync(downSqlPath)) {
    console.error(`Error: down.sql not found for migration ${migrationName}`);
    return false;
  }

  const downSql = fs.readFileSync(downSqlPath, 'utf8');

  console.log(`Reverting migration: ${migrationName}`);

  // Execute the migration SQL directly
  const { error: sqlError } = await supabase.rpc('execute_sql', {
    sql_string: downSql
  });

  if (sqlError) {
    console.error(`Error executing down.sql for ${migrationName}:`, sqlError);
    return false;
  }

  // Remove the migration record
  const { error } = await supabase
    .from('migrations')
    .delete()
    .eq('name', migrationName);

  if (error) {
    console.error(`Error removing migration record for ${migrationName}:`, error);
    return false;
  }

  console.log(`Migration reverted: ${migrationName}`);
  return true;
}

// Main function
async function main() {
  const command = process.argv[2];

  if (!command || !['up', 'down', 'create'].includes(command)) {
    console.log('Usage: node migrate.cjs [up|down|create] [migration_name]');
    process.exit(1);
  }

  // Create a new migration
  if (command === 'create') {
    const migrationName = process.argv[3];

    if (!migrationName) {
      console.error('Error: Migration name is required');
      process.exit(1);
    }

    const directories = getMigrationDirectories();
    const nextNumber = directories.length > 0 
      ? parseInt(directories[directories.length - 1].split('_')[0]) + 1 
      : 1;

    const newMigrationName = `${nextNumber}_${migrationName}`;
    const migrationDir = path.join(__dirname, newMigrationName);

    fs.mkdirSync(migrationDir);
    fs.writeFileSync(path.join(migrationDir, 'up.sql'), '-- Write your UP migration SQL here\n');
    fs.writeFileSync(path.join(migrationDir, 'down.sql'), '-- Write your DOWN migration SQL here\n');

    console.log(`Created new migration: ${newMigrationName}`);
    process.exit(0);
  }

  // Initialize migrations table
  await initMigrationsTable();

  // Get applied migrations
  const appliedMigrations = await getAppliedMigrations();
  const appliedMigrationNames = appliedMigrations.map(m => m.name);

  // Get all migration directories
  const migrationDirectories = getMigrationDirectories();

  if (command === 'up') {
    // Apply all pending migrations
    for (const dir of migrationDirectories) {
      if (!appliedMigrationNames.includes(dir)) {
        const success = await applyMigration(dir);
        if (!success) {
          process.exit(1);
        }
      }
    }
    console.log('All migrations applied');
  } else if (command === 'down') {
    // Revert the last migration
    if (appliedMigrations.length === 0) {
      console.log('No migrations to revert');
      process.exit(0);
    }

    const lastMigration = appliedMigrations[appliedMigrations.length - 1].name;
    const success = await revertMigration(lastMigration);

    if (!success) {
      process.exit(1);
    }

    console.log('Last migration reverted');
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
