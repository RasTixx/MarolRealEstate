/*
  # Fix Remaining Security Issues

  1. Fix RLS Policy Always True Issue
    - Replace "Public can submit inquiries" policy WITH CHECK (true) with proper validation
    - Ensure required fields are not empty or null
    - Validate inquiry_type is either 'buy' or 'sell'
    - Validate email format
    - Validate that status can only be set to 'new' on insert (prevent status manipulation)
    
  2. Auth DB Connection Strategy
    - Note: The Auth DB connection strategy must be configured through Supabase Dashboard
    - Go to: Project Settings → Database → Connection Pooling
    - Change Auth pool configuration from fixed (10) to percentage-based (recommended: 5%)
    - This allows Auth performance to improve when database instance is upgraded

  3. Important Notes
    - Public users can still submit inquiries, but with validation
    - Required fields (inquiry_type, full_name, email, phone, property_type) must be provided
    - Email must be in valid format
    - Status is locked to 'new' on insert (only admins can change it later)
*/

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public can submit inquiries" ON property_inquiries;

-- Create a restrictive policy with proper validation
CREATE POLICY "Public can submit inquiries"
  ON property_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure required fields are not empty
    inquiry_type IS NOT NULL AND
    inquiry_type IN ('buy', 'sell') AND
    full_name IS NOT NULL AND
    trim(full_name) <> '' AND
    email IS NOT NULL AND
    trim(email) <> '' AND
    -- Basic email validation
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
    phone IS NOT NULL AND
    trim(phone) <> '' AND
    property_type IS NOT NULL AND
    trim(property_type) <> '' AND
    -- Ensure status can only be 'new' on insert (prevent manipulation)
    (status IS NULL OR status = 'new')
  );