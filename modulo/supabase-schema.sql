-- Esquema de base de datos para Supabase (PostgreSQL)
-- Ejecutar este script en el SQL Editor de Supabase

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de archivos originales
CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  report_date DATE NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  observations TEXT,
  file_size VARCHAR(50) NOT NULL,
  version VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sgps_code VARCHAR(100),
  study_center_name VARCHAR(255),
  regional VARCHAR(100),
  project_responsibles TEXT,
  is_modified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de archivos modificados
CREATE TABLE IF NOT EXISTS modified_files (
  id BIGSERIAL PRIMARY KEY,
  original_file_id BIGINT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  report_date DATE NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  observations TEXT,
  file_size VARCHAR(50) NOT NULL,
  version VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sgps_code VARCHAR(100),
  study_center_name VARCHAR(255),
  regional VARCHAR(100),
  project_responsibles TEXT,
  modification_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_upload_date ON files(upload_date);
CREATE INDEX IF NOT EXISTS idx_files_report_date ON files(report_date);
CREATE INDEX IF NOT EXISTS idx_files_responsible ON files(responsible);

CREATE INDEX IF NOT EXISTS idx_modified_files_original_id ON modified_files(original_file_id);
CREATE INDEX IF NOT EXISTS idx_modified_files_project_id ON modified_files(project_id);
CREATE INDEX IF NOT EXISTS idx_modified_files_upload_date ON modified_files(upload_date);
CREATE INDEX IF NOT EXISTS idx_modified_files_report_date ON modified_files(report_date);
CREATE INDEX IF NOT EXISTS idx_modified_files_responsible ON modified_files(responsible);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modified_files_updated_at BEFORE UPDATE ON modified_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo (seed)
INSERT INTO projects (name) VALUES
('Proyecto 1 - Software'),
('Proyecto 2 - Marketing'),
('Proyecto 3 - Infraestructura'),
('Proyecto 4 - Recursos Humanos'),
('Proyecto 5 - Finanzas')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Row Level Security (RLS) si es necesario
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE files ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE modified_files ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo para RLS (descomenta si necesitas autenticación)
-- CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON files FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON modified_files FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for all users" ON files FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable insert for all users" ON modified_files FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update for all users" ON files FOR UPDATE USING (true);
-- CREATE POLICY "Enable update for all users" ON modified_files FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete for all users" ON files FOR DELETE USING (true);
-- CREATE POLICY "Enable delete for all users" ON modified_files FOR DELETE USING (true);
