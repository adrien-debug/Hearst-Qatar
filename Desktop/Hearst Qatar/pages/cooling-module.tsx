import Head from 'next/head';
import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import CoolingModule3D from '../components/3d/CoolingModule3D';
import SceneControls from '../components/3d/SceneControls';
import SceneLighting from '../components/3d/Lighting';
import WebGLErrorBoundary from '../components/3d/ErrorBoundary';
import SandyGround from '../components/3d/SandyGround';
import PerformanceMonitor3D from '../components/3d/PerformanceMonitor3D';
import { Scene3DConfig } from '../config/3d.config';
import * as THREE from 'three';
import { performanceMonitor } from '../utils/performanceMonitor';
import { qualityManager } from '../utils/qualityManager';
import { CoolingModule } from '../data/hardwareMock';

// Singleton global pour gérer les contextes WebGL
const WebGLContextManager = {
  activeCanvas: null as HTMLCanvasElement | null,
  activeRenderer: null as any,
  
  registerCanvas(canvas: HTMLCanvasElement, renderer: any) {
    if (this.activeCanvas === canvas) {
      return;
    }
    
    if (this.activeCanvas && this.activeCanvas !== canvas && this.activeRenderer) {
      try {
        this.cleanupInstance(this.activeRenderer, this.activeCanvas);
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }
    }
    
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
    if (this.activeRenderer && this.activeCanvas) {
      this.cleanupInstance(this.activeRenderer, this.activeCanvas);
      this.activeCanvas = null;
      this.activeRenderer = null;
    }
  }
};

// Données mock pour le module de refroidissement
const mockCoolingModule: CoolingModule = {
  id: 'CM-1-1',
  type: 'Hydro Cooling Module',
  coolingCapacitykW: 3250,
  flowRate: '175 L/min',
  temperatureIn: 27,
  temperatureOut: 19,
  status: 'OK',
  efficiency: 92,
};

export default function CoolingModulePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [coolingData, setCoolingData] = useState<CoolingModule>(mockCoolingModule);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'close' | 'technical'>('overview');
  
  const canvasKeyRef = useRef<string>('cooling-module-canvas');
  const rendererRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const isMountedRef = useRef(false);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
    setMounted(true);
    
    return () => {
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

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  // Calculer la position de la caméra selon le mode de vue
  const getCameraPosition = () => {
    switch (viewMode) {
      case 'close':
        return [0, 8, 15]; // Vue rapprochée
      case 'technical':
        return [15, 10, 15]; // Vue technique (angle)
      case 'overview':
      default:
        return [0, 15, 25]; // Vue d'ensemble
    }
  };

  return (
    <>
      <Head>
        <title>Module de Refroidissement - Visualisation 3D</title>
        <meta name="description" content="Visualisation 3D interactive du module de refroidissement pour container HD5" />
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50" style={{ margin: 0, padding: 0 }}>
        {/* Panneau d'information du module */}
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-6 max-w-sm">
          <h3 className="font-bold text-xl mb-4 text-gray-800">Module de Refroidissement</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold text-gray-600">Type:</span>
              <span className="ml-2 text-gray-800">{coolingData.type}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Capacité:</span>
              <span className="ml-2 text-gray-800">{coolingData.coolingCapacitykW} kW</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Débit:</span>
              <span className="ml-2 text-gray-800">{coolingData.flowRate}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Température entrée:</span>
              <span className="ml-2 text-gray-800">{coolingData.temperatureIn}°C</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Température sortie:</span>
              <span className="ml-2 text-gray-800">{coolingData.temperatureOut}°C</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Efficacité:</span>
              <span className="ml-2 text-gray-800">{coolingData.efficiency}%</span>
            </div>
            <div className="pt-2 border-t">
              <span className="font-semibold text-gray-600">Statut:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                coolingData.status === 'OK' ? 'bg-green-100 text-green-800' :
                coolingData.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {coolingData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Sélecteur de vue */}
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-bold text-sm mb-3 text-gray-800">Mode de Vue</h3>
          <div className="space-y-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`w-full px-3 py-2 rounded text-sm ${
                viewMode === 'overview' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setViewMode('close')}
              className={`w-full px-3 py-2 rounded text-sm ${
                viewMode === 'close' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vue rapprochée
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`w-full px-3 py-2 rounded text-sm ${
                viewMode === 'technical' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vue technique
            </button>
          </div>
        </div>

        {/* Contrôles */}
        <div className="absolute top-24 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-sm mb-2 text-gray-800">Contrôles</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>🖱️ Clic gauche: Rotation</li>
            <li>🖱️ Clic droit: Pan</li>
            <li>🖱️ Molette: Zoom</li>
            <li>🖱️ Clic sur module: Sélection</li>
          </ul>
        </div>

        {/* Spécifications techniques */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-bold text-sm mb-2 text-gray-800">Spécifications Techniques</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>📐 Dimensions: 12.2m × 2.4m × 2.9m</li>
            <li>❄️ Système: Refroidissement hydro</li>
            <li>🌀 Radiateur en V avec ailettes</li>
            <li>💨 6 ventilateurs sur le dessus</li>
            <li>🔍 Côtés transparents pour inspection</li>
            <li>⚡ Ventilateurs intégrés</li>
            <li>🔧 Panneau de contrôle LCD</li>
          </ul>
        </div>

        {/* Canvas 3D */}
        {mounted && (
          <>
            <WebGLErrorBoundary>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Canvas
                  key={canvasKeyRef.current}
                  camera={{ 
                    position: getCameraPosition() as [number, number, number],
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
                    logarithmicDepthBuffer: false,
                  }}
                  dpr={Math.min(window.devicePixelRatio, 1.5)}
                  frameloop="demand"
                  onCreated={({ gl, scene, camera }) => {
                    rendererRef.current = gl;
                    canvasRef.current = gl.domElement;
                    
                    WebGLContextManager.registerCanvas(gl.domElement, gl);
                    
                    performanceMonitor.init(gl);
                    
                    const qualitySettings = qualityManager.getSettings();
                    
                    scene.traverse((obj: any) => {
                      if (obj.material) {
                        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                        materials.forEach((mat: any) => {
                          if (mat && mat.type === 'MeshStandardMaterial') {
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
                    
                    qualityManager.applyToRenderer(gl);
                    
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.3;
                    if ('outputColorSpace' in gl) {
                      (gl as any).outputColorSpace = THREE.SRGBColorSpace;
                    }
                    
                    const extensions = gl.getContext().getExtension('EXT_texture_filter_anisotropic');
                    if (extensions) {
                      const maxAnisotropy = gl.getContext().getParameter(extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                      gl.capabilities.getMaxAnisotropy = () => maxAnisotropy;
                    }
                    
                    const handleContextLost = (event: Event) => {
                      event.preventDefault();
                      console.warn('⚠️ Contexte WebGL perdu, tentative de récupération...');
                    };
                    
                    const handleContextRestored = () => {
                      console.log('✅ Contexte WebGL restauré');
                      try {
                        const programs = (gl as any).programs;
                        if (programs) {
                          programs.clear();
                        }
                        
                        scene.traverse((obj: any) => {
                          if (obj.material) {
                            const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                            materials.forEach((mat: any) => {
                              if (mat) {
                                mat.needsUpdate = true;
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
                        // Ignorer les erreurs
                      }
                    };
                    
                    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
                    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
                    
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
                  {/* Monitoring de performance */}
                  <PerformanceMonitor3D />

                  {/* Éclairage optimisé désertique */}
                  <SceneLighting />

                  {/* Sol sablonneux */}
                  <SandyGround size={1000} position={[0, 0, 0]} />

                  {/* Module de refroidissement */}
                  <Suspense fallback={null}>
                    <CoolingModule3D 
                      position={[0, 1.448, 0]}
                      containerId="cooling-module-1"
                      onSelect={handleModuleClick}
                      isSelected={selectedModule === 'cooling-module-1'}
                      showDetails={true}
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

                  {/* Environnement */}
                  <Environment preset="sunset" />
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
