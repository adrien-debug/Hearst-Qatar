import { useRef, useState, useEffect } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colorTokens } from '../../config/design-tokens';

interface CoolingModule3DProps {
  position?: [number, number, number];
  containerId?: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  showDetails?: boolean;
}

// Dimensions du module de refroidissement (identique au container HD5)
const MODULE_LENGTH = 12.196; // m
const MODULE_WIDTH = 2.438;   // m
const MODULE_HEIGHT = 2.896;  // m

/**
 * Module de refroidissement reconstruit selon image de référence
 * - Structure chassis entièrement NOIRE
 * - Radiateur en V MÉTAL ARGENT (sommet au sol, s'ouvre vers le haut)
 * - 12 ventilateurs circulaires noirs sur le dessus
 * - Toit noir avec panneaux solaires noirs
 * - Pompes vertes et tuyauterie verte au sol
 */
export default function CoolingModule3D({ 
  position = [0, 0, 0],
  containerId = 'cooling-module-1',
  onSelect,
  isSelected = false,
  showDetails = true
}: CoolingModule3DProps) {
  const groupRef = useRef<Group>(null);
  const [fanRotation, setFanRotation] = useState(0);
  const [ledBlink, setLedBlink] = useState(0);

  // Animation des ventilateurs
  useFrame((state) => {
    if (groupRef.current) {
      setFanRotation(state.clock.elapsedTime * 10);
    }
  });

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

  // Calculs pour le V inversé
  const vAngle = Math.atan((MODULE_WIDTH / 2 - 0.3) / MODULE_HEIGHT);
  const panelLength = MODULE_HEIGHT / Math.cos(vAngle);
  const centerY = MODULE_HEIGHT / 2;
  const centerZ_offset = (MODULE_WIDTH / 2 - 0.3) / 2;

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
      {/* ==================== CHÂSSIS OUVERT NOIR ==================== */}
      
      {/* Cadre supérieur (noir) */}
      <mesh position={[0, MODULE_HEIGHT - 0.1, 0]} castShadow>
        <boxGeometry args={[MODULE_LENGTH, 0.2, MODULE_WIDTH]} />
        <meshStandardMaterial
          color={colorTokens.threeD.cooling.chassis}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Cadre inférieur (noir) */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[MODULE_LENGTH, 0.2, MODULE_WIDTH]} />
        <meshStandardMaterial
          color={colorTokens.threeD.cooling.chassis}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Poteaux verticaux aux 4 coins (noir) */}
      {[
        [-MODULE_LENGTH / 2 + 0.1, MODULE_HEIGHT / 2, -MODULE_WIDTH / 2 + 0.1],
        [MODULE_LENGTH / 2 - 0.1, MODULE_HEIGHT / 2, -MODULE_WIDTH / 2 + 0.1],
        [-MODULE_LENGTH / 2 + 0.1, MODULE_HEIGHT / 2, MODULE_WIDTH / 2 - 0.1],
        [MODULE_LENGTH / 2 - 0.1, MODULE_HEIGHT / 2, MODULE_WIDTH / 2 - 0.1],
      ].map((pos, i) => (
        <mesh key={`corner-post-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, MODULE_HEIGHT - 0.4, 0.15]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Barres horizontales latérales (structure noire) */}
      {[
        // Avant
        [0, MODULE_HEIGHT / 2, -MODULE_WIDTH / 2 + 0.05, [MODULE_LENGTH - 0.4, 0.08, 0.08]],
        // Arrière
        [0, MODULE_HEIGHT / 2, MODULE_WIDTH / 2 - 0.05, [MODULE_LENGTH - 0.4, 0.08, 0.08]],
        // Gauche
        [-MODULE_LENGTH / 2 + 0.05, MODULE_HEIGHT / 2, 0, [0.08, 0.08, MODULE_WIDTH - 0.4]],
        // Droite
        [MODULE_LENGTH / 2 - 0.05, MODULE_HEIGHT / 2, 0, [0.08, 0.08, MODULE_WIDTH - 0.4]],
      ].map((bar, i) => (
        <mesh
          key={`h-bar-${i}`}
          position={[bar[0], bar[1], bar[2]] as [number, number, number]}
          castShadow
        >
          <boxGeometry args={bar[3] as [number, number, number]} />
          <meshStandardMaterial color={colorTokens.threeD.cooling.chassis} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* ==================== TOIT NOIR ==================== */}
      
      {/* Toit noir */}
      <mesh position={[0, MODULE_HEIGHT - 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[MODULE_LENGTH, 0.1, MODULE_WIDTH]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* ==================== RADIATEUR EN V INVERSÉ (MÉTAL ARGENT) ==================== */}
      {/* V inversé : sommet au SOL (Y=0), s'ouvre vers le HAUT */}
      {/* 2 GRANDES PLAQUES MÉTALLIQUES SIMPLES au lieu de 100 ailettes */}

      {/* PLAQUE AVANT (métal argent) */}
      <mesh
        position={[0, centerY, centerZ_offset]}
        rotation={[vAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[MODULE_LENGTH - 0.7, 0.08, panelLength]} />
        <meshStandardMaterial
          color={colorTokens.threeD.cooling.radiator}
          metalness={0.9}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* PLAQUE ARRIÈRE (métal argent) */}
      <mesh
        position={[0, centerY, -centerZ_offset]}
        rotation={[-vAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[MODULE_LENGTH - 0.7, 0.08, panelLength]} />
        <meshStandardMaterial
          color={colorTokens.threeD.cooling.radiator}
          metalness={0.9}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Supports verticaux du V (noirs) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = -MODULE_LENGTH / 2 + 1 + i * ((MODULE_LENGTH - 2) / 7);
        return (
          <mesh
            key={`v-support-${i}`}
            position={[x, MODULE_HEIGHT / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, MODULE_HEIGHT - 0.4, 12]} />
            <meshStandardMaterial
              color={colorTokens.threeD.cooling.chassis}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* ==================== 3 GROSSES TURBINES D'EXTRACTION + PANNEAUX SOLAIRES ENTRE ==================== */}
      {/* Configuration : TURBINE 1 | PANNEAUX | TURBINE 2 | PANNEAUX | TURBINE 3 */}
      
      {/* TURBINE 1 (gauche) */}
      <group position={[-MODULE_LENGTH / 2 + 2.5, MODULE_HEIGHT + 0.3, 0]}>
        {/* Structure turbine (cylindre noir) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        
        {/* Grille protection turbine */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.05, 32]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.roof}
            metalness={0.7}
            roughness={0.3}
            wireframe={true}
          />
        </mesh>
        
        {/* Pales turbine (6 pales) - rotation */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh 
              key={`blade1-${i}`}
              position={[Math.cos(angle + fanRotation) * 0.4, 0.2, Math.sin(angle + fanRotation) * 0.4]}
              rotation={[0, angle + fanRotation, 0]}
              castShadow
            >
              <boxGeometry args={[0.15, 0.02, 0.7]} />
              <meshStandardMaterial
                color={colorTokens.threeD.cooling.panel}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          );
        })}
        
        {/* Centre turbine */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ZONE PANNEAUX SOLAIRES 1 (entre turbine 1 et 2) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const panelWidth = 0.9;
        const panelDepth = 0.6;
        const spacing = 0.1;
        const startX = -MODULE_LENGTH / 2 + 4.5;
        const startZ = -MODULE_WIDTH / 2 + 0.4;
        
        const panelX = startX + col * (panelWidth + spacing);
        const panelZ = startZ + row * (panelDepth + spacing);
        
        return (
          <group key={`solar1-${i}`}>
            <mesh position={[panelX, MODULE_HEIGHT - 0.03, panelZ]} castShadow>
              <boxGeometry args={[panelWidth, 0.02, panelDepth]} />
              <meshStandardMaterial
                color={colorTokens.threeD.cooling.chassis}
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[panelX, MODULE_HEIGHT - 0.02, panelZ]}>
              <boxGeometry args={[panelWidth + 0.02, 0.01, panelDepth + 0.02]} />
              <meshStandardMaterial color={colorTokens.threeD.cooling.panel} metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* TURBINE 2 (centre) */}
      <group position={[0, MODULE_HEIGHT + 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.05, 32]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.roof}
            metalness={0.7}
            roughness={0.3}
            wireframe={true}
          />
        </mesh>
        
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh 
              key={`blade2-${i}`}
              position={[Math.cos(angle + fanRotation) * 0.4, 0.2, Math.sin(angle + fanRotation) * 0.4]}
              rotation={[0, angle + fanRotation, 0]}
              castShadow
            >
              <boxGeometry args={[0.15, 0.02, 0.7]} />
              <meshStandardMaterial
                color={colorTokens.threeD.cooling.panel}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          );
        })}
        
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ZONE PANNEAUX SOLAIRES 2 (entre turbine 2 et 3) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const panelWidth = 0.9;
        const panelDepth = 0.6;
        const spacing = 0.1;
        const startX = MODULE_LENGTH / 2 - 7.5;
        const startZ = -MODULE_WIDTH / 2 + 0.4;
        
        const panelX = startX + col * (panelWidth + spacing);
        const panelZ = startZ + row * (panelDepth + spacing);
        
        return (
          <group key={`solar2-${i}`}>
            <mesh position={[panelX, MODULE_HEIGHT - 0.03, panelZ]} castShadow>
              <boxGeometry args={[panelWidth, 0.02, panelDepth]} />
              <meshStandardMaterial
                color={colorTokens.threeD.cooling.chassis}
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[panelX, MODULE_HEIGHT - 0.02, panelZ]}>
              <boxGeometry args={[panelWidth + 0.02, 0.01, panelDepth + 0.02]} />
              <meshStandardMaterial color={colorTokens.threeD.cooling.panel} metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* TURBINE 3 (droite) */}
      <group position={[MODULE_LENGTH / 2 - 2.5, MODULE_HEIGHT + 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.05, 32]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.roof}
            metalness={0.7}
            roughness={0.3}
            wireframe={true}
          />
        </mesh>
        
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh 
              key={`blade3-${i}`}
              position={[Math.cos(angle + fanRotation) * 0.4, 0.2, Math.sin(angle + fanRotation) * 0.4]}
              rotation={[0, angle + fanRotation, 0]}
              castShadow
            >
              <boxGeometry args={[0.15, 0.02, 0.7]} />
              <meshStandardMaterial
                color={colorTokens.threeD.cooling.panel}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          );
        })}
        
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial
            color={colorTokens.threeD.cooling.chassis}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ==================== ÉQUIPEMENTS AU SOL (POMPES VERTES) ==================== */}
      {/* 3 pompes vertes */}
      {[
        [-MODULE_LENGTH / 3, 0.4, 0],
        [0, 0.4, 0],
        [MODULE_LENGTH / 3, 0.4, 0],
      ].map((pos, i) => (
        <group key={`pump-${i}`} position={pos as [number, number, number]}>
          {/* Corps de la pompe (vert) */}
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.5, 0.5]} />
            <meshStandardMaterial
              color={colorTokens.threeD.cooling.pump}
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          
          {/* Moteur cylindrique */}
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
            <meshStandardMaterial
              color={colorTokens.threeD.cooling.pumpActive}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== TUYAUTERIE VERTE ==================== */}
      {/* Tuyau principal vert (horizontal) */}
      <mesh position={[0, 0.6, -MODULE_WIDTH / 3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, MODULE_LENGTH - 1, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Tuyaux verts (connexions verticales) */}
      {[-1, 0, 1].map((offset, i) => (
        <mesh
          key={`green-pipe-${i}`}
          position={[offset * MODULE_LENGTH / 4, 0.8, MODULE_WIDTH / 4]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial
            color="#22c55e"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ==================== PANNEAU DE CONTRÔLE ==================== */}
      
      <mesh 
        position={[MODULE_LENGTH/2 - 0.3, MODULE_HEIGHT/2 + 0.5, MODULE_WIDTH/2 - 0.1]} 
        castShadow
      >
        <boxGeometry args={[0.4, 0.3, 0.15]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* LED de statut sur le panneau de contrôle */}
      <mesh 
        position={[MODULE_LENGTH/2 - 0.25, MODULE_HEIGHT/2 + 0.55, MODULE_WIDTH/2 - 0.02]} 
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color={ledBlink ? colorTokens.threeD.cooling.led : colorTokens.threeD.cooling.ledInactive}
          emissive={ledBlink ? colorTokens.threeD.cooling.led : "#000000"}
          emissiveIntensity={ledBlink ? 0.8 : 0}
        />
      </mesh>

      {/* Écran LCD sur le panneau */}
      <mesh 
        position={[MODULE_LENGTH/2 - 0.3, MODULE_HEIGHT/2 + 0.45, MODULE_WIDTH/2 - 0.02]} 
      >
        <boxGeometry args={[0.3, 0.15, 0.01]} />
        <meshStandardMaterial 
          color="#000000" 
          emissive={colorTokens.threeD.cooling.emissive}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Poignée verticale à l'extrémité droite */}
      <mesh 
        position={[MODULE_LENGTH/2 - 0.1, MODULE_HEIGHT/2, MODULE_WIDTH/2 + 0.05]} 
        castShadow
      >
        <boxGeometry args={[0.05, 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Points d'interface pour connexion au container */}
      <group position={[0, -MODULE_HEIGHT/2, 0]} name="CoolingModule_Interface" />
      <group position={[-MODULE_LENGTH/2 + 1, 0, 0]} name="CoolingModule_PowerIn" />
      <group position={[-MODULE_LENGTH/2 + 1, 0, 0]} name="CoolingModule_CoolingIn" />
    </group>
  );
}
