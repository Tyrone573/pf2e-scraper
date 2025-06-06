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