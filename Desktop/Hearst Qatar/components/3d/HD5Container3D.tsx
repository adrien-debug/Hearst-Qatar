import { useRef, useState, useEffect } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HD5Container3DProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

// Dimensions exactes du Bitmain ANTSPACE HD5 - CONTAINERS ÉLARGIS
const HD5_LENGTH = 12.196; // m
const HD5_WIDTH = 3.5;      // m (augmenté de 2.438m à 3.5m pour plus de largeur)
const HD5_HEIGHT = 2.896;  // m

// Le module supérieur a les MÊMES dimensions que le conteneur de base
const COOLING_MODULE_HEIGHT = HD5_HEIGHT; // Même hauteur que le conteneur
const COOLING_MODULE_LENGTH = HD5_LENGTH; // Même longueur que le conteneur
const COOLING_MODULE_WIDTH = HD5_WIDTH;   // Même largeur que le conteneur

// Dimensions du radiateur en V
const V_RADIATOR_WIDTH = 1.5; // Largeur du radiateur en V
const V_RADIATOR_HEIGHT = 1.8; // Hauteur du radiateur
const V_RADIATOR_DEPTH = 0.6; // Profondeur du radiateur

// Évaporateur sur le dessus
const EVAPORATOR_PANELS_COUNT = 7; // 7 sections d'évaporateur comme sur l'image

export default function HD5Container3D({ 
  position, 
  containerId, 
  onSelect,
  isSelected = false 
}: HD5Container3DProps) {
  const groupRef = useRef<Group>(null);
  const [ledBlink, setLedBlink] = useState(0);

  // Animation LED clignotante
  useEffect(() => {
    const interval = setInterval(() => {
      setLedBlink(prev => (prev + 1) % 2);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(containerId);
    }
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* ========== MODULE INFÉRIEUR (CONTAINER DE BASE) ========== */}
      
      {/* Structure principale du container (base blanche) */}
      <mesh position={[0, HD5_HEIGHT/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH]} />
        <meshStandardMaterial 
          color={isSelected ? '#e0e0e0' : '#ffffff'} 
          metalness={0.1}
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Panneaux corrugués verticaux sur les côtés (nervures) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh 
          key={`corrugation-${i}`}
          position={[-HD5_LENGTH/2 + 0.5 + i * 1, HD5_HEIGHT/2, HD5_WIDTH/2 + 0.01]} 
          castShadow
        >
          <boxGeometry args={[0.8, HD5_HEIGHT * 0.95, 0.02]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Marquage "HD5" sur le côté droit */}
      <mesh position={[HD5_LENGTH/2 - 0.5, HD5_HEIGHT/2 - 0.8, HD5_WIDTH/2 + 0.02]}>
        <boxGeometry args={[0.4, 0.2, 0.01]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* Logo ANTSPACE au centre du conteneur */}
      <mesh position={[0, HD5_HEIGHT/2, HD5_WIDTH/2 + 0.02]}>
        <boxGeometry args={[2, 0.5, 0.01]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* Logo BITMAIN en bas à gauche */}
      <mesh position={[-HD5_LENGTH/2 + 1.5, HD5_HEIGHT/2 - 1, HD5_WIDTH/2 + 0.02]}>
        <boxGeometry args={[1.2, 0.3, 0.01]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* Grilles de ventilation sur le côté gauche */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh 
          key={`vent-grate-left-${i}`}
          position={[-HD5_LENGTH/2 + 0.05, HD5_HEIGHT/2 - 0.8 + i * 0.4, HD5_WIDTH/2 + 0.01]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.3, 0.02]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.6}
            roughness={0.3}
            opacity={0.7}
            transparent
          />
        </mesh>
      ))}

      {/* Protubérance rectangulaire avec fentes horizontales (côté gauche) */}
      <mesh position={[-HD5_LENGTH/2 + 0.3, HD5_HEIGHT/2 + 0.5, HD5_WIDTH/2 + 0.05]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
      {/* Fentes horizontales sur la protubérance */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh 
          key={`slot-${i}`}
          position={[-HD5_LENGTH/2 + 0.3, HD5_HEIGHT/2 + 0.3 + i * 0.15, HD5_WIDTH/2 + 0.11]}
        >
          <boxGeometry args={[0.35, 0.05, 0.02]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Portes arrière */}
      <mesh position={[HD5_LENGTH/2 - 0.1, HD5_HEIGHT/2, 0]} castShadow>
        <boxGeometry args={[0.2, HD5_HEIGHT * 0.9, HD5_WIDTH * 0.9]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Poignées de portes */}
      {[0, 1].map((i) => (
        <mesh 
          key={`handle-${i}`}
          position={[HD5_LENGTH/2 - 0.05, HD5_HEIGHT/2 - 0.5 + i * 1, HD5_WIDTH/2 + 0.05]} 
          castShadow
        >
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ========== MODULE SUPÉRIEUR (SYSTÈME DE REFROIDISSEMENT) ========== */}
      {/* Le module supérieur a les MÊMES dimensions que le conteneur de base */}
      
      {/* Structure principale du module supérieur (blanc, même taille que le conteneur) */}
      <mesh 
        position={[0, HD5_HEIGHT + COOLING_MODULE_HEIGHT/2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[COOLING_MODULE_LENGTH, COOLING_MODULE_HEIGHT, COOLING_MODULE_WIDTH]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Panneaux corrugués verticaux sur les côtés du module supérieur */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh 
          key={`cooling-corrugation-${i}`}
          position={[-COOLING_MODULE_LENGTH/2 + 0.5 + i * 1, HD5_HEIGHT + COOLING_MODULE_HEIGHT/2, COOLING_MODULE_WIDTH/2 + 0.01]} 
          castShadow
        >
          <boxGeometry args={[0.8, COOLING_MODULE_HEIGHT * 0.95, 0.02]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* ========== RADIATEUR EN V (EXTRÉMITÉ GAUCHE) ========== */}
      
      {/* Structure de base du radiateur en V */}
      <group position={[-COOLING_MODULE_LENGTH/2 + V_RADIATOR_WIDTH/2, HD5_HEIGHT + COOLING_MODULE_HEIGHT/2, 0]}>
        {/* Support/cadre du radiateur */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[V_RADIATOR_WIDTH, V_RADIATOR_HEIGHT, V_RADIATOR_DEPTH]} />
          <meshStandardMaterial 
            color="#f1f5f9" 
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Structure principale du radiateur en V (deux plans inclinés formant un V) */}
        {/* Plan gauche du V */}
        <mesh 
          position={[-V_RADIATOR_WIDTH/4, 0, 0]}
          rotation={[0, 0, Math.PI / 6]}
          castShadow
        >
          <boxGeometry args={[V_RADIATOR_WIDTH * 0.6, V_RADIATOR_HEIGHT * 0.9, 0.05]} />
          <meshStandardMaterial 
            color="#cbd5e1" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Plan droit du V */}
        <mesh 
          position={[V_RADIATOR_WIDTH/4, 0, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          castShadow
        >
          <boxGeometry args={[V_RADIATOR_WIDTH * 0.6, V_RADIATOR_HEIGHT * 0.9, 0.05]} />
          <meshStandardMaterial 
            color="#cbd5e1" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Ailettes verticales du radiateur (serpentins) */}
        {Array.from({ length: 30 }).map((_, i) => {
          const y = -V_RADIATOR_HEIGHT/2 + (i / 30) * V_RADIATOR_HEIGHT;
          const side = i % 2 === 0 ? -1 : 1; // Alterner entre gauche et droite du V
          const xOffset = side * V_RADIATOR_WIDTH/4;
          const angle = side * Math.PI / 6;
          
          return (
            <mesh 
              key={`v-fin-${i}`}
              position={[xOffset, y, 0]}
              rotation={[0, 0, angle]}
              castShadow
            >
              <boxGeometry args={[0.015, 0.2, V_RADIATOR_DEPTH * 0.8]} />
              <meshStandardMaterial 
                color="#94a3b8" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}

        {/* Tuyaux brillants connectés au radiateur (chromés/inox) - serpentins */}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = -V_RADIATOR_HEIGHT/2 + 0.2 + i * 0.25;
          const side = i % 2 === 0 ? -1 : 1;
          const xOffset = side * V_RADIATOR_WIDTH/3;
          
          return (
            <mesh 
              key={`radiator-pipe-${i}`}
              position={[xOffset, y, V_RADIATOR_DEPTH/2 + 0.05]}
              rotation={[0, 0, side * Math.PI / 8]}
              castShadow
            >
              <cylinderGeometry args={[0.035, 0.035, 0.5, 16]} />
              <meshStandardMaterial 
                color="#e5e7eb" 
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
          );
        })}

        {/* Connexions de tuyaux principales (horizontales en bas) */}
        {Array.from({ length: 2 }).map((_, i) => (
          <mesh 
            key={`main-pipe-${i}`}
            position={[0, -V_RADIATOR_HEIGHT/2 + 0.2 + i * 0.3, V_RADIATOR_DEPTH/2 + 0.1]}
            rotation={[0, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, V_RADIATOR_WIDTH * 0.9, 16]} />
            <meshStandardMaterial 
              color="#e5e7eb" 
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
        ))}

        {/* Tuyaux verticaux de connexion */}
        {Array.from({ length: 4 }).map((_, i) => {
          const xPos = -V_RADIATOR_WIDTH/3 + (i / 3) * (V_RADIATOR_WIDTH * 2/3);
          return (
            <mesh 
              key={`vertical-pipe-${i}`}
              position={[xPos, -V_RADIATOR_HEIGHT/2 + 0.15, V_RADIATOR_DEPTH/2 + 0.15]}
              rotation={[0, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
              <meshStandardMaterial 
                color="#e5e7eb" 
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
          );
        })}
      </group>

      {/* ========== ÉVAPORATEUR SUR LE DESSUS (7 SECTIONS) ========== */}
      
      {/* 7 sections d'évaporateur avec panneaux inclinés bleus/noirs */}
      {Array.from({ length: EVAPORATOR_PANELS_COUNT }).map((_, i) => {
        const sectionSpacing = (COOLING_MODULE_LENGTH - V_RADIATOR_WIDTH - 0.5) / EVAPORATOR_PANELS_COUNT;
        const sectionX = -COOLING_MODULE_LENGTH/2 + V_RADIATOR_WIDTH + 0.25 + i * sectionSpacing + sectionSpacing/2;
        const sectionWidth = sectionSpacing * 0.85;
        const sectionHeight = 0.6;
        
        return (
          <group key={`evaporator-section-${i}`} position={[sectionX, HD5_HEIGHT + COOLING_MODULE_HEIGHT - 0.15, 0]}>
            {/* Structure de base de la section (blanc) */}
            <mesh position={[0, -sectionHeight/2 - 0.1, 0]} castShadow>
              <boxGeometry args={[sectionWidth, 0.1, COOLING_MODULE_WIDTH * 0.95]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.1}
                roughness={0.7}
              />
            </mesh>

            {/* Panneaux inclinés bleus/noirs (ailettes d'évaporateur) - comme sur l'image */}
            {Array.from({ length: 12 }).map((_, j) => {
              const panelAngle = Math.PI / 10; // Angle d'inclinaison vers l'intérieur
              const panelY = -sectionHeight/2 + j * (sectionHeight / 12);
              const panelDepth = 0.15;
              
              // Alternance de couleurs bleu foncé et noir
              const isDark = j % 3 === 0;
              
              return (
                <mesh 
                  key={`evaporator-panel-${i}-${j}`}
                  position={[0, panelY, 0]}
                  rotation={[panelAngle, 0, 0]}
                  castShadow
                >
                  <boxGeometry args={[sectionWidth * 0.92, 0.04, panelDepth]} />
                  <meshStandardMaterial 
                    color={isDark ? "#0f172a" : "#1e3a8a"} 
                    metalness={0.25}
                    roughness={0.35}
                  />
                </mesh>
              );
            })}

            {/* Support latéral de la section */}
            <mesh 
              position={[-sectionWidth/2, -sectionHeight/2 - 0.05, 0]} 
              castShadow
            >
              <boxGeometry args={[0.05, sectionHeight + 0.1, COOLING_MODULE_WIDTH * 0.95]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.1}
                roughness={0.7}
              />
            </mesh>
            <mesh 
              position={[sectionWidth/2, -sectionHeight/2 - 0.05, 0]} 
              castShadow
            >
              <boxGeometry args={[0.05, sectionHeight + 0.1, COOLING_MODULE_WIDTH * 0.95]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.1}
                roughness={0.7}
              />
            </mesh>
          </group>
        );
      })}

      {/* Panneau de contrôle à l'extrémité droite du module supérieur */}
      <mesh 
        position={[COOLING_MODULE_LENGTH/2 - 0.3, HD5_HEIGHT + COOLING_MODULE_HEIGHT/2 + 0.5, COOLING_MODULE_WIDTH/2 - 0.1]} 
        castShadow
      >
        <boxGeometry args={[0.4, 0.3, 0.15]} />
        <meshStandardMaterial 
          color="#94a3b8" 
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Poignée verticale à l'extrémité droite */}
      <mesh 
        position={[COOLING_MODULE_LENGTH/2 - 0.1, HD5_HEIGHT + COOLING_MODULE_HEIGHT/2, COOLING_MODULE_WIDTH/2 + 0.05]} 
        castShadow
      >
        <boxGeometry args={[0.05, 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#cbd5e1" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Points d'interface (Empty objects pour référence) */}
      <group position={[-HD5_LENGTH/2 + 1, 0, 0]} name="HD5_PowerIn" />
      <group position={[-HD5_LENGTH/2 + 1, 0, 0]} name="HD5_CoolingIn" />
    </group>
  );
}
