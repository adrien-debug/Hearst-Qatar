import { useGLTF } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { buildElectricalStructure } from '../../data/electricalMock';
import PowerBlock3D from './PowerBlock3D';
import Transformer3D from './Transformer3D';
import HD5Container3D from './HD5Container3D';
import Generator3D from './Generator3D';

// Dimensions HD5 pour calculs de position
const HD5_HEIGHT = 2.896; // m

interface Substation3DProps {
  modelPath?: string;
  onObjectClick?: (objectName: string) => void;
  selectedObject?: string | null;
  useProcedural?: boolean;
}

export default function Substation3D({ 
  modelPath = '/models/substation_200MW_schema.glb',
  onObjectClick,
  selectedObject,
  useProcedural = true
}: Substation3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  // Essayer de charger le modèle GLB seulement si on ne veut pas la version procédurale
  let scene: THREE.Group | null = null;
  if (!useProcedural) {
    try {
      // #region agent log - Hypothèse B: Tentative chargement GLB
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Substation3D.tsx:31','message':'Hypothèse B - Tentative chargement GLB substation','data':{modelPath:modelPath,useProcedural:useProcedural},timestamp:Date.now(),sessionId:'debug-session',runId:'blank-page-debug',hypothesisId:'B'})}).catch(()=>{});
      }
      // #endregion
      const gltf = useGLTF(modelPath);
      scene = gltf.scene;
      // #region agent log - Hypothèse B: GLB chargé avec succès
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Substation3D.tsx:34','message':'Hypothèse B - GLB substation chargé avec succès','data':{modelPath:modelPath,sceneChildren:scene.children.length},timestamp:Date.now(),sessionId:'debug-session',runId:'blank-page-debug',hypothesisId:'B'})}).catch(()=>{});
      }
      // #endregion
    } catch (error) {
      // #region agent log - Hypothèse B: Erreur chargement GLB
      if (typeof window !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Substation3D.tsx:36','message':'Hypothèse B - ERREUR chargement GLB substation','data':{modelPath:modelPath,errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'blank-page-debug',hypothesisId:'B'})}).catch(()=>{});
      }
      // #endregion
      // Erreur 404 est normale si le fichier n'existe pas encore
      console.log('ℹ️ Modèle GLB non disponible, utilisation de la version procédurale');
      setUseFallback(true);
    }
  }

  const electricalStructure = buildElectricalStructure();

  // Fonction pour gérer les clics sur les objets
  const handleClick = (objectName: string) => {
    if (onObjectClick) {
      onObjectClick(objectName);
    }
  };

  // Version procédurale si le modèle GLB n'est pas disponible ou si demandé
  if (useProcedural || useFallback || !scene) {
    console.log('🎨 Rendu procédural - Structure:', {
      powerBlocks: electricalStructure.children?.length || 0,
      transformers: electricalStructure.children?.reduce((acc, pb) => acc + (pb.children?.length || 0), 0) || 0
    });
    
    return (
      <group ref={groupRef}>
        {/* Substation (représentation simplifiée) */}
        <mesh 
          position={[0, 15, 0]} 
          castShadow
          receiveShadow
          onClick={() => handleClick('Substation_200MW')}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <boxGeometry args={[40, 30, 15]} />
          <meshStandardMaterial 
            color={selectedObject === 'Substation_200MW' ? '#4a9eff' : '#6b7280'} 
            metalness={0.8}
            roughness={0.4}
            emissive={selectedObject === 'Substation_200MW' ? '#1e40af' : '#000000'}
            emissiveIntensity={selectedObject === 'Substation_200MW' ? 0.2 : 0}
          />
        </mesh>

        {/* Power Blocks et leurs transformateurs */}
        {electricalStructure.children?.filter(child => child.type === 'section').map((powerBlock, pbIndex) => {
          const pbNum = pbIndex + 1;
          const pbX = [-75, -25, 25, 75][pbIndex]; // Espacement réduit de 40m à 50m entre Power Blocks
          
          return (
            <group key={powerBlock.id}>
              <PowerBlock3D
                position={[pbX, 0, -40]}
                powerBlockId={powerBlock.id}
                onSelect={handleClick}
                isSelected={selectedObject === powerBlock.id}
              />
              
              {/* Transformateurs pour ce Power Block */}
              {powerBlock.children?.map((transformer, trIndex) => {
                const trNum = trIndex + 1;
                // Espacement réduit de 20m à 20m entre transformateurs (positions ajustées)
                const baseZ = -40; // Position de départ
                const trZ = baseZ - (trIndex * 20); // Espacement de 20m entre chaque transformateur
                
                return (
                  <group key={transformer.id}>
                    <Transformer3D
                      position={[pbX, 0, trZ]}
                      transformerId={transformer.id}
                      onSelect={handleClick}
                      isSelected={selectedObject === transformer.id}
                    />
                    
                    {/* Switchgear */}
                    <mesh
                      position={[pbX + 5, 1, trZ]}
                      castShadow
                      receiveShadow
                      onClick={() => handleClick(`PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}`)}
                      onPointerOver={() => document.body.style.cursor = 'pointer'}
                      onPointerOut={() => document.body.style.cursor = 'default'}
                    >
                      <boxGeometry args={[2, 2, 1.5]} />
                      <meshStandardMaterial 
                        color="#9ca3af" 
                        metalness={0.5}
                        roughness={0.6}
                      />
                    </mesh>
                    
                    {/* 2 Containers HD5 par transformateur */}
                    {transformer.children?.map((container, hd5Index) => {
                      const hd5Offset = hd5Index === 0 ? -12 : 12; // Espacement augmenté de 2m à 12m par rapport au transformateur
                      return (
                        <HD5Container3D
                          key={container.id}
                          position={[pbX + hd5Offset, 0, trZ]}
                          containerId={container.id}
                          onSelect={handleClick}
                          isSelected={selectedObject === container.id}
                        />
                      );
                    })}
                  </group>
                );
              })}
            </group>
          );
        })}

        {/* Generators avec leurs containers (après les Power Blocks) */}
        {electricalStructure.children?.filter(child => child.type === 'generator').map((generator, genIndex) => {
          // Positionner les générateurs en ligne droite après les Power Blocks
          const genZ = -180; // Même position Z pour tous (alignés)
          // Centrer les 8 générateurs horizontalement avec espacement de 20m
          const totalWidth = 7 * 20; // 7 espaces entre 8 générateurs
          const startX = -totalWidth / 2; // Centrer autour de 0
          const genX = startX + genIndex * 20; // Espacement de 20m entre chaque générateur
          
          return (
            <group key={generator.id}>
              <Generator3D
                position={[genX, 0, genZ]}
                generatorId={generator.id}
                onSelect={handleClick}
                isSelected={selectedObject === generator.id}
              />
              
              {/* 2 Containers HD5 par générateur (gauche et droite) */}
              {generator.children?.map((container, containerIndex) => {
                const containerOffset = containerIndex === 0 ? -6 : 6; // -6 pour gauche, +6 pour droite
                return (
                  <HD5Container3D
                    key={container.id}
                    position={[genX + containerOffset, 0, genZ]}
                    containerId={container.id}
                    onSelect={handleClick}
                    isSelected={selectedObject === container.id}
                  />
                );
              })}
            </group>
          );
        })}
      </group>
    );
  }

  // Version avec modèle GLB chargé
  if (scene) {
    scene.traverse((object) => {
      // Mise en surbrillance de l'objet sélectionné
      if (selectedObject && object.name === selectedObject) {
        if (object instanceof THREE.Mesh) {
          const material = object.material as THREE.MeshStandardMaterial;
          if (material) {
            material.emissive = new THREE.Color(0x00ff00);
            material.emissiveIntensity = 0.3;
          }
        }
      } else {
        if (object instanceof THREE.Mesh) {
          const material = object.material as THREE.MeshStandardMaterial;
          if (material) {
            material.emissive = new THREE.Color(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      }
    });

    return (
      <group ref={groupRef} dispose={null}>
        <primitive object={scene.clone()} />
      </group>
    );
  }

  return null;
}

// Précharger le modèle si disponible
try {
  useGLTF.preload('/models/substation_200MW_schema.glb');
} catch (e) {
  // Ignorer si le fichier n'existe pas
}

