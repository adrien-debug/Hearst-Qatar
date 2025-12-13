-- Migration 002: Row Level Security (RLS) Policies
-- Date: 2024-01-XX
-- Description: Configuration des politiques de sécurité pour toutes les tables

-- Activer RLS sur toutes les tables
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE models_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE mining_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooling_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformers ENABLE ROW LEVEL SECURITY;
ALTER TABLE switchgears ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE substations ENABLE ROW LEVEL SECURITY;
ALTER TABLE asic_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooling_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE electrical_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_configurations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: deployments
-- ============================================
-- Les utilisateurs peuvent voir leurs propres déploiements
CREATE POLICY "Users can view their own deployments"
  ON deployments FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres déploiements
CREATE POLICY "Users can create their own deployments"
  ON deployments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres déploiements
CREATE POLICY "Users can update their own deployments"
  ON deployments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres déploiements
CREATE POLICY "Users can delete their own deployments"
  ON deployments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: models_3d
-- ============================================
-- Les utilisateurs peuvent voir leurs propres modèles et les modèles publics
CREATE POLICY "Users can view their own models and public models"
  ON models_3d FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Les utilisateurs peuvent créer leurs propres modèles
CREATE POLICY "Users can create their own models"
  ON models_3d FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres modèles
CREATE POLICY "Users can update their own models"
  ON models_3d FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres modèles
CREATE POLICY "Users can delete their own models"
  ON models_3d FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: equipment_instances
-- ============================================
-- Les utilisateurs peuvent voir les instances de leurs déploiements
CREATE POLICY "Users can view equipment in their deployments"
  ON equipment_instances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM deployments
      WHERE deployments.id = equipment_instances.deployment_id
      AND deployments.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des instances dans leurs déploiements
CREATE POLICY "Users can create equipment in their deployments"
  ON equipment_instances FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deployments
      WHERE deployments.id = equipment_instances.deployment_id
      AND deployments.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent modifier les instances de leurs déploiements
CREATE POLICY "Users can update equipment in their deployments"
  ON equipment_instances FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM deployments
      WHERE deployments.id = equipment_instances.deployment_id
      AND deployments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deployments
      WHERE deployments.id = equipment_instances.deployment_id
      AND deployments.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent supprimer les instances de leurs déploiements
CREATE POLICY "Users can delete equipment in their deployments"
  ON equipment_instances FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM deployments
      WHERE deployments.id = equipment_instances.deployment_id
      AND deployments.user_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES: mining_containers, transformers, etc.
-- ============================================
-- Pour les tables de référence (mining_containers, transformers, etc.),
-- nous permettons la lecture à tous les utilisateurs authentifiés
-- et l'écriture uniquement aux administrateurs (via service role)

-- Mining containers: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view mining containers"
  ON mining_containers FOR SELECT
  TO authenticated
  USING (true);

-- Transformers: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view transformers"
  ON transformers FOR SELECT
  TO authenticated
  USING (true);

-- Switchgears: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view switchgears"
  ON switchgears FOR SELECT
  TO authenticated
  USING (true);

-- Power blocks: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view power blocks"
  ON power_blocks FOR SELECT
  TO authenticated
  USING (true);

-- Substations: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view substations"
  ON substations FOR SELECT
  TO authenticated
  USING (true);

-- ASIC machines: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view ASIC machines"
  ON asic_machines FOR SELECT
  TO authenticated
  USING (true);

-- Cooling modules: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view cooling modules"
  ON cooling_modules FOR SELECT
  TO authenticated
  USING (true);

-- Cooling systems: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view cooling systems"
  ON cooling_systems FOR SELECT
  TO authenticated
  USING (true);

-- Electrical nodes: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view electrical nodes"
  ON electrical_nodes FOR SELECT
  TO authenticated
  USING (true);

-- Dashboard metrics: Lecture pour tous, écriture via service role uniquement
CREATE POLICY "Authenticated users can view dashboard metrics"
  ON dashboard_metrics FOR SELECT
  TO authenticated
  USING (true);

-- Scene configurations: Les utilisateurs peuvent voir leurs propres configurations
CREATE POLICY "Users can view their own scene configurations"
  ON scene_configurations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR is_default = true);

CREATE POLICY "Users can create their own scene configurations"
  ON scene_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scene configurations"
  ON scene_configurations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scene configurations"
  ON scene_configurations FOR DELETE
  USING (auth.uid() = user_id);

