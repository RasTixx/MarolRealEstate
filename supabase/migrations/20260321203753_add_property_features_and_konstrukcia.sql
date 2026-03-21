/*
  # Add New Property Features and Construction Type

  1. New Columns
    - `vlastny_pozemok` (boolean, default false) - Property has its own land
    - `vlastny_parking` (boolean, default false) - Property has its own parking
    - `garaz` (boolean, default false) - Property has a garage
    - `parkovacie_miesto` (boolean, default false) - Property has a parking spot
    - `zahradka` (boolean, default false) - Property has a garden
    - `konstrukcia` (text, nullable) - Construction type (tehlovy, panelovy, drevodom)

  2. Notes
    - All boolean columns default to false
    - konstrukcia is nullable as not all properties will have this info
    - These fields will be hidden for pozemok/stavebny_pozemok property types
*/

ALTER TABLE properties ADD COLUMN IF NOT EXISTS vlastny_pozemok boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS vlastny_parking boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS garaz boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parkovacie_miesto boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS zahradka boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS konstrukcia text;