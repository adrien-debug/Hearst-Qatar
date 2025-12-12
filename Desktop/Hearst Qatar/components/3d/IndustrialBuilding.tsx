import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface IndustrialBuildingProps {
  position: [number, number, number];
  type: 'maintenance' | 'personnel';
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Bâtiment industriel à 4 niveaux (largeur de 4 lignes de containers)
 * - Type "maintenance" : Stockage, maintenance, centre de réparation
 * - Type "personnel" : Chambres, cantine, douches, toilettes
 */
export default function IndustrialBuilding({
  position,
  type,
  onSelect,
  isSelected = false,
}: IndustrialBuildingProps) {
  const groupRef = useRef<Group>(null);

  // Dimensions basées sur 4 lignes de containers
  const CONTAINER_LENGTH = 12.196;
  const CONTAINER_SPACING = 1.5;
  const BUILDING_WIDTH = 4 * (CONTAINER_LENGTH + CONTAINER_SPACING); // 4 lignes
  const BUILDING_DEPTH = 15; // Profondeur du bâtiment
  const FLOOR_HEIGHT = 3.5; // Hauteur par étage
  const FLOORS = 4; // 4 étages
  const BUILDING_HEIGHT = FLOORS * FLOOR_HEIGHT;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(`building-${type}`);
    }
  };

  // Couleurs selon le type
  const mainColor = type === 'maintenance' ? '#1a1a1a' : '#2d3748'; // Noir pour maintenance, gris foncé pour personnel
  const accentColor = type === 'maintenance' ? '#dc2626' : '#3b82f6'; // Rouge pour maintenance, bleu pour personnel
  const doorColor = type === 'maintenance' ? '#fbbf24' : '#10b981'; // Jaune pour maintenance, vert pour personnel

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
      {/* ==================== STRUCTURE PRINCIPALE ==================== */}
      
      {/* Corps principal du bâtiment */}
      <mesh
        position={[0, BUILDING_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[BUILDING_WIDTH, BUILDING_HEIGHT, BUILDING_DEPTH]} />
        <meshStandardMaterial
          color={mainColor}
          metalness={0.3}
          roughness={0.7}
          emissive={isSelected ? accentColor : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* ==================== SÉPARATION DES ÉTAGES ==================== */}
      
      {Array.from({ length: FLOORS - 1 }).map((_, i) => (
        <mesh
          key={`floor-separator-${i}`}
          position={[0, (i + 1) * FLOOR_HEIGHT, BUILDING_DEPTH / 2 + 0.05]}
          castShadow
        >
          <boxGeometry args={[BUILDING_WIDTH, 0.3, 0.1]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* ==================== FENÊTRES ==================== */}
      
      {/* Fenêtres sur la façade avant */}
      {Array.from({ length: FLOORS }).map((_, floor) => 
        Array.from({ length: 8 }).map((_, i) => {
          const windowY = floor * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
          const windowX = -BUILDING_WIDTH / 2 + 3 + i * ((BUILDING_WIDTH - 6) / 7);
          
          return (
            <group key={`window-front-${floor}-${i}`}>
              {/* Cadre fenêtre */}
              <mesh
                position={[windowX, windowY, BUILDING_DEPTH / 2 + 0.08]}
                castShadow
              >
                <boxGeometry args={[1.5, 2, 0.15]} />
                <meshStandardMaterial
                  color="#1a1a1a"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              
              {/* Vitre */}
              <mesh
                position={[windowX, windowY, BUILDING_DEPTH / 2 + 0.09]}
              >
                <boxGeometry args={[1.4, 1.9, 0.02]} />
                <meshStandardMaterial
                  color="#60a5fa"
                  metalness={0.95}
                  roughness={0.05}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* ==================== PORTES AU REZ-DE-CHAUSSÉE ==================== */}
      
      {type === 'maintenance' && (
        <>
          {/* Grande porte de garage pour équipements */}
          <mesh
            position={[0, 2, BUILDING_DEPTH / 2 + 0.08]}
            castShadow
          >
            <boxGeometry args={[6, 4, 0.2]} />
            <meshStandardMaterial
              color={doorColor}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          
          {/* Marquage "MAINTENANCE" */}
          <mesh
            position={[0, 6, BUILDING_DEPTH / 2 + 0.1]}
          >
            <boxGeometry args={[8, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#dc2626"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}

      {type === 'personnel' && (
        <>
          {/* Porte d'entrée principale */}
          <mesh
            position={[0, 1.5, BUILDING_DEPTH / 2 + 0.08]}
            castShadow
          >
            <boxGeometry args={[3, 3, 0.2]} />
            <meshStandardMaterial
              color={doorColor}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          
          {/* Marquage "PERSONNEL" */}
          <mesh
            position={[0, 6, BUILDING_DEPTH / 2 + 0.1]}
          >
            <boxGeometry args={[8, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}

      {/* ==================== TOIT ==================== */}
      
      {/* Toit plat avec bordures */}
      <mesh
        position={[0, BUILDING_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[BUILDING_WIDTH + 0.2, 0.3, BUILDING_DEPTH + 0.2]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Équipements sur le toit (climatisation, etc.) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = -BUILDING_WIDTH / 2 + 5 + i * ((BUILDING_WIDTH - 10) / 5);
        return (
          <mesh
            key={`roof-equipment-${i}`}
            position={[x, BUILDING_HEIGHT + 0.5, 0]}
            castShadow
          >
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        );
      })}

      {/* ==================== DÉTAILS LATÉRAUX ==================== */}
      
      {/* Escalier de secours (côté) */}
      {Array.from({ length: FLOORS - 1 }).map((_, i) => (
        <group key={`stairs-${i}`}>
          {/* Palier */}
          <mesh
            position={[-BUILDING_WIDTH / 2 - 1, (i + 1) * FLOOR_HEIGHT, 0]}
            castShadow
          >
            <boxGeometry args={[2, 0.1, 3]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Rampe */}
          <mesh
            position={[-BUILDING_WIDTH / 2 - 1, (i + 1) * FLOOR_HEIGHT + 0.5, 0]}
            castShadow
          >
            <boxGeometry args={[0.1, 1, 3]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== SIGNALÉTIQUE ==================== */}
      
      {type === 'maintenance' && (
        <group position={[-BUILDING_WIDTH / 2 + 2, 1.5, BUILDING_DEPTH / 2 + 0.12]}>
          {/* Panneaux de signalisation */}
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      )}

      {type === 'personnel' && (
        <>
          {/* Icônes pour les différentes zones */}
          {[
            { x: -BUILDING_WIDTH / 3, label: 'CHAMBRES', floor: 3 },
            { x: 0, label: 'CANTINE', floor: 1 },
            { x: BUILDING_WIDTH / 3, label: 'SANITAIRES', floor: 0.5 },
          ].map((zone, i) => (
            <mesh
              key={`zone-${i}`}
              position={[zone.x, zone.floor * FLOOR_HEIGHT + 1, BUILDING_DEPTH / 2 + 0.11]}
            >
              <boxGeometry args={[2, 0.5, 0.03]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.4}
              />
            </mesh>
          ))}
        </>
      )}

      {/* ==================== ÉCLAIRAGE EXTÉRIEUR ==================== */}
      
      {/* Lampadaires devant le bâtiment */}
      {[-BUILDING_WIDTH / 3, BUILDING_WIDTH / 3].map((x, i) => (
        <group key={`lamp-${i}`} position={[x, 0, BUILDING_DEPTH / 2 + 3]}>
          {/* Poteau */}
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Lampe */}
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* Lumière */}
          <pointLight
            position={[0, 2.5, 0]}
            color="#fbbf24"
            intensity={2}
            distance={15}
            castShadow
          />
        </group>
      ))}

      {/* ==================== SOL/FONDATION ==================== */}
      
      {/* Dalle de béton */}
      <mesh
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <boxGeometry args={[BUILDING_WIDTH + 2, 0.2, BUILDING_DEPTH + 4]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

