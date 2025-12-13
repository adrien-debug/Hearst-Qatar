/**
 * Client Supabase pour le frontend
 * Utilise la clé anonyme (anon key) qui est sécurisée par RLS
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Créer le client même si les variables ne sont pas définies (pour les scripts)
// Les erreurs seront gérées lors de l'utilisation
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

// Fonction pour vérifier la configuration
export function checkSupabaseConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Types pour TypeScript (seront générés plus tard)
export type Database = any; // TODO: Générer depuis Supabase CLI

