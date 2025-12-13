/**
 * Client Supabase pour le backend (API routes, Server Components)
 * Utilise la clé service role pour les opérations administratives
 * ⚠️ NE JAMAIS EXPOSER CETTE CLÉ AU CLIENT
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Client Supabase avec service role key
 * Utilisé uniquement côté serveur pour les opérations administratives
 */
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

// Fonction pour vérifier la configuration
export function checkSupabaseServerConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Types pour TypeScript (seront générés plus tard)
export type Database = any; // TODO: Générer depuis Supabase CLI

