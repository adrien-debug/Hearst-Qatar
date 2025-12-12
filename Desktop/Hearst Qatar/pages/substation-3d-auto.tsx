import Head from 'next/head';
import { useState, useEffect, Suspense, useRef, lazy, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import AutoPlacedScene3D from '../components/3d/AutoPlacedScene3D';
import SceneControls from '../components/3d/SceneControls';
import SceneLighting from '../components/3d/Lighting';
import ViewModeCameraController from '../components/3d/ViewModeCameraController';
import { ViewMode } from '../components/3d/ViewModeSelector';
import WebGLErrorBoundary from '../components/3d/ErrorBoundary';
import SandyGround from '../components/3d/SandyGround';
import EnvironmentHDRI from '../components/3d/EnvironmentHDRI';
import TexturePreloader from '../components/3d/TexturePreloader';
import AnnotationTool3D, { AnnotationPoint, AnnotationLine } from '../components/3d/AnnotationTool3D';
import AnnotationPanel from '../components/3d/AnnotationPanel';
import DeleteTool3D from '../components/3d/DeleteTool3D';
import GpsCalibrationPanel from '../components/3d/GpsCalibrationPanel';
import InteractiveGpsCalibration from '../components/3d/InteractiveGpsCalibration';
import CalibrationFooter from '../components/3d/CalibrationFooter';
import KeyboardShortcutsHelp from '../components/3d/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import SimpleWallEditor, { WallObject, PortalObject } from '../components/3d/SimpleWallEditor';
import LineTool3D, { Line3D } from '../components/3d/LineTool3D';
import LandmarkTool3D from '../components/3d/LandmarkTool3D';
import AlignmentVisualizer from '../components/3d/AlignmentVisualizer';
import SymmetryVisualizer from '../components/3d/SymmetryVisualizer';
import AxisProposalSystem from '../components/3d/AxisProposalSystem';
import DimensionProposalSystem from '../components/3d/DimensionProposalSystem';
import { LandmarkDefinition } from '../data/landmarkTypes';
import { ArchitecturalObject, Point3D } from '../utils/architecturalHelpers';
import { EditMode } from '../components/3d/SimpleEditorPanel';
import ObjectSelector, { SelectableObject } from '../components/3d/ObjectSelector';
import ObjectPropertiesPanel from '../components/3d/ObjectPropertiesPanel';
import TransformControls from '../components/3d/TransformControls';
import EquipmentPlacementPanel, { EquipmentType } from '../components/3d/EquipmentPlacementPanel';
import PositionProposalSystem from '../components/3d/PositionProposalSystem';
import EquipmentPlacer from '../components/3d/EquipmentPlacer';
import { Scene3DConfig } from '../config/3d.config';
import { texturePreloader } from '../utils/texturePreloader';
import { cleanupOptimalTextureSizeCache } from '../utils/textureCache';
import { convertGpsPointsToAnnotations, validateGpsTypes, GpsPoint } from '../utils/gpsToAnnotation';
import { runAllValidations, printValidationReport } from '../utils/validateGpsAnnotation';
import { sceneData } from '../data/splineSceneData';
import * as THREE from 'three';

// Désactiver Fast Refresh pour cette page (évite les problèmes de contextes WebGL multiples)
// @ts-ignore
if (typeof module !== 'undefined' && module.hot) {
  // @ts-ignore
  module.hot.decline();
}

// Singleton global pour gérer les contextes WebGL - VERSION SIMPLIFIÉE
// Ne nettoie que lors du démontage, laisse React Three Fiber gérer normalement
const WebGLContextManager = {
  activeCanvas: null as HTMLCanvasElement | null,
  activeRenderer: null as any,
  
  registerCanvas(canvas: HTMLCanvasElement, renderer: any) {
    // Ne pas nettoyer les autres canvas ici - laisser React Three Fiber gérer
    if (this.activeCanvas === canvas) {
      return;
    }
    
    this.activeCanvas = canvas;
    this.activeRenderer = renderer;
    (canvas as any).__r3f = renderer;
    
    // Stocker le contexte pour le nettoyage futur
    try {
      const context = renderer.getContext();
      if (context) {
        (canvas as any).__webglContext = context;
      }
    } catch (e) {
      // Ignorer
    }
  },
  
  unregisterCanvas(canvas: HTMLCanvasElement) {
    if (this.activeCanvas === canvas) {
      this.activeCanvas = null;
      this.activeRenderer = null;
    }
    delete (canvas as any).__r3f;
    delete (canvas as any).__webglContext;
  },
  
  cleanupInstance(renderer: any, canvas: HTMLCanvasElement) {
    if (!renderer || !canvas) return;
    
    try {
      // Nettoyer les ressources Three.js
      if (renderer.scene) {
        renderer.scene.traverse((obj: any) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
            materials.forEach((mat: any) => {
              if (mat.map) mat.map.dispose();
              if (mat.normalMap) mat.normalMap.dispose();
              if (mat.roughnessMap) mat.roughnessMap.dispose();
              if (mat.metalnessMap) mat.metalnessMap.dispose();
              if (mat.aoMap) mat.aoMap.dispose();
              if (mat.emissiveMap) mat.emissiveMap.dispose();
              mat.dispose();
            });
          }
        });
      }
      
      if (renderer.dispose) {
        renderer.dispose();
      }
      
      // Libérer le contexte WebGL uniquement lors du démontage
      try {
        const context = (canvas as any).__webglContext || renderer.getContext?.();
        if (context && 'getExtension' in context) {
          const loseContext = (context as any).getExtension('WEBGL_lose_context');
          if (loseContext) {
            loseContext.loseContext();
          }
        }
      } catch (e) {
        // Ignorer
      }
    } catch (e) {
      // Ignorer
    }
  }
};

interface SelectedObjectInfo {
  name: string;
  type: string;
  position: { x: number; y: number };
}

export default function Substation3DAutoPage() {
  const [selectedSceneObject, setSelectedSceneObject] = useState<string | null>(null);
  const [objectInfo, setObjectInfo] = useState<SelectedObjectInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [mounted, setMounted] = useState(false);
  const [annotationEnabled, setAnnotationEnabled] = useState(false);
  const [annotationPoints, setAnnotationPoints] = useState<AnnotationPoint[]>([]);
  const [annotationLines, setAnnotationLines] = useState<AnnotationLine[]>([]);
  const [annotationsLoaded, setAnnotationsLoaded] = useState(false);
  const [deleteModeEnabled, setDeleteModeEnabled] = useState(false);
  const [selectedDeletableObject, setSelectedDeletableObject] = useState<string | null>(null);
  const [deletedObjects, setDeletedObjects] = useState<string[]>([]);
  const [gpsCalibrationEnabled, setGpsCalibrationEnabled] = useState(false);
  const [interactiveCalibrationEnabled, setInteractiveCalibrationEnabled] = useState(false);
  const [gpsPoints, setGpsPoints] = useState<GpsPoint[]>([]);
  // États pour les outils d'architecture
  const [architecturalEditMode, setArchitecturalEditMode] = useState<EditMode>('none');
  const [walls, setWalls] = useState<WallObject[]>([]);
  const [portals, setPortals] = useState<PortalObject[]>([]);
  const [lines, setLines] = useState<Line3D[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkDefinition[]>([]);
  const [intelligentAssistance, setIntelligentAssistance] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<Point3D | undefined>(undefined);
  // États pour la sélection et l'édition d'objets
  const [selectedObject, setSelectedObject] = useState<SelectableObject | null>(null);
  const [selectableObjects, setSelectableObjects] = useState<SelectableObject[]>([]);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [selectionModeEnabled, setSelectionModeEnabled] = useState(false);
  // États pour le placement d'équipements
  const [equipmentPlacementMode, setEquipmentPlacementMode] = useState<EquipmentType>('none');
  const [equipmentPlacementPanelOpen, setEquipmentPlacementPanelOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [placedEquipment, setPlacedEquipment] = useState<Array<{
    id: string;
    type: EquipmentType;
    position: [number, number, number];
  }>>([]);
  const objectRefsMap = useRef<Map<string, any>>(new Map());
  const canvasKeyRef = useRef<string>(`substation-3d-auto-canvas-${Date.now()}`);
  const rendererRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMountedRef = useRef(false);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const mountCountRef = useRef(0);

  useEffect(() => {
    mountCountRef.current += 1;
    const currentMount = mountCountRef.current;
    
    // Monter le Canvas immédiatement - laisser React Three Fiber gérer les contextes
    // React Strict Mode créera 2 contextes en développement, mais un seul sera actif
    if (typeof window !== 'undefined') {
      // Ignorer les doubles montages en développement (React Strict Mode)
      // Mais permettre le remontage lors du hot reload (mountCount change)
      if (isMountedRef.current && currentMount === 1) {
        return;
      }
      
      isMountedRef.current = true;
      
      // Forcer une nouvelle clé pour le Canvas lors du hot reload
      if (currentMount > 1) {
        canvasKeyRef.current = `substation-3d-auto-canvas-${Date.now()}`;
      }
      
      setMounted(true);
      // Logs désactivés pour réduire le bruit dans la console
    } else {
      // Si window n'est pas disponible, monter immédiatement
      setMounted(true);
    }
    
    // Nettoyage uniquement lors du démontage
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 Nettoyage de la page 3D...');
      }
      
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
      
      if (rendererRef.current && canvasRef.current) {
        WebGLContextManager.cleanupInstance(rendererRef.current, canvasRef.current);
        WebGLContextManager.unregisterCanvas(canvasRef.current);
        rendererRef.current = null;
        canvasRef.current = null;
      }
      
      // Nettoyer le cache de textures
      texturePreloader.disposeAll();
      
      // Nettoyer le contexte WebGL utilisé pour détecter la taille optimale
      cleanupOptimalTextureSizeCache();
      
      isMountedRef.current = false;
      setMounted(false);
    };
  }, []);

  // Charger les points GPS depuis spline-positions.json au montage
  useEffect(() => {
    if (typeof window !== 'undefined' && !annotationsLoaded) {
      // CORRECTION #1: Vérifier d'abord si des points GPS calibrés existent dans localStorage
      const calibratedGps = localStorage.getItem('gps-points-calibration');
      
      if (calibratedGps) {
        try {
          // Charger les points GPS calibrés depuis localStorage
          const points: GpsPoint[] = JSON.parse(calibratedGps);
          setGpsPoints(points);
          
          // Valider les types GPS
          const validation = validateGpsTypes(points);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Validation des points GPS calibrés:', validation);
            if (validation.errors.length > 0) {
              console.error('❌ Erreurs de validation GPS:', validation.errors);
            }
            if (validation.warnings.length > 0) {
              console.warn('⚠️ Avertissements de validation GPS:', validation.warnings);
            }
          }

          // Convertir les points GPS en points d'annotation
          const gpsAnnotations = convertGpsPointsToAnnotations(points);
          
          // Charger les annotations sauvegardées depuis localStorage
          const saved = localStorage.getItem('annotations-substation-3d-auto');
          let savedPoints: AnnotationPoint[] = [];
          let savedLines: AnnotationLine[] = [];
          
          if (saved) {
            try {
              const data = JSON.parse(saved);
              savedPoints = data.points || [];
              savedLines = data.lines || [];
            } catch (e) {
              console.error('Erreur lors du chargement des annotations sauvegardées:', e);
            }
          }

          // Fusionner les points GPS avec les points sauvegardés
          // Les points GPS ont priorité (ils sont la source de vérité)
          // On garde seulement les points sauvegardés qui ne sont pas déjà dans les points GPS
          const gpsPointIds = new Set(gpsAnnotations.map(p => p.id));
          const additionalSavedPoints = savedPoints.filter(p => !gpsPointIds.has(p.id));
          
          const mergedPoints = [...gpsAnnotations, ...additionalSavedPoints];
          
          setAnnotationPoints(mergedPoints);
          setAnnotationLines(savedLines);
          setAnnotationsLoaded(true);

          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${gpsAnnotations.length} points GPS calibrés chargés depuis localStorage`);
            console.log(`📝 ${additionalSavedPoints.length} points supplémentaires depuis localStorage`);
            console.log(`📊 Total: ${mergedPoints.length} points d'annotation`);
            
            // Exécuter les 10 tests de validation
            runAllValidations()
              .then(reports => {
                printValidationReport(reports);
              })
              .catch(error => {
                console.error('Erreur lors de l\'exécution des tests de validation:', error);
              });
          }
        } catch (e) {
          console.error('Erreur lors du chargement des points GPS calibrés, chargement depuis le fichier:', e);
          // En cas d'erreur, charger depuis le fichier JSON
          loadGpsPointsFromFile();
        }
      } else {
        // Pas de points calibrés, charger depuis le fichier JSON
        loadGpsPointsFromFile();
      }
    }
    
    // Fonction helper pour charger depuis le fichier JSON
    function loadGpsPointsFromFile() {
      fetch('/spline-positions.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then((gpsPoints: GpsPoint[]) => {
          // CORRECTION #2: Initialiser gpsPoints lors du chargement depuis le fichier
          setGpsPoints(gpsPoints);
          
          // Valider les types GPS
          const validation = validateGpsTypes(gpsPoints);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Validation des points GPS:', validation);
            if (validation.errors.length > 0) {
              console.error('❌ Erreurs de validation GPS:', validation.errors);
            }
            if (validation.warnings.length > 0) {
              console.warn('⚠️ Avertissements de validation GPS:', validation.warnings);
            }
          }

          // Convertir les points GPS en points d'annotation
          const gpsAnnotations = convertGpsPointsToAnnotations(gpsPoints);
          
          // Charger les annotations sauvegardées depuis localStorage
          const saved = localStorage.getItem('annotations-substation-3d-auto');
          let savedPoints: AnnotationPoint[] = [];
          let savedLines: AnnotationLine[] = [];
          
          if (saved) {
            try {
              const data = JSON.parse(saved);
              savedPoints = data.points || [];
              savedLines = data.lines || [];
            } catch (e) {
              console.error('Erreur lors du chargement des annotations sauvegardées:', e);
            }
          }

          // Fusionner les points GPS avec les points sauvegardés
          // Les points GPS ont priorité (ils sont la source de vérité)
          // On garde seulement les points sauvegardés qui ne sont pas déjà dans les points GPS
          const gpsPointIds = new Set(gpsAnnotations.map(p => p.id));
          const additionalSavedPoints = savedPoints.filter(p => !gpsPointIds.has(p.id));
          
          const mergedPoints = [...gpsAnnotations, ...additionalSavedPoints];
          
          setAnnotationPoints(mergedPoints);
          setAnnotationLines(savedLines);
          setAnnotationsLoaded(true);

          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${gpsAnnotations.length} points GPS chargés depuis le fichier JSON`);
            console.log(`📝 ${additionalSavedPoints.length} points supplémentaires depuis localStorage`);
            console.log(`📊 Total: ${mergedPoints.length} points d'annotation`);
            
            // Exécuter les 10 tests de validation
            runAllValidations()
              .then(reports => {
                printValidationReport(reports);
              })
              .catch(error => {
                console.error('Erreur lors de l\'exécution des tests de validation:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Erreur lors du chargement des points GPS:', error);
          // En cas d'erreur, charger seulement depuis localStorage
          const saved = localStorage.getItem('annotations-substation-3d-auto');
          if (saved) {
            try {
              const data = JSON.parse(saved);
              setAnnotationPoints(data.points || []);
              setAnnotationLines(data.lines || []);
            } catch (e) {
              console.error('Erreur lors du chargement des annotations:', e);
            }
          }
          setAnnotationsLoaded(true);
        });
    }
  }, [annotationsLoaded]);

  // Charger les objets supprimés depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deleted-objects-substation-3d-auto');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setDeletedObjects(data || []);
        } catch (e) {
          console.error('Erreur lors du chargement des objets supprimés:', e);
        }
      }
    }
  }, []);

  // Sauvegarder les objets supprimés dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && deletedObjects.length >= 0) {
      localStorage.setItem('deleted-objects-substation-3d-auto', JSON.stringify(deletedObjects));
    }
  }, [deletedObjects]);

  // Raccourcis clavier pour les vues et outils
  useKeyboardShortcuts([
    // Raccourcis pour les modes de vue
    {
      key: '1',
      action: () => setViewMode('overview'),
      description: 'Vue d\'ensemble',
    },
    {
      key: '2',
      action: () => setViewMode('substation'),
      description: 'Vue Substation',
    },
    {
      key: '3',
      action: () => setViewMode('powerblock'),
      description: 'Vue Power Block',
    },
    {
      key: '4',
      action: () => setViewMode('transformer'),
      description: 'Vue Transformateur',
    },
    {
      key: '5',
      action: () => setViewMode('container'),
      description: 'Vue Container',
    },
    // Raccourcis pour les outils
    {
      key: 'a',
      action: () => {
        setAnnotationEnabled(!annotationEnabled);
        if (!annotationEnabled) {
          setArchitecturalEditMode('none');
          setGpsCalibrationEnabled(false);
          setInteractiveCalibrationEnabled(false);
          setDeleteModeEnabled(false);
        }
      },
      description: 'Activer/Désactiver Annotation',
    },
    {
      key: 'c',
      action: () => {
        setGpsCalibrationEnabled(!gpsCalibrationEnabled);
        if (!gpsCalibrationEnabled) {
          setAnnotationEnabled(false);
          setArchitecturalEditMode('none');
          setInteractiveCalibrationEnabled(false);
          setDeleteModeEnabled(false);
        }
      },
      description: 'Activer/Désactiver Calibrage GPS',
    },
    {
      key: 'i',
      action: () => {
        setInteractiveCalibrationEnabled(!interactiveCalibrationEnabled);
        if (!interactiveCalibrationEnabled) {
          setAnnotationEnabled(false);
          setArchitecturalEditMode('none');
          setGpsCalibrationEnabled(false);
          setDeleteModeEnabled(false);
        }
      },
      description: 'Activer/Désactiver Calibrage Interactif',
    },
    {
      key: 'd',
      action: () => {
        setDeleteModeEnabled(!deleteModeEnabled);
        if (!deleteModeEnabled) {
          setAnnotationEnabled(false);
          setArchitecturalEditMode('none');
          setGpsCalibrationEnabled(false);
          setInteractiveCalibrationEnabled(false);
        }
      },
      description: 'Activer/Désactiver Mode Suppression',
    },
    {
      key: 'b',
      action: () => {
        if (architecturalEditMode === 'none') {
          setArchitecturalEditMode('wall');
        } else {
          setArchitecturalEditMode('none');
        }
        setAnnotationEnabled(false);
        setGpsCalibrationEnabled(false);
        setInteractiveCalibrationEnabled(false);
        setDeleteModeEnabled(false);
      },
      description: 'Activer/Désactiver Outils d\'Architecture',
    },
    // Raccourcis pour les outils d'architecture
    {
      key: 'w',
      action: () => {
        if (architecturalEditMode !== 'none') {
          setArchitecturalEditMode('wall');
        }
      },
      description: 'Mode Mur (Architecture)',
    },
    {
      key: 'p',
      action: () => {
        if (architecturalEditMode !== 'none') {
          setArchitecturalEditMode('portal');
        }
      },
      description: 'Mode Portail (Architecture)',
    },
    {
      key: 'l',
      action: () => {
        if (architecturalEditMode !== 'none') {
          setArchitecturalEditMode('line');
        }
      },
      description: 'Mode Ligne (Architecture)',
    },
    {
      key: 'm',
      action: () => {
        if (architecturalEditMode !== 'none') {
          setArchitecturalEditMode('landmark');
        }
      },
      description: 'Mode Repère (Architecture)',
    },
    {
      key: 's',
      action: () => {
        setIntelligentAssistance(!intelligentAssistance);
      },
      description: 'Activer/Désactiver Assistance Intelligente',
    },
    // Raccourci Escape pour fermer tous les modes
    {
      key: 'Escape',
      action: () => {
        setAnnotationEnabled(false);
        setDeleteModeEnabled(false);
        setGpsCalibrationEnabled(false);
        setInteractiveCalibrationEnabled(false);
        setArchitecturalEditMode('none');
        setSelectedDeletableObject(null);
      },
      description: 'Fermer tous les modes',
    },
  ]);

  // Raccourci clavier pour afficher l'aide (?) - seulement si Shift est pressé
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && event.shiftKey) {
        // L'aide sera gérée par le composant KeyboardShortcutsHelp
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleObjectClick = (objectName: string) => {
    setSelectedSceneObject(objectName);

    let displayName = objectName;
    let typeName = 'Élément';

    if (objectName === 'Substation_200MW') {
      typeName = 'Substation';
      displayName = 'Substation 200 MW';
    } else if (objectName.startsWith('PowerBlock_')) {
      typeName = 'Power Block';
      displayName = objectName.replace('_', ' ');
    } else if (objectName.includes('Transformer')) {
      typeName = 'Transformateur';
      displayName = objectName.replace(/_/g, ' ');
    } else if (objectName.includes('SG_') || objectName.includes('Switchgear')) {
      typeName = 'Switchgear';
      displayName = objectName.replace(/_/g, ' ');
    } else if (objectName.includes('HD5') || objectName.includes('Container')) {
      typeName = 'Container HD5';
      displayName = objectName.replace(/_/g, ' ');
    }

    setObjectInfo({
      name: displayName,
      type: typeName,
      position: { x: 0, y: 0 },
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Gestion des annotations
  const handleAnnotationsChange = (points: AnnotationPoint[], lines: AnnotationLine[]) => {
    setAnnotationPoints(points);
    setAnnotationLines(lines);
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ points, lines }));
    }
  };

  const handleClearAnnotations = () => {
    setAnnotationPoints([]);
    setAnnotationLines([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('annotations-substation-3d-auto');
    }
  };

  const handleExportAnnotations = () => {
    const data = {
      points: annotationPoints,
      lines: annotationLines,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotations-substation-3d-auto-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAnnotations = (data: { points: AnnotationPoint[]; lines: AnnotationLine[] }) => {
    setAnnotationPoints(data.points);
    setAnnotationLines(data.lines);
  };

  const handleDeletePoint = (pointId: string) => {
    const updatedPoints = annotationPoints.filter((p) => p.id !== pointId);
    const updatedLines = annotationLines.filter((l) => l.startPointId !== pointId && l.endPointId !== pointId);
    
    setAnnotationPoints(updatedPoints);
    setAnnotationLines(updatedLines);
    
    // Sauvegarder dans localStorage immédiatement
    if (typeof window !== 'undefined') {
      localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ 
        points: updatedPoints, 
        lines: updatedLines 
      }));
    }
  };

  const handleDeleteLine = (lineId: string) => {
    const updatedLines = annotationLines.filter((l) => l.id !== lineId);
    setAnnotationLines(updatedLines);
    
    // Sauvegarder dans localStorage immédiatement
    if (typeof window !== 'undefined') {
      localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ 
        points: annotationPoints, 
        lines: updatedLines 
      }));
    }
  };

  const handleUpdatePoint = (pointId: string, updates: Partial<AnnotationPoint>) => {
    const updatedPoints = annotationPoints.map((p) => 
      p.id === pointId ? { ...p, ...updates } : p
    );
    setAnnotationPoints(updatedPoints);
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ 
        points: updatedPoints, 
        lines: annotationLines 
      }));
    }
  };

  // Gestion de la suppression d'objets 3D
  const handleDeleteObject = (objectId: string) => {
    console.log('🗑️ Suppression de l\'objet:', objectId);
    
    // Si c'est un équipement placé manuellement, le retirer de la liste
    setPlacedEquipment((prev) => {
      const filtered = prev.filter(eq => eq.id !== objectId);
      if (filtered.length !== prev.length) {
        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('placed-equipment', JSON.stringify(filtered));
        }
        return filtered;
      }
      return prev;
    });
    
    // Ajouter à la liste des objets supprimés
    setDeletedObjects((prev) => {
      if (!prev.includes(objectId)) {
        const updated = [...prev, objectId];
        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('deleted-objects', JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });
    setSelectedDeletableObject(null);
  };

  // Gestion du placement d'équipements
  const handlePlaceEquipment = (type: EquipmentType, position: [number, number, number]) => {
    if (type === 'none') return;

    const newEquipment = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
    };

    setPlacedEquipment((prev) => [...prev, newEquipment]);
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('placed-equipment') || '[]');
      saved.push(newEquipment);
      localStorage.setItem('placed-equipment', JSON.stringify(saved));
    }

    // Réinitialiser le mode après placement
    setEquipmentPlacementMode('none');
  };

  // Charger les équipements placés au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('placed-equipment');
      if (saved) {
        try {
          const equipment = JSON.parse(saved);
          setPlacedEquipment(equipment);
        } catch (e) {
          console.error('Erreur lors du chargement des équipements:', e);
        }
      }
    }
  }, []);

  // Gestion du calibrage GPS interactif
  const handlePointCalibrated = (pointName: string, position: [number, number, number]) => {
    const updated = gpsPoints.map((point) => {
      if (point.name === pointName) {
        return {
          ...point,
          x: position[0],
          y: position[1],
          z: position[2],
        };
      }
      return point;
    });
    setGpsPoints(updated);
    
    // Mettre à jour les annotations
    const gpsAnnotations = convertGpsPointsToAnnotations(updated);
    setAnnotationPoints(gpsAnnotations);
    
    // CORRECTION #3: Sauvegarder dans gps-points-calibration lors du calibrage interactif
    if (typeof window !== 'undefined') {
      localStorage.setItem('gps-points-calibration', JSON.stringify(updated));
      localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ 
        points: gpsAnnotations, 
        lines: annotationLines 
      }));
    }
  };

  // Gestion du calibrage GPS
  const handleUpdateGpsPoint = (index: number, updatedPoint: GpsPoint) => {
    const updated = [...gpsPoints];
    updated[index] = updatedPoint;
    setGpsPoints(updated);
    
    // CORRECTION #4: Synchroniser immédiatement les annotations lors des modifications manuelles
    const gpsAnnotations = convertGpsPointsToAnnotations(updated);
    setAnnotationPoints(gpsAnnotations);
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gps-points-calibration', JSON.stringify(updated));
      localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ 
        points: gpsAnnotations, 
        lines: annotationLines 
      }));
    }
  };

  const handleSaveGpsPoints = async (updatedPoints: GpsPoint[]) => {
    try {
      // Sauvegarder dans le fichier JSON via une API route (à créer) ou localStorage temporaire
      // Pour l'instant, on sauvegarde dans localStorage et on recharge
      if (typeof window !== 'undefined') {
        // Sauvegarder temporairement
        localStorage.setItem('gps-points-calibration', JSON.stringify(updatedPoints));
        
        // Reconvertir en annotations
        const gpsAnnotations = convertGpsPointsToAnnotations(updatedPoints);
        setAnnotationPoints(gpsAnnotations);
        setGpsPoints(updatedPoints);
        
        // Sauvegarder aussi dans les annotations
        localStorage.setItem('annotations-substation-3d-auto', JSON.stringify({ 
          points: gpsAnnotations, 
          lines: annotationLines 
        }));
        
        alert('Points GPS sauvegardés ! (Note: Pour une sauvegarde permanente, vous devrez mettre à jour le fichier spline-positions.json)');
        setGpsCalibrationEnabled(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des points GPS:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Handlers pour les outils d'architecture
  const handleAddWall = (wall: WallObject) => {
    setWalls((prev) => [...prev, wall]);
    setArchitecturalEditMode('none');
  };

  const handleAddPortal = (portal: PortalObject) => {
    setPortals((prev) => [...prev, portal]);
    setArchitecturalEditMode('none');
  };

  const handleDeleteWall = (id: string) => {
    setWalls((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDeletePortal = (id: string) => {
    setPortals((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddArchitecturalLine = (line: Line3D) => {
    setLines((prev) => [...prev, line]);
    setArchitecturalEditMode('none');
  };

  const handleDeleteArchitecturalLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddLandmark = (landmark: LandmarkDefinition) => {
    setLandmarks((prev) => [...prev, landmark]);
    if (landmark.type === 'point') {
      setArchitecturalEditMode('none');
    }
  };

  const handleDeleteLandmark = (id: string) => {
    setLandmarks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearArchitectural = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les objets architecturaux placés ?')) {
      setWalls([]);
      setPortals([]);
      setLines([]);
      setLandmarks([]);
    }
  };

  // Handlers pour la mise à jour des objets architecturaux
  const handleUpdateWall = (id: string, updates: Partial<WallObject>) => {
    setWalls((prev) => prev.map((wall) => 
      wall.id === id ? { ...wall, ...updates } : wall
    ));
  };

  const handleUpdatePortal = (id: string, updates: Partial<PortalObject>) => {
    setPortals((prev) => prev.map((portal) => 
      portal.id === id ? { ...portal, ...updates } : portal
    ));
  };

  // Handler pour la mise à jour d'un objet sélectionné
  const handleObjectUpdate = (id: string, updates: Partial<SelectableObject>) => {
    // Mettre à jour selon le type d'objet
    if (updates.type === 'wall' || walls.find(w => w.id === id)) {
      handleUpdateWall(id, updates as Partial<WallObject>);
    } else if (updates.type === 'portal' || portals.find(p => p.id === id)) {
      handleUpdatePortal(id, updates as Partial<PortalObject>);
    } else {
      // Objet de la scène (substation, power block, transformer, container, switchgear)
      handleSceneObjectUpdate(id, updates);
    }
  };

  // États pour les objets existants de la scène
  const [sceneObjectPositions, setSceneObjectPositions] = useState<Map<string, [number, number, number]>>(new Map());
  const [sceneObjectRotations, setSceneObjectRotations] = useState<Map<string, number>>(new Map());
  const [sceneObjectScales, setSceneObjectScales] = useState<Map<string, [number, number, number]>>(new Map());
  const [sceneObjectColors, setSceneObjectColors] = useState<Map<string, string>>(new Map());

  // Charger les positions initiales depuis sceneData
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Importer sceneData pour obtenir les positions initiales
      import('../data/splineSceneData').then(({ sceneData }) => {
        const positions = new Map<string, [number, number, number]>();
        const rotations = new Map<string, number>();
        const scales = new Map<string, [number, number, number]>();
        const colors = new Map<string, string>();

        // Substation
        positions.set(sceneData.substation.name, [
          sceneData.substation.x,
          sceneData.substation.y,
          sceneData.substation.z,
        ]);

        // Power Blocks, Transformers, Containers, Switchgears
        sceneData.powerBlocks.forEach(pb => {
          positions.set(pb.id, [pb.position.x, pb.position.y, pb.position.z]);
          pb.transformers.forEach(tr => {
            positions.set(tr.id, [tr.position.x, tr.position.y, tr.position.z]);
            tr.containers.forEach(container => {
              positions.set(container.id, [
                container.position.x,
                container.position.y,
                container.position.z,
              ]);
            });
            tr.switchgears.forEach(sg => {
              positions.set(sg.id, [
                sg.position.x,
                sg.position.y,
                sg.position.z,
              ]);
            });
          });
        });

        setSceneObjectPositions(positions);
        setSceneObjectRotations(rotations);
        setSceneObjectScales(scales);
        setSceneObjectColors(colors);
      });
    }
  }, []);

  // Handler pour mettre à jour les objets de la scène
  const handleSceneObjectUpdate = (id: string, updates: Partial<SelectableObject>) => {
    if (updates.position) {
      setSceneObjectPositions(prev => {
        const newMap = new Map(prev);
        newMap.set(id, updates.position as [number, number, number]);
        return newMap;
      });
    }
    if (updates.rotation !== undefined) {
      setSceneObjectRotations(prev => {
        const newMap = new Map(prev);
        newMap.set(id, updates.rotation as number);
        return newMap;
      });
    }
    if (updates.scale) {
      setSceneObjectScales(prev => {
        const newMap = new Map(prev);
        newMap.set(id, updates.scale as [number, number, number]);
        return newMap;
      });
    }
    if (updates.color) {
      setSceneObjectColors(prev => {
        const newMap = new Map(prev);
        newMap.set(id, updates.color as string);
        return newMap;
      });
    }

    // Mettre à jour la liste des objets sélectionnables
    setSelectableObjects((prev) => prev.map((obj) => 
      obj.id === id ? { ...obj, ...updates } : obj
    ));
  };

  // Mettre à jour la liste des objets sélectionnables quand les objets changent
  useEffect(() => {
    const objects: SelectableObject[] = [
      ...walls.map(wall => ({
        id: wall.id,
        type: 'wall' as const,
        ref: null,
        position: wall.position,
        rotation: wall.rotation,
        scale: wall.scale || [1, 1, 1],
        color: wall.color,
        metadata: { length: wall.length, height: wall.height },
      })),
      ...portals.map(portal => ({
        id: portal.id,
        type: 'portal' as const,
        ref: null,
        position: portal.position,
        rotation: portal.rotation,
        scale: portal.scale || [1, 1, 1],
        color: portal.color,
        metadata: { width: portal.width, height: portal.height },
      })),
    ];

    // Ajouter les objets de la scène
    sceneObjectPositions.forEach((position, id) => {
      // Déterminer le type d'objet
      let type: SelectableObject['type'] = 'other';
      if (id.includes('Substation')) type = 'substation';
      else if (id.startsWith('PowerBlock')) type = 'powerblock';
      else if (id.startsWith('PB') && id.includes('_TR')) type = 'transformer';
      else if (id.includes('HD5')) type = 'container';
      else if (id.includes('SG')) type = 'switchgear';

      objects.push({
        id,
        type,
        ref: null,
        position,
        rotation: sceneObjectRotations.get(id) || 0,
        scale: sceneObjectScales.get(id) || [1, 1, 1],
        color: sceneObjectColors.get(id),
      });
    });

    setSelectableObjects(objects);
  }, [walls, portals, sceneObjectPositions, sceneObjectRotations, sceneObjectScales, sceneObjectColors]);

  // Convertir tous les objets en format ArchitecturalObject pour l'analyse
  const allObjects = useMemo<ArchitecturalObject[]>(() => {
    const objects: ArchitecturalObject[] = [];
    
    walls.forEach(wall => {
      objects.push({
        id: wall.id,
        type: 'wall',
        position: { x: wall.position[0], y: wall.position[1], z: wall.position[2] },
        rotation: wall.rotation,
        dimensions: { length: wall.length, height: wall.height },
      });
    });

    portals.forEach(portal => {
      objects.push({
        id: portal.id,
        type: 'portal',
        position: { x: portal.position[0], y: portal.position[1], z: portal.position[2] },
        rotation: portal.rotation,
        dimensions: { width: portal.width, height: portal.height },
      });
    });

    lines.forEach(line => {
      objects.push({
        id: line.id,
        type: 'line',
        position: line.start,
        dimensions: { length: Math.sqrt(
          Math.pow(line.end.x - line.start.x, 2) +
          Math.pow(line.end.y - line.start.y, 2) +
          Math.pow(line.end.z - line.start.z, 2)
        ) },
      });
    });

    landmarks.forEach(landmark => {
      objects.push({
        id: landmark.id,
        type: 'landmark',
        position: { x: landmark.position[0], y: landmark.position[1], z: landmark.position[2] },
      });
    });

    return objects;
  }, [walls, portals, lines, landmarks]);

  // Liste des objets supprimables avec leurs informations - inclut tous les équipements
  const deletableObjects = useMemo(() => {
    const objects: Array<{
      id: string;
      type: 'golf-cart' | 'wall' | 'container' | 'transformer' | 'switchgear' | 'generator';
      name: string;
      position: [number, number, number];
    }> = [
      {
        id: 'golf-cart-1',
        type: 'golf-cart' as const,
        name: 'Voiture de golf',
        position: [-42.9, 0, -116.3] as [number, number, number],
      },
      {
        id: 'wall-1',
        type: 'wall' as const,
        name: 'Mur 1',
        position: [-99.3, 0, -109.8] as [number, number, number], // Position centrale du mur
      },
    {
      id: 'wall-2',
      type: 'wall' as const,
      name: 'Mur 2',
      position: [-95.0, 0, -110.25] as [number, number, number], // Position centrale du mur
    },
    {
      id: 'wall-3',
      type: 'wall' as const,
      name: 'Mur 3',
      position: [-72.05, 0, -106.25] as [number, number, number], // Position centrale du mur (moyenne entre B et C)
    },
    {
      id: 'wall-4',
      type: 'wall' as const,
      name: 'Mur 4',
      position: [-98.85, 0, -109.9] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-5',
      type: 'wall' as const,
      name: 'Mur 5',
      position: [-40.95, 0, -104.4] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-6',
      type: 'wall' as const,
      name: 'Mur 6',
      position: [-93.85, 0, -103.2] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-7',
      type: 'wall' as const,
      name: 'Mur 7',
      position: [-176.7, 0, 47.4] as [number, number, number], // Position centrale du mur (moyenne entre C et D)
    },
    {
      id: 'wall-8',
      type: 'wall' as const,
      name: 'Mur 8',
      position: [-3.85, 0, 177.85] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-9',
      type: 'wall' as const,
      name: 'Mur 9',
      position: [127.95, 0, -80.95] as [number, number, number], // Position centrale du mur (moyenne entre C et D)
    },
    {
      id: 'wall-10',
      type: 'wall' as const,
      name: 'Mur 10',
      position: [170.55, 0, 34.8] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-11',
      type: 'wall' as const,
      name: 'Mur 11',
      position: [91.25, 0, -99.35] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-12',
      type: 'wall' as const,
      name: 'Mur 12',
      position: [-180.2, 0, 44.6] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    {
      id: 'wall-13',
      type: 'wall' as const,
      name: 'Mur 13',
      position: [-97.65, 0, -98.4] as [number, number, number], // Position centrale du mur (moyenne entre A et B)
    },
    ];

    // Ajouter tous les conteneurs, transformateurs et switchgears depuis sceneData
    sceneData.powerBlocks.forEach((pb) => {
      pb.transformers.forEach((tr) => {
        // Ajouter le transformateur
        objects.push({
          id: tr.id,
          type: 'transformer' as const,
          name: `Transformateur ${tr.id}`,
          position: [tr.position.x, tr.position.y, tr.position.z],
        });

        // Ajouter les conteneurs
        tr.containers.forEach((container) => {
          objects.push({
            id: container.id,
            type: 'container' as const,
            name: `Container ${container.id}`,
            position: [container.position.x, container.position.y, container.position.z],
          });
        });

        // Ajouter les switchgears
        tr.switchgears.forEach((switchgear) => {
          objects.push({
            id: switchgear.id,
            type: 'switchgear' as const,
            name: `Switchgear ${switchgear.id}`,
            position: [switchgear.position.x, switchgear.position.y, switchgear.position.z],
          });
        });
      });
    });

    // Ajouter les équipements placés manuellement
    placedEquipment.forEach((eq) => {
      objects.push({
        id: eq.id,
        type: eq.type === 'container' ? 'container' as const :
              eq.type === 'transformer' ? 'transformer' as const :
              eq.type === 'switchgear' ? 'switchgear' as const :
              eq.type === 'generator' ? 'generator' as const : 'container' as const,
        name: `${eq.type} ${eq.id}`,
        position: eq.position,
      });
    });

    const filtered = objects.filter(obj => !deletedObjects.includes(obj.id));
    
    // Debug: afficher le nombre d'objets supprimables
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Objets supprimables:', {
        total: filtered.length,
        containers: filtered.filter(o => o.type === 'container').length,
        transformers: filtered.filter(o => o.type === 'transformer').length,
        switchgears: filtered.filter(o => o.type === 'switchgear').length,
        walls: filtered.filter(o => o.type === 'wall').length,
      });
    }
    
    return filtered;
  }, [deletedObjects, placedEquipment]);

  return (
    <>
      <Head>
        <title>Visualisation 3D Auto - Substation 200 MW</title>
        <meta name="description" content="Visualisation 3D interactive avec placement automatique" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50" style={{ margin: 0, padding: 0 }}>
        {/* Panneau de calibrage GPS (affiché uniquement quand activé) */}
        {gpsCalibrationEnabled && (
          <div className="absolute top-4 left-4 right-4 z-40 max-h-[80vh] overflow-y-auto">
            <GpsCalibrationPanel
              gpsPoints={gpsPoints}
              onUpdateGpsPoint={handleUpdateGpsPoint}
              onSave={handleSaveGpsPoints}
              onCancel={() => {
                // Recharger les points originaux
                fetch('/spline-positions.json')
                  .then((response) => response.json())
                  .then((points: GpsPoint[]) => {
                    setGpsPoints(points);
                    setGpsCalibrationEnabled(false);
                  });
              }}
            />
          </div>
        )}

        {/* Panneau d'annotation (affiché uniquement quand activé) */}
        {annotationEnabled && (
          <div className="absolute top-4 left-4 z-40">
            <AnnotationPanel
              enabled={annotationEnabled}
              onToggle={setAnnotationEnabled}
              points={annotationPoints}
              lines={annotationLines}
              onClearAll={handleClearAnnotations}
              onDeletePoint={handleDeletePoint}
              onDeleteLine={handleDeleteLine}
              onExport={handleExportAnnotations}
              onImport={handleImportAnnotations}
              onUpdatePoint={handleUpdatePoint}
            />
          </div>
        )}

        {/* Panneau d'information (affiché uniquement quand un objet est sélectionné) */}
        {objectInfo && !annotationEnabled && !gpsCalibrationEnabled && !interactiveCalibrationEnabled && !selectionModeEnabled && (
          <div className="absolute top-4 right-4 z-40 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-lg mb-2">{objectInfo.type}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Nom:</span> {objectInfo.name}
            </p>
            <button
              onClick={() => {
                setSelectedSceneObject(null);
                setObjectInfo(null);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Panneau de sélection et édition */}
        {selectedObject && (
          <ObjectPropertiesPanel
            selectedObject={selectedObject}
            onUpdate={handleObjectUpdate}
            onDelete={(id) => {
              if (selectedObject.type === 'wall') {
                handleDeleteWall(id);
              } else if (selectedObject.type === 'portal') {
                handleDeletePortal(id);
              } else {
                // Pour les objets de la scène, on peut les "cacher" en les déplaçant très loin
                // ou les ajouter à deletedObjects
                setDeletedObjects(prev => [...prev, id]);
              }
              setSelectedObject(null);
            }}
            onClose={() => setSelectedObject(null)}
          />
        )}

        {/* Panneau de contrôle de sélection */}
        {selectionModeEnabled && (
          <div className="absolute top-4 left-4 z-40">
            <div className="bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Mode Sélection</h3>
                <button
                  onClick={() => {
                    setSelectionModeEnabled(false);
                    setSelectedObject(null);
                  }}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setTransformMode('translate')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    transformMode === 'translate'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Déplacer
                </button>
                <button
                  onClick={() => setTransformMode('rotate')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    transformMode === 'rotate'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Tourner
                </button>
                <button
                  onClick={() => setTransformMode('scale')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    transformMode === 'scale'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Redimensionner
                </button>
              </div>
              <p className="text-xs text-white/60">
                Cliquez sur un objet pour le sélectionner
              </p>
            </div>
          </div>
        )}

        {/* Panneau d'outils d'architecture (affiché uniquement quand un mode est actif) */}
        {architecturalEditMode !== 'none' && !selectionModeEnabled && (
          <div className="absolute top-4 left-4 z-40">
            <div className="bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl p-4 max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <h3 className="text-sm font-bold text-white">Outils d'Architecture</h3>
                </div>
                <button
                  onClick={() => setArchitecturalEditMode('none')}
                  className="text-white/60 hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setArchitecturalEditMode('wall')}
                  className={`px-3 py-2 rounded text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    architecturalEditMode === 'wall'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Mur</span>
                </button>
                <button
                  onClick={() => setArchitecturalEditMode('portal')}
                  className={`px-3 py-2 rounded text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    architecturalEditMode === 'portal'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 21V5a2 2 0 012-2h4a2 2 0 012 2v16M8 21H6a2 2 0 01-2-2v-4a2 2 0 012-2h2M8 21h8M16 21h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span>Portail</span>
                </button>
                <button
                  onClick={() => setArchitecturalEditMode('line')}
                  className={`px-3 py-2 rounded text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    architecturalEditMode === 'line'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="6" cy="12" r="2" fill="currentColor"/>
                    <circle cx="18" cy="12" r="2" fill="currentColor"/>
                  </svg>
                  <span>Ligne</span>
                </button>
                <button
                  onClick={() => setArchitecturalEditMode('landmark')}
                  className={`px-3 py-2 rounded text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    architecturalEditMode === 'landmark'
                      ? 'bg-[#8AFD81] text-[#0a0b0d]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  </svg>
                  <span>Repère</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span>Murs: {walls.length}</span>
                <span>Portails: {portals.length}</span>
                <span>Lignes: {lines.length}</span>
                <span>Repères: {landmarks.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={intelligentAssistance}
                    onChange={(e) => setIntelligentAssistance(e.target.checked)}
                    className="w-4 h-4 accent-[#8AFD81]"
                  />
                  <span>Assistance Intelligente</span>
                </label>
                <button
                  onClick={() => {
                    setSelectionModeEnabled(true);
                    setArchitecturalEditMode('none');
                  }}
                  className="px-2 py-1 text-xs bg-[#8AFD81]/20 text-[#8AFD81] hover:bg-[#8AFD81]/30 rounded flex items-center gap-1 border border-[#8AFD81]/30"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span>Sélectionner</span>
                </button>
                {(walls.length > 0 || portals.length > 0 || lines.length > 0 || landmarks.length > 0) && (
                  <button
                    onClick={handleClearArchitectural}
                    className="ml-auto px-2 py-1 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <span>Effacer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Système de propositions de dimensions */}
        {currentPosition && architecturalEditMode !== 'none' && intelligentAssistance && (
          <DimensionProposalSystem
            position={currentPosition}
            allObjects={allObjects}
            type={architecturalEditMode === 'wall' ? 'wall' : architecturalEditMode === 'portal' ? 'portal' : architecturalEditMode === 'line' ? 'line' : 'landmark'}
            enabled={intelligentAssistance}
          />
        )}

        {/* Panneau de placement d'équipements */}
        {equipmentPlacementPanelOpen && (
          <EquipmentPlacementPanel
            placementMode={equipmentPlacementMode}
            onPlacementModeChange={(mode) => {
              setEquipmentPlacementMode(mode);
              if (mode === 'none') {
                setEquipmentPlacementPanelOpen(false);
              }
            }}
            onClose={() => {
              setEquipmentPlacementMode('none');
              setEquipmentPlacementPanelOpen(false);
            }}
          />
        )}

        {/* Système de propositions de position pour équipements - DÉSACTIVÉ TEMPORAIREMENT pour éviter les plantages */}
        {false && equipmentPlacementMode !== 'none' && intelligentAssistance && (
          <PositionProposalSystem
            mousePosition={mousePosition}
            equipmentType={equipmentPlacementMode}
            existingObjects={[
              ...selectableObjects.map(obj => ({
                id: obj.id,
                type: obj.type,
                position: obj.position as [number, number, number],
              })),
              ...placedEquipment.map(eq => ({
                id: eq.id,
                type: eq.type,
                position: eq.position,
              })),
            ]}
            roads={lines.filter(l => l.type === 'road').map(l => ({
              id: l.id,
              points: [l.startPoint, l.endPoint] as [number, number, number][],
              width: 5,
            }))}
            containers={selectableObjects.filter(obj => obj.type === 'container').map(obj => ({
              id: obj.id,
              position: obj.position as [number, number, number],
            }))}
            enabled={intelligentAssistance}
            onProposalSelect={(proposal) => {
              handlePlaceEquipment(equipmentPlacementMode, proposal.position);
            }}
          />
        )}

        {/* Aide des raccourcis clavier */}
        <KeyboardShortcutsHelp
          shortcuts={[
            { keys: ['1'], description: 'Vue d\'ensemble', category: 'view' },
            { keys: ['2'], description: 'Vue Substation', category: 'view' },
            { keys: ['3'], description: 'Vue Power Block', category: 'view' },
            { keys: ['4'], description: 'Vue Transformateur', category: 'view' },
            { keys: ['5'], description: 'Vue Container', category: 'view' },
            { keys: ['A'], description: 'Annotation', category: 'tools' },
            { keys: ['C'], description: 'Calibrage GPS', category: 'tools' },
            { keys: ['I'], description: 'Calibrage Interactif', category: 'tools' },
            { keys: ['D'], description: 'Suppression', category: 'tools' },
            { keys: ['B'], description: 'Outils d\'Architecture', category: 'tools' },
            { keys: ['W'], description: 'Mode Mur', category: 'tools' },
            { keys: ['P'], description: 'Mode Portail', category: 'tools' },
            { keys: ['L'], description: 'Mode Ligne', category: 'tools' },
            { keys: ['M'], description: 'Mode Repère', category: 'tools' },
            { keys: ['S'], description: 'Assistance Intelligente', category: 'tools' },
            { keys: ['Esc'], description: 'Fermer tous les modes', category: 'navigation' },
          ]}
        />

        {/* Footer avec tous les outils de calibration */}
        <CalibrationFooter
          annotationEnabled={annotationEnabled}
          onToggleAnnotation={(enabled) => {
            setAnnotationEnabled(enabled);
            if (enabled) setArchitecturalEditMode('none');
          }}
          gpsCalibrationEnabled={gpsCalibrationEnabled}
          onToggleGpsCalibration={(enabled) => {
            setGpsCalibrationEnabled(enabled);
            if (enabled) setArchitecturalEditMode('none');
          }}
          interactiveCalibrationEnabled={interactiveCalibrationEnabled}
          onToggleInteractiveCalibration={(enabled) => {
            setInteractiveCalibrationEnabled(enabled);
            if (enabled) setArchitecturalEditMode('none');
          }}
          deleteModeEnabled={deleteModeEnabled}
          onToggleDeleteMode={(enabled) => {
            console.log('🔧 Toggle suppression depuis footer:', enabled);
            console.log('🔧 État actuel - annotationEnabled:', annotationEnabled, 'interactiveCalibrationEnabled:', interactiveCalibrationEnabled, 'architecturalEditMode:', architecturalEditMode, 'equipmentPlacementMode:', equipmentPlacementMode);
            setDeleteModeEnabled(enabled);
            if (enabled) {
              setAnnotationEnabled(false);
              setGpsCalibrationEnabled(false);
              setInteractiveCalibrationEnabled(false);
              setArchitecturalEditMode('none');
              setEquipmentPlacementMode('none');
              setEquipmentPlacementPanelOpen(false);
              setSelectionModeEnabled(false);
            }
          }}
          architecturalModeEnabled={architecturalEditMode !== 'none'}
          onToggleArchitecturalMode={(enabled) => {
            if (enabled) {
              setArchitecturalEditMode('wall');
            } else {
              setArchitecturalEditMode('none');
            }
            setAnnotationEnabled(false);
            setGpsCalibrationEnabled(false);
            setInteractiveCalibrationEnabled(false);
            setDeleteModeEnabled(false);
            setSelectionModeEnabled(false);
          }}
          selectionModeEnabled={selectionModeEnabled}
          onToggleSelectionMode={(enabled) => {
            setSelectionModeEnabled(enabled);
            if (enabled) {
              setAnnotationEnabled(false);
              setGpsCalibrationEnabled(false);
              setInteractiveCalibrationEnabled(false);
              setDeleteModeEnabled(false);
              setArchitecturalEditMode('none');
              setEquipmentPlacementMode('none');
              setEquipmentPlacementPanelOpen(false);
            } else {
              setSelectedObject(null);
            }
          }}
          equipmentPlacementEnabled={equipmentPlacementMode !== 'none' || equipmentPlacementPanelOpen}
          onToggleEquipmentPlacement={(enabled) => {
            if (enabled) {
              setEquipmentPlacementPanelOpen(true);
              setAnnotationEnabled(false);
              setGpsCalibrationEnabled(false);
              setInteractiveCalibrationEnabled(false);
              setDeleteModeEnabled(false);
              setArchitecturalEditMode('none');
              setSelectionModeEnabled(false);
            } else {
              setEquipmentPlacementMode('none');
              setEquipmentPlacementPanelOpen(false);
            }
          }}
          onClearAnnotations={handleClearAnnotations}
          onExportAnnotations={handleExportAnnotations}
          onImportAnnotations={handleImportAnnotations}
          annotationPointsCount={annotationPoints.length}
          annotationLinesCount={annotationLines.length}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Canvas 3D - Prend tout l'écran (avec espace pour le footer) */}
        {mounted ? (
          <WebGLErrorBoundary>
            <div style={{ width: '100%', height: 'calc(100vh - 80px)', position: 'relative' }}>
              <Canvas
                performance={{ min: 0.5, max: 1, debounce: 300 }}
                dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.0) : 1}
                frameloop="demand"
                flat
                key={canvasKeyRef.current}
                raycaster={{ enabled: false }}
                camera={{
                  position: [0, 100, -250],
                  fov: 50,
                  near: 0.1,
                  far: 2000,
                }}
                shadows={false}
                style={{ width: '100%', height: '100%', display: 'block' }}
                gl={{
                  antialias: true,
                  alpha: false,
                  powerPreference: 'high-performance',
                  stencil: false,
                  depth: true,
                  preserveDrawingBuffer: false,
                  logarithmicDepthBuffer: false,
                  precision: 'mediump',
                }}
                onCreated={({ gl, scene, camera }) => {
                  // Optimiser le renderer pour les performances - ombres complètement désactivées
                  gl.shadowMap.enabled = false; // Désactiver complètement pour éviter les erreurs et améliorer les performances
                  gl.sortObjects = false; // Désactiver le tri des objets pour meilleures performances
                  gl.physicallyCorrectLights = false; // Désactiver les lumières physiquement correctes
                  
                  // Optimisations supplémentaires pour les performances
                  if (typeof window !== 'undefined') {
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.0)); // Limiter le DPR à 1.0
                  }
                  
                  // Encodage simplifié pour meilleures performances
                  if ('outputEncoding' in gl) {
                    (gl as any).outputEncoding = THREE.LinearEncoding;
                  }
                  
                  // Enregistrer le renderer et canvas
                  rendererRef.current = gl;
                  canvasRef.current = gl.domElement;
                  
                  // Enregistrer dans le manager (sans nettoyer les autres - laisser React gérer)
                  WebGLContextManager.registerCanvas(gl.domElement, gl);
                  
                  // Logs de debug seulement en développement et une seule fois par session
                  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                    const sessionKey = '__substation3DAutoDebugLogged';
                    const debugLogged = sessionStorage.getItem(sessionKey);
                    if (!debugLogged) {
                      console.log('✅ Canvas créé !');
                      console.log('✅ Renderer:', gl);
                      console.log('✅ Caméra position:', camera.position);
                      console.log('✅ Scène:', scene.children.length, 'objets');
                      sessionStorage.setItem(sessionKey, 'true');
                      
                      // Vérifier la scène après un délai
                      setTimeout(() => {
                        if (scene.children.length === 0) {
                          console.warn('⚠️ La scène est vide - vérifier le chargement des composants');
                        }
                      }, 1000);
                    }
                  }

                  // Configuration du rendu
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 1.3;
                  if ('outputColorSpace' in gl) {
                    (gl as any).outputColorSpace = THREE.SRGBColorSpace;
                  }

                  // Gestion de la perte de contexte (ne pas nettoyer agressivement)
                  const handleContextLost = (event: Event) => {
                    event.preventDefault();
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('⚠️ Contexte WebGL perdu');
                    }
                  };

                  const handleContextRestored = () => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('✅ Contexte WebGL restauré');
                    }
                  };

                  gl.domElement.addEventListener('webglcontextlost', handleContextLost);
                  gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

                  // Fonction de nettoyage lors du démontage
                  const cleanup = () => {
                    gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
                    gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
                    WebGLContextManager.unregisterCanvas(gl.domElement);
                    WebGLContextManager.cleanupInstance(gl, gl.domElement);
                    rendererRef.current = null;
                    canvasRef.current = null;
                  };

                  cleanupFunctionRef.current = cleanup;
                  return cleanup;
                }}
              >
                {/* Précharger les textures communes */}
                <TexturePreloader />

                {/* Lumière de base - Simplifiée pour performance */}
                <ambientLight intensity={0.6} />

                {/* Éclairage */}
                <SceneLighting />

                {/* Sol sablonneux */}
                <SandyGround size={1000} position={[0, 0, 0]} />

                {/* Outil d'annotation 3D */}
                <AnnotationTool3D
                  enabled={annotationEnabled}
                  onAnnotationsChange={handleAnnotationsChange}
                  initialPoints={annotationPoints}
                  initialLines={annotationLines}
                  onPointUpdate={handleUpdatePoint}
                />


                  {/* Scène avec placement automatique */}
                <Suspense fallback={null}>
                  <AutoPlacedScene3D
                    onObjectClick={annotationEnabled || architecturalEditMode !== 'none' || selectionModeEnabled || equipmentPlacementMode !== 'none' || deleteModeEnabled ? undefined : handleObjectClick}
                    selectedObject={selectionModeEnabled ? (selectedObject?.id || null) : selectedSceneObject}
                    deletedObjects={deletedObjects}
                    onObjectRef={(id, ref) => {
                      if (ref?.current) {
                        objectRefsMap.current.set(id, ref.current);
                        // Ajouter userData.selectableId si ce n'est pas déjà fait
                        if (ref.current.userData) {
                          ref.current.userData.selectableId = id;
                        }
                      }
                    }}
                    objectPositions={sceneObjectPositions}
                    objectRotations={sceneObjectRotations}
                    objectScales={sceneObjectScales}
                    objectColors={sceneObjectColors}
                  />
                  
                  {/* Outil de suppression - actif quand le mode suppression est activé */}
                  {(() => {
                    const shouldRender = deleteModeEnabled && !annotationEnabled && !interactiveCalibrationEnabled && architecturalEditMode === 'none' && equipmentPlacementMode === 'none';
                    if (process.env.NODE_ENV === 'development') {
                      console.log('🔍 Condition rendu DeleteTool3D:', {
                        shouldRender,
                        deleteModeEnabled,
                        annotationEnabled,
                        interactiveCalibrationEnabled,
                        architecturalEditMode,
                        equipmentPlacementMode
                      });
                    }
                    return shouldRender ? (
                      <DeleteTool3D
                        enabled={deleteModeEnabled}
                        alwaysEnabled={false}
                        deletableObjects={deletableObjects}
                        onObjectSelect={(id) => {
                          console.log('🎯 Objet sélectionné pour suppression:', id);
                          setSelectedDeletableObject(id);
                        }}
                        selectedObjectId={selectedDeletableObject}
                        onDelete={(id) => {
                          console.log('🗑️ Suppression demandée:', id);
                          handleDeleteObject(id);
                        }}
                      />
                    ) : null;
                  })()}

                  {/* Calibrage GPS interactif */}
                  {interactiveCalibrationEnabled && !annotationEnabled && architecturalEditMode === 'none' && (
                    <InteractiveGpsCalibration
                      enabled={interactiveCalibrationEnabled}
                      gpsPoints={gpsPoints}
                      onPointCalibrated={handlePointCalibrated}
                      onComplete={() => {
                        setInteractiveCalibrationEnabled(false);
                        alert('Calibrage terminé ! Les points ont été mis à jour.');
                      }}
                      onCancel={() => {
                        setInteractiveCalibrationEnabled(false);
                        // Recharger les points originaux
                        fetch('/spline-positions.json')
                          .then((response) => response.json())
                          .then((points: GpsPoint[]) => {
                            setGpsPoints(points);
                          });
                      }}
                    />
                  )}

                  {/* Outils d'architecture - toujours actifs pour afficher les objets créés */}
                  {!annotationEnabled && !interactiveCalibrationEnabled && (
                    <>
                      {/* Éditeur de murs/portails */}
                      <SimpleWallEditor
                        editMode={architecturalEditMode === 'wall' || architecturalEditMode === 'portal' ? architecturalEditMode : 'none'}
                        walls={walls}
                        portals={portals}
                        onAddWall={handleAddWall}
                        onAddPortal={handleAddPortal}
                        onDeleteWall={handleDeleteWall}
                        onDeletePortal={handleDeletePortal}
                        onUpdateWall={handleUpdateWall}
                        onUpdatePortal={handleUpdatePortal}
                        selectedObjectId={selectedObject?.id || null}
                        onObjectSelect={(id) => {
                          if (id) {
                            const obj = selectableObjects.find(o => o.id === id);
                            setSelectedObject(obj || null);
                          } else {
                            setSelectedObject(null);
                          }
                        }}
                        onObjectRef={(id, ref) => {
                          if (ref?.current) {
                            objectRefsMap.current.set(id, ref.current);
                          }
                        }}
                      />

                      {/* Outil de création de lignes */}
                      <LineTool3D
                        editMode={architecturalEditMode === 'line' ? 'line' : 'none'}
                        lines={lines}
                        allObjects={allObjects}
                        onAddLine={handleAddArchitecturalLine}
                        onDeleteLine={handleDeleteArchitecturalLine}
                        snapDistance={1.0}
                        snapEnabled={intelligentAssistance}
                      />

                      {/* Outil de création de repères */}
                      <LandmarkTool3D
                        editMode={architecturalEditMode === 'landmark' ? 'landmark' : 'none'}
                        landmarks={landmarks}
                        allObjects={allObjects}
                        onAddLandmark={handleAddLandmark}
                        onDeleteLandmark={handleDeleteLandmark}
                        snapDistance={1.0}
                        snapEnabled={intelligentAssistance}
                      />
                    </>
                  )}

                  {/* Système de placement d'équipements - toujours actif pour afficher les équipements placés */}
                  <EquipmentPlacer
                    placementMode={equipmentPlacementMode}
                    placedEquipment={placedEquipment}
                    onPlaceEquipment={handlePlaceEquipment}
                    onMouseMove={setMousePosition}
                    alwaysRender={true}
                  />

                  {/* Visualiseurs d'alignement et symétrie */}
                  {intelligentAssistance && architecturalEditMode !== 'none' && (
                    <>
                      <AlignmentVisualizer
                        objects={allObjects}
                        lines={lines}
                        walls={walls}
                        enabled={intelligentAssistance}
                        toleranceDegrees={5}
                      />
                      <SymmetryVisualizer
                        objects={allObjects}
                        enabled={intelligentAssistance}
                      />
                      <AxisProposalSystem
                        objects={allObjects}
                        currentPosition={currentPosition}
                        enabled={intelligentAssistance}
                        maxProposals={3}
                      />
                    </>
                  )}

                  {/* Système de sélection d'objets */}
                  {selectionModeEnabled && (
                    <ObjectSelector
                      enabled={selectionModeEnabled}
                      onObjectSelect={setSelectedObject}
                      selectedObjectId={selectedObject?.id || null}
                      selectableObjects={selectableObjects}
                    />
                  )}

                  {/* Contrôles de transformation */}
                  {selectedObject && selectionModeEnabled && (
                    <TransformControls
                      selectedObject={selectedObject}
                      mode={transformMode}
                      onObjectUpdate={handleObjectUpdate}
                      objectRefs={objectRefsMap.current}
                    />
                  )}
                </Suspense>

                {/* Contrôleur de caméra pour les modes de vue */}
                <ViewModeCameraController viewMode={viewMode} duration={1500} />

                {/* Contrôles de caméra - optimisés pour performance */}
                <SceneControls
                  autoRotate={false}
                  minDistance={1}
                  maxDistance={Infinity}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                />

                {/* Environnement HDRI */}
                <EnvironmentHDRI />
              </Canvas>
            </div>
          </WebGLErrorBoundary>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Initialisation du rendu 3D...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
