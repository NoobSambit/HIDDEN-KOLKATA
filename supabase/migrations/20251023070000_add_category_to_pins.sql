/*
  # Add Category Support to Pins Table
  
  Adds a category field to classify gems into different types
  (parks, restaurants, cafes, heritage sites, etc.)
  
  Changes:
  - Add `category` column to `pins` table with default value
  - Create index on category for efficient filtering
*/

-- Add category column to pins table
ALTER TABLE pins ADD COLUMN IF NOT EXISTS category text DEFAULT 'other';

-- Create index for efficient category filtering
CREATE INDEX IF NOT EXISTS pins_category_idx ON pins(category);

-- Update existing pins to have a default category if they don't have one
UPDATE pins SET category = 'other' WHERE category IS NULL;
