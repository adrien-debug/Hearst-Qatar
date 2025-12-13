/**
 * Script pour appliquer les migrations SQL directement via PostgreSQL
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { Client } from 'pg';

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// URL de connexion PostgreSQL
const POSTGRES_URL = process.env.DATABASE_URL || 'postgresql://postgres:Adrien0334$$@db.gnpvwoguufyitnszwvqp.supabase.co:5432/postgres';

/**
 * Applique une migration SQL
 */
async function applyMigration(client: Client, migrationFile: string): Promise<boolean> {
  try {
    const migrationPath = path.join(process.cwd(), 'lib', 'supabase', 'migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Fichier de migration introuvable: ${migrationPath}`);
      return false;
    }

    console.log(`\n📄 Application de la migration: ${migrationFile}`);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Exécuter la migration
    await client.query(sql);
    
    console.log(`✅ Migration ${migrationFile} appliquée avec succès`);
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur lors de l'application de ${migrationFile}:`, error.message);
    return false;
  }
}

/**
 * Vérifie que les tables existent
 */
async function checkTables(client: Client): Promise<boolean> {
  try {
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const expectedTables = [
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

    const existingTables = rows.map((r: any) => r.table_name);
    const missingTables = expectedTables.filter((t) => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('\n⚠️  Tables manquantes:', missingTables.join(', '));
      return false;
    }

    console.log(`\n✅ Toutes les ${expectedTables.length} tables existent`);
    return true;
  } catch (error: any) {
    console.error('❌ Erreur lors de la vérification des tables:', error.message);
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Application des migrations Supabase\n');

  const client = new Client({
    connectionString: POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Se connecter à la base de données
    console.log('🔌 Connexion à la base de données...');
    await client.connect();
    console.log('✅ Connecté à PostgreSQL\n');

    // Vérifier l'état actuel
    console.log('📋 Vérification de l\'état actuel...');
    const tablesExist = await checkTables(client);

    if (tablesExist) {
      console.log('\n✅ Les migrations semblent déjà appliquées');
      console.log('   Pour les réappliquer, supprimez d\'abord les tables existantes');
    } else {
      // Appliquer les migrations dans l'ordre
      console.log('\n📦 Application des migrations...');
      
      const migration1 = await applyMigration(client, '001_initial_schema.sql');
      if (!migration1) {
        throw new Error('Échec de la première migration');
      }

      const migration2 = await applyMigration(client, '002_row_level_security.sql');
      if (!migration2) {
        throw new Error('Échec de la deuxième migration');
      }

      // Vérifier à nouveau
      console.log('\n🔍 Vérification finale...');
      const allTablesExist = await checkTables(client);
      
      if (allTablesExist) {
        console.log('\n✅ Toutes les migrations ont été appliquées avec succès!');
      } else {
        console.log('\n⚠️  Certaines tables sont toujours manquantes');
      }
    }

  } catch (error: any) {
    console.error('\n❌ Erreur fatale:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Déconnexion de la base de données');
  }
}

// Exécuter le script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { applyMigration, checkTables };

