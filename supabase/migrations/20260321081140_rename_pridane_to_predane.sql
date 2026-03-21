/*
  # Rename column pridane to predane

  ## Changes
  - Renames the `pridane` column on the `properties` table to `predane`

  ## Reason
  Corrects the Slovak word from "pridané" (added) to "predané" (sold),
  which is the intended label for marking a property as sold.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'pridane'
  ) THEN
    ALTER TABLE properties RENAME COLUMN pridane TO predane;
  END IF;
END $$;
