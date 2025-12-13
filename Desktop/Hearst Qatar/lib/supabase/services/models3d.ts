/**
 * Service pour la gestion des modèles 3D dans Supabase
 */

import { supabase } from '../client';

export interface Model3D {
  id: string;
  name: string;
  description?: string;
  filePath: string;
  fileSize?: number;
  fileType?: 'glb' | 'gltf';
  thumbnailPath?: string;
  metadata?: Record<string, any>;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Récupère tous les modèles 3D
 */
export async function getModels3D(userId?: string): Promise<Model3D[]> {
  try {
    let query = supabase.from('models_3d').select('*').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching 3D models:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      filePath: row.file_path,
      fileSize: row.file_size,
      fileType: row.file_type as 'glb' | 'gltf',
      thumbnailPath: row.thumbnail_path,
      metadata: row.metadata || {},
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error('Error in getModels3D:', error);
    return [];
  }
}

/**
 * Récupère un modèle 3D par son ID
 */
export async function getModel3DById(id: string): Promise<Model3D | null> {
  try {
    const { data, error } = await supabase
      .from('models_3d')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching 3D model:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      filePath: data.file_path,
      fileSize: data.file_size,
      fileType: data.file_type as 'glb' | 'gltf',
      thumbnailPath: data.thumbnail_path,
      metadata: data.metadata || {},
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error in getModel3DById:', error);
    return null;
  }
}

/**
 * Upload un fichier modèle 3D vers Supabase Storage
 */
export async function uploadModel3DFile(
  file: File,
  fileName: string
): Promise<{ path: string; error: Error | null }> {
  try {
    const fileExt = fileName.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('3d-models')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { path: '', error };
    }

    return { path: data.path, error: null };
  } catch (error) {
    console.error('Error in uploadModel3DFile:', error);
    return { path: '', error: error as Error };
  }
}

/**
 * Crée un enregistrement de modèle 3D
 */
export async function createModel3D(
  model: Omit<Model3D, 'id' | 'createdAt' | 'updatedAt'>,
  userId?: string
): Promise<Model3D | null> {
  try {
    const { data, error } = await supabase
      .from('models_3d')
      .insert({
        name: model.name,
        description: model.description,
        file_path: model.filePath,
        file_size: model.fileSize,
        file_type: model.fileType,
        thumbnail_path: model.thumbnailPath,
        metadata: model.metadata || {},
        user_id: userId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating 3D model:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      filePath: data.file_path,
      fileSize: data.file_size,
      fileType: data.file_type as 'glb' | 'gltf',
      thumbnailPath: data.thumbnail_path,
      metadata: data.metadata || {},
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error in createModel3D:', error);
    return null;
  }
}

/**
 * Obtient l'URL publique d'un fichier modèle 3D
 */
export async function getModel3DUrl(filePath: string): Promise<string | null> {
  try {
    const { data } = supabase.storage.from('3d-models').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting model URL:', error);
    return null;
  }
}

/**
 * Supprime un modèle 3D et son fichier
 */
export async function deleteModel3D(id: string): Promise<boolean> {
  try {
    // Récupérer le modèle pour obtenir le chemin du fichier
    const model = await getModel3DById(id);
    if (!model) {
      return false;
    }

    // Supprimer le fichier du storage
    if (model.filePath) {
      const { error: storageError } = await supabase.storage
        .from('3d-models')
        .remove([model.filePath]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }
    }

    // Supprimer l'enregistrement
    const { error } = await supabase.from('models_3d').delete().eq('id', id);

    if (error) {
      console.error('Error deleting model:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteModel3D:', error);
    return false;
  }
}

