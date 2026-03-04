/*
  # Fix RLS Security and Performance Issues

  1. Performance Optimizations
    - Replace auth.uid() with (SELECT auth.uid()) in all policies to prevent row-by-row re-evaluation
    - This significantly improves query performance at scale

  2. Remove Duplicate Policies
    - Drop duplicate permissive policies that cause conflicts:
      - "Anyone can view properties" (duplicate of "Public can view properties")
      - "Anyone can submit property inquiries" (duplicate of "Public can submit inquiries")
      - "Authenticated users can view all inquiries" (replaced with admin-only policy)
      - "Authenticated users can update inquiry status" (replaced with admin-only policy)

  3. Security Improvements
    - Remove overly permissive policies that bypass RLS
    - Ensure only authenticated admins can modify data
    - Keep public read access for properties (required for public website)
    - Keep public insert access for inquiries (required for contact forms)

  4. Important Notes
    - Public users can view properties (needed for website functionality)
    - Public users can submit inquiries (needed for contact forms)
    - Only verified admins in admin_users table can manage properties and inquiries
    - All auth.uid() calls wrapped in SELECT for optimal performance
*/

-- Drop duplicate and problematic policies
DROP POLICY IF EXISTS "Anyone can view properties" ON properties;
DROP POLICY IF EXISTS "Anyone can submit property inquiries" ON property_inquiries;
DROP POLICY IF EXISTS "Authenticated users can view all inquiries" ON property_inquiries;
DROP POLICY IF EXISTS "Authenticated users can update inquiry status" ON property_inquiries;

-- Recreate admin_users policy with optimized auth.uid()
DROP POLICY IF EXISTS "Admins can read own data" ON admin_users;
CREATE POLICY "Admins can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

-- Recreate properties policies with optimized auth.uid()
DROP POLICY IF EXISTS "Admins can insert properties" ON properties;
CREATE POLICY "Admins can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can update properties" ON properties;
CREATE POLICY "Admins can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can delete properties" ON properties;
CREATE POLICY "Admins can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- Recreate property_inquiries policies with optimized auth.uid()
DROP POLICY IF EXISTS "Admins can view inquiries" ON property_inquiries;
CREATE POLICY "Admins can view inquiries"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can update inquiries" ON property_inquiries;
CREATE POLICY "Admins can update inquiries"
  ON property_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- Recreate storage policies with optimized auth.uid()
DROP POLICY IF EXISTS "Admins can upload property images" ON storage.objects;
CREATE POLICY "Admins can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can update property images" ON storage.objects;
CREATE POLICY "Admins can update property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can delete property images" ON storage.objects;
CREATE POLICY "Admins can delete property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );