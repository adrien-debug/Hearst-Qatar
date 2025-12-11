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
    }).filter((t): t is typeof transformers[0] => t !== null),
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

      <div className="max-w-7xl mx-auto">
        {/* En-tête avec titre et description */}
        <div className="mb-6">
          <div className="inline-block mb-3">
            <h1 className="text-xl font-bold text-[#0b1120] tracking-tight mb-1">
              Hardware Inventory
            </h1>
            <div className="h-0.5 w-16 bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full"></div>
          </div>
          <p className="text-xs text-[#64748b] max-w-3xl leading-tight">
            Inventaire complet de tous les équipements miniers, systèmes de refroidissement et infrastructure électrique déployés sur le site.
          </p>
        </div>

        {/* Bandeau de statistiques premium */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-br from-[#0a0b0d] via-[#0f1114] to-[#0a0b0d] rounded-xl p-5 border border-white/10 hover:border-[#8AFD81]/30 transition-all duration-300 shadow-xl overflow-hidden">
            {/* Effet de brillance animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8AFD81]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8AFD81] to-[#6FD96A] rounded-full"></div>
                <h2 className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Vue d'ensemble</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group">
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Capacité totale</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                      {totalCapacity.toFixed(1)}
                    </span>
                    <span className="text-sm text-white/50 font-semibold">MW</span>
                  </div>
                  <div className="mt-1.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full w-full"></div>
                  </div>
                </div>
                <div className="group">
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Conteneurs actifs</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                      {activeContainers}
                    </span>
                    <span className="text-sm text-white/50 font-semibold">/{miningContainers.length}</span>
                  </div>
                  <div className="mt-1.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full" style={{ width: `${(activeContainers / miningContainers.length) * 100}%` }}></div>
                  </div>
                </div>
                <div className="group">
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Machines totales</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                      {totalMachines.toLocaleString('en-US')}
                    </span>
                    <span className="text-sm text-white/50 font-semibold">ASICs</span>
                  </div>
                  <div className="mt-1.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full w-[95%]"></div>
                  </div>
                </div>
                <div className="group">
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Hashrate total</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                      {(totalHashrate / 1000).toFixed(1)}
                    </span>
                    <span className="text-sm text-white/50 font-semibold">PH/s</span>
                  </div>
                  <div className="mt-1.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Main Substation */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20 shadow-md">
              <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0b1120] tracking-tight">Poste principal</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Hub de distribution électrique central</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <div className="bg-white rounded-lg border border-[#e2e8f0]/80 shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                      <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1120] tracking-tight">Centre de notifications</h3>
                  </div>
                  {totalProblems > 0 && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#64748b] text-white text-xs font-bold">
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
                    <p className="text-xs text-[#64748b] font-medium">Aucun problème détecté</p>
                    <p className="text-[10px] text-[#64748b] mt-1">Tous les systèmes fonctionnent normalement</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {/* Problèmes Substation */}
                    {problems.substation.length > 0 && (
                      <div className="pb-2 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                          <span className="text-xs font-bold text-[#0b1120]">Substation</span>
                        </div>
                        {problems.substation.map((problem, idx) => (
                          <div key={idx} className="ml-3 text-[10px] text-[#64748b]">{problem}</div>
                        ))}
                      </div>
                    )}
                    
                    {/* Problèmes Sections */}
                    {problems.sections.filter(s => s.hasProblems).map((section) => (
                      <div key={section.section} className="pb-2 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                          <span className="text-xs font-bold text-[#0b1120]">Power block {section.section}</span>
                        </div>
                        {section.problems.map((problem, idx) => (
                          <div key={idx} className="ml-3">
                            <div className="text-[10px] font-medium mb-0.5 text-[#64748b]">
                              {problem.message}
                            </div>
                            {problem.items && problem.items.length > 0 && (
                              <div className="ml-2 text-[9px] text-[#64748b]">
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
                          <span className="text-xs font-bold text-[#0b1120]">Transformateurs</span>
                        </div>
                        {problems.transformers.map((transformer, idx) => (
                          <div key={idx} className="ml-3 text-[10px] text-[#64748b]">{transformer.name} - Problème détecté</div>
                        ))}
                      </div>
                    )}
                    
                    {/* Résumé Conteneurs */}
                    {problems.containers.length > 0 && (
                      <div className="pb-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-1 h-4 bg-[#64748b] rounded-full"></div>
                          <span className="text-xs font-bold text-[#0b1120]">Conteneurs</span>
                        </div>
                        <div className="ml-3 text-[10px] text-[#64748b] font-medium">
                          {problems.containers.length} conteneur(s) nécessitent une attention
                        </div>
                        <div className="ml-3 mt-1 text-[9px] text-[#64748b]">
                          {problems.containers.slice(0, 3).map(c => c.name).join(', ')}
                          {problems.containers.length > 3 && ` +${problems.containers.length - 3}`}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Plan d'implantation avec Substation centrée au-dessus des 4 sections - Boxe agrandie */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#e2e8f0]/80 shadow-md p-5 flex flex-col h-full">
              <div className="relative w-full flex-1 flex flex-col justify-between">
                {/* Structure : Substation centrée en haut, alimentant les 4 sections */}
                <div className="flex flex-col items-center w-full" style={{ minHeight: 0 }}>
                  {/* Substation centrée au-dessus - Représentation réaliste */}
                  <div className="flex flex-col items-center gap-2 mb-0">
                    <div className={`relative flex items-center justify-center ${
                      problems.substation.length > 0 ? 'blink-warning' : ''
                    }`}>
                      <svg 
                        className="w-72 h-20" 
                        viewBox="0 0 240 80" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="substationLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#8AFD81" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="transformerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.7" />
                          </linearGradient>
                        </defs>
                        
                        {/* Structure métallique principale (poteaux) - style premium technique */}
                        <rect x="8" y="18" width="3.5" height="52" fill="#334155" rx="1.5" />
                        <rect x="228.5" y="18" width="3.5" height="52" fill="#334155" rx="1.5" />
                        <rect x="35" y="28" width="3" height="42" fill="#334155" rx="1" />
                        <rect x="202" y="28" width="3" height="42" fill="#334155" rx="1" />
                        <rect x="70" y="32" width="2.5" height="38" fill="#334155" rx="1" />
                        <rect x="167.5" y="32" width="2.5" height="38" fill="#334155" rx="1" />
                        <rect x="118.5" y="34" width="2.5" height="36" fill="#334155" rx="1" />
                        
                        {/* Lignes électriques haute tension (132kV) - avec gradient premium */}
                        <line x1="10" y1="22" x2="230" y2="22" stroke="url(#substationLineGradient)" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="10" y1="30" x2="230" y2="30" stroke="url(#substationLineGradient)" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="10" y1="38" x2="230" y2="38" stroke="url(#substationLineGradient)" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="10" y1="46" x2="230" y2="46" stroke="url(#substationLineGradient)" strokeWidth="3.5" strokeLinecap="round" />
                        
                        {/* Isolateurs premium - chaînes d'isolateurs */}
                        {[35, 70, 118.5, 167.5, 202].map((x, idx) => (
                          <g key={idx}>
                            <circle cx={x} cy="22" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={x} cy="30" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={x} cy="38" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx={x} cy="46" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1={x} y1="19" x2={x} y2="49" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5" />
                          </g>
                        ))}
                        
                        {/* Transformateurs principaux (132/33kV) - style premium technique */}
                        <rect x="45" y="50" width="24" height="20" rx="2.5" fill="url(#transformerGradient)" stroke="#6FD96A" strokeWidth="3" />
                        <rect x="105" y="50" width="24" height="20" rx="2.5" fill="url(#transformerGradient)" stroke="#6FD96A" strokeWidth="3" />
                        <rect x="171" y="50" width="24" height="20" rx="2.5" fill="url(#transformerGradient)" stroke="#6FD96A" strokeWidth="3" />
                        
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
                        
                        {/* Connexions vers transformateurs - style premium technique */}
                        <line x1="36.5" y1="34" x2="57" y2="50" stroke="#8AFD81" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        <line x1="72.5" y1="32" x2="80" y2="50" stroke="#8AFD81" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        <line x1="121" y1="34" x2="117" y2="50" stroke="#8AFD81" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        <line x1="168.5" y1="32" x2="160" y2="50" stroke="#8AFD81" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        <line x1="203.5" y1="34" x2="183" y2="50" stroke="#8AFD81" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        
                        {/* Disjoncteurs premium - style technique */}
                        <rect x="32" y="52" width="8" height="14" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
                        <rect x="92" y="52" width="8" height="14" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
                        <rect x="158" y="52" width="8" height="14" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
                        <rect x="200" y="52" width="8" height="14" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
                        {[36, 96, 162, 204].map((x) => (
                          <line key={x} x1={x} y1="55" x2={x} y2="63" stroke="#334155" strokeWidth="2" />
                        ))}
                        
                        {/* Section de commutation (sectionneur) */}
                        <rect x="80" y="52" width="20" height="6" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
                        <line x1="90" y1="52" x2="90" y2="58" stroke="#334155" strokeWidth="2" />
                        
                        {/* Lignes de sortie (33kV) - premium technique */}
                        {[57, 67, 117, 127, 183, 193].map((x, idx) => (
                          <line key={idx} x1={x} y1="70" x2={x} y2="76" stroke="#6FD96A" strokeWidth="3" strokeLinecap="round" />
                        ))}
                        
                        {/* Équipements de mesure (compteurs) */}
                        <circle cx="40" cy="58" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                        <circle cx="200" cy="58" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="37" y1="58" x2="43" y2="58" stroke="#334155" strokeWidth="1" />
                        <line x1="197" y1="58" x2="203" y2="58" stroke="#334155" strokeWidth="1" />
                        
                        {/* Label premium technique */}
                        <text 
                          x="120" 
                          y="15" 
                          fontSize="12" 
                          fontWeight="bold" 
                          fill="#334155" 
                          textAnchor="middle"
                          letterSpacing="2"
                        >
                          SUBSTATION 132/33 kV
                        </text>
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
                        {/* Gradient animé pour le flux dynamique vert */}
                        <linearGradient id="distributionFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3">
                            <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="50%" stopColor="#8AFD81" stopOpacity="0.8">
                            <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.3">
                            <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                          </stop>
                        </linearGradient>
                        {/* Gradient pour les lignes principales */}
                        <linearGradient id="mainLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4">
                            <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="50%" stopColor="#8AFD81" stopOpacity="1">
                            <animate attributeName="stop-opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4">
                            <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                          </stop>
                        </linearGradient>
                      </defs>
                      
                      {/* Ligne principale verticale depuis le centre de la substation */}
                      <line 
                        x1="50" 
                        y1="0" 
                        x2="50" 
                        y2="40" 
                        stroke="url(#mainLineGradient)" 
                        strokeWidth="1" 
                        strokeLinecap="round"
                      />
                      {/* Branche vers Power Block 1 */}
                      <path 
                        d="M 50 40 Q 35 50 12.5 100" 
                        stroke="url(#distributionFlow)" 
                        strokeWidth="1" 
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Branche vers Power Block 2 */}
                      <path 
                        d="M 50 40 Q 40 50 37.5 100" 
                        stroke="url(#distributionFlow)" 
                        strokeWidth="1" 
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Branche vers Power Block 3 */}
                      <path 
                        d="M 50 40 Q 60 50 62.5 100" 
                        stroke="url(#distributionFlow)" 
                        strokeWidth="1" 
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Branche vers Power Block 4 */}
                      <path 
                        d="M 50 40 Q 65 50 87.5 100" 
                        stroke="url(#distributionFlow)" 
                        strokeWidth="1" 
                        fill="none"
                        strokeLinecap="round"
                      />
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
                          {/* Label section centré au-dessus des transformateurs */}
                          <div className="mb-8 flex-shrink-0">
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#8AFD81]/10 to-[#8AFD81]/5 border shadow-sm ${
                              hasSectionProblems ? 'border-[#8AFD81]' : 'border-[#8AFD81]/20'
                            }`}>
                              <svg 
                                className="w-5 h-5" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <defs>
                                  <linearGradient id={`powerBlockGradient-${sectionNum}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#6FD96A" stopOpacity="1" />
                                  </linearGradient>
                                </defs>
                                {/* Bloc principal */}
                                <rect 
                                  x="3" 
                                  y="5" 
                                  width="18" 
                                  height="14" 
                                  rx="2" 
                                  fill="url(#powerBlockGradient-${sectionNum})"
                                  stroke="#6FD96A" 
                                  strokeWidth="1.5"
                                />
                                {/* Lignes de connexion électrique */}
                                <line x1="6" y1="8" x2="18" y2="8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                                <line x1="6" y1="12" x2="18" y2="12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                                <line x1="6" y1="16" x2="18" y2="16" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                                {/* Connecteurs latéraux */}
                                <circle cx="3" cy="12" r="1.5" fill="#6FD96A" />
                                <circle cx="21" cy="12" r="1.5" fill="#6FD96A" />
                                {/* Indicateur de puissance */}
                                <circle cx="12" cy="12" r="2" fill="#334155" opacity="0.3" />
                                <path d="M12 10L12 14M10 12L14 12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                                {/* Numéro du bloc */}
                                <text 
                                  x="12" 
                                  y="22" 
                                  fontSize="8" 
                                  fontWeight="bold" 
                                  fill="#334155" 
                                  textAnchor="middle"
                                >
                                  {sectionNum}
                                </text>
                              </svg>
                              <span className="text-xs font-bold text-[#0b1120]">Power block {sectionNum}</span>
                            </div>
                          </div>
                          
                          {/* Ligne de connexion entre Power Block et transformateurs */}
                          <div className="relative w-full flex items-center justify-center" style={{ height: '60px', marginTop: '-30px', marginBottom: '-30px' }}>
                            <svg 
                              className="absolute inset-0 w-full h-full" 
                              viewBox="0 0 100 100" 
                              preserveAspectRatio="none"
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                {/* Gradient pour les lignes principales - même style que substation */}
                                <linearGradient id={`powerBlockLineGradient-${sectionNum}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4">
                                    <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                                  </stop>
                                  <stop offset="50%" stopColor="#8AFD81" stopOpacity="1">
                                    <animate attributeName="stop-opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
                                  </stop>
                                  <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4">
                                    <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                                  </stop>
                                </linearGradient>
                              </defs>
                              {/* Ligne verticale fine depuis le Power Block vers les transformateurs */}
                              <line 
                                x1="50" 
                                y1="0" 
                                x2="50" 
                                y2="100" 
                                stroke={`url(#powerBlockLineGradient-${sectionNum})`} 
                                strokeWidth="1.5" 
                                strokeLinecap="round"
                              />
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
                                        {/* Gradient pour les lignes principales - même style que substation */}
                                        <linearGradient id={`transformerLineGradient-${transformer.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4">
                                            <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                                          </stop>
                                          <stop offset="50%" stopColor="#8AFD81" stopOpacity="1">
                                            <animate attributeName="stop-opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
                                          </stop>
                                          <stop offset="100%" stopColor="#6FD96A" stopOpacity="0.4">
                                            <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                                          </stop>
                                        </linearGradient>
                                      </defs>
                                      {/* Ligne verticale continue depuis la ligne principale vers le transformateur */}
                                      <line 
                                        x1="50" 
                                        y1="0" 
                                        x2="50" 
                                        y2="100" 
                                        stroke={`url(#transformerLineGradient-${transformer.id})`} 
                                        strokeWidth="1.5" 
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </div>
                                  
                                  <div className="flex items-center justify-center gap-0.5 w-full flex-shrink-0">
                                  {/* Conteneur gauche - Rectangle vertical */}
                                  {leftContainer && (
                                    <>
                                      <div
                                        className="relative flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer flex-shrink-0"
                                        style={{ height: '4.5rem', width: '2.5rem' }}
                                        title={leftContainer.name}
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
                                              <stop offset="0%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#8AFD81' : '#8AFD81') : '#e2e8f0'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '0.3' : '0.6') : '0.5'} />
                                              <stop offset="100%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#cbd5e1'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '0.4' : '0.7') : '0.6'} />
                                            </linearGradient>
                                            <linearGradient id={`containerBorderLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                              <stop offset="0%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#475569'} stopOpacity={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '0.9' : '1') : '0.8'} />
                                              <stop offset="100%" stopColor={leftContainer.status === 'In Service' ? (leftStatus === 'ok' ? '#5BC550' : '#5BC550') : '#334155'} stopOpacity="1" />
                                            </linearGradient>
                                          </defs>
                                          {/* Structure principale du conteneur */}
                                          <rect 
                                            x="2" 
                                            y="2" 
                                            width="36" 
                                            height="68" 
                                            rx="2" 
                                            fill={`url(#containerGradientLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            stroke={`url(#containerBorderLeft-${leftContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            strokeWidth="2.5"
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
                                          {/* Zone centrale avec numéro */}
                                          <rect x="6" y="40" width="28" height="12" fill={leftContainer.status === 'In Service' ? '#8AFD81' : '#e2e8f0'} opacity="0.2" rx="1" />
                                          <text 
                                            x="20" 
                                            y="47" 
                                            fontSize="11" 
                                            fontWeight="bold" 
                                            fill="#334155" 
                                            textAnchor="middle" 
                                            dominantBaseline="middle"
                                          >
                                            {leftContainer.id.split('-').length > 1 ? leftContainer.id.split('-')[1] : leftContainer.id.replace('C', '')}
                                          </text>
                                          {/* Panneaux inférieurs */}
                                          <rect x="6" y="54" width="28" height="8" fill={leftContainer.status === 'In Service' ? '#6FD96A' : '#475569'} opacity="0.4" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" />
                                          <line x1="14" y1="54" x2="14" y2="62" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          <line x1="26" y1="54" x2="26" y2="62" stroke={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} strokeWidth="1" opacity="0.6" />
                                          {/* Base du conteneur */}
                                          <rect x="2" y="66" width="36" height="4" fill={leftContainer.status === 'In Service' ? '#5BC550' : '#334155'} opacity="0.8" />
                                        </svg>
                                      </div>
                                      
                                      {/* Ligne vers transformateur avec flux dynamique */}
                                      <div className="w-1 h-0.5 flow-horizontal rounded flex-shrink-0 bg-slate-800 opacity-70"></div>
                                    </>
                                  )}
                                  
                                  {/* Transformateur au milieu */}
                                  <div
                                    className="flex items-center justify-center flex-shrink-0"
                                    title={transformer.name}
                                  >
                                    <svg 
                                      className="w-10 h-10" 
                                      viewBox="0 0 24 24" 
                                      fill="none" 
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <defs>
                                        <linearGradient id="transformerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
                                          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="1" />
                                        </linearGradient>
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
                                      {/* Noyau magnétique - lignes de connexion premium */}
                                      <line 
                                        x1="8" 
                                        y1="6" 
                                        x2="16" 
                                        y2="6" 
                                        stroke="#cbd5e1" 
                                        strokeWidth="2" 
                                        strokeLinecap="round"
                                        opacity="0.7"
                                      />
                                      <line 
                                        x1="8" 
                                        y1="12" 
                                        x2="16" 
                                        y2="12" 
                                        stroke="#cbd5e1" 
                                        strokeWidth="2" 
                                        strokeLinecap="round"
                                        opacity="0.7"
                                      />
                                      <line 
                                        x1="8" 
                                        y1="18" 
                                        x2="16" 
                                        y2="18" 
                                        stroke="#cbd5e1" 
                                        strokeWidth="2" 
                                        strokeLinecap="round"
                                        opacity="0.7"
                                      />
                                    </svg>
                                  </div>
                                  
                                  {/* Ligne vers conteneur droit avec flux dynamique */}
                                  {rightContainer && (
                                    <>
                                      <div className="w-1 h-0.5 flow-horizontal rounded flex-shrink-0 bg-slate-800 opacity-70"></div>
                                      
                                      {/* Conteneur droit - Rectangle vertical */}
                                      <div
                                        className="relative flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer flex-shrink-0"
                                        style={{ height: '4.5rem', width: '2.5rem' }}
                                        title={rightContainer.name}
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
                                              <stop offset="0%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#8AFD81' : '#8AFD81') : '#e2e8f0'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '0.3' : '0.6') : '0.5'} />
                                              <stop offset="100%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#cbd5e1'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '0.4' : '0.7') : '0.6'} />
                                            </linearGradient>
                                            <linearGradient id={`containerBorderRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                              <stop offset="0%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#6FD96A' : '#6FD96A') : '#475569'} stopOpacity={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '0.9' : '1') : '0.8'} />
                                              <stop offset="100%" stopColor={rightContainer.status === 'In Service' ? (rightStatus === 'ok' ? '#5BC550' : '#5BC550') : '#334155'} stopOpacity="1" />
                                            </linearGradient>
                                          </defs>
                                          {/* Structure principale du conteneur */}
                                          <rect 
                                            x="2" 
                                            y="2" 
                                            width="36" 
                                            height="68" 
                                            rx="2" 
                                            fill={`url(#containerGradientRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            stroke={`url(#containerBorderRight-${rightContainer.id.replace(/[^a-zA-Z0-9]/g, '')})`}
                                            strokeWidth="2.5"
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
                                          {/* Zone centrale avec numéro */}
                                          <rect x="6" y="40" width="28" height="12" fill={rightContainer.status === 'In Service' ? '#8AFD81' : '#e2e8f0'} opacity="0.2" rx="1" />
                                          <text 
                                            x="20" 
                                            y="47" 
                                            fontSize="11" 
                                            fontWeight="bold" 
                                            fill="#334155" 
                                            textAnchor="middle" 
                                            dominantBaseline="middle"
                                          >
                                            {rightContainer.id.split('-').length > 1 ? rightContainer.id.split('-')[1] : rightContainer.id.replace('C', '')}
                                          </text>
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
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20 shadow-md">
              <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0b1120] tracking-tight">
                Conteneurs miniers
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">{miningContainers.length} conteneurs • 40' Bitmain Hydro</p>
            </div>
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
              <div key={sectionNum} className="mb-4 last:mb-0">
                {/* En-tête cliquable du menu déroulant */}
                <button
                  onClick={() => toggleSection(sectionNum)}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-white to-[#f8f9fa] border border-[#e2e8f0]/80 hover:border-[#8AFD81]/40 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8AFD81]/15 via-[#8AFD81]/10 to-[#8AFD81]/5 flex items-center justify-center border border-[#8AFD81]/30 shadow-md group-hover:shadow-lg group-hover:shadow-[#8AFD81]/20 transition-all duration-300">
                          <span className="text-[#0b1120] font-bold text-lg">{sectionNum}</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8AFD81] rounded-full shadow-lg shadow-[#8AFD81]/50"></div>
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-[#0b1120] tracking-tight group-hover:text-[#8AFD81] transition-colors duration-300">
                          Power block {sectionNum}
                        </h3>
                        <p className="text-xs text-[#64748b] mt-1 font-semibold">
                          {sectionContainers.length} conteneurs • {sectionCapacity.toFixed(1)} MW • {sectionActive} actifs ({activePercentage.toFixed(0)}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white border border-[#e2e8f0] shadow-sm">
                        <div className="w-28 h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full transition-all duration-500"
                            style={{ width: `${activePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-[#64748b] min-w-[35px]">{activePercentage.toFixed(0)}%</span>
                      </div>
                      {/* Icône de flèche animée */}
                      <div className={`w-8 h-8 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-[#8AFD81]/10 border-[#8AFD81]/30' : 'group-hover:bg-[#f8f9fa]'}`}>
                        <svg 
                          className={`w-5 h-5 text-[#64748b] transition-colors duration-300 ${isOpen ? 'text-[#8AFD81]' : 'group-hover:text-[#0b1120]'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
                  <div className="pt-6 pb-2">
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
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20 shadow-md">
              <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0b1120] tracking-tight">Machines ASIC</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Unités Bitmain Antminer S21 Hydro optimisées pour le minage haute performance</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0]/80 shadow-md overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-gradient-to-r from-[#f8f9fa] to-[#f1f5f9]">
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Marque</th>
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Modèle</th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Hashrate unitaire (TH/s)</th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Consommation (kW)</th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Efficacité (J/TH)</th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Total installé</th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Actif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {asicMachines.map((machine, index) => {
                    const activePercentage = (machine.activeCount / machine.totalInstalled) * 100;
                    return (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-[#f8f9fa] hover:to-white transition-all duration-200 group">
                        <td className="py-3 px-4 text-[#0b1120] font-bold text-sm">{machine.brand}</td>
                        <td className="py-3 px-4 text-[#0b1120] font-semibold text-sm">{machine.model}</td>
                        <td className="py-3 px-4 text-right text-[#0b1120] font-bold text-sm">{machine.hashrateTHs.toLocaleString('en-US')}</td>
                        <td className="py-3 px-4 text-right text-[#0b1120] font-bold text-sm">{machine.powerConsumptionkW}</td>
                        <td className="py-3 px-4 text-right text-[#0b1120] font-bold text-sm">{machine.efficiencyJTH}</td>
                        <td className="py-3 px-4 text-right text-[#0b1120] font-bold text-sm">{machine.totalInstalled.toLocaleString('en-US')}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="text-right">
                              <span className="text-[#0b1120] font-bold">{machine.activeCount.toLocaleString('en-US')}</span>
                              <span className="ml-2 text-[#8AFD81] text-xs font-bold">
                                ({activePercentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-16 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full transition-all duration-500"
                                style={{ width: `${activePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section Transformers */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20 shadow-md">
              <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0b1120] tracking-tight">
                Transformateurs
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">{transformers.length} transformateurs • 4 MVA, 33 kV → 0.4 kV</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0]/80 shadow-md overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-gradient-to-r from-[#f8f9fa] to-[#f1f5f9]">
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Nom / ID</th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Puissance (MVA)</th>
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Tension primaire</th>
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Tension secondaire</th>
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Section</th>
                    <th className="text-left py-3 px-4 text-[#64748b] font-bold text-[10px] uppercase tracking-wider">Conteneurs connectés</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {transformers.map((transformer) => (
                    <tr key={transformer.id} className="hover:bg-gradient-to-r hover:from-[#f8f9fa] hover:to-white transition-all duration-200">
                      <td className="py-3 px-4 text-[#0b1120] font-bold text-sm">{transformer.name}</td>
                      <td className="py-3 px-4 text-right text-[#0b1120] font-bold text-sm">{transformer.powerMVA} MVA</td>
                      <td className="py-3 px-4 text-[#0b1120] font-semibold text-sm">{transformer.voltagePrimary}</td>
                      <td className="py-3 px-4 text-[#0b1120] font-semibold text-sm">{transformer.voltageSecondary}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-[#f8f9fa] to-[#f1f5f9] text-[#0b1120] text-[10px] font-bold border border-[#e2e8f0]">
                          {transformer.section}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#64748b] text-[10px]">
                        <div className="flex flex-wrap gap-1.5">
                          {transformer.containersConnected.map((containerId, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-[#f8f9fa] rounded-md text-[#0b1120] font-mono font-semibold text-xs border border-[#e2e8f0]">
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
        </section>
      </div>
    </>
  );
}
