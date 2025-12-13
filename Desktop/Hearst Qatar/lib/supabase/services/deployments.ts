/**
 * Service pour la gestion des déploiements dans Supabase
 */

import { supabase } from '../client';
import type { Deployment, DeploymentConfig } from '../../../data/deployments';

export interface SupabaseDeployment {
  id: string;
  name: string;
  user_id: string | null;
  config: DeploymentConfig;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Convertit un déploiement Supabase en déploiement local
 */
function fromSupabase(row: SupabaseDeployment): Deployment {
  return {
    id: row.id,
    name: row.name,
    config: row.config,
    isDefault: row.is_default,
  };
}

/**
 * Convertit un déploiement local en format Supabase
 */
function toSupabase(deployment: Partial<Deployment>, userId?: string) {
  return {
    name: deployment.name,
    user_id: userId || null,
    config: deployment.config || {},
    is_default: deployment.isDefault || false,
  };
}

/**
 * Récupère tous les déploiements de l'utilisateur actuel
 */
export async function getDeployments(userId?: string): Promise<Deployment[]> {
  try {
    const query = supabase.from('deployments').select('*').order('created_at', { ascending: false });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching deployments:', error);
      return [];
    }

    return (data || []).map(fromSupabase);
  } catch (error) {
    console.error('Error in getDeployments:', error);
    return [];
  }
}

/**
 * Récupère un déploiement par son ID
 */
export async function getDeploymentById(id: string): Promise<Deployment | null> {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching deployment:', error);
      return null;
    }

    return data ? fromSupabase(data) : null;
  } catch (error) {
    console.error('Error in getDeploymentById:', error);
    return null;
  }
}

/**
 * Crée un nouveau déploiement
 */
export async function createDeployment(
  deployment: Omit<Deployment, 'id'>,
  userId?: string
): Promise<Deployment | null> {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .insert(toSupabase(deployment, userId))
      .select()
      .single();

    if (error) {
      console.error('Error creating deployment:', error);
      return null;
    }

    return data ? fromSupabase(data) : null;
  } catch (error) {
    console.error('Error in createDeployment:', error);
    return null;
  }
}

/**
 * Met à jour un déploiement existant
 */
export async function updateDeployment(
  id: string,
  updates: Partial<Deployment>
): Promise<Deployment | null> {
  try {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.config !== undefined) updateData.config = updates.config;
    if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;

    // Mettre à jour updated_at dans les métadonnées
    if (updates.config?.metadata) {
      updateData.config = {
        ...updates.config,
        metadata: {
          ...updates.config.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    const { data, error } = await supabase
      .from('deployments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating deployment:', error);
      return null;
    }

    return data ? fromSupabase(data) : null;
  } catch (error) {
    console.error('Error in updateDeployment:', error);
    return null;
  }
}

/**
 * Supprime un déploiement
 */
export async function deleteDeployment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('deployments').delete().eq('id', id);

    if (error) {
      console.error('Error deleting deployment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteDeployment:', error);
    return false;
  }
}

/**
 * Duplique un déploiement
 */
export async function duplicateDeployment(
  id: string,
  newName: string,
  userId?: string
): Promise<Deployment | null> {
  try {
    const original = await getDeploymentById(id);
    if (!original) {
      return null;
    }

    const duplicated: Omit<Deployment, 'id'> = {
      name: newName,
      config: {
        ...original.config,
        metadata: {
          ...original.config.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      isDefault: false,
    };

    return await createDeployment(duplicated, userId);
  } catch (error) {
    console.error('Error in duplicateDeployment:', error);
    return null;
  }
}

