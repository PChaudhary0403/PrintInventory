-- Migration 008: Production Jobs, Production Files, CSV Batches
-- Digital Heroes Web-to-Print Platform

CREATE TABLE IF NOT EXISTS production_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','queued','in_progress','completed','failed','cancelled')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  priority INT NOT NULL DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_job_id UUID NOT NULL REFERENCES production_jobs(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf','png','svg','ai','other')),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  resolution INT,
  bleed_settings JSONB DEFAULT '{}',
  file_size BIGINT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'generated'
    CHECK (status IN ('generating','generated','error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS csv_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_job_id UUID NOT NULL REFERENCES production_jobs(id) ON DELETE CASCADE,
  original_file_path TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  total_rows INT NOT NULL DEFAULT 0,
  processed_rows INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed','partial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS csv_batch_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  csv_batch_id UUID NOT NULL REFERENCES csv_batches(id) ON DELETE CASCADE,
  row_number INT NOT NULL,
  row_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed')),
  output_file_id UUID REFERENCES production_files(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER production_jobs_updated_at
  BEFORE UPDATE ON production_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER csv_batches_updated_at
  BEFORE UPDATE ON csv_batches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE production_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE csv_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE csv_batch_rows ENABLE ROW LEVEL SECURITY;

-- Production tables are admin-only
CREATE POLICY "Admins can manage production jobs" ON production_jobs FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));
CREATE POLICY "Admins can manage production files" ON production_files FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));
CREATE POLICY "Admins can manage csv batches" ON csv_batches FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));
CREATE POLICY "Admins can manage csv batch rows" ON csv_batch_rows FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE INDEX idx_production_jobs_order_item_id ON production_jobs(order_item_id);
CREATE INDEX idx_production_jobs_status ON production_jobs(status);
CREATE INDEX idx_production_files_job_id ON production_files(production_job_id);
CREATE INDEX idx_csv_batches_job_id ON csv_batches(production_job_id);
CREATE INDEX idx_csv_batch_rows_batch_id ON csv_batch_rows(csv_batch_id);
