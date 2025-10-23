/*
  # Hidden Kolkata - Pins Table
  
  Creates the core table for storing hidden gems/spots in Kolkata.
  
  1. New Tables
    - `pins`
      - `id` (uuid, primary key) - unique identifier for each pin
      - `name` (text) - name of the hidden spot
      - `description` (text) - user-entered description or Wikipedia summary
      - `latitude` (float) - latitude coordinate for map display
      - `longitude` (float) - longitude coordinate for map display
      - `image_url` (text) - URL to image from Unsplash or user upload
      - `created_by` (text, nullable) - user identifier (email or user id)
      - `created_at` (timestamptz) - timestamp of creation
  
  2. Security
    - Enable RLS on `pins` table
    - Add policy for anyone to read all pins (public read access)
    - Add policy for authenticated users to insert their own pins
    - Add policy for users to update/delete only their own pins
  
  3. Indexes
    - Index on latitude and longitude for efficient map queries
*/

CREATE TABLE IF NOT EXISTS pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  latitude float NOT NULL,
  longitude float NOT NULL,
  image_url text DEFAULT '',
  created_by text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pins ENABLE ROW LEVEL SECURITY;

-- Public read access: anyone can view all pins
CREATE POLICY "Anyone can view all pins"
  ON pins
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert pins
CREATE POLICY "Authenticated users can insert pins"
  ON pins
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Anonymous users can also insert pins (for public contribution)
CREATE POLICY "Anonymous users can insert pins"
  ON pins
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Users can update their own pins
CREATE POLICY "Users can update own pins"
  ON pins
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = created_by)
  WITH CHECK (auth.jwt()->>'email' = created_by);

-- Users can delete their own pins
CREATE POLICY "Users can delete own pins"
  ON pins
  FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = created_by);

-- Create index for efficient geospatial queries
CREATE INDEX IF NOT EXISTS pins_location_idx ON pins(latitude, longitude);