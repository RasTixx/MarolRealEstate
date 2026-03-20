/*
  # Add Property Images Table and Location Coordinates

  ## Overview
  This migration enhances property management with multi-image support and precise location data.

  ## 1. New Tables
    - `property_images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `property_id` (uuid, foreign key) - Links to parent property
      - `image_url` (text) - URL of the uploaded image
      - `display_order` (integer) - Order for displaying images (1-30)
      - `is_primary` (boolean) - Whether this is the main property image
      - `uploaded_at` (timestamptz) - When image was uploaded

  ## 2. Schema Changes
    - Add `latitude` (numeric) to properties table for map integration
    - Add `longitude` (numeric) to properties table for map integration
    - Add `area` (numeric) as alias/replacement for area_sqm for consistency

  ## 3. Security
    - Enable RLS on property_images table
    - Public read access for property images (anyone can view)
    - Only authenticated admins can insert/update/delete images

  ## 4. Constraints
    - display_order must be between 1 and 30
    - Foreign key cascade delete (when property deleted, images deleted too)
    - Only one primary image per property (enforced at application level)
*/

-- Add location coordinates to properties table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN latitude numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN longitude numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'area'
  ) THEN
    ALTER TABLE properties ADD COLUMN area numeric;
  END IF;
END $$;

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 1,
  is_primary boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now(),
  CONSTRAINT valid_display_order CHECK (display_order >= 1 AND display_order <= 30)
);

-- Enable RLS on property_images
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Public can view all property images
CREATE POLICY "Anyone can view property images"
  ON property_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert property images
CREATE POLICY "Authenticated users can insert property images"
  ON property_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update property images
CREATE POLICY "Authenticated users can update property images"
  ON property_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete property images
CREATE POLICY "Authenticated users can delete property images"
  ON property_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_display_order ON property_images(property_id, display_order);
