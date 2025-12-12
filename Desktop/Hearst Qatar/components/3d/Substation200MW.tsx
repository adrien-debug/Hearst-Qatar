import { useRef } from 'react';
import { Group, Mesh } from 'three';
import * as THREE from 'three';

interface Substation200MWProps {
  position: [number, number, number];
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Substation haute tension 120 MW réaliste
 * Structure industrielle avec pylônes, transformateurs, disjoncteurs
 * 
 * Dimensions ajustées par rapport aux power blocks de 25 MW (18m × 6m × 5m) :
 * - Longueur : 40m (≈2.2× un power block)
 * - Largeur : 18m (≈3× un power block)
 * - Hauteur : 12m (≈2.4× un power block)
 * 
 * Une substation de 120 MW alimente 4 power blocks de 25 MW chacun.
 */
export default function Substation200MW({
  position,
  onSelect,
  isSelected = false,
}: Substation200MWProps) {
  const groupRef = useRef<Group>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect('Substation_200MW');
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      name="Substation_200MW"
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Socle en béton pour la substation */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[42, 0.6, 20]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      {/* Structure principale - Bâtiment de contrôle RÉALISTE */}
      {/* Dimensions ajustées pour substation 120 MW : 40m × 12m × 18m */}
      <group position={[0, 6.5, 0]}>
        {/* Structure principale avec détails architecturaux */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[40, 12, 18]} />
          <meshStandardMaterial
            color={isSelected ? '#4a9eff' : '#4b5563'}
            metalness={0.6}
            roughness={0.4}
            emissive={isSelected ? '#1e40af' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>
        
        {/* Toit avec pente (structure réaliste) */}
        <mesh position={[0, 6.5, 0]} castShadow>
          <boxGeometry args={[42, 0.5, 20]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Fenêtres latérales (panneaux vitrés) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`window-${i}`}
            position={[-18 + i * 5, 3, 9.1]}
            castShadow={false}
          >
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial
              color="#1e3a8a"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.3}
              emissive="#1e3a8a"
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
        
        {/* Portes d'accès */}
        {[-1, 1].map((side, i) => (
          <mesh
            key={`door-${i}`}
            position={[side * 15, 2, 9.1]}
            castShadow
          >
            <boxGeometry args={[2, 4, 0.15]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
        
        {/* Ventilateurs de toit (extraction d'air) */}
        {[-12, -4, 4, 12].map((x, i) => (
          <group key={`ventilator-${i}`} position={[x, 6.8, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.8, 0.8, 0.3, 16]} />
              <meshStandardMaterial
                color="#6b7280"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Grille de ventilation */}
            <mesh position={[0, 0.16, 0]} castShadow={false}>
              <boxGeometry args={[1.6, 0.05, 1.6]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.9}
                roughness={0.2}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Pylônes haute tension (4 pylônes) - Positionnés proportionnellement à la nouvelle échelle */}
      {([
        [-18, 0, -9],
        [18, 0, -9],
        [-18, 0, 9],
        [18, 0, 9],
      ] as [number, number, number][]).map((pylonPos, i) => (
        <group key={`pylon-${i}`} position={pylonPos}>
          {/* Base du pylône */}
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[1.5, 4, 1.5]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Structure supérieure du pylône */}
          <mesh position={[0, 6, 0]} castShadow>
            <boxGeometry args={[0.8, 4, 0.8]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Isolateurs en haut */}
          {[0, 1, 2].map((j) => (
            <mesh
              key={`insulator-${i}-${j}`}
              position={[-1 + j * 1, 9, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.0}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Transformateurs de puissance (2 gros transformateurs) - RENDU RÉALISTE */}
      {[-12, 12].map((x, i) => (
        <group key={`main-transformer-${i}`} position={[x, 3, 0]}>
          {/* Corps principal du transformateur (cylindre réaliste) */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[2.5, 2.5, 4, 32]} />
            <meshStandardMaterial
              color="#059669"
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          
          {/* Capot supérieur */}
          <mesh position={[0, 4.5, 0]} castShadow>
            <cylinderGeometry args={[2.6, 2.5, 0.5, 32]} />
            <meshStandardMaterial
              color="#047857"
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
          
          {/* Capot inférieur */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <cylinderGeometry args={[2.5, 2.6, 0.5, 32]} />
            <meshStandardMaterial
              color="#047857"
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
          
          {/* Refroidisseurs latéraux (tubes de refroidissement) */}
          {[-1.5, 1.5].map((z, j) => (
            <group key={`cooler-${i}-${j}`} position={[0, 1, z]}>
              {Array.from({ length: 6 }).map((_, k) => (
                <mesh
                  key={`cooler-tube-${k}`}
                  position={[0, k * 0.6 - 1.5, 0]}
                  castShadow
                >
                  <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
                  <meshStandardMaterial
                    color="#6b7280"
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              ))}
            </group>
          ))}
          
          {/* Bornes haute tension (3 phases) */}
          {[-1, 0, 1].map((z, j) => (
            <mesh
              key={`terminal-${i}-${j}`}
              position={[0, 4.8, z * 1.2]}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.95}
                roughness={0.1}
                emissive="#fbbf24"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
          
          {/* Support en béton */}
          <mesh position={[0, -0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[3.5, 0.6, 3.5]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Disjoncteurs haute tension (6 unités) - RENDU RÉALISTE */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 16;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={`breaker-${i}`} position={[x, 2, z]}>
            {/* Support en béton */}
            <mesh position={[0, -0.3, 0]} receiveShadow castShadow>
              <boxGeometry args={[1.2, 0.6, 1.2]} />
              <meshStandardMaterial
                color="#6b7280"
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
            
            {/* Corps principal du disjoncteur (cylindre) */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.6, 0.6, 2.5, 16]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            
            {/* Capot supérieur */}
            <mesh position={[0, 2.9, 0]} castShadow>
              <cylinderGeometry args={[0.65, 0.6, 0.3, 16]} />
              <meshStandardMaterial
                color="#374151"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            
            {/* Isolateurs (3 phases) */}
            {[-0.4, 0, 0.4].map((offset, j) => (
              <mesh
                key={`insulator-${i}-${j}`}
                position={[offset, 3.5, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  metalness={0.0}
                  roughness={0.1}
                />
              </mesh>
            ))}
            
            {/* Barres de connexion */}
            <mesh position={[0, 4.2, 0]} castShadow>
              <boxGeometry args={[1.5, 0.1, 0.1]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.95}
                roughness={0.1}
                emissive="#fbbf24"
                emissiveIntensity={0.15}
              />
            </mesh>
          </group>
        );
      })}

      {/* Barres de connexion (busbars) - Ajustées pour nouvelle échelle */}
      <mesh position={[0, 12.5, 0]} castShadow>
        <boxGeometry args={[42, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.95}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 12.5, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 20]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.95}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
