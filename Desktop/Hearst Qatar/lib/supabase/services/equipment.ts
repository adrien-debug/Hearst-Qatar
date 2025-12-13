/**
 * Service pour la gestion des équipements dans Supabase
 */

import { supabase } from '../client';
import type { MiningContainer, Transformer, ASICMachine, CoolingModule, CoolingSystem } from '../../../data/hardwareMock';

/**
 * Récupère tous les conteneurs de mining
 */
export async function getMiningContainers(): Promise<MiningContainer[]> {
  try {
    const { data, error } = await supabase
      .from('mining_containers')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching mining containers:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      capacityMW: Number(row.capacity_mw),
      machinesCount: row.machines_count,
      coolingSystem: row.cooling_system as 'Hydro' | 'Immersion' | 'Air',
      section: row.section,
      status: row.status as 'In Service' | 'Maintenance' | 'Standby',
      powerConsumptionMW: row.power_consumption_mw ? Number(row.power_consumption_mw) : 0,
      hashrateTHs: row.hashrate_ths ? Number(row.hashrate_ths) : 0,
      dailyProductionBTC: row.daily_production_btc ? Number(row.daily_production_btc) : 0,
      efficiencyJTH: row.efficiency_jth ? Number(row.efficiency_jth) : 0,
      uptime: row.uptime ? Number(row.uptime) : 0,
      activeMachines: row.active_machines || 0,
      coolingModule: {} as CoolingModule, // Sera rempli par une jointure si nécessaire
    }));
  } catch (error) {
    console.error('Error in getMiningContainers:', error);
    return [];
  }
}

/**
 * Récupère tous les transformateurs
 */
export async function getTransformers(): Promise<Transformer[]> {
  try {
    const { data, error } = await supabase
      .from('transformers')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching transformers:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      powerMVA: Number(row.power_mva),
      voltagePrimary: row.voltage_primary,
      voltageSecondary: row.voltage_secondary,
      section: row.section,
      containersConnected: [], // Sera rempli par une jointure si nécessaire
    }));
  } catch (error) {
    console.error('Error in getTransformers:', error);
    return [];
  }
}

/**
 * Récupère toutes les machines ASIC
 */
export async function getASICMachines(): Promise<ASICMachine[]> {
  try {
    const { data, error } = await supabase
      .from('asic_machines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ASIC machines:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      brand: row.brand,
      model: row.model,
      batch: row.batch,
      hashrateTHs: Number(row.hashrate_ths),
      powerConsumptionkW: Number(row.power_consumption_kw),
      efficiencyJTH: Number(row.efficiency_jth),
      totalInstalled: row.total_installed,
      activeCount: row.active_count,
      installationDate: row.installation_date || undefined,
    }));
  } catch (error) {
    console.error('Error in getASICMachines:', error);
    return [];
  }
}

/**
 * Récupère tous les modules de refroidissement
 */
export async function getCoolingModules(): Promise<CoolingModule[]> {
  try {
    const { data, error } = await supabase
      .from('cooling_modules')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching cooling modules:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      coolingCapacitykW: Number(row.cooling_capacity_kw),
      flowRate: row.flow_rate || '',
      temperatureIn: row.temperature_in ? Number(row.temperature_in) : 0,
      temperatureOut: row.temperature_out ? Number(row.temperature_out) : 0,
      status: row.status as 'OK' | 'Warning' | 'Maintenance',
      efficiency: row.efficiency ? Number(row.efficiency) : 0,
    }));
  } catch (error) {
    console.error('Error in getCoolingModules:', error);
    return [];
  }
}

/**
 * Récupère tous les systèmes de refroidissement
 */
export async function getCoolingSystems(): Promise<CoolingSystem[]> {
  try {
    const { data, error } = await supabase
      .from('cooling_systems')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching cooling systems:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      thermalCapacityMW: Number(row.thermal_capacity_mw),
      sectionsCovered: [], // Sera rempli par une jointure si nécessaire
      containersCovered: [], // Sera rempli par une jointure si nécessaire
      notes: row.notes || '',
    }));
  } catch (error) {
    console.error('Error in getCoolingSystems:', error);
    return [];
  }
}

/**
 * Insère ou met à jour un conteneur de mining
 */
export async function upsertMiningContainer(container: MiningContainer): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('mining_containers')
      .upsert({
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
      console.error('Error upserting mining container:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in upsertMiningContainer:', error);
    return false;
  }
}

/**
 * Insère ou met à jour un transformateur
 */
export async function upsertTransformer(transformer: Transformer): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('transformers')
      .upsert({
        id: transformer.id,
        name: transformer.name,
        power_mva: transformer.powerMVA,
        voltage_primary: transformer.voltagePrimary,
        voltage_secondary: transformer.voltageSecondary,
        section: transformer.section,
        status: 'OK',
      });

    if (error) {
      console.error('Error upserting transformer:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in upsertTransformer:', error);
    return false;
  }
}

