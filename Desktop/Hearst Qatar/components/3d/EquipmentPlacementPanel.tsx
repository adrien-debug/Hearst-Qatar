import React from 'react';

export type EquipmentType = 'container' | 'generator' | 'transformer' | 'switchgear' | 'gravel' | 'none';

interface EquipmentPlacementPanelProps {
  placementMode: EquipmentType;
  onPlacementModeChange: (mode: EquipmentType) => void;
  onClose: () => void;
}

export default function EquipmentPlacementPanel({
  placementMode,
  onPlacementModeChange,
  onClose,
}: EquipmentPlacementPanelProps) {
  const equipmentTypes: Array<{
    type: EquipmentType;
    label: string;
    icon: string;
    description: string;
    color: string;
  }> = [
    {
      type: 'container',
      label: 'Conteneur',
      icon: '📦',
      description: 'Conteneur HD5 pour mining',
      color: 'bg-blue-500',
    },
    {
      type: 'generator',
      label: 'Générateur',
      icon: '⚡',
      description: 'Générateur électrique',
      color: 'bg-yellow-500',
    },
    {
      type: 'transformer',
      label: 'Transformateur',
      icon: '🔌',
      description: 'Transformateur électrique',
      color: 'bg-purple-500',
    },
    {
      type: 'switchgear',
      label: 'Tableau',
      icon: '🔧',
      description: 'Tableau de distribution',
      color: 'bg-green-500',
    },
    {
      type: 'gravel',
      label: 'Gravier',
      icon: '🪨',
      description: 'Zone de gravier entre chemins',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="absolute top-4 right-4 z-40">
      <div className="bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl p-4 min-w-[280px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <h3 className="text-sm font-bold text-white">Placement d'Équipements</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {equipmentTypes.map((equipment) => (
            <button
              key={equipment.type}
              onClick={() => {
                if (placementMode === equipment.type) {
                  onPlacementModeChange('none');
                } else {
                  onPlacementModeChange(equipment.type);
                }
              }}
              className={`w-full px-3 py-2.5 rounded-lg text-left transition-all flex items-center gap-3 ${
                placementMode === equipment.type
                  ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{equipment.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{equipment.label}</div>
                <div className={`text-xs ${placementMode === equipment.type ? 'text-[#0a0b0d]/70' : 'text-white/60'}`}>
                  {equipment.description}
                </div>
              </div>
              {placementMode === equipment.type && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {placementMode !== 'none' && (
          <div className="pt-3 border-t border-white/10">
            <div className="text-xs text-white/60 space-y-1">
              <p className="font-medium text-white/80 mb-1">Instructions :</p>
              {placementMode === 'gravel' ? (
                <>
                  <p>• Cliquez entre deux chemins pour créer une zone de gravier</p>
                  <p>• Cliquez entre un chemin et un conteneur</p>
                  <p>• La zone sera créée automatiquement</p>
                </>
              ) : (
                <>
                  <p>• Cliquez sur le sol pour placer l'équipement</p>
                  <p>• Les propositions intelligentes suggèrent des emplacements</p>
                  <p>• Utilisez les contrôles pour ajuster la position</p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => onPlacementModeChange('none')}
            className="w-full px-3 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
          >
            Annuler le placement
          </button>
        </div>
      </div>
    </div>
  );
}

