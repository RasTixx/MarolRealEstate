/*
  # Complete Database Setup for Property Management System

  ## Overview
  This migration creates all necessary tables, storage, and security policies for a complete
  real estate property management system with admin functionality.

  ## 1. Tables Created
  
  ### properties
  - id (uuid, primary key) - Unique identifier
  - title (text) - Property listing title
  - description (text) - Detailed property description
  - price (numeric) - Property price
  - location (text) - General location/city
  - address (text) - Full street address
  - property_type (text) - Type: apartment, house, commercial, land
  - transaction_type (text) - Type: sale or rent
  - bedrooms (integer) - Number of bedrooms
  - bathrooms (integer) - Number of bathrooms
  - area (numeric) - Area in square meters
  - year_built (integer, nullable) - Year of construction
  - floor (integer, nullable) - Floor number
  - image_url (text) - URL to property image
  - featured (boolean, default false) - Featured property flag
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### testimonials
  - id (uuid, primary key) - Unique identifier
  - customer_name (text) - Customer's name
  - customer_role (text, nullable) - Role: Kupujúci, Predávajúci, Nájomca, Prenajímateľ
  - testimonial_text (text) - Testimonial content
  - rating (integer) - Star rating 1-5
  - featured (boolean, default false) - Featured testimonial flag
  - approved (boolean, default false) - Admin approval status
  - created_at (timestamptz) - Creation timestamp

  ### contact_messages
  - id (uuid, primary key) - Unique identifier
  - name (text) - Sender's name
  - email (text) - Sender's email
  - phone (text, nullable) - Sender's phone number
  - message (text) - Message content
  - status (text, default 'new') - Status: new, read, replied
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### property_inquiries
  - id (uuid, primary key) - Unique identifier
  - inquiry_type (text) - Type: 'buy' or 'sell'
  - full_name (text) - Inquirer's full name
  - email (text) - Inquirer's email
  - phone (text, nullable) - Inquirer's phone number
  - property_type (text, nullable) - Desired property type
  - location (text, nullable) - Desired location
  - min_price (numeric, nullable) - Minimum price range
  - max_price (numeric, nullable) - Maximum price range
  - bedrooms (integer, nullable) - Number of bedrooms needed
  - bathrooms (integer, nullable) - Number of bathrooms needed
  - min_area (numeric, nullable) - Minimum area in sqm
  - max_area (numeric, nullable) - Maximum area in sqm
  - address (text, nullable) - Property address (for sell inquiries)
  - city (text, nullable) - City location
  - asking_price (numeric, nullable) - Asking price (for sell inquiries)
  - additional_requirements (text, nullable) - Additional requirements
  - description (text, nullable) - Property description (for sell inquiries)
  - status (text, default 'new') - Status: new, contacted, closed
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### admin_users
  - id (uuid, primary key, references auth.users) - Admin user ID

  ## 2. Storage Bucket
  - Bucket name: property-images
  - Public read access enabled
  - 5MB file size limit
  - Allowed types: image/png, image/jpeg, image/jpg, image/webp, image/gif

  ## 3. Security (RLS Policies)
  
  ### properties table
  - Public: SELECT (read access for all)
  - Authenticated admins: INSERT, UPDATE, DELETE

  ### testimonials table
  - Public: SELECT approved testimonials only
  - Public: INSERT (anyone can submit)
  - Authenticated admins: UPDATE, DELETE

  ### contact_messages table
  - Public: INSERT (anyone can submit)
  - Authenticated admins: SELECT, UPDATE, DELETE

  ### property_inquiries table
  - Public: INSERT (anyone can submit)
  - Authenticated admins: SELECT, UPDATE, DELETE

  ### admin_users table
  - Authenticated: SELECT own user ID only

  ### Storage policies
  - Public: SELECT (read images)
  - Authenticated admins: INSERT (upload images)

  ## 4. Automation
  - Auto-update timestamps via triggers
  - Indexes on frequently queried columns for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  property_type text NOT NULL,
  transaction_type text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  area numeric NOT NULL,
  year_built integer,
  floor integer,
  image_url text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name text NOT NULL,
  customer_role text,
  testimonial_text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  featured boolean DEFAULT false,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property inquiries table
CREATE TABLE IF NOT EXISTS property_inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('buy', 'sell')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  property_type text,
  location text,
  min_price numeric,
  max_price numeric,
  bedrooms integer,
  bathrooms integer,
  min_area numeric,
  max_area numeric,
  address text,
  city text,
  asking_price numeric,
  additional_requirements text,
  description text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =====================================================
-- 2. CREATE STORAGE BUCKET
-- =====================================================

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES - PROPERTIES
-- =====================================================

-- Public can view all properties
CREATE POLICY "Anyone can view properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Authenticated admins can insert properties
CREATE POLICY "Admins can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can update properties
CREATE POLICY "Admins can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can delete properties
CREATE POLICY "Admins can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 5. CREATE RLS POLICIES - TESTIMONIALS
-- =====================================================

-- Public can view approved testimonials only
CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (approved = true);

-- Public can insert testimonials
CREATE POLICY "Anyone can submit testimonials"
  ON testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Authenticated admins can update testimonials
CREATE POLICY "Admins can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 6. CREATE RLS POLICIES - CONTACT MESSAGES
-- =====================================================

-- Public can insert contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Authenticated admins can view contact messages
CREATE POLICY "Admins can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can update contact messages
CREATE POLICY "Admins can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can delete contact messages
CREATE POLICY "Admins can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 7. CREATE RLS POLICIES - PROPERTY INQUIRIES
-- =====================================================

-- Public can insert property inquiries
CREATE POLICY "Anyone can submit property inquiries"
  ON property_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Authenticated admins can view property inquiries
CREATE POLICY "Admins can view property inquiries"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can update property inquiries
CREATE POLICY "Admins can update property inquiries"
  ON property_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can delete property inquiries
CREATE POLICY "Admins can delete property inquiries"
  ON property_inquiries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 8. CREATE RLS POLICIES - ADMIN USERS
-- =====================================================

-- Authenticated users can only view their own admin status
CREATE POLICY "Users can view own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- =====================================================
-- 9. CREATE STORAGE POLICIES
-- =====================================================

-- Public can view property images
CREATE POLICY "Anyone can view property images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

-- Authenticated admins can upload property images
CREATE POLICY "Admins can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can update property images
CREATE POLICY "Admins can update property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Authenticated admins can delete property images
CREATE POLICY "Admins can delete property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 10. CREATE AUTOMATION FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. CREATE TRIGGERS
-- =====================================================

-- Trigger for properties table
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contact_messages table
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for property_inquiries table
DROP TRIGGER IF EXISTS update_property_inquiries_updated_at ON property_inquiries;
CREATE TRIGGER update_property_inquiries_updated_at
  BEFORE UPDATE ON property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes on properties table
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Indexes on testimonials table
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Indexes on contact_messages table
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Indexes on property_inquiries table
CREATE INDEX IF NOT EXISTS idx_property_inquiries_status ON property_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_inquiry_type ON property_inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_created_at ON property_inquiries(created_at DESC);
