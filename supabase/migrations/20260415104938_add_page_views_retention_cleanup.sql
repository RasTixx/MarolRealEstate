/*
  # Add Page Views Data Retention Policy

  ## Summary
  The page_views table will grow continuously as visitors browse the site.
  Without a retention policy, it accumulates unbounded rows and causes
  ever-increasing disk IO for analytics queries that scan the table.

  ## Changes

  ### Function: cleanup_old_page_views()
  - Deletes page_views rows older than 90 days
  - Designed to be called periodically (can be scheduled via pg_cron if available)
  - Returns the number of rows deleted for logging

  ### Immediate Cleanup
  - Deletes any existing rows older than 90 days on migration run

  ## Notes
  - 90 days of data is sufficient for the analytics dashboard (which only shows 30 days)
  - This function can be called manually or scheduled as needed
*/

CREATE OR REPLACE FUNCTION public.cleanup_old_page_views()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.page_views
  WHERE created_at < now() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

DELETE FROM public.page_views
WHERE created_at < now() - INTERVAL '90 days';
