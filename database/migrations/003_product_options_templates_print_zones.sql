-- Migration 003: Product Options, Templates, and Print Zones
-- Digital Heroes Web-to-Print Platform

-- Product option definitions (configurable fields per product)
CREATE TABLE IF NOT EXISTS product_option_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL,
  option_key TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('select', 'radio', 'number', 'text', 'checkbox', 'color')),
  is_required BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  validation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, option_key)
);

-- Product option values (predefined choices for select/radio)
CREATE TABLE IF NOT EXISTS product_option_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID NOT NULL REFERENCES product_option_definitions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product templates (reusable design starting points)
CREATE TABLE IF NOT EXISTS product_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Print zones (defined printable areas per product)
CREATE TABLE IF NOT EXISTS print_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  zone_name TEXT NOT NULL,
  width NUMERIC(10,2) NOT NULL,
  height NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'mm' CHECK (unit IN ('mm', 'cm', 'in', 'px')),
  position_data JSONB DEFAULT '{}',
  constraints JSONB DEFAULT '{}',
  bleed NUMERIC(5,2) DEFAULT 3.0,
  resolution_dpi INT DEFAULT 300,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at triggers
CREATE TRIGGER product_templates_updated_at
  BEFORE UPDATE ON product_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER print_zones_updated_at
  BEFORE UPDATE ON print_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies
ALTER TABLE product_option_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_zones ENABLE ROW LEVEL SECURITY;

-- Public read for product configuration
CREATE POLICY "Anyone can view option definitions"
  ON product_option_definitions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage option definitions"
  ON product_option_definitions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
  );

CREATE POLICY "Anyone can view active option values"
  ON product_option_values FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage option values"
  ON product_option_values FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
  );

CREATE POLICY "Anyone can view active templates"
  ON product_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON product_templates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
  );

CREATE POLICY "Anyone can view print zones"
  ON print_zones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage print zones"
  ON print_zones FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
  );

-- Indexes
CREATE INDEX idx_option_definitions_product_id ON product_option_definitions(product_id);
CREATE INDEX idx_option_values_option_id ON product_option_values(option_id);
CREATE INDEX idx_product_templates_product_id ON product_templates(product_id);
CREATE INDEX idx_print_zones_product_id ON print_zones(product_id);
