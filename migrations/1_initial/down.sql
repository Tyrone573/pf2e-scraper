-- Drop policies for profiles
DROP POLICY IF EXISTS "Profiles can be updated by the owner" ON profiles;
DROP POLICY IF EXISTS "Profiles can be created by the owner" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Drop policies for users
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;

-- Disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop tables
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- Drop triggers
DROP TRIGGER IF EXISTS update_traits_updated_at ON traits;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop policies
DROP POLICY IF EXISTS "Allow public read access on traits" ON traits;
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access on trait_categories" ON trait_categories;
DROP POLICY IF EXISTS "Allow public read access on sources" ON sources;

-- Drop tables
DROP TABLE IF EXISTS trait_categories;
DROP TABLE IF EXISTS traits;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sources;