/**
 * Script pour importer les modèles 3D existants vers Supabase Storage
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { supabaseAdmin, checkSupabaseServerConfig } from '../lib/supabase/server';
import { createModel3D, uploadModel3DFile } from '../lib/supabase/services/models3d';

// Vérifier la configuration
const serverConfig = checkSupabaseServerConfig();
if (!serverConfig.valid) {
  console.error('❌ Variables d\'environnement manquantes:', serverConfig.missing.join(', '));
  process.exit(1);
}

/**
 * Scanne un répertoire pour trouver les fichiers 3D
 */
function find3DFiles(dir: string, extensions: string[] = ['.glb', '.gltf', '.dae']): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Récursivement scanner les sous-dossiers
        files.push(...find3DFiles(fullPath, extensions));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors du scan de ${dir}:`, error);
  }

  return files;
}

/**
 * Importe un fichier modèle 3D
 */
async function importModelFile(filePath: string): Promise<boolean> {
  try {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName).toLowerCase().slice(1); // .glb -> glb
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;

    console.log(`\n📦 Import de: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

    // Lire le fichier
    const fileBuffer = fs.readFileSync(filePath);
    
    // Créer un Blob-like object pour Supabase
    const blob = new Blob([fileBuffer], {
      type: fileExt === 'glb' ? 'model/gltf-binary' : 'model/gltf+json',
    });

    // Créer un File-like object
    const file = Object.assign(blob, {
      name: fileName,
      lastModified: Date.now(),
    }) as File;

    // Upload vers Supabase Storage
    console.log('   ⬆️  Upload vers Supabase Storage...');
    const { path: storagePath, error: uploadError } = await uploadModel3DFile(file, fileName);

    if (uploadError) {
      console.error(`   ❌ Erreur lors de l'upload: ${uploadError.message}`);
      return false;
    }

    console.log(`   ✅ Fichier uploadé: ${storagePath}`);

    // Créer l'enregistrement dans la base de données
    console.log('   💾 Création de l\'enregistrement...');
    const model = await createModel3D({
      name: path.parse(fileName).name,
      description: `Modèle 3D importé depuis ${filePath}`,
      filePath: storagePath,
      fileSize: fileSize,
      fileType: (fileExt === 'glb' ? 'glb' : 'gltf') as 'glb' | 'gltf',
      metadata: {
        originalPath: filePath,
        importedAt: new Date().toISOString(),
      },
    });

    if (!model) {
      console.error('   ❌ Erreur lors de la création de l\'enregistrement');
      return false;
    }

    console.log(`   ✅ Modèle créé avec l'ID: ${model.id}`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Erreur lors de l'import de ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Vérifie que le bucket existe
 */
async function checkBucket(): Promise<boolean> {
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();

    if (error) {
      console.error('❌ Erreur lors de la vérification des buckets:', error.message);
      return false;
    }

    const modelsBucket = buckets?.find((b) => b.name === '3d-models');
    if (!modelsBucket) {
      console.error('❌ Le bucket "3d-models" n\'existe pas!');
      console.error('   Veuillez le créer dans le dashboard Supabase (Storage > New bucket)');
      return false;
    }

    console.log('✅ Bucket "3d-models" trouvé');
    return true;
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Import des modèles 3D vers Supabase\n');

  // Vérifier le bucket
  const bucketExists = await checkBucket();
  if (!bucketExists) {
    process.exit(1);
  }

  // Scanner le dossier public/models
  const modelsDir = path.join(process.cwd(), 'public', 'models');
  
  if (!fs.existsSync(modelsDir)) {
    console.log(`⚠️  Le dossier ${modelsDir} n'existe pas`);
    console.log('   Aucun modèle à importer');
    process.exit(0);
  }

  console.log(`\n🔍 Scan du dossier: ${modelsDir}`);
  const files = find3DFiles(modelsDir);

  if (files.length === 0) {
    console.log('   Aucun fichier 3D trouvé (.glb, .gltf, .dae)');
    process.exit(0);
  }

  console.log(`   ✅ ${files.length} fichier(s) 3D trouvé(s)\n`);

  // Importer chaque fichier
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const success = await importModelFile(file);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Petite pause entre les imports
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 Résumé de l\'import:');
  console.log(`   ✅ Réussis: ${successCount}`);
  console.log(`   ❌ Échoués: ${failCount}`);
  console.log(`   📁 Total: ${files.length}`);
  console.log('='.repeat(50) + '\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { find3DFiles, importModelFile, checkBucket };

