/*
  # Create property inquiries table

  1. New Tables
    - `property_inquiries`
      - `id` (uuid, primary key) - Unique identifier for each inquiry
      - `inquiry_type` (text) - Type of inquiry: 'buy' or 'sell'
      - `full_name` (text) - Full name of the person making the inquiry
      - `email` (text) - Email address
      - `phone` (text) - Phone number
      - `property_type` (text) - Type of property (byt, rodinny-dom, pozemok, etc.)
      - `location` (text) - Preferred location (for buy inquiries)
      - `address` (text) - Property address (for sell inquiries)
      - `city` (text) - City (for sell inquiries)
      - `postal_code` (text) - Postal code (for sell inquiries)
      - `min_price` (numeric) - Minimum price range (for buy inquiries)
      - `max_price` (numeric) - Maximum price range (for buy inquiries)
      - `asking_price` (numeric) - Asking price (for sell inquiries)
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (integer) - Number of bathrooms
      - `min_area` (numeric) - Minimum area in m² (for buy inquiries)
      - `max_area` (numeric) - Maximum area in m² (for buy inquiries)
      - `area` (numeric) - Property area in m² (for sell inquiries)
      - `year_built` (integer) - Year the property was built (for sell inquiries)
      - `property_condition` (text) - Condition of property (for sell inquiries)
      - `additional_requirements` (text) - Additional requirements (for buy inquiries)
      - `description` (text) - Property description (for sell inquiries)
      - `created_at` (timestamptz) - Timestamp when inquiry was created
      - `status` (text) - Status of inquiry (new, contacted, closed)

  2. Security
    - Enable RLS on `property_inquiries` table
    - Add policy for public users to insert their own inquiries
    - Add policy for authenticated admin users to read all inquiries
*/

CREATE TABLE IF NOT EXISTS property_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('buy', 'sell')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  property_type text NOT NULL,
  location text,
  address text,
  city text,
  postal_code text,
  min_price numeric,
  max_price numeric,
  asking_price numeric,
  bedrooms integer,
  bathrooms integer,
  min_area numeric,
  max_area numeric,
  area numeric,
  year_built integer,
  property_condition text,
  additional_requirements text,
  description text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit property inquiries"
  ON property_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all inquiries"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inquiry status"
  ON property_inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
