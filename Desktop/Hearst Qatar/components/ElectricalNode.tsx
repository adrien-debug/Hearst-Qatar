import { ElectricalNode as ElectricalNodeType } from '../data/electricalMock';

interface ElectricalNodeProps {
  node: ElectricalNodeType;
  selectedSection?: string;
  onSelect?: (nodeId: string) => void;
  level: number;
}

// Composant d'icône premium pour Substation
const SubstationIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M8 10h8M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <path d="M12 2v4M12 18v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Composant d'icône premium pour Section
const SectionIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M9 9h6M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="9" r="1" fill="currentColor"/>
    <circle cx="7" cy="13" r="1" fill="currentColor"/>
    <circle cx="7" cy="17" r="1" fill="currentColor"/>
  </svg>
);

// Composant d'icône premium pour Transformer
const TransformerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="12" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12 2v2M12 20v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
    <path d="M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Composant d'icône premium pour Container
const ContainerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 10h16M4 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="6" y="8" width="3" height="2" rx="0.5" fill="currentColor"/>
    <rect x="11" y="8" width="3" height="2" rx="0.5" fill="currentColor"/>
    <rect x="16" y="8" width="3" height="2" rx="0.5" fill="currentColor"/>
    <circle cx="8" cy="16" r="1" fill="currentColor"/>
    <circle cx="16" cy="16" r="1" fill="currentColor"/>
  </svg>
);

export default function ElectricalNode({ node, selectedSection, onSelect, level }: ElectricalNodeProps) {
  const isSelected = selectedSection && (node.section === selectedSection || node.id === selectedSection);
  const isHighlighted = selectedSection && (
    node.section === selectedSection ||
    node.id === selectedSection ||
    (node.parentId && node.parentId.includes(selectedSection))
  );

  const statusStyles = {
    OK: {
      border: 'border-emerald-400/60',
      bg: 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      statusDot: 'bg-emerald-500',
    },
    Warning: {
      border: 'border-amber-400/60',
      bg: 'bg-gradient-to-br from-amber-50/80 to-amber-100/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      statusDot: 'bg-amber-500',
    },
    Off: {
      border: 'border-red-400/60',
      bg: 'bg-gradient-to-br from-red-50/80 to-red-100/40',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      statusDot: 'bg-red-500',
    },
  };

  const typeStyles = {
    substation: {
      border: 'border-blue-500/70',
      bg: 'bg-gradient-to-br from-blue-50/90 via-blue-100/50 to-indigo-50/60',
      iconColor: 'text-blue-600',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.2)]',
    },
    section: {
      border: 'border-[#8AFD81]/70',
      bg: 'bg-gradient-to-br from-[#8AFD81]/15 via-[#8AFD81]/10 to-emerald-50/40',
      iconColor: 'text-[#8AFD81]',
      glow: 'shadow-[0_0_25px_rgba(138,253,129,0.2)]',
    },
    transformer: {
      border: 'border-orange-500/70',
      bg: 'bg-gradient-to-br from-orange-50/90 via-amber-50/60 to-orange-100/40',
      iconColor: 'text-orange-600',
      glow: 'shadow-[0_0_25px_rgba(249,115,22,0.2)]',
    },
    container: {
      border: 'border-slate-500/70',
      bg: 'bg-gradient-to-br from-slate-50/90 via-slate-100/50 to-gray-50/60',
      iconColor: 'text-slate-600',
      glow: 'shadow-[0_0_20px_rgba(100,116,139,0.15)]',
    },
    generator: {
      border: 'border-purple-500/70',
      bg: 'bg-gradient-to-br from-purple-50/90 via-purple-100/50 to-indigo-50/60',
      iconColor: 'text-purple-600',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]',
    },
  };

  const statusStyle = statusStyles[node.status] || statusStyles.OK;
  const typeStyle = typeStyles[node.type] || typeStyles.container;

  const handleClick = () => {
    if (onSelect && node.type === 'section') {
      onSelect(node.id);
    }
  };

  const renderIcon = () => {
    const iconClass = `w-5 h-5 ${typeStyle.iconColor} flex-shrink-0`;
    switch (node.type) {
      case 'substation':
        return <SubstationIcon className={iconClass} />;
      case 'section':
        return <SectionIcon className={iconClass} />;
      case 'transformer':
        return <TransformerIcon className={iconClass} />;
      case 'container':
        return <ContainerIcon className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div
        className={`
          relative rounded-xl p-5 border-2 backdrop-blur-sm
          transition-all duration-300 ease-out cursor-pointer
          ${isSelected ? 'ring-4 ring-[#8AFD81]/50 scale-[1.02] z-10' : ''}
          ${isHighlighted ? 'opacity-100' : selectedSection ? 'opacity-25' : 'opacity-100'}
          ${statusStyle.border}
          ${statusStyle.bg}
          ${statusStyle.glow}
          ${typeStyle.glow}
          ${onSelect && node.type === 'section' ? 'hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-0.5' : 'hover:shadow-lg'}
        `}
        onClick={handleClick}
        title={`${node.name} - ${node.status}`}
      >
        {/* Effet de brillance premium */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Contenu principal */}
        <div className="relative flex items-start gap-3">
          {/* Icône */}
          <div className="mt-0.5">
            {renderIcon()}
          </div>
          
          {/* Informations */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-[#0b1120] font-bold text-sm leading-tight">{node.name}</h3>
              <div className={`w-2 h-2 rounded-full ${statusStyle.statusDot} flex-shrink-0`} />
            </div>
            
            <div className="space-y-1">
              {(node.capacityMW || node.capacityMVA) && (
                <div className="text-[#475569] text-xs font-medium">
                  {node.capacityMW && <span>{node.capacityMW} MW</span>}
                  {node.capacityMW && node.capacityMVA && <span className="mx-1">•</span>}
                  {node.capacityMVA && <span>{node.capacityMVA} MVA</span>}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  node.status === 'OK' ? 'bg-emerald-100 text-emerald-700' :
                  node.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {node.status}
                </span>
              </div>
              
              {node.children && node.children.length > 0 && (
                <div className="text-[#64748b] text-xs font-medium mt-1.5">
                  <span>{node.children.length}</span> {node.type === 'section' ? 'transformers' : 'containers'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className={`mt-5 ${level === 0 ? 'grid grid-cols-4 gap-5' : level === 1 ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-2 gap-3'}`}>
          {node.children.map((child) => (
            <ElectricalNode
              key={child.id}
              node={child}
              selectedSection={selectedSection}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

