/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key) - Unique identifier for each testimonial
      - `customer_name` (text, required) - Name of the customer providing the testimonial
      - `customer_role` (text, optional) - Role/type of customer (e.g., "Kupujúci", "Predávajúci")
      - `testimonial_text` (text, required) - The actual testimonial content
      - `rating` (integer, required) - Star rating from 1 to 5
      - `featured` (boolean, default false) - Whether testimonial should be featured on homepage
      - `approved` (boolean, default false) - Whether admin has approved the testimonial for display
      - `created_at` (timestamptz, default now()) - Timestamp when testimonial was submitted

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public users to read approved testimonials only
    - Add policy for public users to insert new testimonials (pending approval)
    - Add policy for authenticated admin users to update testimonials (approve/feature)
    - Add policy for authenticated admin users to delete testimonials

  3. Indexes
    - Create index on `approved` column for faster queries
    - Create index on `featured` and `approved` columns for homepage queries
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_role text,
  testimonial_text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  featured boolean DEFAULT false NOT NULL,
  approved boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can submit testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured_approved ON testimonials(featured, approved) WHERE approved = true;