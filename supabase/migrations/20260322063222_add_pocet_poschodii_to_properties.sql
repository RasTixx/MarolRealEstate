/*
  # Add pocet_poschodii column to properties table

  1. Changes
    - Adds `pocet_poschodii` (integer, nullable) column to the `properties` table
    - Stores the number of floors in a property building
    - Nullable because not all property types have this information

  2. Notes
    - Safe operation using IF NOT EXISTS check
    - No data loss possible - additive change only
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'pocet_poschodii'
  ) THEN
    ALTER TABLE properties ADD COLUMN pocet_poschodii integer;
  END IF;
END $$;
