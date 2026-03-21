/*
  # Add area column to property_inquiries table

  ## Summary
  Adds a missing `area` column to the `property_inquiries` table.

  ## Changes
  - `property_inquiries`: Added `area` (numeric, nullable) column to store the property area in square meters for sell inquiries

  ## Notes
  - The SellProperty form submits an `area` field but the column was missing, causing all sell form submissions to fail
  - This is a non-destructive additive change
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'property_inquiries' AND column_name = 'area'
  ) THEN
    ALTER TABLE property_inquiries ADD COLUMN area numeric;
  END IF;
END $$;
