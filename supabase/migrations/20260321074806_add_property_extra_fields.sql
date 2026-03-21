/*
  # Add Extra Property Fields

  ## Overview
  Adds new fields to the properties table for enhanced property listing details.

  ## 1. New Columns
    - `vytah` (boolean, default false) - Has elevator
    - `pivnica` (boolean, default false) - Has basement/cellar
    - `balkon` (boolean, default false) - Has balcony
    - `terasa` (boolean, default false) - Has terrace
    - `stav` (text) - Property condition/status (novostavba, etc.)
    - `uzitkova_plocha` (numeric) - Usable floor area in m²
    - `zastavana_plocha` (numeric) - Built-up area in m²
    - `rezervovane` (boolean, default false) - Is reserved
    - `pridane` (boolean, default false) - Is newly added/highlighted

  ## 2. No breaking changes
    - All new columns are nullable or have defaults
    - Existing rows are unaffected

  ## 3. Security
    - No RLS changes needed, existing policies cover new columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'vytah'
  ) THEN
    ALTER TABLE properties ADD COLUMN vytah boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'pivnica'
  ) THEN
    ALTER TABLE properties ADD COLUMN pivnica boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'balkon'
  ) THEN
    ALTER TABLE properties ADD COLUMN balkon boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'terasa'
  ) THEN
    ALTER TABLE properties ADD COLUMN terasa boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'stav'
  ) THEN
    ALTER TABLE properties ADD COLUMN stav text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'uzitkova_plocha'
  ) THEN
    ALTER TABLE properties ADD COLUMN uzitkova_plocha numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'zastavana_plocha'
  ) THEN
    ALTER TABLE properties ADD COLUMN zastavana_plocha numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'rezervovane'
  ) THEN
    ALTER TABLE properties ADD COLUMN rezervovane boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'pridane'
  ) THEN
    ALTER TABLE properties ADD COLUMN pridane boolean DEFAULT false;
  END IF;
END $$;
