-- Crear base de datos
CREATE DATABASE IF NOT EXISTS `gestor_archivos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gestor_archivos`;

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Tabla de archivos originales
CREATE TABLE IF NOT EXISTS files (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  report_date DATE NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  progress INT NOT NULL,
  observations TEXT,
  file_size VARCHAR(50) NOT NULL,
  version VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sgps_code VARCHAR(100),
  study_center_name VARCHAR(255),
  regional VARCHAR(100),
  project_responsibles TEXT,
  is_modified BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_files_project FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla de archivos modificados
CREATE TABLE IF NOT EXISTS modified_files (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  original_file_id BIGINT NOT NULL,
  project_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  report_date DATE NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  progress INT NOT NULL,
  observations TEXT,
  file_size VARCHAR(50) NOT NULL,
  version VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sgps_code VARCHAR(100),
  study_center_name VARCHAR(255),
  regional VARCHAR(100),
  project_responsibles TEXT,
  modification_reason TEXT,
  CONSTRAINT fk_modified_files_original FOREIGN KEY (original_file_id) REFERENCES files(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_modified_files_project FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Seed de proyectos
INSERT INTO projects (name) VALUES
('Proyecto 1 - Software'),
('Proyecto 2 - Marketing'),
('Proyecto 3 - Infraestructura'),
('Proyecto 4 - Recursos Humanos'),
('Proyecto 5 - Finanzas')
ON DUPLICATE KEY UPDATE name = VALUES(name);
























-- -- Crear base de datos
-- CREATE DATABASE IF NOT EXISTS `gestor_archivos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `gestor_archivos`;

-- -- Tabla de proyectos
-- CREATE TABLE IF NOT EXISTS projects (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   nombre VARCHAR(255) NOT NULL
-- ) ENGINE=InnoDB;

-- -- Tabla de archivos
-- CREATE TABLE IF NOT EXISTS files (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   proyecto_id INT NOT NULL,
--   nombre_archivo VARCHAR(255) NOT NULL,
--   ruta_almacenamiento VARCHAR(255) NOT NULL,
--   fecha_carga DATE NOT NULL,
--   fecha_reporte DATE NOT NULL,
--   responsable VARCHAR(255) NOT NULL,
--   progreso INT NOT NULL,
--   observacion TEXT,
--   tamano_archivo VARCHAR(50) NOT NULL,
--   version VARCHAR(50) NOT NULL,
--   categoria VARCHAR(100) NOT NULL,
--   CONSTRAINT fk_files_project FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE
-- ) ENGINE=InnoDB;

-- -- Seed de proyectos
-- INSERT INTO projects (nombre) VALUES
-- ('Proyecto 1 - Software'),
-- ('Proyecto 2 - Marketing'),
-- ('Proyecto 3 - Infraestructura'),
-- ('Proyecto 4 - Recursos Humanos'),
-- ('Proyecto 5 - Finanzas')
-- ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
