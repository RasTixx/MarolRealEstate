/*
  # Add status and updated_at columns to property_inquiries table

  1. Changes
    - Add `status` column to track inquiry status (new, contacted, closed)
    - Add `updated_at` column to track last update time
    - Set default value for status as 'new'
    - Add index for faster queries by status
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'property_inquiries' AND column_name = 'status'
  ) THEN
    ALTER TABLE property_inquiries ADD COLUMN status text DEFAULT 'new' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'property_inquiries' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE property_inquiries ADD COLUMN updated_at timestamptz DEFAULT now() NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_property_inquiries_status ON property_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_created_at ON property_inquiries(created_at DESC);