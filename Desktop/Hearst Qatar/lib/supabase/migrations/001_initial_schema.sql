-- Migration initiale : Schéma complet pour Hearst Qatar
-- Date: 2024-01-XX
-- Description: Création de toutes les tables nécessaires pour la plateforme

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: deployments
-- Configurations de projets 3D
-- ============================================
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deployments_user_id ON deployments(user_id);
CREATE INDEX idx_deployments_is_default ON deployments(is_default);

-- ============================================
-- TABLE: 3d_models
-- Métadonnées des modèles 3D (GLB/GLTF)
-- ============================================
CREATE TABLE IF NOT EXISTS models_3d (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- Chemin dans Supabase Storage
  file_size BIGINT,
  file_type TEXT, -- 'glb', 'gltf'
  thumbnail_path TEXT,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_models_3d_user_id ON models_3d(user_id);
CREATE INDEX idx_models_3d_file_type ON models_3d(file_type);

-- ============================================
-- TABLE: equipment_instances
-- Instances d'équipements placés dans les scènes 3D
-- ============================================
CREATE TABLE IF NOT EXISTS equipment_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deployment_id UUID REFERENCES deployments(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL, -- 'container', 'transformer', 'switchgear', 'generator', etc.
  equipment_id TEXT, -- ID de l'équipement dans sa table respective
  position JSONB NOT NULL, -- [x, y, z]
  rotation JSONB DEFAULT '[0, 0, 0]', -- [x, y, z] en radians
  scale JSONB DEFAULT '[1, 1, 1]',
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipment_instances_deployment_id ON equipment_instances(deployment_id);
CREATE INDEX idx_equipment_instances_type ON equipment_instances(equipment_type);

-- ============================================
-- TABLE: mining_containers
-- Données des conteneurs de mining
-- ============================================
CREATE TABLE IF NOT EXISTS mining_containers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity_mw DECIMAL(10, 2) NOT NULL,
  machines_count INTEGER NOT NULL,
  cooling_system TEXT NOT NULL, -- 'Hydro', 'Immersion', 'Air'
  section TEXT NOT NULL,
  status TEXT NOT NULL, -- 'In Service', 'Maintenance', 'Standby'
  power_consumption_mw DECIMAL(10, 2),
  hashrate_ths DECIMAL(12, 2),
  daily_production_btc DECIMAL(18, 8),
  efficiency_jth DECIMAL(8, 2),
  uptime DECIMAL(5, 2), -- Pourcentage
  active_machines INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mining_containers_section ON mining_containers(section);
CREATE INDEX idx_mining_containers_status ON mining_containers(status);

-- ============================================
-- TABLE: cooling_modules
-- Modules de refroidissement
-- ============================================
CREATE TABLE IF NOT EXISTS cooling_modules (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  cooling_capacity_kw DECIMAL(10, 2) NOT NULL,
  flow_rate TEXT,
  temperature_in DECIMAL(5, 2),
  temperature_out DECIMAL(5, 2),
  status TEXT NOT NULL, -- 'OK', 'Warning', 'Maintenance'
  efficiency DECIMAL(5, 2),
  container_id TEXT REFERENCES mining_containers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cooling_modules_container_id ON cooling_modules(container_id);
CREATE INDEX idx_cooling_modules_status ON cooling_modules(status);

-- ============================================
-- TABLE: transformers
-- Transformateurs électriques
-- ============================================
CREATE TABLE IF NOT EXISTS transformers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  power_mva DECIMAL(10, 2) NOT NULL,
  voltage_primary TEXT NOT NULL,
  voltage_secondary TEXT NOT NULL,
  section TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OK', -- 'OK', 'Warning', 'Off'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transformers_section ON transformers(section);
CREATE INDEX idx_transformers_status ON transformers(status);

-- Table de liaison pour les conteneurs connectés aux transformateurs
CREATE TABLE IF NOT EXISTS transformer_containers (
  transformer_id TEXT REFERENCES transformers(id) ON DELETE CASCADE,
  container_id TEXT REFERENCES mining_containers(id) ON DELETE CASCADE,
  PRIMARY KEY (transformer_id, container_id)
);

-- ============================================
-- TABLE: switchgears
-- Tableaux de distribution
-- ============================================
CREATE TABLE IF NOT EXISTS switchgears (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  transformer_id TEXT REFERENCES transformers(id) ON DELETE SET NULL,
  section TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OK',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_switchgears_transformer_id ON switchgears(transformer_id);
CREATE INDEX idx_switchgears_section ON switchgears(section);

-- ============================================
-- TABLE: power_blocks
-- Blocs d'alimentation
-- ============================================
CREATE TABLE IF NOT EXISTS power_blocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  capacity_mw DECIMAL(10, 2) NOT NULL,
  section TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OK',
  substation_id TEXT, -- Référence vers substations
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_power_blocks_section ON power_blocks(section);
CREATE INDEX idx_power_blocks_substation_id ON power_blocks(substation_id);

-- Table de liaison pour les transformateurs dans les power blocks
CREATE TABLE IF NOT EXISTS power_block_transformers (
  power_block_id TEXT REFERENCES power_blocks(id) ON DELETE CASCADE,
  transformer_id TEXT REFERENCES transformers(id) ON DELETE CASCADE,
  PRIMARY KEY (power_block_id, transformer_id)
);

-- ============================================
-- TABLE: substations
-- Sous-stations électriques
-- ============================================
CREATE TABLE IF NOT EXISTS substations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  total_capacity_mw DECIMAL(10, 2) NOT NULL,
  input_voltage TEXT NOT NULL,
  output_voltage TEXT NOT NULL,
  feeders_count INTEGER,
  status TEXT NOT NULL DEFAULT 'OK',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de liaison pour les sections connectées
CREATE TABLE IF NOT EXISTS substation_sections (
  substation_id TEXT REFERENCES substations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  PRIMARY KEY (substation_id, section_name)
);

-- ============================================
-- TABLE: asic_machines
-- Machines ASIC
-- ============================================
CREATE TABLE IF NOT EXISTS asic_machines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  batch TEXT NOT NULL,
  hashrate_ths DECIMAL(10, 2) NOT NULL,
  power_consumption_kw DECIMAL(8, 2) NOT NULL,
  efficiency_jth DECIMAL(8, 2) NOT NULL,
  total_installed INTEGER NOT NULL,
  active_count INTEGER NOT NULL,
  installation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_asic_machines_batch ON asic_machines(batch);
CREATE INDEX idx_asic_machines_brand_model ON asic_machines(brand, model);

-- ============================================
-- TABLE: cooling_systems
-- Systèmes de refroidissement
-- ============================================
CREATE TABLE IF NOT EXISTS cooling_systems (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  thermal_capacity_mw DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de liaison pour les sections couvertes
CREATE TABLE IF NOT EXISTS cooling_system_sections (
  cooling_system_id TEXT REFERENCES cooling_systems(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  PRIMARY KEY (cooling_system_id, section_name)
);

-- Table de liaison pour les conteneurs couverts
CREATE TABLE IF NOT EXISTS cooling_system_containers (
  cooling_system_id TEXT REFERENCES cooling_systems(id) ON DELETE CASCADE,
  container_id TEXT REFERENCES mining_containers(id) ON DELETE CASCADE,
  PRIMARY KEY (cooling_system_id, container_id)
);

-- ============================================
-- TABLE: electrical_nodes
-- Structure hiérarchique électrique
-- ============================================
CREATE TABLE IF NOT EXISTS electrical_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'substation', 'section', 'transformer', 'container', 'generator'
  capacity_mw DECIMAL(10, 2),
  capacity_mva DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'OK',
  parent_id TEXT REFERENCES electrical_nodes(id) ON DELETE CASCADE,
  section TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_electrical_nodes_parent_id ON electrical_nodes(parent_id);
CREATE INDEX idx_electrical_nodes_type ON electrical_nodes(type);
CREATE INDEX idx_electrical_nodes_section ON electrical_nodes(section);

-- ============================================
-- TABLE: dashboard_metrics
-- Métriques et KPIs du dashboard
-- ============================================
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL, -- 'power', 'hashrate', 'mining_output', 'wallet', etc.
  value JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dashboard_metrics_type ON dashboard_metrics(metric_type);
CREATE INDEX idx_dashboard_metrics_timestamp ON dashboard_metrics(timestamp);

-- ============================================
-- TABLE: scene_configurations
-- Configurations de scènes 3D
-- ============================================
CREATE TABLE IF NOT EXISTS scene_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scene_configurations_user_id ON scene_configurations(user_id);
CREATE INDEX idx_scene_configurations_is_default ON scene_configurations(is_default);

-- ============================================
-- TRIGGERS: Mise à jour automatique de updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER update_deployments_updated_at BEFORE UPDATE ON deployments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_3d_updated_at BEFORE UPDATE ON models_3d
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_instances_updated_at BEFORE UPDATE ON equipment_instances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mining_containers_updated_at BEFORE UPDATE ON mining_containers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cooling_modules_updated_at BEFORE UPDATE ON cooling_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transformers_updated_at BEFORE UPDATE ON transformers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_switchgears_updated_at BEFORE UPDATE ON switchgears
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_power_blocks_updated_at BEFORE UPDATE ON power_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_substations_updated_at BEFORE UPDATE ON substations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asic_machines_updated_at BEFORE UPDATE ON asic_machines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cooling_systems_updated_at BEFORE UPDATE ON cooling_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_electrical_nodes_updated_at BEFORE UPDATE ON electrical_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scene_configurations_updated_at BEFORE UPDATE ON scene_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

