/*
  # Add Performance Indexes

  ## Summary
  Adds database indexes to speed up the most common query patterns used in the application.

  ## New Indexes

  ### properties table
  - `idx_properties_featured_created_at` - Composite index on (featured DESC, created_at DESC) for the default homepage sort order
  - `idx_properties_transaction_type` - Index for filtering by sale/rent type
  - `idx_properties_property_type` - Index for filtering by property type (apartment, house, etc.)
  - `idx_properties_created_at` - Index for admin dashboard sort by date

  ### property_images table
  - `idx_property_images_property_id_order` - Composite index on (property_id, display_order) for fetching ordered images per property

  ### testimonials table
  - `idx_testimonials_approved_featured` - Composite index for the homepage featured testimonials query
  - `idx_testimonials_approved_created_at` - Index for the all-testimonials page

  ### contact_messages table
  - `idx_contact_messages_created_at` - Index for admin dashboard sort
  - `idx_contact_messages_status` - Index for filtering by status

  ### property_inquiries table
  - `idx_property_inquiries_created_at` - Index for admin dashboard sort
  - `idx_property_inquiries_status` - Index for filtering by status
*/

CREATE INDEX IF NOT EXISTS idx_properties_featured_created_at
  ON properties (featured DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_transaction_type
  ON properties (transaction_type);

CREATE INDEX IF NOT EXISTS idx_properties_property_type
  ON properties (property_type);

CREATE INDEX IF NOT EXISTS idx_properties_created_at
  ON properties (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id_order
  ON property_images (property_id, display_order ASC);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved_featured
  ON testimonials (approved, featured, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved_created_at
  ON testimonials (approved, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
  ON contact_messages (status);

CREATE INDEX IF NOT EXISTS idx_property_inquiries_created_at
  ON property_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_inquiries_status
  ON property_inquiries (status);
