-- Migration 002: Product Divisions and Products
-- Digital Heroes Web-to-Print Platform

-- Product divisions (the 6 PRD categories)
CREATE TABLE IF NOT EXISTS product_divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID NOT NULL REFERENCES product_divisions(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  base_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  configuration_schema JSONB DEFAULT '{}',
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at triggers
CREATE TRIGGER product_divisions_updated_at
  BEFORE UPDATE ON product_divisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies (products are publicly readable)
ALTER TABLE product_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active divisions"
  ON product_divisions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage divisions"
  ON product_divisions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_products_division_id ON products(division_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_divisions_slug ON product_divisions(slug);

-- Seed the 6 product divisions
INSERT INTO product_divisions (name, slug, description, display_order) VALUES
  ('Labels & Stickers', 'labels-stickers', 'Custom printed labels and stickers for every application. From product labels to promotional stickers, configured to your exact specifications.', 1),
  ('Race & Event Numbers', 'race-event-numbers', 'Professional race numbers and event identification. Variable data printing for bulk orders with CSV merge support.', 2),
  ('MTB Boards', 'mtb-boards', 'Custom mountain bike number boards and plates. Durable materials designed for outdoor racing conditions.', 3),
  ('Stamps', 'stamps', 'Custom rubber and self-inking stamps. Business stamps, address stamps, and specialty designs.', 4),
  ('Trophies', 'trophies', 'Custom engraved and printed trophies, awards, and recognition items for events and achievements.', 5),
  ('Laser-Cut Work', 'laser-cut-work', 'Precision laser-cut signage, decorative items, and custom fabrication in wood, acrylic, and metal.', 6);
