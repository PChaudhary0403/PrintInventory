-- Migration 004: Pricing Rules and Volume Discounts
-- Digital Heroes Web-to-Print Platform

CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('base', 'option_modifier', 'size_modifier', 'custom')),
  conditions JSONB DEFAULT '{}',
  calculation JSONB DEFAULT '{}',
  priority INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volume_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INT NOT NULL,
  max_quantity INT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_quantity_range CHECK (max_quantity IS NULL OR max_quantity > min_quantity)
);

CREATE TRIGGER pricing_rules_updated_at
  BEFORE UPDATE ON pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE volume_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing rules"
  ON pricing_rules FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing rules"
  ON pricing_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Anyone can view active volume discounts"
  ON volume_discounts FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage volume discounts"
  ON volume_discounts FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE INDEX idx_pricing_rules_product_id ON pricing_rules(product_id);
CREATE INDEX idx_volume_discounts_product_id ON volume_discounts(product_id);
