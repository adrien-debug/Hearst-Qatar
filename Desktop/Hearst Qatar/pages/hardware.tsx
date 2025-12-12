import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import EquipmentCard from '../components/EquipmentCard';
import NotificationCenter from '../components/NotificationCenter';
import ProportionalCircle from '../components/ProportionalCircle';
import StatusPieChart, { prepareStatusData } from '../components/StatusPieChart';
import {
  miningContainers,
  asicMachines,
  transformers,
  mainSubstation,
} from '../data/hardwareMock';

export default function Hardware() {
  const router = useRouter();

  // État pour gérer l'ouverture/fermeture des sections
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const toggleSection = (sectionNum: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionNum]: !prev[sectionNum],
    }));
  };

  const handleContainerClick = (containerId: string) => {
    router.push(`/containers/${containerId}`);
  };

  // Calcul des statistiques globales
  const totalCapacity = miningContainers.reduce((sum, c) => sum + c.capacityMW, 0);
  const totalMachines = miningContainers.reduce((sum, c) => sum + c.machinesCount, 0);
  const activeContainers = miningContainers.filter(c => c.status === 'In Service').length;
  const totalHashrate = asicMachines.reduce((sum, m) => sum + (m.activeCount * m.hashrateTHs), 0);

  // Calcul des problèmes/alertes
  const problems = {
    substation: mainSubstation ? [] : [],
    sections: [1, 2, 3, 4].map((sectionNum) => {
      const sectionContainers = miningContainers.filter(c => c.section === `Section ${sectionNum}`);
      const sectionProblems = [];
      
      const problemContainers = sectionContainers.filter(c => 
        c.status === 'Maintenance' || c.status === 'Standby'
      );
      if (problemContainers.length > 0) {
        sectionProblems.push({
          type: 'warning' as const,
          message: `${problemContainers.length} conteneur(s) hors service`,
          items: problemContainers.map(c => c.name)
        });
      }
      
      const problemCooling = sectionContainers.filter(c => 
        c.coolingModule.status !== 'OK'
      );
      if (problemCooling.length > 0) {
        sectionProblems.push({
          type: problemCooling.some(c => c.coolingModule.status === 'Warning') ? 'warning' as const : 'error' as const,
          message: `${problemCooling.length} module(s) de refroidissement en problème`,
          items: problemCooling.map(c => `${c.name} (${c.coolingModule.id})`)
        });
      }
      
      return {
        section: sectionNum,
        problems: sectionProblems,
        hasProblems: sectionProblems.length > 0
      };
    }),
    transformers: transformers.map(t => null).filter((t) => t !== null) as typeof transformers,
    containers: miningContainers.filter(c => 
      c.status === 'Maintenance' || c.status === 'Standby' || c.coolingModule.status !== 'OK'
    )
  };

  const totalProblems = 
    problems.substation.length + 
    problems.sections.reduce((sum, s) => sum + s.problems.length, 0) + 
    problems.transformers.length + 
    problems.containers.length;

  // Préparer les données de statut pour la substation (toujours OK pour l'instant)
  const substationStatusData = prepareStatusData([{ status: 'OK' }]);

  return (
    <>
      <Head>
        <title>Hardware - 100MW QATAR</title>
        <meta name="description" content="Mining park hardware inventory" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 overflow-x-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-white tracking-tight mb-2">
              Hardware Inventory
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Inventaire complet de tous les équipements miniers, systèmes de refroidissement et infrastructure électrique déployés sur le site.
            </p>
          </div>
        </div>

        {/* Centre de notifications - Pleine largeur */}
        <div className="mb-8">
          <NotificationCenter problems={problems} totalProblems={totalProblems} />
        </div>

        {/* Section Statistiques globales */}
        <div className="mb-8">
          <div className="bg-[#0a0b0d] rounded-[8px] p-6 sm:p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Capacité totale</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {totalCapacity.toFixed(1)}
                  </p>
                  <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">MW</span>
                </div>
                <p className="text-xs text-white/50 mt-2">Capacité installée</p>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Conteneurs actifs</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {activeContainers}
                  </p>
                  <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">/{miningContainers.length}</span>
                </div>
                <p className="text-xs text-white/50 mt-2">En service</p>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Machines totales</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {totalMachines.toLocaleString('en-US')}
                  </p>
                  <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">ASICs</span>
                </div>
                <p className="text-xs text-white/50 mt-2">Total installé</p>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Hashrate total</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {(totalHashrate / 1000).toFixed(1)}
                  </p>
                  <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">PH/s</span>
                </div>
                <p className="text-xs text-white/50 mt-2">Contribution réseau</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Sous-stations (vue hiérarchique) */}
        <section className="mb-12">
          <div className="relative mb-6">
            <h2 className="text-[1.5rem] font-bold text-white tracking-tight mb-2">Poste principal</h2>
            <p className="text-sm text-white/60">Infrastructure électrique principale</p>
          </div>
          
          <div className="bg-[#0a0b0d] rounded-[8px] p-6 sm:p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Visualisation avec cercle proportionnel */}
              <div className="flex flex-col items-center justify-center">
                <ProportionalCircle
                  value={mainSubstation.totalCapacityMW}
                  maxValue={200}
                  label="Capacité totale"
                  unit="MW"
                  size={250}
                  color="#8AFD81"
                />
              </div>
              
              {/* Détails et camembert */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">{mainSubstation.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Tension d'entrée</p>
                      <p className="text-base font-semibold text-white">{mainSubstation.inputVoltage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Tension de sortie</p>
                      <p className="text-base font-semibold text-white">{mainSubstation.outputVoltage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Nombre de départs</p>
                      <p className="text-base font-semibold text-white">{mainSubstation.feedersCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Sections connectées</p>
                      <p className="text-base font-semibold text-white">{mainSubstation.sectionsConnected.length}</p>
                    </div>
                  </div>
                </div>
                
                {/* Camembert de statut */}
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Statut</h4>
                  <StatusPieChart data={substationStatusData} size={180} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Conteneurs (vue hiérarchique) */}
        <section className="mb-12">
          <div className="relative mb-6">
            <h2 className="text-[1.5rem] font-bold text-white tracking-tight mb-2">Conteneurs miniers</h2>
            <p className="text-sm text-white/60">Inventaire des conteneurs de minage par section</p>
          </div>

          {/* Sections individuelles avec visualisations */}
          {[1, 2, 3, 4].map((sectionNum) => {
            const sectionContainers = miningContainers.filter(
              (c) => c.section === `Section ${sectionNum}`
            );
            const sectionCapacity = sectionContainers.reduce((sum, c) => sum + c.capacityMW, 0);
            const sectionActive = sectionContainers.filter((c) => c.status === 'In Service').length;
            const activePercentage = (sectionActive / sectionContainers.length) * 100;
            const isOpen = openSections[sectionNum];
            
            // Préparer les données de statut pour le camembert
            const sectionStatusData = prepareStatusData(sectionContainers);
            
            // Trouver la capacité maximale pour le calcul proportionnel
            const maxSectionCapacity = Math.max(...[1, 2, 3, 4].map(s => 
              miningContainers
                .filter(c => c.section === `Section ${s}`)
                .reduce((sum, c) => sum + c.capacityMW, 0)
            ));

            return (
              <div key={sectionNum} className="mb-6 last:mb-0">
                {/* Carte principale de la section */}
                <div className="bg-[#0a0b0d] rounded-[8px] border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm overflow-hidden">
                  {/* En-tête cliquable */}
                  <button
                    onClick={() => toggleSection(sectionNum)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        {/* Cercle proportionnel */}
                        <div className="flex-shrink-0">
                          <ProportionalCircle
                            value={sectionCapacity}
                            maxValue={maxSectionCapacity}
                            label={`Section ${sectionNum}`}
                            unit="MW"
                            size={150}
                            color="#8AFD81"
                          />
                        </div>
                        
                        {/* Informations de la section */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-3">
                            Section {sectionNum}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Conteneurs</p>
                              <p className="text-lg font-bold text-[#8AFD81]">{sectionContainers.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Capacité</p>
                              <p className="text-lg font-bold text-white">{sectionCapacity.toFixed(1)} MW</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Actifs</p>
                              <p className="text-lg font-bold text-[#8AFD81]">{sectionActive}/{sectionContainers.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Hashrate</p>
                              <p className="text-lg font-bold text-white">
                                {(sectionContainers.reduce((sum, c) => sum + c.hashrateTHs, 0) / 1000).toFixed(1)} PH/s
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Camembert de statut */}
                        <div className="flex-shrink-0 hidden md:block">
                          <StatusPieChart data={sectionStatusData} size={120} />
                        </div>
                      </div>
                      
                      {/* Icône de flèche */}
                      <div className={`ml-4 flex-shrink-0 w-10 h-10 rounded-[8px] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 ${
                        isOpen ? 'rotate-180 bg-[#8AFD81]/20 border-[#8AFD81]/30' : 'hover:border-[#8AFD81]/20'
                      }`}>
                        <svg 
                          className={`w-6 h-6 transition-colors duration-200 ${isOpen ? 'text-[#8AFD81]' : 'text-white/60'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Contenu déroulant */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0 border-t border-white/10">
                      {/* Camembert visible sur mobile */}
                      <div className="md:hidden mb-6">
                        <StatusPieChart data={sectionStatusData} size={200} />
                      </div>
                      
                      {/* Grille des conteneurs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sectionContainers.map((container) => {
                          const tempDiff = container.coolingModule.temperatureIn - container.coolingModule.temperatureOut;
                          const coolingStatusColor = container.coolingModule.status === 'OK' 
                            ? 'text-[#8AFD81]' 
                            : container.coolingModule.status === 'Warning' 
                            ? 'text-yellow-400' 
                            : 'text-orange-400';
                          
                          return (
                            <div
                              key={container.id}
                              onClick={() => handleContainerClick(container.id)}
                              className="cursor-pointer"
                            >
                              <EquipmentCard
                                title={container.name}
                                subtitle={container.type}
                                details={[
                                  { label: 'Capacité', value: `${container.capacityMW} MW` },
                                  { label: 'Machines', value: `${container.machinesCount} ASICs` },
                                  { label: 'Hashrate', value: `${(container.hashrateTHs / 1000).toFixed(1)} PH/s` },
                                  { label: 'Production/jour', value: `${container.dailyProductionBTC.toFixed(4)} BTC` },
                                  { label: 'Uptime', value: `${container.uptime.toFixed(1)}%` },
                                  { label: 'Status', value: container.status },
                                  { label: 'Module refroidissement', value: container.coolingModule.id },
                                  { label: 'Temp. entrée', value: `${container.coolingModule.temperatureIn}°C` },
                                  { label: 'Temp. sortie', value: `${container.coolingModule.temperatureOut}°C` },
                                  { label: 'Δ Temp.', value: `${tempDiff.toFixed(1)}°C`, className: coolingStatusColor },
                                  { label: 'Status refroidissement', value: container.coolingModule.status, className: coolingStatusColor },
                                ]}
                                status={container.status}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
