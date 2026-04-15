/*
  # Optimize RLS Policies to Eliminate Repeated admin_users Sequential Scans

  ## Problem
  Every RLS policy on `properties`, `testimonials`, `page_views`, and other tables
  uses a subquery pattern:
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())

  This subquery runs on EVERY row evaluation for EVERY request (including anonymous
  requests checking DELETE/UPDATE/INSERT policies). The `admin_users` table was being
  sequentially scanned 494+ times because:
  1. The subquery is evaluated fresh each time (no caching)
  2. Even anonymous users trigger policy checks for non-SELECT operations

  ## Solution
  Create a `is_admin()` security definer function. Postgres can inline and cache this
  per-transaction, dramatically reducing the number of `admin_users` lookups.
  The function uses `SECURITY DEFINER` and `SET search_path = public` for safety.

  ## Changes
  - New function: `public.is_admin()` - returns boolean, security definer, stable
  - Updated policies on: properties, testimonials, page_views
    to use `is_admin()` instead of raw EXISTS subqueries

  ## Security
  - Function uses SECURITY DEFINER so it runs with definer privileges (safe read of admin_users)
  - Returns false for unauthenticated users (auth.uid() returns null)
  - All existing access patterns are preserved identically
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can update properties" ON public.properties;

CREATE POLICY "Admins can delete properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;

CREATE POLICY "Admins can read page views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (public.is_admin());
