-- Migration 007: Proof Versions and Approvals
-- Digital Heroes Web-to-Print Platform

CREATE TABLE IF NOT EXISTS proof_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  design_version_id UUID REFERENCES design_versions(id) ON DELETE SET NULL,
  version_number INT NOT NULL,
  proof_file_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','sent','approved','changes_requested','superseded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_item_id, version_number)
);

CREATE TABLE IF NOT EXISTS proof_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_version_id UUID NOT NULL REFERENCES proof_versions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('approved', 'changes_requested')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE proof_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own proof versions" ON proof_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM order_items oi JOIN orders o ON o.id = oi.order_id
    WHERE oi.id = proof_versions.order_item_id AND o.user_id = auth.uid()
  ));
CREATE POLICY "Admins can manage proof versions" ON proof_versions FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Users can view own proof approvals" ON proof_approvals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proof_versions pv
    JOIN order_items oi ON oi.id = pv.order_item_id
    JOIN orders o ON o.id = oi.order_id
    WHERE pv.id = proof_approvals.proof_version_id AND o.user_id = auth.uid()
  ));
CREATE POLICY "Users can create proof approvals" ON proof_approvals FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage proof approvals" ON proof_approvals FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE INDEX idx_proof_versions_order_item_id ON proof_versions(order_item_id);
CREATE INDEX idx_proof_approvals_proof_version_id ON proof_approvals(proof_version_id);
