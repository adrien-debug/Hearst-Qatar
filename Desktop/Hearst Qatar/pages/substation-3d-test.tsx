import Head from 'next/head';
import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

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

// Version de test simplifiée
function TestScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Cube de test */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <OrbitControls />
    </>
  );
}

export default function TestPage() {
  const rendererRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Ignorer les doubles montages en développement (React Strict Mode)
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
    
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
    };
  }, []);

  return (
    <>
      <Head>
        <title>Test 3D</title>
      </Head>
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: '#000' }}>
        <Canvas
          onCreated={({ gl }) => {
            // Enregistrer le renderer et canvas
            rendererRef.current = gl;
            canvasRef.current = gl.domElement;
            
            // Enregistrer dans le manager
            WebGLContextManager.registerCanvas(gl.domElement, gl);
            
            // Retourner la fonction de nettoyage
            const cleanup = () => {
              WebGLContextManager.unregisterCanvas(gl.domElement);
              WebGLContextManager.cleanupInstance(gl, gl.domElement);
              rendererRef.current = null;
              canvasRef.current = null;
            };
            
            cleanupFunctionRef.current = cleanup;
            return cleanup;
          }}
        >
          <Suspense fallback={null}>
            <TestScene />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
