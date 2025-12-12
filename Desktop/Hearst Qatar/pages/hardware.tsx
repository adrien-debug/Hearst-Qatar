import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import EquipmentCard from '../components/EquipmentCard';
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

  // État pour gérer l'ouverture/fermeture des transformateurs par section
  const [openTransformerSections, setOpenTransformerSections] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // État pour gérer l'ouverture/fermeture des machines ASIC par section
  const [openASICSections, setOpenASICSections] = useState<{ [key: string]: boolean }>({
    '1': false,
    '2': false,
    '3': false,
    '4': false,
  });

  // État pour gérer les tooltips
  const [hoveredElement, setHoveredElement] = useState<{
    type: 'container' | 'transformer' | 'powerblock' | 'substation' | null;
    id: string;
    data: any;
    x: number;
    y: number;
  } | null>(null);

  const toggleSection = (sectionNum: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionNum]: !prev[sectionNum],
    }));
  };

  const toggleTransformerSection = (sectionNum: number) => {
    setOpenTransformerSections((prev) => ({
      ...prev,
      [sectionNum]: !prev[sectionNum],
    }));
  };

  const toggleASICSection = (key: string) => {
    setOpenASICSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleContainerClick = (containerId: string) => {
    router.push(`/containers/${containerId}`);
  };

  const handleMouseEnter = (e: React.MouseEvent, type: 'container' | 'transformer' | 'powerblock' | 'substation', id: string, data: any) => {
    setHoveredElement({
      type,
      id,
      data,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredElement) {
      setHoveredElement({
        ...hoveredElement,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // Calcul des statistiques globales
  const totalCapacity = miningContainers.reduce((sum, c) => sum + c.capacityMW, 0);
  const totalMachines = miningContainers.reduce((sum, c) => sum + c.machinesCount, 0);
  const activeContainers = miningContainers.filter(c => c.status === 'In Service').length;
  const totalHashrate = asicMachines.reduce((sum, m) => sum + (m.activeCount * m.hashrateTHs), 0);

  // Calcul des problèmes/alertes
  const problems = {
    substation: mainSubstation ? [] : [], // Pour l'instant OK
    sections: [1, 2, 3, 4].map((sectionNum) => {
      const sectionContainers = miningContainers.filter(c => c.section === `Section ${sectionNum}`);
      const sectionProblems = [];
      
      // Conteneurs en maintenance ou standby
      const problemContainers = sectionContainers.filter(c => 
        c.status === 'Maintenance' || c.status === 'Standby'
      );
      if (problemContainers.length > 0) {
        sectionProblems.push({
          type: 'warning',
          message: `${problemContainers.length} conteneur(s) hors service`,
          items: problemContainers.map(c => c.name)
        });
      }
      
      // Modules de refroidissement en problème
      const problemCooling = sectionContainers.filter(c => 
        c.coolingModule.status !== 'OK'
      );
      if (problemCooling.length > 0) {
        sectionProblems.push({
          type: problemCooling.some(c => c.coolingModule.status === 'Warning') ? 'warning' : 'error',
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
    transformers: transformers.map(t => {
      // Pour l'instant tous les transformateurs sont OK
      // On peut ajouter des logiques de détection de problèmes ici
      return null;
    }).filter((t) => t !== null) as typeof transformers,
    containers: miningContainers.filter(c => 
      c.status === 'Maintenance' || c.status === 'Standby' || c.coolingModule.status !== 'OK'
    )
  };

  const totalProblems = 
    problems.substation.length + 
    problems.sections.reduce((sum, s) => sum + s.problems.length, 0) + 
    problems.transformers.length + 
    problems.containers.length;

  return (
    <>
      <Head>
        <title>Hardware - 100MW QATAR</title>
        <meta name="description" content="Mining park hardware inventory" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 overflow-x-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#e2e8f0]">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[#0b1120] tracking-tight mb-2">
              Hardware Inventory
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Inventaire complet de tous les équipements miniers, systèmes de refroidissement et infrastructure électrique déployés sur le site.
            </p>
          </div>
        </div>

        {/* Bandeau de statistiques - Style Dashboard */}
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

        {/* Section Main Substation */}
        <section className="mb-24 relative">
          <div className="relative mb-8">
            <h2 className="text-[1.5rem] font-bold text-[#0b1120] tracking-tight mb-2">Poste principal</h2>
            <p className="text-sm text-[#64748b]">Infrastructure électrique principale</p>
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-4">
              <EquipmentCard
                title={mainSubstation.name}
                details={[
                  { label: 'Capacité totale', value: `${mainSubstation.totalCapacityMW} MW` },
                  { label: 'Tension d\'entrée', value: mainSubstation.inputVoltage },
                  { label: 'Tension de sortie', value: mainSubstation.outputVoltage },
                  { label: 'Nombre de départs', value: mainSubstation.feedersCount },
                  { label: 'Sections connectées', value: mainSubstation.sectionsConnected.length },
                ]}
                status="OK"
              />
              
              {/* Centre de notifications */}
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[8px] bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/20">
                      <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-[#0b1120] tracking-tight">Centre de notifications</h3>
                  </div>
                  {totalProblems > 0 && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#64748b] text-white text-[10px] font-bold">
                      {totalProblems}
                    </div>
                  )}
                </div>
                
                {totalProblems === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#8AFD81]/20 flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#64748b] font-medium">Aucun problème détecté</p>
                    <p className="text-xs text-[#64748b] mt-1">Tous les systèmes fonctionnent normalement</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {/* Problèmes Substation */}
                    {problems.substation.length > 0 && (
                      <div className="pb-2 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                          <span className="text-sm font-semibold text-[#0b1120]">Substation</span>
                        </div>
                        {problems.substation.map((problem, idx) => (
                          <div key={idx} className="ml-3 text-xs text-[#64748b]">{problem}</div>
                        ))}
                      </div>
                    )}
                    
                    {/* Problèmes Sections */}
                    {problems.sections.filter(s => s.hasProblems).map((section) => (
                      <div key={section.section} className="pb-2 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                        </div>
                        {section.problems.map((problem, idx) => (
                          <div key={idx} className="ml-3">
                            <div className="text-xs font-medium mb-0.5 text-[#64748b]">
                              {problem.message}
                            </div>
                            {problem.items && problem.items.length > 0 && (
                              <div className="ml-2 text-xs text-[#64748b]">
                                {problem.items.slice(0, 2).join(', ')}
                                {problem.items.length > 2 && ` +${problem.items.length - 2}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    {/* Problèmes Transformateurs */}
                    {problems.transformers.length > 0 && (
                      <div className="pb-2 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                          <span className="text-sm font-semibold text-[#0b1120]">Transformateurs</span>
                        </div>
                        {problems.transformers.map((transformer, idx) => (
                          <div key={idx} className="ml-3 text-xs text-[#64748b]">{transformer.name} - Problème détecté</div>
                        ))}
                      </div>
                    )}
                    
                    {/* Résumé Conteneurs */}
                    {problems.containers.length > 0 && (
                      <div className="pb-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                          <span className="text-sm font-semibold text-[#0b1120]">Conteneurs</span>
                        </div>
                        <div className="ml-3 text-xs text-[#64748b] font-medium">
                          {problems.containers.length} conteneur(s) nécessitent une attention
                        </div>
                        <div className="ml-3 mt-1 text-xs text-[#64748b]">
                          {problems.containers.slice(0, 3).map(c => c.name).join(', ')}
                          {problems.containers.length > 3 && ` +${problems.containers.length - 3}`}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section Mining Containers */}
        <section className="mb-24 relative">
          <div className="relative mb-8">
            <h2 className="text-[1.5rem] font-bold text-[#0b1120] tracking-tight mb-2">Conteneurs miniers</h2>
            <p className="text-sm text-[#64748b]">Inventaire des conteneurs de minage par section</p>
          </div>

          {/* Sections individuelles pour chaque groupe de conteneurs avec menus déroulants */}
          {[1, 2, 3, 4].map((sectionNum) => {
            const sectionContainers = miningContainers.filter(
              (c) => c.section === `Section ${sectionNum}`
            );
            const sectionCapacity = sectionContainers.reduce((sum, c) => sum + c.capacityMW, 0);
            const sectionActive = sectionContainers.filter((c) => c.status === 'In Service').length;
            const activePercentage = (sectionActive / sectionContainers.length) * 100;
            const isOpen = openSections[sectionNum];

            return (
              <div key={sectionNum} className="mb-3 last:mb-0">
                {/* En-tête cliquable du menu déroulant */}
                <button
                  onClick={() => toggleSection(sectionNum)}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between p-4 rounded-[8px] bg-white border border-[#e2e8f0] hover:border-[#8AFD81]/30 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg className="w-10 h-10 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" opacity="0.3" strokeWidth="2"/>
                          <text x="12" y="16.5" fontSize="12" fontWeight="bold" fill="currentColor" textAnchor="middle">{sectionNum}</text>
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-base font-semibold text-[#0b1120] tracking-tight mb-0.5">
                          Section {sectionNum}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
                          <span>{sectionContainers.length} conteneurs</span>
                          <span>•</span>
                          <span>{sectionCapacity.toFixed(1)} MW</span>
                          <span>•</span>
                          <span>{sectionActive} actifs ({activePercentage.toFixed(0)}%)</span>
                          <span>•</span>
                          <span>{(sectionContainers.reduce((sum, c) => sum + c.hashrateTHs, 0) / 1000).toFixed(1)} PH/s</span>
                          <span>•</span>
                          <span>{(sectionContainers.reduce((sum, c) => sum + c.dailyProductionBTC, 0)).toFixed(4)} BTC/j</span>
                          <span>•</span>
                          <span>{(sectionContainers.reduce((sum, c) => sum + c.uptime, 0) / sectionContainers.length).toFixed(1)}% uptime</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-[8px] bg-white border border-[#e2e8f0] shadow-sm">
                        <div className="w-28 h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8AFD81] rounded-full transition-all duration-500"
                            style={{ width: `${activePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-[#64748b] min-w-[35px]">{activePercentage.toFixed(0)}%</span>
                      </div>
                      {/* Icône de flèche animée */}
                      <div className={`relative w-10 h-10 rounded-[8px] bg-white border border-[#e2e8f0] flex items-center justify-center transition-all duration-200 ${isOpen ? 'rotate-180 bg-[#8AFD81] border-[#8AFD81] text-black' : 'hover:border-[#8AFD81]/30'}`}>
                        <svg 
                          className={`w-6 h-6 transition-colors duration-200 ${isOpen ? 'text-black' : 'text-[#64748b]'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Contenu du menu déroulant */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-4 pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {sectionContainers.map((container) => {
                        const tempDiff = container.coolingModule.temperatureIn - container.coolingModule.temperatureOut;
                        const coolingStatusColor = container.coolingModule.status === 'OK' 
                          ? 'text-[#8AFD81]' 
                          : container.coolingModule.status === 'Warning' 
                          ? 'text-yellow-500' 
                          : 'text-orange-500';
                        
                        return (
                          <EquipmentCard
                            key={container.id}
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
                        );
                      })}
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
