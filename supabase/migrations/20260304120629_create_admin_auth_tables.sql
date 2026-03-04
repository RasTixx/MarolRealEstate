/*
  # Admin Authentication and Security Setup

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamptz)
    
  2. Storage
    - Create `property-images` bucket for storing property photos
    - Set up public read access, authenticated write access

  3. Security Changes
    - Enable RLS on `properties` table
    - Add policy for public SELECT access
    - Add policy for authenticated admin INSERT/UPDATE/DELETE
    - Enable RLS on `admin_users` table
    - Add policy for admins to read their own data
    - Enable RLS on `property_inquiries` table
    - Add policy for public INSERT (contact form)
    - Add policy for authenticated admin SELECT

  4. Important Notes
    - Admin users must be added to both auth.users and admin_users tables
    - Only users in admin_users table can manage properties
    - Public users can view properties and submit inquiries
    - Property images will be stored in Supabase Storage
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can read their own data
CREATE POLICY "Admins can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Enable RLS on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public can view all properties
CREATE POLICY "Public can view properties"
  ON properties
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated admins can insert properties
CREATE POLICY "Admins can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Authenticated admins can update properties
CREATE POLICY "Admins can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Authenticated admins can delete properties
CREATE POLICY "Admins can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Enable RLS on property_inquiries
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can insert inquiries (contact form submissions)
CREATE POLICY "Public can submit inquiries"
  ON property_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated admins can view all inquiries
CREATE POLICY "Admins can view inquiries"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Authenticated admins can update inquiries (e.g., mark as contacted)
CREATE POLICY "Admins can update inquiries"
  ON property_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read property images
CREATE POLICY "Public can view property images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

-- Allow authenticated admins to upload property images
CREATE POLICY "Admins can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Allow authenticated admins to update property images
CREATE POLICY "Admins can update property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Allow authenticated admins to delete property images
CREATE POLICY "Admins can delete property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );