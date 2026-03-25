/*
  # Create page_views table for website visit analytics

  1. New Tables
    - `page_views`
      - `id` (uuid, primary key)
      - `page_path` (text) - the URL path visited (e.g. "/", "/chcem-kupit")
      - `session_id` (text) - anonymous session identifier stored in sessionStorage
      - `referrer` (text, nullable) - the referring URL if available
      - `created_at` (timestamptz) - timestamp of the visit

  2. Security
    - Enable RLS on `page_views` table
    - Public (anonymous) users can INSERT visits (to track all traffic)
    - Only authenticated admin users can SELECT data (to read analytics)
    - No UPDATE or DELETE policies needed for public

  3. Indexes
    - Index on `created_at` for fast date-based filtering
    - Index on `page_path` for grouping by page
    - Index on `session_id` for deduplication queries
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  session_id text NOT NULL,
  referrer text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
  ON page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_page_path_idx ON page_views (page_path);
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views (session_id);
