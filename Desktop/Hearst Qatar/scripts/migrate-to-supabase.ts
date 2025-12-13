/**
 * Script de migration des données depuis localStorage vers Supabase
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../lib/supabase/server';
import {
  getDeployments as getLocalDeployments,
  type Deployment,
} from '../data/deployments';
import {
  miningContainers,
  transformers,
  asicMachines,
  coolingSystems,
} from '../data/hardwareMock';
import { buildElectricalStructure } from '../data/electricalMock';

/**
 * Migre les déploiements depuis localStorage
 */
async function migrateDeployments(): Promise<number> {
  try {
    console.log('\n📦 Migration des déploiements...');

    if (typeof window === 'undefined') {
      console.log('⚠️  localStorage non disponible (côté serveur)');
      return 0;
    }

    const localDeployments = getLocalDeployments();
    let migrated = 0;

    for (const deployment of localDeployments) {
      const { error } = await supabaseAdmin.from('deployments').upsert({
        id: deployment.id,
        name: deployment.name,
        config: deployment.config,
        is_default: deployment.isDefault || false,
        user_id: null, // Sera associé à l'utilisateur lors de la connexion
      });

      if (error) {
        console.error(`❌ Erreur lors de la migration du déploiement ${deployment.id}:`, error.message);
      } else {
        migrated++;
        console.log(`✅ Déploiement migré: ${deployment.name}`);
      }
    }

    console.log(`✅ ${migrated}/${localDeployments.length} déploiements migrés`);
    return migrated;
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration des déploiements:', error.message);
    return 0;
  }
}

/**
 * Migre les conteneurs de mining
 */
async function migrateMiningContainers(): Promise<number> {
  try {
    console.log('\n📦 Migration des conteneurs de mining...');

    let migrated = 0;

    for (const container of miningContainers) {
      const { error } = await supabaseAdmin.from('mining_containers').upsert({
        id: container.id,
        name: container.name,
        type: container.type,
        capacity_mw: container.capacityMW,
        machines_count: container.machinesCount,
        cooling_system: container.coolingSystem,
        section: container.section,
        status: container.status,
        power_consumption_mw: container.powerConsumptionMW,
        hashrate_ths: container.hashrateTHs,
        daily_production_btc: container.dailyProductionBTC,
        efficiency_jth: container.efficiencyJTH,
        uptime: container.uptime,
        active_machines: container.activeMachines,
      });

      if (error) {
        console.error(`❌ Erreur lors de la migration du conteneur ${container.id}:`, error.message);
      } else {
        migrated++;

        // Migrer aussi le module de refroidissement associé
        if (container.coolingModule) {
          await supabaseAdmin.from('cooling_modules').upsert({
            id: container.coolingModule.id,
            type: container.coolingModule.type,
            cooling_capacity_kw: container.coolingModule.coolingCapacitykW,
            flow_rate: container.coolingModule.flowRate,
            temperature_in: container.coolingModule.temperatureIn,
            temperature_out: container.coolingModule.temperatureOut,
            status: container.coolingModule.status,
            efficiency: container.coolingModule.efficiency,
            container_id: container.id,
          });
        }
      }
    }

    console.log(`✅ ${migrated}/${miningContainers.length} conteneurs migrés`);
    return migrated;
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration des conteneurs:', error.message);
    return 0;
  }
}

/**
 * Migre les transformateurs
 */
async function migrateTransformers(): Promise<number> {
  try {
    console.log('\n⚡ Migration des transformateurs...');

    let migrated = 0;

    for (const transformer of transformers) {
      const { error } = await supabaseAdmin.from('transformers').upsert({
        id: transformer.id,
        name: transformer.name,
        power_mva: transformer.powerMVA,
        voltage_primary: transformer.voltagePrimary,
        voltage_secondary: transformer.voltageSecondary,
        section: transformer.section,
        status: 'OK',
      });

      if (error) {
        console.error(`❌ Erreur lors de la migration du transformateur ${transformer.id}:`, error.message);
      } else {
        migrated++;

        // Créer les relations avec les conteneurs
        for (const containerId of transformer.containersConnected) {
          await supabaseAdmin.from('transformer_containers').upsert({
            transformer_id: transformer.id,
            container_id: containerId,
          });
        }
      }
    }

    console.log(`✅ ${migrated}/${transformers.length} transformateurs migrés`);
    return migrated;
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration des transformateurs:', error.message);
    return 0;
  }
}

/**
 * Migre les machines ASIC
 */
async function migrateASICMachines(): Promise<number> {
  try {
    console.log('\n💻 Migration des machines ASIC...');

    let migrated = 0;

    for (const machine of asicMachines) {
      const { error } = await supabaseAdmin.from('asic_machines').upsert({
        brand: machine.brand,
        model: machine.model,
        batch: machine.batch,
        hashrate_ths: machine.hashrateTHs,
        power_consumption_kw: machine.powerConsumptionkW,
        efficiency_jth: machine.efficiencyJTH,
        total_installed: machine.totalInstalled,
        active_count: machine.activeCount,
        installation_date: machine.installationDate || null,
      });

      if (error) {
        console.error(`❌ Erreur lors de la migration de la machine ASIC:`, error.message);
      } else {
        migrated++;
      }
    }

    console.log(`✅ ${migrated}/${asicMachines.length} machines ASIC migrées`);
    return migrated;
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration des machines ASIC:', error.message);
    return 0;
  }
}

/**
 * Migre les systèmes de refroidissement
 */
async function migrateCoolingSystems(): Promise<number> {
  try {
    console.log('\n❄️  Migration des systèmes de refroidissement...');

    let migrated = 0;

    for (const system of coolingSystems) {
      const { error } = await supabaseAdmin.from('cooling_systems').upsert({
        id: system.id,
        type: system.type,
        thermal_capacity_mw: system.thermalCapacityMW,
        notes: system.notes,
      });

      if (error) {
        console.error(`❌ Erreur lors de la migration du système ${system.id}:`, error.message);
      } else {
        migrated++;

        // Créer les relations avec les sections
        for (const section of system.sectionsCovered) {
          await supabaseAdmin.from('cooling_system_sections').upsert({
            cooling_system_id: system.id,
            section_name: section,
          });
        }

        // Créer les relations avec les conteneurs
        for (const containerId of system.containersCovered) {
          await supabaseAdmin.from('cooling_system_containers').upsert({
            cooling_system_id: system.id,
            container_id: containerId,
          });
        }
      }
    }

    console.log(`✅ ${migrated}/${coolingSystems.length} systèmes migrés`);
    return migrated;
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration des systèmes:', error.message);
    return 0;
  }
}

/**
 * Migre la structure électrique
 */
async function migrateElectricalStructure(): Promise<number> {
  try {
    console.log('\n🔌 Migration de la structure électrique...');

    const structure = buildElectricalStructure();

    function migrateNode(node: any, parentId: string | null = null): number {
      let count = 0;

      const { error } = supabaseAdmin.from('electrical_nodes').upsert({
        id: node.id,
        name: node.name,
        type: node.type,
        capacity_mw: node.capacityMW || null,
        capacity_mva: node.capacityMVA || null,
        status: node.status || 'OK',
        parent_id: parentId,
        section: node.section || null,
        metadata: {},
      });

      if (!error) {
        count++;
      }

      // Migrer les enfants récursivement
      if (node.children) {
        for (const child of node.children) {
          count += migrateNode(child, node.id);
        }
      }

      return count;
    }

    const migrated = migrateNode(structure);
    console.log(`✅ ${migrated} nœuds électriques migrés`);
    return migrated;
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration de la structure électrique:', error.message);
    return 0;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Migration des données vers Supabase\n');

  // Vérifier les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    process.exit(1);
  }

  const results = {
    deployments: 0,
    containers: 0,
    transformers: 0,
    asicMachines: 0,
    coolingSystems: 0,
    electricalNodes: 0,
  };

  // Migrer toutes les données
  results.deployments = await migrateDeployments();
  results.containers = await migrateMiningContainers();
  results.transformers = await migrateTransformers();
  results.asicMachines = await migrateASICMachines();
  results.coolingSystems = await migrateCoolingSystems();
  results.electricalNodes = await migrateElectricalStructure();

  // Résumé
  console.log('\n📊 Résumé de la migration:');
  console.log(`   Déploiements: ${results.deployments}`);
  console.log(`   Conteneurs: ${results.containers}`);
  console.log(`   Transformateurs: ${results.transformers}`);
  console.log(`   Machines ASIC: ${results.asicMachines}`);
  console.log(`   Systèmes de refroidissement: ${results.coolingSystems}`);
  console.log(`   Nœuds électriques: ${results.electricalNodes}`);

  console.log('\n✅ Migration terminée!');
}

// Exécuter le script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export {
  migrateDeployments,
  migrateMiningContainers,
  migrateTransformers,
  migrateASICMachines,
  migrateCoolingSystems,
  migrateElectricalStructure,
};

