-- Migration 005: Designs, Design Versions, and Design Assets
-- Digital Heroes Web-to-Print Platform

CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  name TEXT NOT NULL DEFAULT 'Untitled Design',
  design_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  design_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (design_id, version_number)
);

CREATE TABLE IF NOT EXISTS design_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own designs"
  ON designs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own designs"
  ON designs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own designs"
  ON designs FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own designs"
  ON designs FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all designs"
  ON designs FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Users can view own design versions"
  ON design_versions FOR SELECT
  USING (EXISTS (SELECT 1 FROM designs WHERE designs.id = design_versions.design_id AND designs.user_id = auth.uid()));
CREATE POLICY "Users can create own design versions"
  ON design_versions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM designs WHERE designs.id = design_versions.design_id AND designs.user_id = auth.uid()));

CREATE POLICY "Users can view own design assets"
  ON design_assets FOR SELECT
  USING (EXISTS (SELECT 1 FROM designs WHERE designs.id = design_assets.design_id AND designs.user_id = auth.uid()));
CREATE POLICY "Users can manage own design assets"
  ON design_assets FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM designs WHERE designs.id = design_assets.design_id AND designs.user_id = auth.uid()));

CREATE INDEX idx_designs_user_id ON designs(user_id);
CREATE INDEX idx_designs_product_id ON designs(product_id);
CREATE INDEX idx_design_versions_design_id ON design_versions(design_id);
CREATE INDEX idx_design_assets_design_id ON design_assets(design_id);
