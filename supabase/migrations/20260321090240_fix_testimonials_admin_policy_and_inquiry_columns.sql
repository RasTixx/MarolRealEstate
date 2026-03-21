/*
  # Fix Testimonials Admin Visibility and Property Inquiries Missing Columns

  ## Changes

  ### 1. Testimonials - Add Admin SELECT Policy
  - The existing SELECT policy only allows viewing approved testimonials
  - Admins cannot see pending/unapproved submissions in the dashboard
  - Added a new SELECT policy: "Admins can view all testimonials"
    - Allows authenticated admin users to read all rows regardless of approved status

  ### 2. Property Inquiries - Add Missing Columns
  - The sell inquiry form submits `postal_code`, `year_built`, and `property_condition`
  - These columns were missing from the table, causing insert failures
  - Added:
    - `postal_code` (text) - postal code of the property being sold
    - `year_built` (integer) - construction year of the property
    - `property_condition` (text) - condition of the property (e.g. needs renovation)
*/

CREATE POLICY "Admins can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'property_inquiries' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE property_inquiries ADD COLUMN postal_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'property_inquiries' AND column_name = 'year_built'
  ) THEN
    ALTER TABLE property_inquiries ADD COLUMN year_built integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'property_inquiries' AND column_name = 'property_condition'
  ) THEN
    ALTER TABLE property_inquiries ADD COLUMN property_condition text;
  END IF;
END $$;
