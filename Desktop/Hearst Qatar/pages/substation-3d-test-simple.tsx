import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Page de test ultra-simple pour vérifier que le Canvas fonctionne
 */
export default function Substation3DTestSimple() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('✅ Page montée');
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Test 3D Simple</title>
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900">
        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded">
          <h1 className="font-bold">Test 3D Simple</h1>
          <p className="text-sm">Si vous voyez un cube rouge, le Canvas fonctionne</p>
        </div>

        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          onCreated={({ gl, scene, camera }) => {
            console.log('✅ Canvas créé !');
            console.log('Renderer:', gl);
            console.log('Scene:', scene);
            console.log('Camera:', camera);
          }}
          onError={(error) => {
            console.error('❌ Erreur Canvas:', error);
          }}
        >
          {/* Lumière */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {/* Cube de test */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="red" />
          </mesh>

          {/* Axes helper */}
          <axesHelper args={[5]} />
        </Canvas>
      </div>
    </>
  );
}
