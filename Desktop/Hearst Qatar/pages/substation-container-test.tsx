import Head from 'next/head';
import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import SubstationContainer3D from '../components/3d/SubstationContainer3D';
import SceneControls from '../components/3d/SceneControls';
import SceneLighting from '../components/3d/Lighting';
import SceneGridHelper from '../components/3d/GridHelper';
import CameraController from '../components/3d/CameraController';
import WebGLErrorBoundary from '../components/3d/ErrorBoundary';
import SandyGround from '../components/3d/SandyGround';
import * as THREE from 'three';

// Singleton global pour gérer les contextes WebGL
const WebGLContextManager = {
  activeCanvas: null as HTMLCanvasElement | null,
  activeRenderer: null as any,
  
  registerCanvas(canvas: HTMLCanvasElement, renderer: any) {
    // Si un contexte est déjà actif, nettoyer uniquement celui-ci
    if (this.activeCanvas && this.activeCanvas !== canvas) {
      this.cleanupInstance(this.activeRenderer, this.activeCanvas);
    }
    
    // Enregistrer le nouveau contexte
    this.activeCanvas = canvas;
    this.activeRenderer = renderer;
  },
  
  unregisterCanvas(canvas: HTMLCanvasElement) {
    if (this.activeCanvas === canvas) {
      this.activeCanvas = null;
      this.activeRenderer = null;
    }
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
    // Nettoyer uniquement l'instance active, pas tous les canvas du document
    if (this.activeRenderer && this.activeCanvas) {
      this.cleanupInstance(this.activeRenderer, this.activeCanvas);
      this.activeCanvas = null;
      this.activeRenderer = null;
    }
  }
};

export default function SubstationContainerTestPage() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const rendererRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(false);

  // Éviter le rendu côté serveur
  useEffect(() => {
    // Ignorer les doubles montages en développement (React Strict Mode)
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
    
    setMounted(true);
    
    return () => {
      // Nettoyage uniquement lors du vrai démontage
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
      
      isMountedRef.current = false;
      setMounted(false);
    };
  }, []);

  const handleObjectClick = (objectName: string) => {
    setSelectedObject(objectName);
  };

  return (
    <>
      <Head>
        <title>Test - Conteneur de Base avec Sous-station</title>
        <meta name="description" content="Test de visualisation 3D du conteneur de base avec sous-station" />
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50" style={{ margin: 0, padding: 0 }}>
        {/* Panneau d'information */}
        {selectedObject && (
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-lg mb-2">Conteneur de Base + Sous-station</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">ID:</span> {selectedObject}
            </p>
            <button
              onClick={() => {
                setSelectedObject(null);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Contrôles */}
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-sm mb-2">Contrôles</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>🖱️ Clic gauche: Rotation</li>
            <li>🖱️ Clic droit: Pan</li>
            <li>🖱️ Molette: Zoom</li>
            <li>🖱️ Clic sur objet: Sélection</li>
          </ul>
        </div>

        {/* Canvas 3D */}
        {mounted && (
          <WebGLErrorBoundary>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Canvas
                camera={{ position: [0, 10, 20], fov: 50 }}
                shadows={true}
                style={{ width: '100%', height: '100%', display: 'block' }}
                gl={{ 
                  antialias: true, 
                  alpha: false,
                  powerPreference: 'high-performance',
                  stencil: false,
                  depth: true,
                  preserveDrawingBuffer: false,
                }}
                dpr={Math.min(window.devicePixelRatio, 2)}
                frameloop="always"
                onCreated={({ gl, scene, camera }) => {
                  // Enregistrer le renderer et canvas
                  rendererRef.current = gl;
                  canvasRef.current = gl.domElement;
                  
                  // Enregistrer dans le manager
                  WebGLContextManager.registerCanvas(gl.domElement, gl);
                  
                  // Configurer le rendu
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 1.2;
                  if ('outputColorSpace' in gl) {
                    (gl as any).outputColorSpace = THREE.SRGBColorSpace;
                  }
                  
                  // Configurer les ombres
                  gl.shadowMap.enabled = true;
                  gl.shadowMap.type = THREE.PCFSoftShadowMap;
                  
                  // Gérer la perte de contexte WebGL
                  const handleContextLost = (event: Event) => {
                    event.preventDefault();
                    console.warn('⚠️ Contexte WebGL perdu');
                  };
                  
                  const handleContextRestored = () => {
                    console.log('✅ Contexte WebGL restauré');
                  };
                  
                  gl.domElement.addEventListener('webglcontextlost', handleContextLost);
                  gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
                  
                  // Retourner la fonction de nettoyage
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
                {/* Éclairage optimisé désertique */}
                <SceneLighting />

                {/* Sol sablonneux */}
                <SandyGround size={100} position={[0, 0, 0]} />

                {/* Conteneur de base avec sous-station */}
                <Suspense fallback={null}>
                  <SubstationContainer3D 
                    position={[0, 0, 0]}
                    containerId="SUBSTATION_CONTAINER_001"
                    onSelect={handleObjectClick}
                    isSelected={selectedObject === "SUBSTATION_CONTAINER_001"}
                  />
                </Suspense>

                {/* Contrôles de caméra */}
                <SceneControls
                  autoRotate={false}
                  minDistance={5}
                  maxDistance={100}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                />

                {/* Environnement */}
                <Environment preset="sunset" />
                
                {/* Grille et axes de référence */}
                <SceneGridHelper />
              </Canvas>
            </div>
          </WebGLErrorBoundary>
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
