/**
 * Script de configuration et test Supabase
 * Exécute les tests de connexion et crée l'utilisateur admin
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../lib/supabase/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gnpvwoguufyitnszwvqp.supabase.co';
const ADMIN_EMAIL = 'admin@hearst-qatar.com';
const ADMIN_PASSWORD = 'admin';

/**
 * Test de connexion à Supabase
 */
async function testConnection(testNumber: number): Promise<boolean> {
  try {
    console.log(`\n🔍 Test de connexion #${testNumber}...`);
    
    // Test 1: Vérifier que les tables existent
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('deployments')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error(`❌ Test #${testNumber} échoué:`, tablesError.message);
      return false;
    }

    console.log(`✅ Test #${testNumber} réussi - Connexion OK`);
    return true;
  } catch (error: any) {
    console.error(`❌ Test #${testNumber} échoué:`, error.message);
    return false;
  }
}

/**
 * Crée l'utilisateur admin
 */
async function createAdminUser(): Promise<boolean> {
  try {
    console.log('\n👤 Création de l\'utilisateur admin...');

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUser?.users?.find((u: any) => u.email === ADMIN_EMAIL);

    if (adminExists) {
      console.log('⚠️  L\'utilisateur admin existe déjà');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   ID: ${adminExists.id}`);
      return true;
    }

    // Créer l'utilisateur admin
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Administrator',
      },
    });

    if (error) {
      console.error('❌ Erreur lors de la création de l\'admin:', error.message);
      return false;
    }

    console.log('✅ Utilisateur admin créé avec succès');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   ID: ${data.user.id}`);
    return true;
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
    return false;
  }
}

/**
 * Vérifie que les migrations ont été appliquées
 */
async function checkMigrations(): Promise<boolean> {
  try {
    console.log('\n📋 Vérification des migrations...');

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

    let allTablesExist = true;

    for (const table of tables) {
      const { error } = await supabaseAdmin.from(table).select('count').limit(1);
      if (error) {
        console.error(`❌ Table "${table}" n'existe pas:`, error.message);
        allTablesExist = false;
      } else {
        console.log(`✅ Table "${table}" existe`);
      }
    }

    return allTablesExist;
  } catch (error: any) {
    console.error('❌ Erreur lors de la vérification des migrations:', error.message);
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Configuration Supabase - Hearst Qatar\n');
  console.log(`📍 URL: ${SUPABASE_URL}\n`);

  // Vérifier les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('   Assurez-vous que .env.local existe avec:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Vérifier les migrations
  const migrationsOK = await checkMigrations();
  if (!migrationsOK) {
    console.error('\n❌ Certaines tables sont manquantes!');
    console.error('   Veuillez exécuter les migrations SQL dans le dashboard Supabase:');
    console.error('   1. lib/supabase/migrations/001_initial_schema.sql');
    console.error('   2. lib/supabase/migrations/002_row_level_security.sql');
    process.exit(1);
  }

  // Exécuter 10 tests de connexion
  console.log('\n🧪 Exécution de 10 tests de connexion...');
  const testResults: boolean[] = [];
  for (let i = 1; i <= 10; i++) {
    const result = await testConnection(i);
    testResults.push(result);
    // Petite pause entre les tests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const successCount = testResults.filter((r) => r).length;
  console.log(`\n📊 Résultats: ${successCount}/10 tests réussis`);

  if (successCount < 10) {
    console.error('⚠️  Certains tests ont échoué. Vérifiez votre configuration.');
  }

  // Créer l'utilisateur admin
  await createAdminUser();

  console.log('\n✅ Configuration terminée!');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. Connectez-vous avec admin/admin');
  console.log('   2. Exécutez le script de migration des données');
  console.log('   3. Importez les modèles 3D si nécessaire');
}

// Exécuter le script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { testConnection, createAdminUser, checkMigrations };

