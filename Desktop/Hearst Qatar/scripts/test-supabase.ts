/**
 * Script de test complet de la connexion Supabase
 * Exécute 10 tests de connexion et vérifie toutes les fonctionnalités
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { supabase, checkSupabaseConfig } from '../lib/supabase/client';
import { supabaseAdmin, checkSupabaseServerConfig } from '../lib/supabase/server';

// Vérifier la configuration avant de continuer
const clientConfig = checkSupabaseConfig();
const serverConfig = checkSupabaseServerConfig();

if (!clientConfig.valid || !serverConfig.valid) {
  console.error('❌ Variables d\'environnement manquantes:');
  if (!clientConfig.valid) {
    console.error('   Client:', clientConfig.missing.join(', '));
  }
  if (!serverConfig.valid) {
    console.error('   Server:', serverConfig.missing.join(', '));
  }
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gnpvwoguufyitnszwvqp.supabase.co';

interface TestResult {
  testNumber: number;
  success: boolean;
  message: string;
  duration: number;
}

const results: TestResult[] = [];

/**
 * Exécute un test de connexion
 */
async function runTest(testNumber: number): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    // Test 1: Vérifier que la connexion fonctionne
    const { data, error } = await supabase
      .from('deployments')
      .select('count')
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      return {
        testNumber,
        success: false,
        message: `Erreur: ${error.message}`,
        duration,
      };
    }

    return {
      testNumber,
      success: true,
      message: 'Connexion réussie',
      duration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      testNumber,
      success: false,
      message: `Exception: ${error.message}`,
      duration,
    };
  }
}

/**
 * Test des différentes tables
 */
async function testTables(): Promise<void> {
  console.log('\n📋 Test des tables...');

  const tables = [
    'deployments',
    'models_3d',
    'equipment_instances',
    'mining_containers',
    'transformers',
    'switchgears',
    'power_blocks',
    'substations',
    'asic_machines',
    'cooling_modules',
    'cooling_systems',
    'electrical_nodes',
    'dashboard_metrics',
    'scene_configurations',
  ];

  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ Table "${table}": ${error.message}`);
      } else {
        console.log(`✅ Table "${table}": OK`);
      }
    } catch (error: any) {
      console.log(`❌ Table "${table}": ${error.message}`);
    }
  }
}

/**
 * Test du Storage
 */
async function testStorage(): Promise<void> {
  console.log('\n📦 Test du Storage...');

  try {
    // Lister les buckets
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();

    if (bucketsError) {
      console.log(`❌ Erreur lors de la liste des buckets: ${bucketsError.message}`);
      return;
    }

    console.log(`✅ ${buckets?.length || 0} bucket(s) trouvé(s)`);

    // Vérifier que le bucket 3d-models existe
    const modelsBucket = buckets?.find((b) => b.name === '3d-models');
    if (modelsBucket) {
      console.log('✅ Bucket "3d-models" existe');

      // Lister les fichiers
      const { data: files, error: filesError } = await supabaseAdmin.storage
        .from('3d-models')
        .list();

      if (filesError) {
        console.log(`⚠️  Erreur lors de la liste des fichiers: ${filesError.message}`);
      } else {
        console.log(`✅ ${files?.length || 0} fichier(s) dans le bucket`);
      }
    } else {
      console.log('⚠️  Bucket "3d-models" n\'existe pas encore');
    }
  } catch (error: any) {
    console.log(`❌ Erreur lors du test du Storage: ${error.message}`);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🧪 Test complet de la connexion Supabase\n');
  console.log(`📍 URL: ${SUPABASE_URL}\n`);

  // Vérifier les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('   Assurez-vous que .env.local existe');
    process.exit(1);
  }

  // Exécuter 10 tests de connexion
  console.log('🔄 Exécution de 10 tests de connexion...\n');

  for (let i = 1; i <= 10; i++) {
    const result = await runTest(i);
    results.push(result);

    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} Test #${result.testNumber}: ${result.message} (${result.duration}ms)`);

    // Petite pause entre les tests
    if (i < 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  // Statistiques
  const successCount = results.filter((r) => r.success).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const minDuration = Math.min(...results.map((r) => r.duration));
  const maxDuration = Math.max(...results.map((r) => r.duration));

  console.log('\n📊 Statistiques:');
  console.log(`   Tests réussis: ${successCount}/10`);
  console.log(`   Durée moyenne: ${avgDuration.toFixed(2)}ms`);
  console.log(`   Durée min: ${minDuration}ms`);
  console.log(`   Durée max: ${maxDuration}ms`);

  // Tests supplémentaires
  await testTables();
  await testStorage();

  // Résultat final
  console.log('\n' + '='.repeat(50));
  if (successCount === 10) {
    console.log('✅ Tous les tests sont passés avec succès!');
  } else {
    console.log(`⚠️  ${10 - successCount} test(s) ont échoué`);
  }
  console.log('='.repeat(50) + '\n');
}

// Exécuter le script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { runTest, testTables, testStorage };

