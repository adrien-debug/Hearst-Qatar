import Head from 'next/head';
import { useState, useEffect, Suspense, useRef, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import AutoPlacedScene3D from '../components/3d/AutoPlacedScene3D';
import SceneControls from '../components/3d/SceneControls';
import SceneLighting from '../components/3d/Lighting';
import ViewModeSelector, { ViewMode } from '../components/3d/ViewModeSelector';
import WebGLErrorBoundary from '../components/3d/ErrorBoundary';
import SandyGround from '../components/3d/SandyGround';
import EnvironmentHDRI from '../components/3d/EnvironmentHDRI';
import TexturePreloader from '../components/3d/TexturePreloader';
import { Scene3DConfig } from '../config/3d.config';
import { texturePreloader } from '../utils/texturePreloader';
import { cleanupOptimalTextureSizeCache } from '../utils/textureCache';
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
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [objectInfo, setObjectInfo] = useState<SelectedObjectInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [mounted, setMounted] = useState(false);
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
      console.log('✅ Page Substation3DAutoPage montée');
    } else {
      // Si window n'est pas disponible, monter immédiatement
      setMounted(true);
      console.log('✅ Page Substation3DAutoPage montée (SSR)');
    }
    
    // Nettoyage uniquement lors du démontage
    return () => {
      console.log('🧹 Nettoyage de la page 3D...');
      
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
      console.log('✅ Cache de textures nettoyé');
      
      // Nettoyer le contexte WebGL utilisé pour détecter la taille optimale
      cleanupOptimalTextureSizeCache();
      
      isMountedRef.current = false;
      setMounted(false);
    };
  }, []);

  const handleObjectClick = (objectName: string) => {
    setSelectedObject(objectName);

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

  return (
    <>
      <Head>
        <title>Visualisation 3D Auto - Substation 200 MW</title>
        <meta name="description" content="Visualisation 3D interactive avec placement automatique" />
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Mode:</span> Placement Automatique
            </p>
          </div>
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-green-600 font-semibold">
              ✅ Placement automatique activé
            </p>
          </div>
        </div>

        {/* Canvas 3D */}
        {mounted ? (
          <WebGLErrorBoundary>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Canvas
                key={canvasKeyRef.current}
                camera={{
                  position: [0, 100, -250],
                  fov: 50,
                  near: 0.1,
                  far: 2000,
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
                  logarithmicDepthBuffer: false,
                }}
                dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
                frameloop="always"
                onCreated={({ gl, scene, camera }) => {
                  // Enregistrer le renderer et canvas
                  rendererRef.current = gl;
                  canvasRef.current = gl.domElement;
                  
                  // Enregistrer dans le manager (sans nettoyer les autres - laisser React gérer)
                  WebGLContextManager.registerCanvas(gl.domElement, gl);
                  
                  console.log('✅ Canvas créé !');
                  console.log('✅ Renderer:', gl);
                  console.log('✅ Caméra position:', camera.position);
                  console.log('✅ Scène:', scene.children.length, 'objets');
                  
                  // Vérifier la scène après un délai
                  setTimeout(() => {
                    console.log('🔍 Après 1 seconde - Scène:', scene.children.length, 'objets');
                    if (scene.children.length === 0) {
                      console.warn('⚠️ La scène est vide - vérifier le chargement des composants');
                    }
                  }, 1000);

                  // Configuration du rendu
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 1.3;
                  if ('outputColorSpace' in gl) {
                    (gl as any).outputColorSpace = THREE.SRGBColorSpace;
                  } else {
                    (gl as any).outputEncoding = THREE.sRGBEncoding;
                  }

                  // Gestion de la perte de contexte (ne pas nettoyer agressivement)
                  const handleContextLost = (event: Event) => {
                    event.preventDefault();
                    console.warn('⚠️ Contexte WebGL perdu');
                  };

                  const handleContextRestored = () => {
                    console.log('✅ Contexte WebGL restauré');
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

                {/* Lumière de base */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, 10, -10]} intensity={0.5} />

                {/* Éclairage */}
                <SceneLighting />

                {/* Sol sablonneux */}
                <SandyGround size={1000} position={[0, 0, 0]} />

                {/* Scène avec placement automatique */}
                <Suspense fallback={null}>
                  <AutoPlacedScene3D
                    onObjectClick={handleObjectClick}
                    selectedObject={selectedObject}
                  />
                </Suspense>

                {/* Contrôles de caméra */}
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
