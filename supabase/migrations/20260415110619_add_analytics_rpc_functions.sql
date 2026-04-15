/*
  # Add Analytics RPC Functions

  Replaces the raw full-table page_views fetch in AdminDashboard with
  three lightweight server-side aggregates, each returning only the
  data needed by the UI instead of thousands of individual rows.

  ## New Functions

  1. `count_unique_sessions(since timestamptz)` → bigint
     Returns the number of distinct session_ids recorded since a given timestamp.

  2. `top_pages(since timestamptz, page_limit int)` → table(page_path text, count bigint)
     Returns the top N most-visited page paths since a given timestamp,
     ordered by descending visit count.

  3. `daily_page_views(since timestamptz)` → table(date text, count bigint)
     Returns total page view counts grouped by calendar day (UTC)
     since a given timestamp, ordered ascending so the UI can render
     a chronological bar chart.

  ## Security
  - All functions are SECURITY DEFINER so they run as the owning role
    and bypass RLS (analytics data is only accessed from admin panel).
  - SET search_path = public ensures no schema-injection risk.
*/

CREATE OR REPLACE FUNCTION public.count_unique_sessions(since timestamptz)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT session_id)
  FROM page_views
  WHERE created_at >= since;
$$;

CREATE OR REPLACE FUNCTION public.top_pages(since timestamptz, page_limit int DEFAULT 10)
RETURNS TABLE(page_path text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pv.page_path, COUNT(*) AS count
  FROM page_views pv
  WHERE pv.created_at >= since
  GROUP BY pv.page_path
  ORDER BY count DESC
  LIMIT page_limit;
$$;

CREATE OR REPLACE FUNCTION public.daily_page_views(since timestamptz)
RETURNS TABLE(date text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    TO_CHAR(DATE_TRUNC('day', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS date,
    COUNT(*) AS count
  FROM page_views
  WHERE created_at >= since
  GROUP BY DATE_TRUNC('day', created_at AT TIME ZONE 'UTC')
  ORDER BY 1 ASC;
$$;
