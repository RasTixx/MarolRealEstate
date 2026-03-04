/*
  # Create properties table for real estate website

  1. New Tables
    - `properties`
      - `id` (uuid, primary key) - Unique identifier for each property
      - `title` (text) - Property title/name
      - `description` (text) - Detailed property description
      - `price` (numeric) - Property price in EUR
      - `location` (text) - City/area location
      - `address` (text) - Full address
      - `property_type` (text) - Type: apartment, house, commercial, land
      - `transaction_type` (text) - Sale or rent
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (integer) - Number of bathrooms
      - `area_sqm` (numeric) - Area in square meters
      - `year_built` (integer) - Year of construction
      - `floor` (integer) - Floor number (for apartments)
      - `image_url` (text) - Main property image URL
      - `featured` (boolean) - Whether property is featured
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `properties` table
    - Add policy for public read access (anyone can view properties)
    - This is appropriate for a public real estate website
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  property_type text NOT NULL,
  transaction_type text NOT NULL,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area_sqm numeric NOT NULL,
  year_built integer,
  floor integer,
  image_url text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view properties"
  ON properties
  FOR SELECT
  TO anon
  USING (true);