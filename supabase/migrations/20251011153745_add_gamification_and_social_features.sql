/*
  # Hidden Kolkata - Phase 3: Gamification & Social Features
  
  Adds user profiles, XP system, hidden gems, memories, and social interactions.
  
  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - references auth.users
      - `username` (text, unique) - display name
      - `email` (text) - user email
      - `avatar_url` (text) - profile picture URL
      - `xp` (integer, default 0) - experience points
      - `gems_created` (integer, default 0) - count of gems added
      - `trails_explored` (integer, default 0) - count of trails completed
      - `created_at` (timestamptz) - account creation date
    
    - `hidden_gems`
      - `id` (uuid, primary key) - unique identifier
      - `name` (text) - gem name
      - `description` (text) - gem description
      - `latitude` (float) - location latitude
      - `longitude` (float) - location longitude
      - `image_url` (text) - gem photo URL
      - `created_by` (uuid) - references profiles(id)
      - `upvotes` (integer, default 0) - total upvotes
      - `created_at` (timestamptz) - creation timestamp
    
    - `gem_upvotes`
      - `id` (uuid, primary key) - unique identifier
      - `gem_id` (uuid) - references hidden_gems(id)
      - `user_id` (uuid) - references profiles(id)
      - `created_at` (timestamptz) - upvote timestamp
      - UNIQUE constraint on (gem_id, user_id)
    
    - `memories`
      - `id` (uuid, primary key) - unique identifier
      - `user_id` (uuid) - references profiles(id)
      - `trail_name` (text) - associated trail name
      - `caption` (text) - memory caption
      - `image_url` (text) - photo URL in Supabase Storage
      - `latitude` (float, nullable) - photo location
      - `longitude` (float, nullable) - photo location
      - `created_at` (timestamptz) - upload timestamp
    
    - `gem_comments`
      - `id` (uuid, primary key) - unique identifier
      - `gem_id` (uuid) - references hidden_gems(id)
      - `user_id` (uuid) - references profiles(id)
      - `text` (text) - comment content
      - `created_at` (timestamptz) - comment timestamp
  
  2. Security
    - Enable RLS on all new tables
    - Public read access for gems, comments, memories
    - Users can only insert/update/delete their own content
    - Profiles are publicly readable but only user can update own profile
  
  3. Functions
    - `award_xp` - Function to add XP to user and update stats
    - `increment_gem_upvotes` - Safely increment upvote count
  
  4. Indexes
    - Performance indexes on foreign keys and frequently queried fields
    - Composite index on gem_upvotes for uniqueness check
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text NOT NULL,
  avatar_url text DEFAULT '',
  xp integer DEFAULT 0,
  gems_created integer DEFAULT 0,
  trails_explored integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are readable by everyone but only editable by owner
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create hidden_gems table
CREATE TABLE IF NOT EXISTS hidden_gems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  latitude float NOT NULL,
  longitude float NOT NULL,
  image_url text DEFAULT '',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hidden_gems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hidden gems are viewable by everyone"
  ON hidden_gems FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create gems"
  ON hidden_gems FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own gems"
  ON hidden_gems FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own gems"
  ON hidden_gems FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create gem_upvotes table
CREATE TABLE IF NOT EXISTS gem_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id uuid REFERENCES hidden_gems(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(gem_id, user_id)
);

ALTER TABLE gem_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Upvotes are viewable by everyone"
  ON gem_upvotes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON gem_upvotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own upvotes"
  ON gem_upvotes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  trail_name text DEFAULT 'Untitled Trail',
  caption text DEFAULT '',
  image_url text NOT NULL,
  latitude float,
  longitude float,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Memories are viewable by everyone"
  ON memories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create memories"
  ON memories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own memories"
  ON memories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create gem_comments table
CREATE TABLE IF NOT EXISTS gem_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id uuid REFERENCES hidden_gems(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gem_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON gem_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON gem_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON gem_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to award XP and update user stats
CREATE OR REPLACE FUNCTION award_xp(
  user_uuid uuid,
  xp_amount integer,
  stat_to_increment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET xp = xp + xp_amount
  WHERE id = user_uuid;
  
  IF stat_to_increment = 'gems_created' THEN
    UPDATE profiles SET gems_created = gems_created + 1 WHERE id = user_uuid;
  ELSIF stat_to_increment = 'trails_explored' THEN
    UPDATE profiles SET trails_explored = trails_explored + 1 WHERE id = user_uuid;
  END IF;
END;
$$;

-- Function to safely increment gem upvotes
CREATE OR REPLACE FUNCTION increment_gem_upvotes(gem_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE hidden_gems
  SET upvotes = upvotes + 1
  WHERE id = gem_uuid;
END;
$$;

-- Function to safely decrement gem upvotes
CREATE OR REPLACE FUNCTION decrement_gem_upvotes(gem_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE hidden_gems
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = gem_uuid;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS hidden_gems_created_by_idx ON hidden_gems(created_by);
CREATE INDEX IF NOT EXISTS hidden_gems_created_at_idx ON hidden_gems(created_at DESC);
CREATE INDEX IF NOT EXISTS gem_upvotes_gem_id_idx ON gem_upvotes(gem_id);
CREATE INDEX IF NOT EXISTS gem_upvotes_user_id_idx ON gem_upvotes(user_id);
CREATE INDEX IF NOT EXISTS memories_user_id_idx ON memories(user_id);
CREATE INDEX IF NOT EXISTS memories_created_at_idx ON memories(created_at DESC);
CREATE INDEX IF NOT EXISTS gem_comments_gem_id_idx ON gem_comments(gem_id);
CREATE INDEX IF NOT EXISTS gem_comments_created_at_idx ON gem_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_xp_idx ON profiles(xp DESC);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();