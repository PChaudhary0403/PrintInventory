-- Migration 010: Final integrity constraints, indexes, and RLS completion
-- Run this LAST, after all previous migrations

-- ============================================================
-- INDEXES for query performance
-- ============================================================

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Order items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Designs
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_product_id ON designs(product_id);
CREATE INDEX IF NOT EXISTS idx_designs_updated_at ON designs(updated_at DESC);

-- Proof versions
CREATE INDEX IF NOT EXISTS idx_proof_versions_order_item_id ON proof_versions(order_item_id);
CREATE INDEX IF NOT EXISTS idx_proof_versions_status ON proof_versions(status);
CREATE INDEX IF NOT EXISTS idx_proof_versions_created_at ON proof_versions(created_at DESC);

-- Production jobs
CREATE INDEX IF NOT EXISTS idx_production_jobs_order_item_id ON production_jobs(order_item_id);
CREATE INDEX IF NOT EXISTS idx_production_jobs_status ON production_jobs(status);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_division_id ON products(division_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active) WHERE is_active = TRUE;

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;

-- ============================================================
-- CONSTRAINTS
-- ============================================================

-- Ensure order totals are non-negative
ALTER TABLE orders
  ADD CONSTRAINT chk_orders_total_non_negative CHECK (total_amount >= 0),
  ADD CONSTRAINT chk_orders_gst_non_negative CHECK (gst_amount >= 0);

-- Ensure order item quantities are positive
ALTER TABLE order_items
  ADD CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0),
  ADD CONSTRAINT chk_order_items_unit_price_non_negative CHECK (unit_price >= 0);

-- Ensure product base price is non-negative
ALTER TABLE products
  ADD CONSTRAINT chk_products_base_price_non_negative CHECK (base_price >= 0);

-- ============================================================
-- SUPABASE STORAGE BUCKETS (run separately in Supabase dashboard or via API)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('artwork', 'artwork', FALSE),       -- Customer uploaded artwork (private)
--   ('proofs', 'proofs', FALSE),         -- Generated proof files (private)
--   ('production', 'production', FALSE), -- Production-ready files (private, admin only)
--   ('templates', 'templates', FALSE),   -- Design templates (private)
--   ('thumbnails', 'thumbnails', TRUE)   -- Design thumbnails (public CDN)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES (after creating buckets)
-- ============================================================
-- Artwork: owners can upload/read their own files; admins can read all
-- CREATE POLICY "artwork_owner_access" ON storage.objects
--   FOR ALL USING (bucket_id = 'artwork' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Proofs: owners can read their proofs; admins can read/write all
-- CREATE POLICY "proofs_owner_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Production: admin only
-- CREATE POLICY "production_admin_only" ON storage.objects
--   FOR ALL USING (bucket_id = 'production' AND EXISTS (
--     SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
--   ));

-- ============================================================
-- ANALYTICS VIEW (optional, for the admin reports page)
-- ============================================================
CREATE OR REPLACE VIEW order_analytics AS
SELECT
  DATE_TRUNC('month', o.created_at) AS month,
  COUNT(o.id) AS order_count,
  SUM(o.total_amount) AS total_revenue,
  SUM(o.gst_amount) AS total_gst,
  SUM(o.total_amount - o.gst_amount) AS revenue_excl_gst,
  AVG(o.total_amount) AS avg_order_value
FROM orders o
WHERE o.payment_status = 'paid'
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY month DESC;

COMMENT ON VIEW order_analytics IS 'Monthly revenue and order counts for the admin reports page. Filtered to paid orders only.';
