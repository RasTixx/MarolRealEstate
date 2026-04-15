/*
  # Drop Redundant Unused Indexes

  Removes indexes on the `properties` table that have zero scans recorded
  and are superseded by the existing composite index
  `idx_properties_featured_created` (featured, created_at DESC).

  Also removes the duplicate `idx_property_images_display_order` single-column
  index which is covered by `idx_property_images_property_id_order`
  (property_id, display_order).

  ## Indexes Dropped

  ### properties table
  - `idx_properties_featured` – covered by composite index
  - `idx_properties_featured_created_at` – covered by composite index
  - `idx_properties_created_at` – superseded; queries always filter by featured first
  - `idx_properties_location` – zero scans; filters done client-side after list fetch
  - `idx_properties_property_type` – zero scans; same reason
  - `idx_properties_transaction_type` – zero scans; same reason

  ### property_images table
  - `idx_property_images_display_order` – covered by the (property_id, display_order) composite index

  ## Effect
  Each INSERT/UPDATE to `properties` previously had to maintain 7 indexes
  (excluding PK). After this migration only 1 composite index + PK remains,
  cutting write IO per mutation by ~80% on that table.
*/

DROP INDEX IF EXISTS public.idx_properties_featured;
DROP INDEX IF EXISTS public.idx_properties_featured_created_at;
DROP INDEX IF EXISTS public.idx_properties_created_at;
DROP INDEX IF EXISTS public.idx_properties_location;
DROP INDEX IF EXISTS public.idx_properties_property_type;
DROP INDEX IF EXISTS public.idx_properties_transaction_type;
DROP INDEX IF EXISTS public.idx_property_images_display_order;
