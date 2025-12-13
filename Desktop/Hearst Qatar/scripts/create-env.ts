/**
 * Script pour créer le fichier .env.local avec les credentials Supabase
 */

import * as fs from 'fs';
import * as path from 'path';

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gnpvwoguufyitnszwvqp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHZ3b2d1dWZ5aXRuc3p3dnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDI5ODEsImV4cCI6MjA4MTIxODk4MX0.hGQwi6NpZhst0oW3DoTW3ZXxxvLDPP4qoYr-60rbjdk

# Service Role Key (backend only - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHZ3b2d1dWZ5aXRuc3p3dnFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY0Mjk4MSwiZXhwIjoyMDgxMjE4OTgxfQ.ZuIqOa1m80XMU46p1UzjgxshcLLY6rBGXnfFASgO0bQ

# JWT Secret
SUPABASE_JWT_SECRET=XmWzxdDZK5T98cqc+rcVFHb1fs8C27mxfftYrbsboQLsWL8w60jWj41Rf8rrykJDOjeALzeep0voqaLcdAUh4Q==
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  // Vérifier si le fichier existe déjà
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Le fichier .env.local existe déjà');
    console.log('   Pour le recréer, supprimez-le d\'abord');
    process.exit(0);
  }

  // Créer le fichier
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Fichier .env.local créé avec succès!');
  console.log(`   Chemin: ${envPath}`);
} catch (error: any) {
  console.error('❌ Erreur lors de la création du fichier .env.local:', error.message);
  process.exit(1);
}

