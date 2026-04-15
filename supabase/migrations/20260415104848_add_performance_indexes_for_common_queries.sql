/*
  # Add Performance Indexes for Common Query Patterns

  ## Summary
  Adds composite and partial indexes to support the most frequent query patterns,
  reducing sequential scans and disk IO.

  ## New Indexes

  ### properties
  - `idx_properties_featured_created` - composite index for the main listing query
    which always orders by `featured DESC, created_at DESC`

  ### testimonials
  - `idx_testimonials_approved_featured` - partial index for the public testimonials
    query which always filters `WHERE approved = true`

  ### page_views
  - `idx_page_views_created_at` - supports the analytics query which filters
    by `created_at >= 30 days ago` - will become critical as the table grows

  ## Notes
  - All indexes use IF NOT EXISTS to be safe to re-run
*/

CREATE INDEX IF NOT EXISTS idx_properties_featured_created
  ON public.properties (featured DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved_featured
  ON public.testimonials (approved, featured)
  WHERE approved = true;

CREATE INDEX IF NOT EXISTS idx_page_views_created_at
  ON public.page_views (created_at DESC);
