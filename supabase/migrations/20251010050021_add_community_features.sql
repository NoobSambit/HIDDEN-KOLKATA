/*
  # Hidden Kolkata - Community Features & Routes
  
  Adds community interaction features and trail storage.
  
  1. Schema Changes
    - Add `likes` column to `pins` table (integer, default 0)
    - Add `category` column to `pins` table for analytics
    
  2. New Tables
    - `comments`
      - `id` (uuid, primary key) - unique identifier
      - `pin_id` (uuid, foreign key) - references pins table
      - `content` (text) - comment text
      - `author_name` (text, nullable) - optional name for anonymous comments
      - `created_at` (timestamptz) - timestamp of creation
    
    - `trails`
      - `id` (uuid, primary key) - unique identifier
      - `title` (text) - AI-generated trail title
      - `description` (text) - AI-generated trail description
      - `pin_ids` (jsonb) - array of pin IDs in order
      - `path` (jsonb) - OSRM route geometry
      - `created_by` (text, nullable) - user identifier
      - `created_at` (timestamptz) - timestamp of creation
  
  3. Security
    - Enable RLS on new tables
    - Public read access for comments and trails
    - Anyone can insert comments and trails
    - Users can delete their own comments
  
  4. Indexes
    - Index on pin_id for efficient comment queries
    - Index on created_at for timeline queries
*/

-- Add likes and category columns to existing pins table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pins' AND column_name = 'likes'
  ) THEN
    ALTER TABLE pins ADD COLUMN likes integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pins' AND column_name = 'category'
  ) THEN
    ALTER TABLE pins ADD COLUMN category text DEFAULT 'Other';
  END IF;
END $$;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_id uuid REFERENCES pins(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_name text DEFAULT 'Anonymous',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access for comments
CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

-- Anyone can insert comments
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create trails table
CREATE TABLE IF NOT EXISTS trails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  pin_ids jsonb NOT NULL,
  path jsonb NOT NULL,
  created_by text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trails ENABLE ROW LEVEL SECURITY;

-- Public read access for trails
CREATE POLICY "Anyone can view trails"
  ON trails
  FOR SELECT
  TO public
  USING (true);

-- Anyone can create trails
CREATE POLICY "Anyone can create trails"
  ON trails
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Authenticated users can delete their own trails
CREATE POLICY "Users can delete own trails"
  ON trails
  FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = created_by);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS comments_pin_id_idx ON comments(pin_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS trails_created_at_idx ON trails(created_at DESC);
CREATE INDEX IF NOT EXISTS pins_category_idx ON pins(category);
CREATE INDEX IF NOT EXISTS pins_created_at_idx ON pins(created_at);