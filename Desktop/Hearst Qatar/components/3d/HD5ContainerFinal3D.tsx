import { useRef, Suspense, useMemo } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import HearstLogo from './HearstLogo';
import { createContainerMaterial, createAdvancedMetalMaterial } from '../../utils/materialHelpers';

interface HD5ContainerFinal3DProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Container BITMAIN ANTSPACE HD5 HYDRO - Version FINALE
 * Dimensions millimétriques exactes :
 * - Module inférieur (container 40ft ISO) : 12196 × 2438 × 2896 mm
 * 
 * Logo HEARST appliqué sur la face arrière
 */
export default function HD5ContainerFinal3D({
  position,
  containerId,
  onSelect,
  isSelected = false,
}: HD5ContainerFinal3DProps) {
  // #region agent log - Hypothèse E: HD5ContainerFinal3D rendu
  (() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HD5ContainerFinal3D.tsx:93','message':'Hypothèse E - HD5ContainerFinal3D rendu','data':{containerId:containerId,positionX:position[0],positionY:position[1],positionZ:position[2]},timestamp:Date.now(),sessionId:'debug-session',runId:'blank-page-debug',hypothesisId:'E'})}).catch(()=>{});
    }
    return null;
  })();
  // #endregion
  
  const groupRef = useRef<Group>(null);

  // Dimensions exactes en mètres - CONTAINERS ÉLARGIS
  const HD5_LENGTH = 12.196; // m
  const HD5_WIDTH = 3.5;      // m (augmenté de 2.438m à 3.5m pour plus de largeur)
  const HD5_HEIGHT = 2.896;   // m

  // Matériaux mémorisés pour de meilleures performances - ULTRA-RÉALISTES
  const containerMaterial = useMemo(() => createContainerMaterial('#1a1a1a', 0.2), []);
  const metalMaterial = useMemo(() => createAdvancedMetalMaterial('#374151', 0.8, 0.2), []);
  const pipeMaterial = useMemo(() => createAdvancedMetalMaterial('#e5e7eb', 0.95, 0.05), []);
  const selectedMaterial = useMemo(() => {
    const mat = createContainerMaterial('#1a1a1a', 0.2);
    mat.emissive = new THREE.Color('#1e40af');
    mat.emissiveIntensity = 0.2;
    return mat;
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(containerId);
    }
  };

  // #region agent log
  useMemo(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HD5ContainerFinal3D.tsx:58','message':'Container créé - Dimensions et position de base','data':{containerId:containerId,position:{x:position[0],y:position[1],z:position[2]},dimensions:{length:HD5_LENGTH,width:HD5_WIDTH,height:HD5_HEIGHT},faces:{left:[-HD5_LENGTH/2,HD5_HEIGHT/2,0],right:[HD5_LENGTH/2,HD5_HEIGHT/2,0],front:[0,HD5_HEIGHT/2,HD5_WIDTH/2],back:[0,HD5_HEIGHT/2,-HD5_WIDTH/2]}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
    return null;
  }, [containerId, position]);
  // #endregion

  return (
    <group
      ref={groupRef}
      position={position}
      name={containerId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* ========== MODULE INFÉRIEUR — CONTAINER 40 FT ISO ========== */}
      
      {/* Structure principale du container (noir mat PBR avec textures réalistes) */}
      {/* #region agent log */}
      {useMemo(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HD5ContainerFinal3D.tsx:81','message':'Container geometry - Dimensions et faces','data':{containerId:containerId,geometry:{length:HD5_LENGTH,height:HD5_HEIGHT,width:HD5_WIDTH},faces:{front:{z:HD5_WIDTH/2,description:'Face avant (Z positif)'},back:{z:-HD5_WIDTH/2,description:'Face arrière (Z négatif)'},left:{x:-HD5_LENGTH/2,description:'Face gauche (X négatif)'},right:{x:HD5_LENGTH/2,description:'Face droite (X positif)'},top:{y:HD5_HEIGHT,description:'Face supérieure'},bottom:{y:0,description:'Face inférieure'}},cameraPosition:{x:0,y:80,z:200},cameraViewDirection:'fromZ200toZ0'},timestamp:Date.now(),sessionId:'debug-session',runId:'camera-visibility-fix',hypothesisId:'geometry'})}).catch(()=>{});
        }
        return null;
      }, [containerId])}
      {/* #endregion */}
      <mesh
        position={[0, HD5_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH]} />
        <primitive object={isSelected ? selectedMaterial : containerMaterial} attach="material" />
      </mesh>

      {/* Parois nervurées verticales (OPTIMISÉ - moins de nervures pour performance) */}
      {Array.from({ length: Math.floor(HD5_LENGTH / 0.5) }).map((_, i) => {
        const xPos = -HD5_LENGTH / 2 + 0.25 + i * 0.5; // Espacement doublé (50cm au lieu de 25cm)
        return (
          <mesh
            key={`corrugation-left-${i}`}
            position={[xPos, HD5_HEIGHT / 2, HD5_WIDTH / 2 + 0.01]}
            castShadow={false}
          >
            <boxGeometry args={[0.3, HD5_HEIGHT * 0.95, 0.02]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.3}
              roughness={0.65}
            />
          </mesh>
        );
      })}

      {/* Parois nervurées côté droit (OPTIMISÉ) */}
      {Array.from({ length: Math.floor(HD5_LENGTH / 0.5) }).map((_, i) => {
        const xPos = -HD5_LENGTH / 2 + 0.25 + i * 0.5; // Espacement doublé
        return (
          <mesh
            key={`corrugation-right-${i}`}
            position={[xPos, HD5_HEIGHT / 2, -HD5_WIDTH / 2 - 0.01]}
            castShadow={false}
          >
            <boxGeometry args={[0.3, HD5_HEIGHT * 0.95, 0.02]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.3}
              roughness={0.65}
            />
          </mesh>
        );
      })}

      {/* Coins ISO aux 4 angles */}
      {([
        [-HD5_LENGTH / 2, HD5_HEIGHT, HD5_WIDTH / 2],
        [HD5_LENGTH / 2, HD5_HEIGHT, HD5_WIDTH / 2],
        [-HD5_LENGTH / 2, HD5_HEIGHT, -HD5_WIDTH / 2],
        [HD5_LENGTH / 2, HD5_HEIGHT, -HD5_WIDTH / 2],
      ] as const).map((cornerPos, i) => (
        <mesh key={`iso-corner-${i}`} position={cornerPos as [number, number, number]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Double porte arrière */}
      <mesh position={[HD5_LENGTH / 2 - 0.1, HD5_HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[0.2, HD5_HEIGHT * 0.9, HD5_WIDTH * 0.9]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.65}
        />
      </mesh>

      {/* Grilles latérales de ventilation (OPTIMISÉ - moins de grilles) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`vent-grate-left-${i}`}
          position={[-HD5_LENGTH / 2 + 0.05, HD5_HEIGHT / 2 - 0.8 + i * 0.8, HD5_WIDTH / 2 + 0.01]}
          castShadow={false}
        >
          <boxGeometry args={[0.1, 0.6, 0.02]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.3}
            opacity={0.7}
            transparent
          />
        </mesh>
      ))}

      {/* Coffret électrique latéral (800 × 500 × 300 mm) */}
      <mesh
        position={[-HD5_LENGTH / 2 + 0.4, HD5_HEIGHT / 2 - 0.5, HD5_WIDTH / 2 + 0.15]}
        castShadow
      >
        <boxGeometry args={[0.8, 0.5, 0.3]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Tuyaux hydro (diamètre 100-125 mm) avec détails */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={`hydro-pipe-${i}`} position={[-HD5_LENGTH / 2 + 1 + i * 2, HD5_HEIGHT / 2, HD5_WIDTH / 2 + 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.0625, 0.0625, 0.3, 16]} />
            <primitive object={pipeMaterial} attach="material" />
          </mesh>
          {/* Collier de fixation */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <torusGeometry args={[0.0625, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.15, 0]} castShadow>
            <torusGeometry args={[0.0625, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ========== LOGO HEARST — VISIBLE SUR TOUTES LES FACES ========== */}
      {/* Logo HEARST sur la face arrière (Z négatif) - PRINCIPAL - TRÈS VISIBLE */}
      <HearstLogo
        position={[0, HD5_HEIGHT / 2, -HD5_WIDTH / 2 - 0.05]}
        rotation={[0, Math.PI, 0]}
        width={HD5_LENGTH * 0.9}
      />
      
      {/* Logo HEARST sur la face avant (Z positif) - TRÈS VISIBLE */}
      <HearstLogo
        position={[0, HD5_HEIGHT / 2, HD5_WIDTH / 2 + 0.05]}
        rotation={[0, 0, 0]}
        width={HD5_LENGTH * 0.9}
      />
      
      {/* Logo HEARST sur le côté gauche (X négatif) - TRÈS VISIBLE */}
      <HearstLogo
        position={[-HD5_LENGTH / 2 - 0.05, HD5_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={HD5_WIDTH * 0.9}
      />
      
      {/* Logo HEARST sur le côté droit (X positif) - TRÈS VISIBLE */}
      <HearstLogo
        position={[HD5_LENGTH / 2 + 0.05, HD5_HEIGHT / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={HD5_WIDTH * 0.9}
      />


      {/* Échelles latérales */}
      {[-1, 1].map((side, i) => (
        <group key={`ladder-${i}`} position={[HD5_LENGTH / 2 - 0.1, HD5_HEIGHT / 2, side * (HD5_WIDTH / 2 + 0.05)]}>
          {Array.from({ length: 8 }).map((_, j) => (
            <mesh
              key={`rung-${j}`}
              position={[0, -1 + j * 0.4, 0]}
              castShadow
            >
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
