/*
  # Allow anonymous inserts to page_views table

  ## Problem
  The page_views table has RLS enabled but no policy allowing anonymous
  (unauthenticated) visitors to insert rows. This causes the tracking hook
  to silently fail, resulting in zero visits recorded.

  ## Changes
  - Add INSERT policy for anonymous role on page_views table
  - Visitors can insert their own page view records
  - No SELECT policy added for anon - visitors cannot read tracking data
  - Admin (authenticated) access remains unchanged
*/

CREATE POLICY "Allow anon to insert page views"
  ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);
