import { useState } from 'react';
import { colorTokens } from '../../config/design-tokens';
import { ViewMode } from './ViewModeSelector';

interface CalibrationFooterProps {
  annotationEnabled: boolean;
  onToggleAnnotation: (enabled: boolean) => void;
  gpsCalibrationEnabled: boolean;
  onToggleGpsCalibration: (enabled: boolean) => void;
  interactiveCalibrationEnabled: boolean;
  onToggleInteractiveCalibration: (enabled: boolean) => void;
  deleteModeEnabled: boolean;
  onToggleDeleteMode: (enabled: boolean) => void;
  architecturalModeEnabled?: boolean;
  onToggleArchitecturalMode?: (enabled: boolean) => void;
  selectionModeEnabled?: boolean;
  onToggleSelectionMode?: (enabled: boolean) => void;
  equipmentPlacementEnabled?: boolean;
  onToggleEquipmentPlacement?: (enabled: boolean) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onClearAnnotations?: () => void;
  onExportAnnotations?: () => void;
  onImportAnnotations?: (data: any) => void;
  annotationPointsCount?: number;
  annotationLinesCount?: number;
}

export default function CalibrationFooter({
  annotationEnabled,
  onToggleAnnotation,
  gpsCalibrationEnabled,
  onToggleGpsCalibration,
  interactiveCalibrationEnabled,
  onToggleInteractiveCalibration,
  deleteModeEnabled,
  onToggleDeleteMode,
  architecturalModeEnabled = false,
  onToggleArchitecturalMode,
  selectionModeEnabled = false,
  onToggleSelectionMode,
  equipmentPlacementEnabled = false,
  onToggleEquipmentPlacement,
  viewMode,
  onViewModeChange,
  onClearAnnotations,
  onExportAnnotations,
  onImportAnnotations,
  annotationPointsCount = 0,
  annotationLinesCount = 0,
}: CalibrationFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Logo Hearst vert vectoriel
  const HearstLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#8AFD81" opacity="0.2"/>
      <path
        d="M16 8L20 16L16 24L12 16L16 8Z"
        fill="#8AFD81"
        stroke="#0a0b0d"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="16" r="3" fill="#0a0b0d"/>
    </svg>
  );

  // Icône Annotation (point) - avec couleur dynamique
  const AnnotationIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6" fill={color} stroke={color} strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" fill={active ? '#8AFD81' : '#0a0b0d'}/>
      </svg>
    );
  };

  // Icône Calibrage Interactif (cible) - avec couleur dynamique
  const TargetIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
        <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="2" fill={color}/>
      </svg>
    );
  };

  // Icône Calibrage Manuel (règle) - avec couleur dynamique
  const RulerIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="8" width="18" height="8" rx="1" fill={color} opacity={active ? 0.2 : 0.3} stroke={color} strokeWidth="1.5"/>
        <line x1="6" y1="10" x2="6" y2="14" stroke={color} strokeWidth="1.5"/>
        <line x1="9" y1="10" x2="9" y2="14" stroke={color} strokeWidth="1.5"/>
        <line x1="12" y1="10" x2="12" y2="14" stroke={color} strokeWidth="1.5"/>
        <line x1="15" y1="10" x2="15" y2="14" stroke={color} strokeWidth="1.5"/>
        <line x1="18" y1="10" x2="18" y2="14" stroke={color} strokeWidth="1.5"/>
      </svg>
    );
  };

  // Icône Suppression (poubelle) - avec couleur dynamique
  const DeleteIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  // Icône Exporter (flèche vers le bas)
  const ExportIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M3 21h18" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  // Icône Importer (flèche vers le haut)
  const ImportIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21V9m0 0l-4 4m4-4l4 4M3 3h18" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  // Icône Flèche Haut
  const ArrowUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  // Icône Flèche Bas
  const ArrowDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  // Icône Architecture (maison/bâtiment)
  const ArchitectureIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M9 9v0M9 12v0M9 15v0M9 18v0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  // Icônes pour les modes de vue
  const OverviewIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="12" r="2" fill={color}/>
      </svg>
    );
  };

  const SubstationIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="14" rx="1" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M8 14h8M8 17h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="10.5" r="1" fill={color}/>
      </svg>
    );
  };

  const PowerBlockIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" rx="1" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M9 10h6M9 14h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="10" r="0.5" fill={color}/>
        <circle cx="7" cy="14" r="0.5" fill={color}/>
        <circle cx="17" cy="10" r="0.5" fill={color}/>
        <circle cx="17" cy="14" r="0.5" fill={color}/>
      </svg>
    );
  };

  const TransformerIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="12" height="16" rx="1" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M9 8h6M9 12h6M9 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 2v4M18 2v4M6 18v4M18 18v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  };

  const ContainerIcon = ({ active = false }: { active?: boolean }) => {
    const color = active ? '#0a0b0d' : '#8AFD81';
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" rx="1" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M4 10h16M4 14h16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="6" y="8" width="3" height="2" rx="0.5" fill={color}/>
        <rect x="11" y="8" width="3" height="2" rx="0.5" fill={color}/>
        <rect x="16" y="8" width="3" height="2" rx="0.5" fill={color}/>
        <circle cx="8" cy="16" r="1" fill={color}/>
        <circle cx="16" cy="16" r="1" fill={color}/>
      </svg>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0b0d] border-t border-[#8AFD81]/20 shadow-2xl">
      {/* Barre principale compacte */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo et titre */}
        <div className="flex items-center gap-3">
          <HearstLogo />
          <div>
            <h3 className="text-sm font-bold text-white">Outils de Calibration</h3>
            <p className="text-xs text-white/60">
              {annotationPointsCount} points • {annotationLinesCount} lignes
            </p>
          </div>
        </div>

        {/* Boutons principaux */}
        <div className="flex items-center gap-2">
          {/* Raccourcis de vue */}
          {viewMode !== undefined && onViewModeChange && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
              <button
                onClick={() => onViewModeChange('overview')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'overview'
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                    : 'text-white hover:bg-white/10'
                }`}
                title="Vue d'ensemble"
              >
                <OverviewIcon active={viewMode === 'overview'} />
              </button>
              <button
                onClick={() => onViewModeChange('substation')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'substation'
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                    : 'text-white hover:bg-white/10'
                }`}
                title="Substation"
              >
                <SubstationIcon active={viewMode === 'substation'} />
              </button>
              <button
                onClick={() => onViewModeChange('powerblock')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'powerblock'
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                    : 'text-white hover:bg-white/10'
                }`}
                title="Power Block"
              >
                <PowerBlockIcon active={viewMode === 'powerblock'} />
              </button>
              <button
                onClick={() => onViewModeChange('transformer')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'transformer'
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                    : 'text-white hover:bg-white/10'
                }`}
                title="Transformateur"
              >
                <TransformerIcon active={viewMode === 'transformer'} />
              </button>
              <button
                onClick={() => onViewModeChange('container')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'container'
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                    : 'text-white hover:bg-white/10'
                }`}
                title="Container"
              >
                <ContainerIcon active={viewMode === 'container'} />
              </button>
            </div>
          )}

          {/* Mode Annotation */}
          <button
            onClick={() => {
              onToggleAnnotation(!annotationEnabled);
              if (!annotationEnabled) {
                onToggleGpsCalibration(false);
                onToggleInteractiveCalibration(false);
                onToggleDeleteMode(false);
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              annotationEnabled
                ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <AnnotationIcon active={annotationEnabled} />
            <span>Annotation</span>
          </button>

          {/* Mode Calibrage Interactif */}
          <button
            onClick={() => {
              onToggleInteractiveCalibration(!interactiveCalibrationEnabled);
              if (!interactiveCalibrationEnabled) {
                onToggleAnnotation(false);
                onToggleGpsCalibration(false);
                onToggleDeleteMode(false);
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              interactiveCalibrationEnabled
                ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <TargetIcon active={interactiveCalibrationEnabled} />
            <span>Calibrage Interactif</span>
          </button>

          {/* Mode Calibrage Manuel */}
          <button
            onClick={() => {
              onToggleGpsCalibration(!gpsCalibrationEnabled);
              if (!gpsCalibrationEnabled) {
                onToggleAnnotation(false);
                onToggleInteractiveCalibration(false);
                onToggleDeleteMode(false);
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              gpsCalibrationEnabled
                ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <RulerIcon active={gpsCalibrationEnabled} />
            <span>Calibrage Manuel</span>
          </button>

          {/* Mode Suppression */}
          <button
            onClick={() => {
              onToggleDeleteMode(!deleteModeEnabled);
              if (!deleteModeEnabled) {
                onToggleAnnotation(false);
                onToggleGpsCalibration(false);
                onToggleInteractiveCalibration(false);
                onToggleArchitecturalMode?.(false);
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              deleteModeEnabled
                ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <DeleteIcon active={deleteModeEnabled} />
            <span>Suppression</span>
          </button>

          {/* Mode Architecture */}
          {onToggleArchitecturalMode && (
            <button
              onClick={() => {
                onToggleArchitecturalMode(!architecturalModeEnabled);
                if (!architecturalModeEnabled) {
                  onToggleAnnotation(false);
                  onToggleGpsCalibration(false);
                  onToggleInteractiveCalibration(false);
                  onToggleDeleteMode(false);
                  onToggleEquipmentPlacement?.(false);
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                architecturalModeEnabled
                  ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <ArchitectureIcon active={architecturalModeEnabled} />
              <span>Architecture</span>
            </button>
          )}

          {/* Mode Placement d'Équipements */}
          {onToggleEquipmentPlacement && (
            <button
              onClick={() => {
                onToggleEquipmentPlacement(!equipmentPlacementEnabled);
                if (!equipmentPlacementEnabled) {
                  onToggleAnnotation(false);
                  onToggleGpsCalibration(false);
                  onToggleInteractiveCalibration(false);
                  onToggleDeleteMode(false);
                  onToggleArchitecturalMode?.(false);
                  onToggleSelectionMode?.(false);
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                equipmentPlacementEnabled
                  ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={equipmentPlacementEnabled ? '#0a0b0d' : '#8AFD81'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span>Placement</span>
            </button>
          )}

          {/* Mode Sélection */}
          {onToggleSelectionMode && (
            <button
              onClick={() => {
                onToggleSelectionMode(!selectionModeEnabled);
                if (!selectionModeEnabled) {
                  onToggleAnnotation(false);
                  onToggleGpsCalibration(false);
                  onToggleInteractiveCalibration(false);
                  onToggleDeleteMode(false);
                  onToggleArchitecturalMode?.(false);
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectionModeEnabled
                  ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={selectionModeEnabled ? '#0a0b0d' : '#8AFD81'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span>Sélection</span>
            </button>
          )}

          {/* Bouton pour étendre */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center"
          >
            {isExpanded ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </button>
        </div>
      </div>

      {/* Panneau étendu avec options supplémentaires */}
      {isExpanded && (
        <div className="border-t border-white/10 px-4 py-3 bg-[#0a0b0d]/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Actions sur les annotations */}
            {annotationEnabled && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onClearAnnotations}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all flex items-center gap-2"
                >
                  <DeleteIcon />
                  <span>Tout effacer</span>
                </button>
                <button
                  onClick={onExportAnnotations}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-[#8AFD81]/20 text-[#8AFD81] hover:bg-[#8AFD81]/30 border border-[#8AFD81]/30 transition-all flex items-center gap-2"
                >
                  <ExportIcon />
                  <span>Exporter</span>
                </button>
                <label className="px-3 py-1.5 rounded text-xs font-medium bg-[#8AFD81]/20 text-[#8AFD81] hover:bg-[#8AFD81]/30 border border-[#8AFD81]/30 transition-all cursor-pointer flex items-center gap-2">
                  <ImportIcon />
                  <span>Importer</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            onImportAnnotations?.(data);
                          } catch (error) {
                            console.error('Erreur lors de l\'import:', error);
                            alert('Erreur lors de l\'import du fichier');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {/* Instructions */}
            <div className="flex-1 text-xs text-white/60 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#8AFD81" strokeWidth="2" fill="none"/>
                <path d="M12 16v-4M12 8h.01" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {annotationEnabled && (
                <span>Cliquez dans la scène pour placer des points. Reliez-les pour créer des lignes.</span>
              )}
              {interactiveCalibrationEnabled && (
                <span>Cliquez sur un point GPS dans la scène pour le calibrer interactivement.</span>
              )}
              {gpsCalibrationEnabled && (
                <span>Utilisez le panneau de calibrage pour ajuster les coordonnées GPS.</span>
              )}
              {deleteModeEnabled && (
                <span>Cliquez sur un objet (voiture de golf ou mur) pour le supprimer.</span>
              )}
              {architecturalModeEnabled && (
                <span>Utilisez les outils d'architecture pour créer des murs, portails, lignes et repères avec assistance intelligente.</span>
              )}
              {selectionModeEnabled && (
                <span>Cliquez sur un objet pour le sélectionner et l'éditer (position, rotation, échelle, couleur).</span>
              )}
              {!annotationEnabled && !interactiveCalibrationEnabled && !gpsCalibrationEnabled && !deleteModeEnabled && !architecturalModeEnabled && !selectionModeEnabled && (
                <span>Sélectionnez un mode ci-dessus pour commencer.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

