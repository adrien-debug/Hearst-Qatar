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
                            {/* Ligne de base */}
                            <line x1="10" y1={y} x2="230" y2={y} stroke="#8AFD81" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                            {/* Ligne avec flux animé */}
                            <line x1="10" y1={y} x2="230" y2={y} stroke="url(#substationLineGradient)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" opacity="0.9" />
                            {/* Particules de flux électrique */}
                            <circle cx="50" cy={y} r="2" fill="#8AFD81" opacity="0.9">
                              <animate attributeName="cx" values="10;230;10" dur="1.5s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="120" cy={y} r="1.5" fill="#6FD96A" opacity="0.8">
                              <animate attributeName="cx" values="10;230;10" dur="4s" begin={`${idx * 0.75}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" begin={`${idx * 0.75}s`} repeatCount="indefinite" />
                            </circle>
                            <circle cx="190" cy={y} r="1.2" fill="#8AFD81" opacity="0.7">
                              <animate attributeName="cx" values="10;230;10" dur="1.5s" begin={`${idx * 0.6}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin={`${idx * 0.6}s`} repeatCount="indefinite" />
                            </circle>
                          </g>
                        ))}
                        
                        {/* Isolateurs premium - chaînes d'isolateurs avec gradients */}
                        <defs>
                          <radialGradient id="insulatorGradient">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.7" />
                          </radialGradient>
                        </defs>
                        {[35, 70, 118.5, 167.5, 202].map((x, idx) => (
                          <g key={idx}>
                            <circle cx={x} cy="22" r="3.5" fill="url(#insulatorGradient)" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={x} cy="30" r="3.5" fill="url(#insulatorGradient)" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={x} cy="38" r="3.5" fill="url(#insulatorGradient)" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={x} cy="46" r="3.5" fill="url(#insulatorGradient)" stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1={x} y1="19" x2={x} y2="49" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.6" />
                          </g>
                        ))}
                        
                        {/* Transformateurs principaux (132/33kV) - style premium technique avec ombres */}
                        <defs>
                          <filter id="transformerShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                            <feOffset dx="1" dy="2" result="offsetblur"/>
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.3"/>
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <rect x="45" y="50" width="24" height="20" rx="2.5" fill="url(#transformerGradient)" stroke="#6FD96A" strokeWidth="3.5" filter="url(#transformerShadow)" />
                        <rect x="105" y="50" width="24" height="20" rx="2.5" fill="url(#transformerGradient)" stroke="#6FD96A" strokeWidth="3.5" filter="url(#transformerShadow)" />
                        <rect x="171" y="50" width="24" height="20" rx="2.5" fill="url(#transformerGradient)" stroke="#6FD96A" strokeWidth="3.5" filter="url(#transformerShadow)" />
                        
                        {/* Bobines des transformateurs - détaillées avec noyau */}
                        {[57, 117, 183].map((x, idx) => (
                          <g key={idx}>
                            <ellipse cx={x} cy="58" rx="6" ry="4" fill="#334155" opacity="0.6" />
                            <ellipse cx={x} cy="64" rx="6" ry="4" fill="#334155" opacity="0.6" />
                            <line x1={x - 6} y1="58" x2={x + 6} y2="58" stroke="#475569" strokeWidth="1.5" />
                            <line x1={x - 6} y1="64" x2={x + 6} y2="64" stroke="#475569" strokeWidth="1.5" />
                            <rect x={x - 7} y="56" width="14" height="10" rx="1" fill="none" stroke="#475569" strokeWidth="1" opacity="0.4" />
                          </g>
                        ))}
                        
                        {/* Connexions vers transformateurs - avec flux électrique animé */}
                        <defs>
                          <linearGradient id="substationToTransformerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                            <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                              <animate attributeName="offset" values="0;1;0" dur="1.4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        {[
                          { x1: 36.5, y1: 34, x2: 57, y2: 50 },
                          { x1: 72.5, y1: 32, x2: 80, y2: 50 },
                          { x1: 121, y1: 34, x2: 117, y2: 50 },
                          { x1: 168.5, y1: 32, x2: 160, y2: 50 },
                          { x1: 203.5, y1: 34, x2: 183, y2: 50 }
                        ].map((line, idx) => (
                          <g key={idx}>
                            {/* Ligne de base */}
                            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                            {/* Ligne avec flux animé */}
                            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="url(#substationToTransformerGradient)" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)" opacity="0.9" />
                            {/* Particule de flux */}
                            <circle r="1.5" fill="#8AFD81" opacity="0.9">
                              <animateMotion dur="1.4s" repeatCount="indefinite">
                                <mpath href={`#substationPath-${idx}`} />
                              </animateMotion>
                              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
                            </circle>
                            <path id={`substationPath-${idx}`} d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} fill="none" />
                          </g>
                        ))}
                        
                        {/* Disjoncteurs premium - style technique avec gradients */}
                        <defs>
                          <linearGradient id="breakerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e2e8f0" />
                            <stop offset="50%" stopColor="#cbd5e1" />
                            <stop offset="100%" stopColor="#94a3b8" />
                          </linearGradient>
                        </defs>
                        <rect x="32" y="52" width="8" height="14" rx="2" fill="url(#breakerGradient)" stroke="#64748b" strokeWidth="2.5" />
                        <rect x="92" y="52" width="8" height="14" rx="2" fill="url(#breakerGradient)" stroke="#64748b" strokeWidth="2.5" />
                        <rect x="158" y="52" width="8" height="14" rx="2" fill="url(#breakerGradient)" stroke="#64748b" strokeWidth="2.5" />
                        <rect x="200" y="52" width="8" height="14" rx="2" fill="url(#breakerGradient)" stroke="#64748b" strokeWidth="2.5" />
                        {[36, 96, 162, 204].map((x) => (
                          <line key={x} x1={x} y1="55" x2={x} y2="63" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                        ))}
                        
                        {/* Section de commutation (sectionneur) */}
                        <rect x="80" y="52" width="20" height="6" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
                        <line x1="90" y1="52" x2="90" y2="58" stroke="#334155" strokeWidth="2" />
                        
                        {/* Lignes de sortie (33kV) - avec flux électrique animé */}
                        <defs>
                          <linearGradient id="outputLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6FD96A" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#8AFD81" stopOpacity="1">
                              <animate attributeName="offset" values="0;1;0" dur="3.5s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        {[57, 67, 117, 127, 183, 193].map((x, idx) => (
                          <g key={idx}>
                            {/* Ligne de base */}
                            <line x1={x} y1="70" x2={x} y2="76" stroke="#6FD96A" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                            {/* Ligne avec flux animé */}
                            <line x1={x} y1="70" x2={x} y2="76" stroke="url(#outputLineGradient)" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)" opacity="0.9" />
                            {/* Particule de flux */}
                            <circle cx={x} cy="71" r="1.2" fill="#8AFD81" opacity="0.9">
                              <animate attributeName="cy" values="70;76;70" dur="3.5s" begin={`${idx * 0.5}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.3;1;0.3" dur="3.5s" begin={`${idx * 0.5}s`} repeatCount="indefinite" />
                            </circle>
                          </g>
                        ))}
                        
                        {/* Équipements de mesure (compteurs) */}
                        <circle cx="40" cy="58" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                        <circle cx="200" cy="58" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="37" y1="58" x2="43" y2="58" stroke="#334155" strokeWidth="1" />
                        <line x1="197" y1="58" x2="203" y2="58" stroke="#334155" strokeWidth="1" />
                        
                        {/* Label premium technique avec ombre */}
                        <defs>
                          <filter id="textShadow">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                            <feOffset dx="1" dy="1" result="offsetblur"/>
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.3"/>
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Lignes de connexion entre substation et power blocks */}
                  <div className="relative w-full mb-8 flex items-start justify-center" style={{ height: '100px', marginTop: '-4px' }}>
                    <svg 
                      className="absolute inset-0 w-full h-full" 
                      viewBox="0 0 100 100" 
                      preserveAspectRatio="none"
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Gradient animé pour flux électrique - style jauge */}
                        <linearGradient id="electricFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3" />
                          <stop offset="30%" stopColor="#8AFD81" stopOpacity="0.1" />
                          <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                            <animate attributeName="offset" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="70%" stopColor="#8AFD81" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.3" />
                        </linearGradient>
                        {/* Gradient pour ligne principale avec flux vertical */}
                        <linearGradient id="mainLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                          <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.2" />
                          <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                            <animate attributeName="offset" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4" />
                        </linearGradient>
                        {/* Gradient pour branches avec flux courbe */}
                        <linearGradient id="branchFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3" />
                          <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.1" />
                          <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                              <animate attributeName="offset" values="0;1;0" dur="4.5s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.3" />
                        </linearGradient>
                        {/* Filtre glow pour effet électrique */}
                        <filter id="electricGlow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        {/* Masque pour effet de jauge segmentée */}
                        <pattern id="gaugePattern" x="0" y="0" width="8" height="2" patternUnits="userSpaceOnUse">
                          <rect width="6" height="2" fill="#8AFD81" opacity="0.8">
                            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
                          </rect>
                          <rect x="6" width="2" height="2" fill="transparent" />
                        </pattern>
                      </defs>
                      
                      {/* Ligne principale verticale avec flux électrique animé */}
                      <line 
                        x1="50" 
                        y1="0" 
                        x2="50" 
                        y2="40" 
                        stroke="url(#mainLineGradient)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                        filter="url(#electricGlow)"
                      />
                      {/* Ligne de base pour effet de jauge */}
                      <line 
                        x1="50" 
                        y1="0" 
                        x2="50" 
                        y2="40" 
                        stroke="#8AFD81" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                      {/* Particules de flux électrique sur ligne principale */}
                      <circle cx="50" cy="10" r="1.5" fill="#8AFD81" opacity="0.9">
                        <animate attributeName="cy" values="0;40;0" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="50" cy="20" r="1.2" fill="#6FD96A" opacity="0.8">
                        <animate attributeName="cy" values="0;40;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="50" cy="30" r="1" fill="#8AFD81" opacity="0.7">
                        <animate attributeName="cy" values="0;40;0" dur="3s" begin="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin="2s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Branche vers Power Block 1 avec flux animé */}
                      <path 
                        d="M 50 40 Q 35 50 12.5 100" 
                        stroke="url(#branchFlow)" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#electricGlow)"
                      />
                      <path 
                        d="M 50 40 Q 35 50 12.5 100" 
                        stroke="#8AFD81" 
                        strokeWidth="1.5" 
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                      {/* Particules sur branche 1 */}
                      <circle r="1.5" fill="#8AFD81" opacity="0.9">
                        <animateMotion dur="1.8s" repeatCount="indefinite">
                          <mpath href="#branch1-path" />
                        </animateMotion>
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                      <path id="branch1-path" d="M 50 40 Q 35 50 12.5 100" fill="none" />
                      
                      {/* Branche vers Power Block 2 avec flux animé */}
                      <path 
                        d="M 50 40 Q 40 50 37.5 100" 
                        stroke="url(#branchFlow)" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#electricGlow)"
                      />
                      <path 
                        d="M 50 40 Q 40 50 37.5 100" 
                        stroke="#8AFD81" 
                        strokeWidth="1.5" 
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                      <circle r="1.5" fill="#6FD96A" opacity="0.9">
                        <animateMotion dur="1.8s" begin="0.3s" repeatCount="indefinite">
                          <mpath href="#branch2-path" />
                        </animateMotion>
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
                      </circle>
                      <path id="branch2-path" d="M 50 40 Q 40 50 37.5 100" fill="none" />
                      
                      {/* Branche vers Power Block 3 avec flux animé */}
                      <path 
                        d="M 50 40 Q 60 50 62.5 100" 
                        stroke="url(#branchFlow)" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#electricGlow)"
                      />
                      <path 
                        d="M 50 40 Q 60 50 62.5 100" 
                        stroke="#8AFD81" 
                        strokeWidth="1.5" 
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                      <circle r="1.5" fill="#8AFD81" opacity="0.9">
                        <animateMotion dur="1.8s" begin="0.6s" repeatCount="indefinite">
                          <mpath href="#branch3-path" />
                        </animateMotion>
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                      </circle>
                      <path id="branch3-path" d="M 50 40 Q 60 50 62.5 100" fill="none" />
                      
                      {/* Branche vers Power Block 4 avec flux animé */}
                      <path 
                        d="M 50 40 Q 65 50 87.5 100" 
                        stroke="url(#branchFlow)" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#electricGlow)"
                      />
                      <path 
                        d="M 50 40 Q 65 50 87.5 100" 
                        stroke="#8AFD81" 
                        strokeWidth="1.5" 
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                      <circle r="1.5" fill="#6FD96A" opacity="0.9">
                        <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite">
                          <mpath href="#branch4-path" />
                        </animateMotion>
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
                      </circle>
                      <path id="branch4-path" d="M 50 40 Q 65 50 87.5 100" fill="none" />
                    </svg>
                  </div>
                  
                  {/* Ligne des transformateurs avec leurs conteneurs et labels de sections centrés */}
                  <div className="grid grid-cols-4 gap-8 w-full px-8 flex-1" style={{ minHeight: 0 }}>
                    {/* Transformateurs de toutes les sections avec labels centrés */}
                    {[1, 2, 3, 4].map((sectionNum) => {
                      const sectionTransformers = transformers.filter(t => t.section === `Section ${sectionNum}`);
                      const sectionProblems = problems.sections.find(s => s.section === sectionNum);
                      const hasSectionProblems = sectionProblems && sectionProblems.hasProblems;
                      
                      return (
                        <div key={sectionNum} className="flex flex-col items-center gap-4 w-full justify-start">
                          {/* Label section centré au-dessus des transformateurs - Style Dashboard Tabs */}
                          <div className="mb-8 flex-shrink-0">
                            <div className={`relative px-6 py-3 font-semibold text-sm tracking-wide transition-all duration-300 rounded-[8px] ${
                              hasSectionProblems
                                ? 'bg-[#8AFD81] text-black shadow-md'
                                : 'bg-white text-[#64748b] hover:text-[#0b1120] hover:border-[#8AFD81]/30 border border-[#e2e8f0] shadow-sm hover:shadow-md'
                            }`}>
                              Section {sectionNum}
                            </div>
                          </div>
                          
                          {/* Ligne de connexion entre Power Block et transformateurs premium */}
                          <div className="relative w-full flex items-center justify-center" style={{ height: '60px', marginTop: '-30px', marginBottom: '-30px' }}>
                            <svg 
                              className="absolute inset-0 w-full h-full" 
                              viewBox="0 0 100 100" 
                              preserveAspectRatio="none"
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                {/* Gradient animé pour flux électrique vertical */}
                                <linearGradient id={`powerBlockLineGradient-${sectionNum}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                                  <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.2" />
                                  <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                                    <animate attributeName="offset" values="0;1;0" dur="4s" repeatCount="indefinite" />
                                  </stop>
                                  <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4" />
                                </linearGradient>
                                <filter id={`powerBlockLineGlow-${sectionNum}`}>
                                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                  <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                              </defs>
                              {/* Ligne verticale avec flux électrique animé */}
                              <line 
                                x1="50" 
                                y1="0" 
                                x2="50" 
                                y2="100" 
                                stroke={`url(#powerBlockLineGradient-${sectionNum})`} 
                                strokeWidth="2.5" 
                                strokeLinecap="round"
                                filter={`url(#powerBlockLineGlow-${sectionNum})`}
                              />
                              {/* Ligne de base pour effet de jauge */}
                              <line 
                                x1="50" 
                                y1="0" 
                                x2="50" 
                                y2="100" 
                                stroke="#8AFD81" 
                                strokeWidth="1.5" 
                                strokeLinecap="round"
                                opacity="0.3"
                              />
                              {/* Particules de flux électrique */}
                              <circle cx="50" cy="20" r="1.5" fill="#8AFD81" opacity="0.9">
                                <animate attributeName="cy" values="0;100;0" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                              </circle>
                              <circle cx="50" cy="50" r="1.2" fill="#6FD96A" opacity="0.8">
                                <animate attributeName="cy" values="0;100;0" dur="4s" begin="1.25s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" begin="1.25s" repeatCount="indefinite" />
                              </circle>
                              <circle cx="50" cy="80" r="1" fill="#8AFD81" opacity="0.7">
                                <animate attributeName="cy" values="0;100;0" dur="1.5s" begin="1s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="1s" repeatCount="indefinite" />
                              </circle>
                            </svg>
                          </div>
                          
                          {/* Transformateurs avec leurs conteneurs connectés, alignés verticalement */}
                          <div className="flex flex-col gap-6 items-center w-full flex-1 justify-start">
                            {sectionTransformers.map((transformer) => {
                              const connectedContainers = miningContainers.filter(c => 
                                transformer.containersConnected.includes(c.id)
                              );
                              
                              if (connectedContainers.length === 0) return null;
                              
                              // On prend les 2 premiers conteneurs connectés
                              const leftContainer = connectedContainers[0];
                              const rightContainer = connectedContainers[1] || null;
                              
                              // Déterminer si le conteneur a un problème
                              const getContainerStatus = (container: typeof leftContainer) => {
                                if (container.status === 'Maintenance' || container.status === 'Standby') {
                                  return 'error';
                                }
                                if (container.coolingModule.status === 'Warning') {
                                  return 'warning';
                                }
                                if (container.coolingModule.status === 'Maintenance') {
                                  return 'error';
                                }
                                return 'ok';
                              };
                              
                              const leftStatus = leftContainer ? getContainerStatus(leftContainer) : 'ok';
                              const rightStatus = rightContainer ? getContainerStatus(rightContainer) : 'ok';
                              
                              return (
                                <div key={transformer.id} className="relative flex flex-col items-center w-full flex-shrink-0 py-1">
                                  {/* Ligne de connexion verticale continue depuis la ligne principale vers le transformateur */}
                                  <div className="relative w-full flex items-center justify-center" style={{ height: '50px', marginTop: '-25px', marginBottom: '-25px', zIndex: 1 }}>
                                    <svg 
                                      className="absolute inset-0 w-full h-full" 
                                      viewBox="0 0 100 100" 
                                      preserveAspectRatio="none"
                                      fill="none" 
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <defs>
                                        {/* Gradient animé pour flux électrique vers transformateur */}
                                        <linearGradient id={`transformerLineGradient-${transformer.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                                          <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.2" />
                                          <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                                            <animate attributeName="offset" values="0;1;0" dur="3.5s" repeatCount="indefinite" />
                                          </stop>
                                          <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.2" />
                                          <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4" />
                                        </linearGradient>
                                        <filter id={`transformerLineGlow-${transformer.id}`}>
                                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                          <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                          </feMerge>
                                        </filter>
                                      </defs>
                                      {/* Ligne verticale avec flux électrique animé */}
                                      <line 
                                        x1="50" 
                                        y1="0" 
                                        x2="50" 
                                        y2="100" 
                                        stroke={`url(#transformerLineGradient-${transformer.id})`} 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round"
                                        filter={`url(#transformerLineGlow-${transformer.id})`}
                                      />
                                      {/* Ligne de base */}
                                      <line 
                                        x1="50" 
                                        y1="0" 
                                        x2="50" 
                                        y2="100" 
                                        stroke="#8AFD81" 
                                        strokeWidth="1.5" 
                                        strokeLinecap="round"
                                        opacity="0.3"
                                      />
                                      {/* Particules de flux électrique */}
                                      <circle cx="50" cy="25" r="1.5" fill="#8AFD81" opacity="0.9">
                                        <animate attributeName="cy" values="0;100;0" dur="3.5s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3.5s" repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="50" cy="50" r="1.2" fill="#6FD96A" opacity="0.8">
                                        <animate attributeName="cy" values="0;100;0" dur="1.3s" begin="0.4s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.3s" begin="0.4s" repeatCount="indefinite" />
                                      </circle>
                                      <circle cx="50" cy="75" r="1" fill="#8AFD81" opacity="0.7">
                                        <animate attributeName="cy" values="0;100;0" dur="3.5s" begin="2s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3.5s" begin="2s" repeatCount="indefinite" />
                                      </circle>
                                    </svg>
                                  </div>
                                  
                                  <div className="flex items-center justify-center gap-0.5 w-full flex-shrink-0">
                                  {/* Conteneur gauche - Rectangle vertical */}
                                  {leftContainer && (
                                    <>
                                      <div
                                        className="relative flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer flex-shrink-0"
                                        style={{ height: '4.5rem', width: '2.5rem' }}
                                        onMouseEnter={(e) => handleMouseEnter(e, 'container', leftContainer.id, leftContainer)}
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        {leftStatus !== 'ok' && (
                                          <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/80 animate-pulse z-10"></div>
                                        )}
                                        <svg 
                                          className="w-full h-full" 
                                          viewBox="0 0 40 72" 
                                          fill="none" 
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <defs>
                                            <linearGradient id={`containerGradientLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                              <stop offset="0%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#8AFD81' : '#8AFD81') : '#e2e8f0'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '0.4' : '0.7') : '0.5'} />
                                              <stop offset="50%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#cbd5e1'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '0.5' : '0.8') : '0.6'} />
                                              <stop offset="100%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#5BC550' : '#5BC550') : '#94a3b8'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '0.6' : '0.9') : '0.7'} />
                                            </linearGradient>
                                            <linearGradient id={`containerBorderLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                              <stop offset="0%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#475569'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '1' : '1') : '0.9'} />
                                              <stop offset="100%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#5BC550' : '#5BC550') : '#334155'} stopOpacity="1" />
                                            </linearGradient>
                                            <filter id={`containerShadowLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`}>
                                              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                                              <feOffset dx="1" dy="2" result="offsetblur"/>
                                              <feComponentTransfer>
                                                <feFuncA type="linear" slope="0.4"/>
                                              </feComponentTransfer>
                                              <feMerge>
                                                <feMergeNode/>
                                                <feMergeNode in="SourceGraphic"/>
                                              </feMerge>
                                            </filter>
                                          </defs>
                                          {/* Structure principale du conteneur avec ombre premium */}
                                          <rect 
                                            x="2" 
                                            y="2" 
                                            width="36" 
                                            height="68" 
                                            rx="2.5" 
                                            fill={`url(#containerGradientLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            stroke={`url(#containerBorderLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            strokeWidth="3"
                                            filter={`url(#containerShadowLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                          />
                                          {/* Toit du conteneur */}
                                          <rect x="2" y="2" width="36" height="4" fill={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} opacity="0.8" />
                                          {/* Portes principales (double porte) */}
                                          <rect x="8" y="8" width="12" height="20" rx="1" fill={leftContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.5" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1.5" />
                                          <rect x="20" y="8" width="12" height="20" rx="1" fill={leftContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.5" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1.5" />
                                          {/* Séparation verticale entre les portes */}
                                          <line x1="20" y1="8" x2="20" y2="28" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1.5" />
                                          {/* Poignées de portes */}
                                          <circle cx="10" cy="18" r="1" fill={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} />
                                          <circle cx="30" cy="18" r="1" fill={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} />
                                          {/* Panneaux latéraux avec structure */}
                                          <rect x="6" y="30" width="28" height="8" fill={leftContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.4" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" />
                                          <line x1="14" y1="30" x2="14" y2="38" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          <line x1="26" y1="30" x2="26" y2="38" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          {/* Zone centrale */}
                                          <rect x="6" y="40" width="28" height="12" fill={leftContainer.status === 'In Service' ? '#8AFD81' : '#e2e8f0'} opacity="0.25" rx="1.5" />
                                          {/* Panneaux inférieurs */}
                                          <rect x="6" y="54" width="28" height="8" fill={leftContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.4" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" />
                                          <line x1="14" y1="54" x2="14" y2="62" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          <line x1="26" y1="54" x2="26" y2="62" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          {/* Base du conteneur */}
                                          <rect x="2" y="66" width="36" height="4" fill={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} opacity="0.8" />
                                        </svg>
                                      </div>
                                      
                                      {/* Ligne vers transformateur avec flux électrique animé */}
                                      <svg className="w-1.5 h-0.5 flex-shrink-0" viewBox="0 0 12 2" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                          <linearGradient id={`horizontalFlow-${transformer.id}-left`} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3" />
                                            <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.1" />
                                            <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                                              <animate attributeName="offset" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.1" />
                                            <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.3" />
                                          </linearGradient>
                                          <filter id={`horizontalGlow-${transformer.id}-left`}>
                                            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                                            <feMerge>
                                              <feMergeNode in="coloredBlur"/>
                                              <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                          </filter>
                                        </defs>
                                        {/* Ligne de base */}
                                        <line x1="0" y1="1" x2="12" y2="1" stroke="#8AFD81" strokeWidth="1.5" opacity="0.3" />
                                        {/* Ligne avec flux animé */}
                                        <line x1="0" y1="1" x2="12" y2="1" stroke="url(#horizontalFlow-${transformer.id}-left)" strokeWidth="2" strokeLinecap="round" filter="url(#horizontalGlow-${transformer.id}-left)" />
                                        {/* Particules de flux */}
                                        <circle cx="2" cy="1" r="1" fill="#8AFD81" opacity="0.9">
                                          <animate attributeName="cx" values="0;12;0" dur="1.2s" repeatCount="indefinite" />
                                          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="6" cy="1" r="0.8" fill="#6FD96A" opacity="0.8">
                                          <animate attributeName="cx" values="0;12;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                                          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                                        </circle>
                                      </svg>
                                    </>
                                  )}
                                  
                                  {/* Transformateur au milieu */}
                                  <div
                                    className="flex items-center justify-center flex-shrink-0 cursor-pointer"
                                    onMouseEnter={(e) => handleMouseEnter(e, 'transformer', transformer.id, transformer)}
                                    onMouseLeave={handleMouseLeave}
                                  >
                                    <svg 
                                      className="w-10 h-10" 
                                      viewBox="0 0 24 24" 
                                      fill="none" 
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <defs>
                                        <linearGradient id="transformerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.9" />
                                          <stop offset="50%" stopColor="#cbd5e1" stopOpacity="1" />
                                          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.95" />
                                        </linearGradient>
                                        <filter id="transformerGlow">
                                          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                                          <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                          </feMerge>
                                        </filter>
                                      </defs>
                                      {/* Bobine primaire (gauche) - style premium */}
                                      <path 
                                        d="M4 6C4 4.895 4.895 4 6 4C7.105 4 8 4.895 8 6V10C8 11.105 7.105 12 6 12C4.895 12 4 11.105 4 10V6Z" 
                                        fill="url(#transformerGradient)"
                                        stroke="#94a3b8" 
                                        strokeWidth="1.5"
                                      />
                                      <path 
                                        d="M4 14C4 12.895 4.895 12 6 12C7.105 12 8 12.895 8 14V18C8 19.105 7.105 20 6 20C4.895 20 4 19.105 4 18V14Z" 
                                        fill="url(#transformerGradient)"
                                        stroke="#94a3b8" 
                                        strokeWidth="1.5"
                                      />
                                      {/* Bobine secondaire (droite) - style premium */}
                                      <path 
                                        d="M16 6C16 4.895 16.895 4 18 4C19.105 4 20 4.895 20 6V10C20 11.105 19.105 12 18 12C16.895 12 16 11.105 16 10V6Z" 
                                        fill="url(#transformerGradient)"
                                        stroke="#94a3b8" 
                                        strokeWidth="1.5"
                                      />
                                      <path 
                                        d="M16 14C16 12.895 16.895 12 18 12C19.105 12 20 12.895 20 14V18C20 19.105 19.105 20 18 20C16.895 20 16 19.105 16 18V14Z" 
                                        fill="url(#transformerGradient)"
                                        stroke="#94a3b8" 
                                        strokeWidth="1.5"
                                      />
                                      {/* Noyau magnétique - lignes de connexion premium avec glow */}
                                      <line 
                                        x1="8" 
                                        y1="6" 
                                        x2="16" 
                                        y2="6" 
                                        stroke="#e2e8f0" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round"
                                        opacity="0.85"
                                        filter="url(#transformerGlow)"
                                      />
                                      <line 
                                        x1="8" 
                                        y1="12" 
                                        x2="16" 
                                        y2="12" 
                                        stroke="#e2e8f0" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round"
                                        opacity="0.85"
                                        filter="url(#transformerGlow)"
                                      />
                                      <line 
                                        x1="8" 
                                        y1="18" 
                                        x2="16" 
                                        y2="18" 
                                        stroke="#e2e8f0" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round"
                                        opacity="0.85"
                                        filter="url(#transformerGlow)"
                                      />
                                    </svg>
                                  </div>
                                  
                                  {/* Ligne vers conteneur droit avec flux dynamique premium */}
                                  {rightContainer && (
                                    <>
                                      {/* Ligne vers conteneur droit avec flux électrique animé */}
                                      <svg className="w-1.5 h-0.5 flex-shrink-0" viewBox="0 0 12 2" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                          <linearGradient id={`horizontalFlow-${transformer.id}-right`} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3" />
                                            <stop offset="40%" stopColor="#8AFD81" stopOpacity="0.1" />
                                            <stop offset="50%" stopColor="#6FD96A" stopOpacity="1">
                                              <animate attributeName="offset" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="60%" stopColor="#8AFD81" stopOpacity="0.1" />
                                            <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.3" />
                                          </linearGradient>
                                          <filter id={`horizontalGlow-${transformer.id}-right`}>
                                            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                                            <feMerge>
                                              <feMergeNode in="coloredBlur"/>
                                              <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                          </filter>
                                        </defs>
                                        {/* Ligne de base */}
                                        <line x1="0" y1="1" x2="12" y2="1" stroke="#8AFD81" strokeWidth="1.5" opacity="0.3" />
                                        {/* Ligne avec flux animé */}
                                        <line x1="0" y1="1" x2="12" y2="1" stroke="url(#horizontalFlow-${transformer.id}-right)" strokeWidth="2" strokeLinecap="round" filter="url(#horizontalGlow-${transformer.id}-right)" />
                                        {/* Particules de flux */}
                                        <circle cx="2" cy="1" r="1" fill="#8AFD81" opacity="0.9">
                                          <animate attributeName="cx" values="0;12;0" dur="1.2s" repeatCount="indefinite" />
                                          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="6" cy="1" r="0.8" fill="#6FD96A" opacity="0.8">
                                          <animate attributeName="cx" values="0;12;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                                          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                                        </circle>
                                      </svg>
                                      
                                      {/* Conteneur droit - Rectangle vertical */}
                                      <div
                                        className="relative flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer flex-shrink-0"
                                        style={{ height: '4.5rem', width: '2.5rem' }}
                                        onMouseEnter={(e) => handleMouseEnter(e, 'container', rightContainer.id, rightContainer)}
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        {rightStatus !== 'ok' && (
                                          <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/80 animate-pulse z-10"></div>
                                        )}
                                        <svg 
                                          className="w-full h-full" 
                                          viewBox="0 0 40 72" 
                                          fill="none" 
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <defs>
                                            <linearGradient id={`containerGradientRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                              <stop offset="0%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#8AFD81' : '#8AFD81') : '#e2e8f0'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '0.4' : '0.7') : '0.5'} />
                                              <stop offset="50%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#cbd5e1'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '0.5' : '0.8') : '0.6'} />
                                              <stop offset="100%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#5BC550' : '#5BC550') : '#94a3b8'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '0.6' : '0.9') : '0.7'} />
                                            </linearGradient>
                                            <linearGradient id={`containerBorderRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                              <stop offset="0%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#475569'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '1' : '1') : '0.9'} />
                                              <stop offset="100%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#5BC550' : '#5BC550') : '#334155'} stopOpacity="1" />
                                            </linearGradient>
                                            <filter id={`containerShadowRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`}>
                                              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                                              <feOffset dx="1" dy="2" result="offsetblur"/>
                                              <feComponentTransfer>
                                                <feFuncA type="linear" slope="0.4"/>
                                              </feComponentTransfer>
                                              <feMerge>
                                                <feMergeNode/>
                                                <feMergeNode in="SourceGraphic"/>
                                              </feMerge>
                                            </filter>
                                          </defs>
                                          {/* Structure principale du conteneur avec ombre premium */}
                                          <rect 
                                            x="2" 
                                            y="2" 
                                            width="36" 
                                            height="68" 
                                            rx="2.5" 
                                            fill={`url(#containerGradientRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            stroke={`url(#containerBorderRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            strokeWidth="3"
                                            filter={`url(#containerShadowRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                          />
                                          {/* Toit du conteneur */}
                                          <rect x="2" y="2" width="36" height="4" fill={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} opacity="0.8" />
                                          {/* Portes principales (double porte) */}
                                          <rect x="8" y="8" width="12" height="20" rx="1" fill={rightContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.5" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1.5" />
                                          <rect x="20" y="8" width="12" height="20" rx="1" fill={rightContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.5" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1.5" />
                                          {/* Séparation verticale entre les portes */}
                                          <line x1="20" y1="8" x2="20" y2="28" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1.5" />
                                          {/* Poignées de portes */}
                                          <circle cx="10" cy="18" r="1" fill={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} />
                                          <circle cx="30" cy="18" r="1" fill={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} />
                                          {/* Panneaux latéraux avec structure */}
                                          <rect x="6" y="30" width="28" height="8" fill={rightContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.4" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" />
                                          <line x1="14" y1="30" x2="14" y2="38" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          <line x1="26" y1="30" x2="26" y2="38" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          {/* Zone centrale */}
                                          <rect x="6" y="40" width="28" height="12" fill={rightContainer.status === 'In Service' ? '#8AFD81' : '#e2e8f0'} opacity="0.25" rx="1.5" />
                                          {/* Panneaux inférieurs */}
                                          <rect x="6" y="54" width="28" height="8" fill={rightContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.4" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" />
                                          <line x1="14" y1="54" x2="14" y2="62" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          <line x1="26" y1="54" x2="26" y2="62" stroke={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          {/* Base du conteneur */}
                                          <rect x="2" y="66" width="36" height="4" fill={rightContainer.status === 'In Service' ? '#5BC550' : '#334155'} opacity="0.8" />
                                        </svg>
                                      </div>
                                    </>
                                  )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
                              { label: 'Consommation', value: `${container.powerConsumptionMW.toFixed(2)} MW` },
                              { label: 'Machines', value: `${container.activeMachines}/${container.machinesCount}` },
                              { label: 'Hashrate', value: `${(container.hashrateTHs / 1000).toFixed(2)} PH/s` },
                              { label: 'Refroidissement', value: `${(container.coolingModule.coolingCapacitykW / 1000).toFixed(2)} MW` },
                              { label: 'Statut refroid.', value: container.coolingModule.status },
                            ]}
                            status={container.status}
                            onClick={() => handleContainerClick(container.id)}
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

        {/* Section ASIC Machines */}
        <section className="mb-24 relative">
          <div className="relative mb-8">
            <h2 className="text-[1.5rem] font-bold text-[#0b1120] tracking-tight mb-2">Machines ASIC</h2>
            <p className="text-sm text-[#64748b]">Inventaire des machines ASIC par section</p>
          </div>

          {/* Menus déroulants pour chaque section ASIC */}
          {[1, 2, 3, 4].map((sectionNum) => {
            const sectionMachine = asicMachines.find(m => m.batch === `Section ${sectionNum}`);
            if (!sectionMachine) return null;
            
            const activePercentage = (sectionMachine.activeCount / sectionMachine.totalInstalled) * 100;
            const totalHashrate = sectionMachine.activeCount * sectionMachine.hashrateTHs;
            const totalPower = sectionMachine.activeCount * sectionMachine.powerConsumptionkW;
            const isOpen = openASICSections[sectionNum] || false;

            return (
              <div key={sectionNum} className="mb-3 last:mb-0">
                {/* En-tête cliquable du menu déroulant */}
                <button
                  onClick={() => toggleASICSection(String(sectionNum))}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between p-4 rounded-[8px] bg-white border border-[#e2e8f0] hover:border-[#8AFD81]/30 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg className="w-10 h-10 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="4" width="16" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                          <text x="12" y="16.5" fontSize="12" fontWeight="bold" fill="currentColor" textAnchor="middle">{sectionNum}</text>
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-base font-semibold text-[#0b1120] tracking-tight mb-0.5">
                          Section {sectionNum} - Machines ASIC
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
                          <span>{sectionMachine.totalInstalled.toLocaleString('en-US')} machines</span>
                          <span>•</span>
                          <span>{sectionMachine.activeCount.toLocaleString('en-US')} actives ({activePercentage.toFixed(1)}%)</span>
                          <span>•</span>
                          <span>{(totalHashrate / 1000).toFixed(1)} PH/s</span>
                          <span>•</span>
                          <span>{(totalPower / 1000).toFixed(1)} MW</span>
                          <span>•</span>
                          <span>{sectionMachine.efficiencyJTH} J/TH</span>
                          <span>•</span>
                          <span>{((totalHashrate / 1000000) * 0.000125).toFixed(4)} BTC/j</span>
                          <span>•</span>
                          <span>{((totalPower / 1000) * 24).toFixed(1)} MWh/j</span>
                          {sectionMachine.installationDate && (
                            <>
                              <span>•</span>
                              <span>Installé le {new Date(sectionMachine.installationDate).toLocaleDateString('fr-FR')}</span>
                            </>
                          )}
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
                    <div className="border-t border-[#e2e8f0] pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <EquipmentCard
                          title={`${sectionMachine.brand} ${sectionMachine.model} - Section ${sectionNum}`}
                          subtitle="Unité de minage haute performance"
                          details={[
                            { label: 'Section', value: `Section ${sectionNum}` },
                            { label: 'Hashrate unitaire', value: `${sectionMachine.hashrateTHs.toLocaleString('en-US')} TH/s` },
                            { label: 'Consommation', value: `${sectionMachine.powerConsumptionkW} kW` },
                            { label: 'Efficacité', value: `${sectionMachine.efficiencyJTH} J/TH` },
                            { label: 'Total installé', value: `${sectionMachine.totalInstalled.toLocaleString('en-US')} unités` },
                            { label: 'Actif', value: `${sectionMachine.activeCount.toLocaleString('en-US')} unités` },
                            { label: 'Taux d\'activité', value: `${activePercentage.toFixed(1)}%` },
                            { label: 'Hashrate total', value: `${(totalHashrate / 1000).toFixed(1)} PH/s` },
                            { label: 'Puissance totale', value: `${(totalPower / 1000).toFixed(1)} MW` },
                            ...(sectionMachine.installationDate ? [{ label: 'Date d\'installation', value: new Date(sectionMachine.installationDate).toLocaleDateString('fr-FR') }] : []),
                          ]}
                          status="In Service"
                        />
                        <EquipmentCard
                          title="Performance globale"
                          subtitle="Statistiques de production"
                          details={[
                            { label: 'Hashrate moyen', value: `${(totalHashrate / sectionMachine.activeCount / 1000).toFixed(2)} PH/s` },
                            { label: 'Efficacité moyenne', value: `${sectionMachine.efficiencyJTH} J/TH` },
                            { label: 'Uptime moyen', value: `${(95 + (sectionNum * 1.2) % 5).toFixed(1)}%` },
                            { label: 'Production estimée', value: `${((totalHashrate / 1000000) * 0.000125).toFixed(4)} BTC/jour` },
                          ]}
                          status="In Service"
                        />
                        <EquipmentCard
                          title="Consommation énergétique"
                          subtitle="Analyse de la puissance"
                          details={[
                            { label: 'Puissance totale', value: `${(totalPower / 1000).toFixed(2)} MW` },
                            { label: 'Puissance unitaire', value: `${sectionMachine.powerConsumptionkW} kW` },
                            { label: 'Ratio efficacité', value: `${(sectionMachine.powerConsumptionkW / sectionMachine.hashrateTHs).toFixed(2)} W/TH` },
                            { label: 'Consommation/jour', value: `${((totalPower / 1000) * 24).toFixed(1)} MWh` },
                          ]}
                          status="In Service"
                        />
                        <EquipmentCard
                          title="État des machines"
                          subtitle="Statut opérationnel"
                          details={[
                            { label: 'Machines actives', value: `${sectionMachine.activeCount.toLocaleString('en-US')}` },
                            { label: 'Machines inactives', value: `${(sectionMachine.totalInstalled - sectionMachine.activeCount).toLocaleString('en-US')}` },
                            { label: 'Taux d\'activité', value: `${activePercentage.toFixed(1)}%` },
                            { label: 'Disponibilité', value: `${(95 + (sectionNum * 1.2) % 5).toFixed(1)}%` },
                          ]}
                          status="In Service"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Section Transformers */}
        <section className="mb-24 relative">
          <div className="relative mb-8">
            <h2 className="text-[1.5rem] font-bold text-[#0b1120] tracking-tight mb-2">Transformateurs</h2>
            <p className="text-sm text-[#64748b]">Inventaire des transformateurs par section</p>
          </div>

          {/* Sections individuelles pour chaque groupe de transformateurs avec menus déroulants */}
          {[1, 2, 3, 4].map((sectionNum) => {
            const sectionTransformers = transformers.filter(
              (t) => t.section === `Section ${sectionNum}`
            );
            const sectionPower = sectionTransformers.reduce((sum, t) => sum + t.powerMVA, 0);
            const isOpen = openTransformerSections[sectionNum];

            return (
              <div key={sectionNum} className="mb-3 last:mb-0">
                {/* En-tête cliquable du menu déroulant */}
                <button
                  onClick={() => toggleTransformerSection(sectionNum)}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between p-4 rounded-[8px] bg-white border border-[#e2e8f0] hover:border-[#8AFD81]/30 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg className="w-10 h-10 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                          <text x="12" y="16.5" fontSize="12" fontWeight="bold" fill="currentColor" textAnchor="middle">{sectionNum}</text>
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-base font-semibold text-[#0b1120] tracking-tight mb-0.5">
                          Section {sectionNum} - Transformateurs
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
                          <span>{sectionTransformers.length} transformateurs</span>
                          <span>•</span>
                          <span>{sectionPower} MVA total</span>
                          <span>•</span>
                          <span>{sectionTransformers.reduce((sum, t) => sum + t.containersConnected.length, 0)} conteneurs</span>
                          <span>•</span>
                          <span>33 kV → 0.4 kV</span>
                          <span>•</span>
                          <span>{((sectionTransformers.reduce((sum, t) => sum + t.containersConnected.length, 0) * 3.2) / sectionPower * 100).toFixed(0)}% charge</span>
                          <span>•</span>
                          <span>{(sectionTransformers.reduce((sum, t) => sum + t.containersConnected.length, 0) * 180).toLocaleString('en-US')} machines</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
                    <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden backdrop-blur-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#e2e8f0] bg-gradient-to-r from-[#f8f9fa] to-[#f1f5f9]">
                              <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[9px] uppercase tracking-wider">Nom / ID</th>
                              <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[9px] uppercase tracking-wider">Puissance (MVA)</th>
                              <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[9px] uppercase tracking-wider">Tension primaire</th>
                              <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[9px] uppercase tracking-wider">Tension secondaire</th>
                              <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[9px] uppercase tracking-wider">Section</th>
                              <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[9px] uppercase tracking-wider">Conteneurs connectés</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#f1f5f9]">
                            {sectionTransformers.map((transformer) => (
                              <tr key={transformer.id} className="hover:bg-gradient-to-r hover:from-[#f8f9fa] hover:to-white transition-all duration-200">
                                <td className="py-3 px-4 text-[#0b1120] font-bold text-xs">{transformer.name}</td>
                                <td className="py-3 px-4 text-right text-[#0b1120] font-bold text-xs">{transformer.powerMVA} MVA</td>
                                <td className="py-3 px-4 text-[#0b1120] font-semibold text-xs">{transformer.voltagePrimary}</td>
                                <td className="py-3 px-4 text-[#0b1120] font-semibold text-xs">{transformer.voltageSecondary}</td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2 py-1 rounded-[8px] bg-white text-[#0b1120] text-[9px] font-bold border border-[#e2e8f0]">
                                    {transformer.section}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-[#64748b] text-[9px]">
                                  <div className="flex flex-wrap gap-1.5">
                                    {transformer.containersConnected.map((containerId, idx) => (
                                      <span key={idx} className="px-2.5 py-1 bg-white rounded-[8px] text-[#0b1120] font-mono font-semibold text-[10px] border border-[#e2e8f0]">
                                        {containerId}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
