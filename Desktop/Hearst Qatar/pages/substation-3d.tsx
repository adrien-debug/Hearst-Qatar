import Head from 'next/head';
import { useState, Suspense, useEffect, useRef, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import EnvironmentHDRI from '../components/3d/EnvironmentHDRI';
import SubstationSystem3D from '../components/3d/SubstationSystem3D';
import SceneControls from '../components/3d/SceneControls';
import SceneLighting from '../components/3d/Lighting';
import ViewModeSelector, { ViewMode } from '../components/3d/ViewModeSelector';
import WebGLErrorBoundary from '../components/3d/ErrorBoundary';
import SandyGround from '../components/3d/SandyGround';
import PerformanceMonitor3D from '../components/3d/PerformanceMonitor3D';
import AtmosphericEffects from '../components/3d/AtmosphericEffects';
import LODManager from '../components/3d/LODManager';
import { Scene3DConfig } from '../config/3d.config';
import * as THREE from 'three';
import { performanceMonitor } from '../utils/performanceMonitor';
import { qualityManager } from '../utils/qualityManager';
// Infrastructure VRD
import ConcreteWall3D from '../components/3d/ConcreteWall3D';
import EntranceGate3D from '../components/3d/EntranceGate3D';
import GuardHouse3D from '../components/3d/GuardHouse3D';
import Parking3D from '../components/3d/Parking3D';
import AsphaltRoad3D from '../components/3d/AsphaltRoad3D';
import SafetySignage3D from '../components/3d/SafetySignage3D';

// CODE SPLITTING : Lazy load du post-processing (chargé après le rendu initial)
const PostProcessing = lazy(() => import('../components/3d/PostProcessing'));

// Singleton global pour gérer les contextes WebGL
// Version améliorée pour gérer le hot reload de Next.js
const WebGLContextManager = {
  activeCanvas: null as HTMLCanvasElement | null,
  activeRenderer: null as any,
  allCanvases: new Set<HTMLCanvasElement>(),
  
  registerCanvas(canvas: HTMLCanvasElement, renderer: any) {
    // Si le même canvas est déjà enregistré, ne rien faire
    if (this.activeCanvas === canvas) {
      return;
    }
    
    // NETTOYER TOUS LES AUTRES CANVAS APRÈS avoir vérifié que ce n'est pas le même
    // Mais seulement si un autre canvas était actif
    if (this.activeCanvas && this.activeCanvas !== canvas) {
      this.cleanupAllOtherCanvases(canvas);
    }
    
    // Enregistrer le nouveau contexte
    this.activeCanvas = canvas;
    this.activeRenderer = renderer;
    this.allCanvases.add(canvas);
    
    // Stocker le renderer sur le canvas pour référence future
    (canvas as any).__r3f = renderer;
  },
  
  unregisterCanvas(canvas: HTMLCanvasElement) {
    if (this.activeCanvas === canvas) {
      this.activeCanvas = null;
      this.activeRenderer = null;
    }
    this.allCanvases.delete(canvas);
  },
  
  cleanupInstance(renderer: any, canvas: HTMLCanvasElement) {
    if (!renderer || !canvas) return;
    
    try {
      // Nettoyer la scène si disponible
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
      
      // Nettoyer le renderer
      if (renderer.dispose) {
        renderer.dispose();
      }
      
      // Forcer la perte de contexte WebGL
      const context = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (context && 'getExtension' in context) {
        const loseContext = (context as any).getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    } catch (e) {
      // Ignorer les erreurs de nettoyage
    }
  },
  
  cleanupAll() {
    // Nettoyer uniquement l'instance active
    if (this.activeRenderer && this.activeCanvas) {
      this.cleanupInstance(this.activeRenderer, this.activeCanvas);
      this.activeCanvas = null;
      this.activeRenderer = null;
    }
  },
  
  // NOUVELLE MÉTHODE : Nettoyer TOUS les autres canvas (sauf celui passé en paramètre)
  // IMPORTANT : Ne pas appeler getContext() car cela peut créer un nouveau contexte
  cleanupAllOtherCanvases(currentCanvas: HTMLCanvasElement | null) {
    if (typeof document === 'undefined') return;
    
    try {
      // Trouver tous les canvas dans le document
      const allCanvases = Array.from(document.querySelectorAll('canvas'));
      
      allCanvases.forEach((canvas) => {
        // Ignorer le canvas actuel
        if (canvas === currentCanvas) {
          return;
        }
        
        try {
          // Essayer d'obtenir le contexte existant SANS en créer un nouveau
          // Utiliser une approche qui ne crée pas de contexte
          const context = (canvas as any).__webglContext;
          
          // Si pas de contexte stocké, essayer de le récupérer depuis le renderer Three.js
          if (!context) {
            // Chercher si ce canvas a un renderer Three.js associé
            const renderer = (canvas as any).__r3f;
            if (renderer && renderer.getContext) {
              const ctx = renderer.getContext();
              if (ctx && 'getExtension' in ctx) {
                const loseContext = (ctx as any).getExtension('WEBGL_lose_context');
                if (loseContext) {
                  loseContext.loseContext();
                }
              }
            }
          } else if (context && 'getExtension' in context) {
            // Forcer la perte de contexte
            const loseContext = (context as any).getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        } catch (e) {
          // Ignorer les erreurs individuelles
        }
      });
    } catch (e) {
      // Ignorer les erreurs globales
    }
  }
};

// NETTOYAGE GLOBAL au chargement du module (pour gérer le hot reload)
// Version améliorée qui ne crée pas de nouveaux contextes
if (typeof window !== 'undefined') {
  // Fonction de nettoyage qui ne crée PAS de nouveaux contextes
  const cleanupAllWebGLContexts = () => {
    try {
      const allCanvases = Array.from(document.querySelectorAll('canvas'));
      let cleanedCount = 0;
      
      allCanvases.forEach((canvas) => {
        try {
          // Essayer d'obtenir le contexte existant SANS en créer un nouveau
          // Utiliser le renderer Three.js stocké si disponible
          const renderer = (canvas as any).__r3f;
          if (renderer && renderer.getContext) {
            try {
              const context = renderer.getContext();
              if (context && 'getExtension' in context) {
                const loseContext = (context as any).getExtension('WEBGL_lose_context');
                if (loseContext) {
                  loseContext.loseContext();
                  cleanedCount++;
                }
              }
            } catch (e) {
              // Ignorer les erreurs
            }
          } else {
            // Fallback : utiliser le contexte stocké directement
            const context = (canvas as any).__webglContext;
            if (context && 'getExtension' in context) {
              const loseContext = (context as any).getExtension('WEBGL_lose_context');
              if (loseContext) {
                loseContext.loseContext();
                cleanedCount++;
              }
            }
          }
        } catch (e) {
          // Ignorer les erreurs individuelles
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`🧹 Nettoyé ${cleanedCount} contexte(s) WebGL`);
      }
    } catch (e) {
      // Ignorer les erreurs globales
    }
  };
  
  // Nettoyer immédiatement (mais seulement les contextes existants)
  setTimeout(cleanupAllWebGLContexts, 100);
  
  // Intercepter les warnings de contextes multiples et nettoyer immédiatement
  const originalConsoleWarn = console.warn;
  console.warn = function(...args: any[]) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Too many active WebGL contexts')) {
      // Nettoyer immédiatement si on détecte le warning
      setTimeout(cleanupAllWebGLContexts, 0);
    }
    originalConsoleWarn.apply(console, args);
  };
  
  // Nettoyer aussi lors des événements de hot reload
  window.addEventListener('beforeunload', cleanupAllWebGLContexts);
  
  // Nettoyer périodiquement (toutes les 10 secondes) pour éviter l'accumulation
  setInterval(() => {
    const canvasCount = document.querySelectorAll('canvas').length;
    if (canvasCount > 1) {
      cleanupAllWebGLContexts();
    }
  }, 10000);
}


interface SelectedObjectInfo {
  name: string;
  type: string;
  position: { x: number; y: number };
}

// Désactiver Fast Refresh pour cette page (évite les problèmes de contextes WebGL multiples)
// @ts-ignore
if (typeof module !== 'undefined' && module.hot) {
  // @ts-ignore
  module.hot.decline();
}

export default function Substation3DPage() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [objectInfo, setObjectInfo] = useState<SelectedObjectInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [mounted, setMounted] = useState(false);
  
  // Clé unique qui change à chaque hot reload pour forcer la destruction complète
  // Utiliser un timestamp pour forcer la recréation lors du hot reload
  const canvasKeyRef = useRef<string>(`substation-3d-canvas-${Date.now()}`);
  const rendererRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Protection contre les doubles montages en React Strict Mode
  const isMountedRef = useRef(false);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  
  // Compteur de montages pour détecter les hot reloads
  const mountCountRef = useRef(0);

  // Éviter le rendu côté serveur et les problèmes de hot reload
  useEffect(() => {
    mountCountRef.current += 1;
    const currentMount = mountCountRef.current;
    
    // NETTOYER TOUS LES CANVAS EXISTANTS AVANT de monter (pour hot reload)
    if (typeof window !== 'undefined') {
      // Nettoyer de manière agressive tous les canvas WebGL
      const allCanvases = Array.from(document.querySelectorAll('canvas'));
      allCanvases.forEach((canvas) => {
        try {
          const context = canvas.getContext('webgl') || canvas.getContext('webgl2');
          if (context && 'getExtension' in context) {
            const loseContext = (context as any).getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        } catch (e) {
          // Ignorer
        }
      });
    }
    
    // Ignorer les doubles montages en développement (React Strict Mode)
    // Mais permettre le remontage lors du hot reload (mountCount change)
    if (isMountedRef.current && currentMount === 1) {
      return;
    }
    isMountedRef.current = true;
    
    // Forcer une nouvelle clé pour le Canvas lors du hot reload
    if (currentMount > 1) {
      canvasKeyRef.current = `substation-3d-canvas-${Date.now()}`;
    }
    
    setMounted(true);
    
    return () => {
      // Nettoyage complet lors du démontage
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
      
      // Nettoyer tous les autres canvas restants
      if (typeof window !== 'undefined') {
        const allCanvases = Array.from(document.querySelectorAll('canvas'));
        allCanvases.forEach((canvas) => {
          try {
            const context = canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (context && 'getExtension' in context) {
              const loseContext = (context as any).getExtension('WEBGL_lose_context');
              if (loseContext) {
                loseContext.loseContext();
              }
            }
          } catch (e) {
            // Ignorer
          }
        });
      }
      
      isMountedRef.current = false;
      setMounted(false);
    };
  }, []); // Tableau de dépendances vide - s'exécute une seule fois au montage

  const handleObjectClick = (objectName: string) => {
    setSelectedObject(objectName);
    
    // Déterminer le type et le nom d'affichage
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
    } else if (objectName.includes('SG_')) {
      typeName = 'Switchgear';
      displayName = objectName.replace(/_/g, ' ');
    } else if (objectName.includes('HD5')) {
      typeName = 'Container HD5';
      displayName = objectName.replace(/_/g, ' ');
    }
    
    setObjectInfo({
      name: displayName,
      type: typeName,
      position: { x: 0, y: 0 }
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <>
      <Head>
        <title>Visualisation 3D - Substation 200 MW</title>
        <meta name="description" content="Visualisation 3D interactive de la ferme énergétique" />
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50" style={{ margin: 0, padding: 0 }}>
        {/* Panneau d'information */}
        {objectInfo && (
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-lg mb-2">{objectInfo.type}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Nom:</span> {objectInfo.name}
            </p>
            <button
              onClick={() => {
                setSelectedObject(null);
                setObjectInfo(null);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Sélecteur de mode de vue */}
        <div className="absolute top-4 right-4 z-10">
          <ViewModeSelector 
            currentMode={viewMode} 
            onModeChange={handleViewModeChange} 
          />
        </div>

        {/* Contrôles */}
        <div className="absolute top-24 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-sm mb-2">Contrôles</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>🖱️ Clic gauche: Rotation</li>
            <li>🖱️ Clic droit: Pan</li>
            <li>🖱️ Molette: Zoom</li>
            <li>🖱️ Clic sur objet: Sélection</li>
          </ul>
        </div>

        {/* Statistiques */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-bold text-sm mb-2">Structure Industrielle</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>1 Substation 200 MW</li>
            <li>4 Power Blocks</li>
            <li>24 Transformateurs</li>
            <li>24 Switchgears</li>
            <li>48 Containers HD5</li>
          </ul>
        </div>

        {/* Canvas 3D - Un seul Canvas à la fois */}
        {mounted && (
          <>
            <WebGLErrorBoundary>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Canvas
            key={canvasKeyRef.current}
            camera={{ 
              position: [0, 150, 200], // Vue d'ensemble : plus haute (Y=150) et plus éloignée (Z=200) pour voir toute la scène avec un léger zoom arrière
              fov: Scene3DConfig.camera.fov,
              near: 0.1,
              far: 2000
            }}
            shadows={true}
            style={{ width: '100%', height: '100%', display: 'block' }}
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
              preserveDrawingBuffer: false,
              logarithmicDepthBuffer: false, // Désactivé pour performance
            }}
            dpr={Math.min(window.devicePixelRatio, 1.5)} // Réduit pour meilleure performance
            frameloop="demand" // Rendu seulement quand nécessaire - OPTIMISATION PERFORMANCE
            onCreated={({ gl, scene, camera }) => {
              // Enregistrer le renderer et canvas
              rendererRef.current = gl;
              canvasRef.current = gl.domElement;
              
              // Enregistrer dans le manager (va nettoyer automatiquement les anciens contextes)
              // IMPORTANT : Ne pas nettoyer AVANT car le renderer vient d'être créé
              WebGLContextManager.registerCanvas(gl.domElement, gl);
              
              // Initialiser le monitoring de performance
              performanceMonitor.init(gl);
              
              // Obtenir les paramètres de qualité
              const qualitySettings = qualityManager.getSettings();
              
              // Nettoyer tous les matériaux de la scène pour éviter les textures null
              scene.traverse((obj: any) => {
                if (obj.material) {
                  const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                  materials.forEach((mat: any) => {
                    if (mat && mat.type === 'MeshStandardMaterial') {
                      // S'assurer qu'aucune texture n'est null
                      const textureProps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'];
                      textureProps.forEach(prop => {
                        if (mat[prop] === null) {
                          mat[prop] = undefined;
                        }
                      });
                      mat.needsUpdate = true;
                    }
                  });
                }
              });
              
              // Appliquer les paramètres de qualité
              qualityManager.applyToRenderer(gl);
              
              // Configurer le rendu
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.3;
              if ('outputColorSpace' in gl) {
                (gl as any).outputColorSpace = THREE.SRGBColorSpace;
              } else {
                (gl as any).outputEncoding = THREE.sRGBEncoding;
              }
              
              // Les ombres sont configurées par qualityManager
              
              // Pixel ratio est configuré par qualityManager
              
              // Activer les extensions avancées si disponibles
              const extensions = gl.getContext().getExtension('EXT_texture_filter_anisotropic');
              if (extensions) {
                const maxAnisotropy = gl.getContext().getParameter(extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.capabilities.getMaxAnisotropy = () => maxAnisotropy;
              }
              
              // Gérer la perte de contexte WebGL
              const handleContextLost = (event: Event) => {
                event.preventDefault();
                console.warn('⚠️ Contexte WebGL perdu, tentative de récupération...');
              };
              
              const handleContextRestored = () => {
                console.log('✅ Contexte WebGL restauré');
                try {
                  // Réinitialiser les shaders après restauration du contexte
                  const programs = (gl as any).programs;
                  if (programs) {
                    programs.clear();
                  }
                  
                  // Réinitialiser les matériaux
                  scene.traverse((obj: any) => {
                    if (obj.material) {
                      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                      materials.forEach((mat: any) => {
                        if (mat) {
                          mat.needsUpdate = true;
                          // Réinitialiser les uniforms null
                          if (mat.uniforms) {
                            Object.keys(mat.uniforms).forEach((uniformName) => {
                              const uniform = mat.uniforms[uniformName];
                              if (uniform && uniform.value === null) {
                                if (uniform.type === 't') {
                                  uniform.value = new THREE.Texture();
                                } else if (uniform.type === 'v2' || uniform.type === 'v3' || uniform.type === 'v4') {
                                  uniform.value = uniform.type === 'v2' ? new THREE.Vector2() :
                                                 uniform.type === 'v3' ? new THREE.Vector3() : new THREE.Vector4();
                                } else {
                                  uniform.value = 0;
                                }
                              }
                            });
                          }
                        }
                      });
                    }
                  });
                } catch (e) {
                  // Ignorer les erreurs de réinitialisation
                }
              };
              
              gl.domElement.addEventListener('webglcontextlost', handleContextLost);
              gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
              
              // Retourner la fonction de nettoyage qui sera appelée lors du démontage
              const cleanup = () => {
                gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
                gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
                
                // Désenregistrer du manager
                WebGLContextManager.unregisterCanvas(gl.domElement);
                
                // Nettoyer le contexte WebGL de cette instance
                WebGLContextManager.cleanupInstance(gl, gl.domElement);
                
                // Nettoyer les références
                rendererRef.current = null;
                canvasRef.current = null;
              };
              
              // Stocker la fonction de nettoyage pour le useEffect
              cleanupFunctionRef.current = cleanup;
              
              return cleanup;
            }}
          >
            {/* Monitoring de performance - OPTIMISATION */}
            <PerformanceMonitor3D />

            {/* LOD Manager - Optimisation pour objets distants */}
            <LODManager />

            {/* Effets atmosphériques (fog) */}
            <AtmosphericEffects />

            {/* Éclairage optimisé désertique */}
            <SceneLighting />

            {/* Sol sablonneux - Base du site (rendu en premier pour être visible) */}
            <SandyGround size={1000} position={[0, 0, 0]} />

            {/* ==================== INFRASTRUCTURE VRD ==================== */}
            
            {/* Mur d'enceinte en béton */}
            <ConcreteWall3D
              center={Scene3DConfig.layout.vrd.concreteWall.center}
              width={Scene3DConfig.layout.vrd.concreteWall.width}
              depth={Scene3DConfig.layout.vrd.concreteWall.depth}
              height={Scene3DConfig.layout.vrd.concreteWall.height}
              thickness={Scene3DConfig.layout.vrd.concreteWall.thickness}
              gatePosition={Scene3DConfig.layout.vrd.concreteWall.gatePosition}
              gateWidth={Scene3DConfig.layout.vrd.concreteWall.gateWidth}
            />

            {/* Portail d'entrée principal */}
            <EntranceGate3D
              position={Scene3DConfig.layout.vrd.entranceGate.position}
              width={Scene3DConfig.layout.vrd.entranceGate.width}
              height={Scene3DConfig.layout.vrd.entranceGate.height}
              isOpen={Scene3DConfig.layout.vrd.entranceGate.isOpen}
            />

            {/* Poste de garde */}
            <GuardHouse3D
              position={Scene3DConfig.layout.vrd.guardHouse.position}
              rotation={Scene3DConfig.layout.vrd.guardHouse.rotation}
            />

            {/* Parking professionnel */}
            <Parking3D
              position={Scene3DConfig.layout.vrd.parking.position}
              width={Scene3DConfig.layout.vrd.parking.width}
              depth={Scene3DConfig.layout.vrd.parking.depth}
              rows={Scene3DConfig.layout.vrd.parking.rows}
              spotsPerRow={Scene3DConfig.layout.vrd.parking.spotsPerRow}
            />

            {/* Routes - Externe (asphalte) */}
            <AsphaltRoad3D
              position={Scene3DConfig.layout.vrd.roads.external.position}
              length={Scene3DConfig.layout.vrd.roads.external.length}
              width={Scene3DConfig.layout.vrd.roads.external.width}
              orientation={Scene3DConfig.layout.vrd.roads.external.orientation}
              material={Scene3DConfig.layout.vrd.roads.external.material}
              showCenterLine={Scene3DConfig.layout.vrd.roads.external.showCenterLine}
              showEdgeLines={Scene3DConfig.layout.vrd.roads.external.showEdgeLines}
            />

            {/* Route interne (béton) */}
            <AsphaltRoad3D
              position={Scene3DConfig.layout.vrd.roads.internal.position}
              length={Scene3DConfig.layout.vrd.roads.internal.length}
              width={Scene3DConfig.layout.vrd.roads.internal.width}
              orientation={Scene3DConfig.layout.vrd.roads.internal.orientation}
              material={Scene3DConfig.layout.vrd.roads.internal.material}
              showCenterLine={Scene3DConfig.layout.vrd.roads.internal.showCenterLine}
              showEdgeLines={Scene3DConfig.layout.vrd.roads.internal.showEdgeLines}
            />

            {/* Route d'accès au parking */}
            <AsphaltRoad3D
              position={Scene3DConfig.layout.vrd.roads.parkingAccess.position}
              length={Scene3DConfig.layout.vrd.roads.parkingAccess.length}
              width={Scene3DConfig.layout.vrd.roads.parkingAccess.width}
              orientation={Scene3DConfig.layout.vrd.roads.parkingAccess.orientation}
              material={Scene3DConfig.layout.vrd.roads.parkingAccess.material}
              showCenterLine={Scene3DConfig.layout.vrd.roads.parkingAccess.showCenterLine}
              showEdgeLines={Scene3DConfig.layout.vrd.roads.parkingAccess.showEdgeLines}
            />

            {/* Signalétique de sécurité */}
            {Scene3DConfig.layout.vrd.signage.map((sign, index) => (
              <SafetySignage3D
                key={`signage-${index}`}
                position={sign.position}
                type={sign.type}
                direction={sign.direction}
                text={sign.text}
              />
            ))}

            {/* Système Substation complet */}
            <Suspense fallback={null}>
              <SubstationSystem3D 
                onObjectClick={handleObjectClick} 
                selectedObject={selectedObject}
              />
            </Suspense>

            {/* Contrôles de caméra - Navigation libre sans restrictions */}
            <SceneControls
              autoRotate={false}
              minDistance={1}
              maxDistance={Infinity}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />

            {/* Environnement HDRI désertique */}
            <EnvironmentHDRI />
            
            {/* Post-processing - Chargé de manière lazy après le rendu initial */}
            <Suspense fallback={null}>
              <PostProcessing />
            </Suspense>
            
            {/* Grille désactivée pour voir le sol sablonneux */}
            {/* <SceneGridHelper /> */}
            {/* Note: La grille est désactivée. Si vous voyez encore une grille, elle vient peut-être du sol sablonneux ou d'un autre élément */}
          </Canvas>
            </div>
          </WebGLErrorBoundary>
          </>
        )}
        {!mounted && (
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

