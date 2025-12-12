import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface Substation120MWProps {
  position: [number, number, number];
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Substation haute tension 120 MW ULTRA-RÉALISTE
 * 
 * Basée sur les spécifications réelles d'une substation électrique industrielle:
 * - Dimensions: 60m × 35m (emprise au sol)
 * - 2 transformateurs principaux de 60 MVA chacun
 * - Disjoncteurs haute tension (138 kV ou 230 kV)
 * - Barres omnibus (busbars)
 * - Sectionneurs
 * - Transformateurs d'instrumentation
 * - Bâtiment de contrôle
 * - Pylônes haute tension
 * - Clôture de sécurité
 */
export default function Substation120MW({
  position,
  onSelect,
  isSelected = false,
}: Substation120MWProps) {
  const groupRef = useRef<Group>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect('Substation_120MW');
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      name="Substation_120MW"
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* ==================== FONDATION ET ZONE DE GRAVIER ==================== */}
      {/* Plateforme en gravier concassé (emprise complète) */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[65, 0.3, 40]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.0}
          roughness={1.0}
        />
      </mesh>

      {/* Bordure en béton autour de la plateforme */}
      {[
        // Bordures latérales
        { pos: [-32.5, 0.4, 0], size: [0.5, 0.8, 40] },
        { pos: [32.5, 0.4, 0], size: [0.5, 0.8, 40] },
        // Bordures avant/arrière
        { pos: [0, 0.4, -20], size: [65, 0.8, 0.5] },
        { pos: [0, 0.4, 20], size: [65, 0.8, 0.5] },
      ].map((border, i) => (
        <mesh key={`border-${i}`} position={border.pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={border.size as [number, number, number]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* ==================== BÂTIMENT DE CONTRÔLE ==================== */}
      <group position={[-22, 0, -12]}>
        {/* Structure principale du bâtiment */}
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 8, 10]} />
          <meshStandardMaterial
            color={isSelected ? '#4a9eff' : '#374151'}
            metalness={0.3}
            roughness={0.7}
            emissive={isSelected ? '#1e40af' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>

        {/* Toit plat avec équipements */}
        <mesh position={[0, 8.2, 0]} castShadow>
          <boxGeometry args={[14.5, 0.4, 10.5]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>

        {/* Fenêtres sur la face avant */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh
            key={`window-front-${i}`}
            position={[-5 + i * 3.3, 4, 5.1]}
          >
            <boxGeometry args={[1.8, 2.5, 0.1]} />
            <meshStandardMaterial
              color="#1e3a8a"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}

        {/* Fenêtres sur le côté */}
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh
            key={`window-side-${i}`}
            position={[7.1, 4, -3 + i * 3]}
          >
            <boxGeometry args={[0.1, 2.5, 1.8]} />
            <meshStandardMaterial
              color="#1e3a8a"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}

        {/* Porte d'entrée */}
        <mesh position={[0, 2, 5.1]} castShadow>
          <boxGeometry args={[2.5, 4, 0.2]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>

        {/* Climatiseurs sur le toit */}
        {[-4, 0, 4].map((x, i) => (
          <group key={`ac-${i}`} position={[x, 8.6, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2, 0.8, 1.5]} />
              <meshStandardMaterial
                color="#6b7280"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            {/* Grilles de ventilation */}
            <mesh position={[0, 0.45, 0.76]}>
              <boxGeometry args={[1.8, 0.05, 0.05]} />
              <meshStandardMaterial
                color="#374151"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Antenne communication sur le toit */}
        <group position={[6, 8.4, -4]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 4.3, 0]} castShadow>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* ==================== TRANSFORMATEURS PRINCIPAUX (2 × 60 MVA) ==================== */}
      {[-10, 10].map((x, i) => (
        <group key={`main-transformer-${i}`} position={[x, 0, 5]}>
          {/* Plateforme de rétention en béton */}
          <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
            <boxGeometry args={[8, 0.8, 6]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>

          {/* Murs de rétention d'huile (bac de rétention) */}
          {[
            { pos: [-4, 1, 0], size: [0.3, 1.2, 6] },
            { pos: [4, 1, 0], size: [0.3, 1.2, 6] },
            { pos: [0, 1, -3], size: [8, 1.2, 0.3] },
            { pos: [0, 1, 3], size: [8, 1.2, 0.3] },
          ].map((wall, j) => (
            <mesh key={`wall-${i}-${j}`} position={wall.pos as [number, number, number]} castShadow>
              <boxGeometry args={wall.size as [number, number, number]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
          ))}

          {/* Corps principal du transformateur (cuve) */}
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 5, 4]} />
            <meshStandardMaterial
              color="#10b981"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>

          {/* Conservateur d'huile (réservoir supérieur) */}
          <mesh position={[0, 6.5, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
            <meshStandardMaterial
              color="#059669"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>

          {/* Radiateurs de refroidissement (ailettes) */}
          {[-2.5, -1.5, 1.5, 2.5].map((z, j) => (
            <group key={`radiator-${i}-${j}`} position={[3.2, 3.5, z]}>
              {/* Panneaux radiateurs verticaux */}
              <mesh castShadow>
                <boxGeometry args={[0.4, 4.5, 0.6]} />
                <meshStandardMaterial
                  color="#6b7280"
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
              {/* Tubes de circulation */}
              {Array.from({ length: 8 }).map((_, k) => (
                <mesh
                  key={`tube-${k}`}
                  position={[0, -2 + k * 0.6, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  castShadow
                >
                  <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
                  <meshStandardMaterial
                    color="#4b5563"
                    metalness={0.8}
                    roughness={0.3}
                  />
                </mesh>
              ))}
            </group>
          ))}

          {/* Radiateurs côté gauche */}
          {[-2.5, -1.5, 1.5, 2.5].map((z, j) => (
            <group key={`radiator-left-${i}-${j}`} position={[-3.2, 3.5, z]}>
              <mesh castShadow>
                <boxGeometry args={[0.4, 4.5, 0.6]} />
                <meshStandardMaterial
                  color="#6b7280"
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
              {Array.from({ length: 8 }).map((_, k) => (
                <mesh
                  key={`tube-${k}`}
                  position={[0, -2 + k * 0.6, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  castShadow
                >
                  <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
                  <meshStandardMaterial
                    color="#4b5563"
                    metalness={0.8}
                    roughness={0.3}
                  />
                </mesh>
              ))}
            </group>
          ))}

          {/* Traversées haute tension (bushing) - Côté haute tension */}
          {[-1.5, 0, 1.5].map((z, j) => (
            <group key={`ht-bushing-${i}-${j}`} position={[0, 6.3, z]}>
              {/* Isolateur en porcelaine */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.3, 2.4, 16]} />
                <meshStandardMaterial
                  color="#f3f4f6"
                  metalness={0.0}
                  roughness={0.3}
                />
              </mesh>
              {/* Anneaux de protection */}
              {[0.3, 0.9, 1.5].map((y, k) => (
                <mesh key={`ring-${k}`} position={[0, y, 0]}>
                  <torusGeometry args={[0.35, 0.05, 16, 32]} />
                  <meshStandardMaterial
                    color="#e5e7eb"
                    metalness={0.1}
                    roughness={0.4}
                  />
                </mesh>
              ))}
              {/* Borne de connexion */}
              <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  metalness={0.95}
                  roughness={0.1}
                  emissive="#fbbf24"
                  emissiveIntensity={0.1}
                />
              </mesh>
            </group>
          ))}

          {/* Traversées basse tension - Côté opposé */}
          {[-1, 0, 1].map((z, j) => (
            <group key={`lt-bushing-${i}-${j}`} position={[0, 6.3, z + (i === 0 ? -6 : 6)]}>
              <mesh position={[0, 0.8, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.25, 1.6, 16]} />
                <meshStandardMaterial
                  color="#f3f4f6"
                  metalness={0.0}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[0, 1.7, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  metalness={0.95}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))}

          {/* Plaque signalétique */}
          <mesh position={[3.1, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#f9fafb"
              metalness={0.3}
              roughness={0.6}
            />
          </mesh>

          {/* Vannes de vidange */}
          {[-2, 2].map((z, j) => (
            <mesh
              key={`valve-${i}-${j}`}
              position={[-3.1, 1.5, z]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
              <meshStandardMaterial
                color="#1f2937"
                metalness={0.8}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* ==================== DISJONCTEURS HAUTE TENSION ==================== */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={`circuit-breaker-${i}`} position={[x, 0, z]}>
            {/* Base en béton */}
            <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
              <boxGeometry args={[2.5, 1, 2.5]} />
              <meshStandardMaterial
                color="#6b7280"
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>

            {/* Corps principal du disjoncteur (SF6) */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.8, 0.8, 3, 24]} />
              <meshStandardMaterial
                color="#374151"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Capot métallique supérieur */}
            <mesh position={[0, 4.2, 0]} castShadow>
              <cylinderGeometry args={[0.85, 0.8, 0.4, 24]} />
              <meshStandardMaterial
                color="#1f2937"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Isolateurs supérieurs (3 phases) */}
            {[-0.6, 0, 0.6].map((offset, j) => (
              <group key={`insulator-${i}-${j}`} position={[offset, 4.5, 0]}>
                <mesh position={[0, 0.8, 0]} castShadow>
                  <cylinderGeometry args={[0.15, 0.18, 1.6, 16]} />
                  <meshStandardMaterial
                    color="#f3f4f6"
                    metalness={0.0}
                    roughness={0.2}
                  />
                </mesh>
                {/* Anneaux d'isolation */}
                {[0.3, 0.8].map((y, k) => (
                  <mesh key={`ring-${k}`} position={[0, y, 0]}>
                    <torusGeometry args={[0.22, 0.03, 12, 24]} />
                    <meshStandardMaterial
                      color="#e5e7eb"
                      metalness={0.1}
                      roughness={0.3}
                    />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Connexion haute tension */}
            <mesh position={[0, 6.5, 0]} castShadow>
              <boxGeometry args={[2, 0.2, 0.2]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.95}
                roughness={0.1}
                emissive="#fbbf24"
                emissiveIntensity={0.15}
              />
            </mesh>

            {/* Mécanisme de commande (actionneur) */}
            <mesh position={[0, 1.2, 0.9]} castShadow>
              <boxGeometry args={[0.6, 0.8, 0.5]} />
              <meshStandardMaterial
                color="#1f2937"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== SECTIONNEURS ==================== */}
      {[
        { pos: [-15, 0, -10], rot: 0 },
        { pos: [15, 0, -10], rot: 0 },
        { pos: [-15, 0, 10], rot: Math.PI },
        { pos: [15, 0, 10], rot: Math.PI },
      ].map((disconnector, i) => (
        <group
          key={`disconnector-${i}`}
          position={disconnector.pos as [number, number, number]}
          rotation={[0, disconnector.rot, 0]}
        >
          {/* Base */}
          <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.5, 0.6, 1.5]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>

          {/* Colonnes isolantes (3 phases) */}
          {[-0.6, 0, 0.6].map((z, j) => (
            <group key={`phase-${j}`} position={[0, 0, z]}>
              {/* Isolateur vertical */}
              <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.15, 4.5, 16]} />
                <meshStandardMaterial
                  color="#f3f4f6"
                  metalness={0.0}
                  roughness={0.3}
                />
              </mesh>
              {/* Lame mobile (ouverte à 45°) */}
              <mesh position={[0.8, 4.5, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <boxGeometry args={[2, 0.1, 0.15]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  metalness={0.95}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ==================== BARRES OMNIBUS (BUSBARS) ==================== */}
      {/* Barre principale haute */}
      <group position={[0, 8, 0]}>
        {/* Barres horizontales */}
        {[-0.4, 0, 0.4].map((z, i) => (
          <mesh key={`busbar-main-${i}`} position={[0, 0, z]} castShadow>
            <boxGeometry args={[50, 0.3, 0.3]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.1}
              emissive="#fbbf24"
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}

        {/* Supports isolants */}
        {[-20, -10, 0, 10, 20].map((x, i) => (
          <group key={`busbar-support-${i}`} position={[x, -1.5, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.22, 3, 16]} />
              <meshStandardMaterial
                color="#f3f4f6"
                metalness={0.0}
                roughness={0.3}
              />
            </mesh>
            {/* Support métallique */}
            <mesh position={[0, -1.8, 0]} castShadow>
              <boxGeometry args={[0.3, 0.6, 0.3]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ==================== PYLÔNES HAUTE TENSION ==================== */}
      {[
        { pos: [-28, 0, -15], rot: 0 },
        { pos: [28, 0, -15], rot: 0 },
        { pos: [-28, 0, 15], rot: 0 },
        { pos: [28, 0, 15], rot: 0 },
      ].map((pylon, i) => (
        <group
          key={`pylon-${i}`}
          position={pylon.pos as [number, number, number]}
          rotation={[0, pylon.rot, 0]}
        >
          {/* Base en béton */}
          <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
            <boxGeometry args={[3, 1, 3]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>

          {/* Structure en treillis */}
          {/* Poteaux principaux */}
          {[
            [-0.8, -0.8],
            [0.8, -0.8],
            [-0.8, 0.8],
            [0.8, 0.8],
          ].map((pos, j) => (
            <mesh key={`post-${j}`} position={[pos[0], 8, pos[1]]} castShadow>
              <boxGeometry args={[0.3, 14, 0.3]} />
              <meshStandardMaterial
                color="#1f2937"
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
          ))}

          {/* Traverses horizontales */}
          {[3, 6, 9, 12].map((y, j) => (
            <group key={`cross-${j}`} position={[0, y, 0]}>
              <mesh castShadow>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshStandardMaterial
                  color="#374151"
                  metalness={0.8}
                  roughness={0.4}
                />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshStandardMaterial
                  color="#374151"
                  metalness={0.8}
                  roughness={0.4}
                />
              </mesh>
            </group>
          ))}

          {/* Bras porte-isolateurs (3 niveaux) */}
          {[13, 14, 15].map((y, level) => (
            <group key={`arm-level-${level}`} position={[0, y, 0]}>
              {/* Bras gauche et droit */}
              {[-1, 1].map((side, j) => (
                <group key={`arm-${j}`} position={[side * 2, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[3, 0.25, 0.25]} />
                    <meshStandardMaterial
                      color="#1f2937"
                      metalness={0.9}
                      roughness={0.3}
                    />
                  </mesh>
                  {/* Chaîne d'isolateurs */}
                  <group position={[side * 1.8, -1.5, 0]}>
                    {[0, 1, 2, 3].map((seg, k) => (
                      <mesh key={`insulator-seg-${k}`} position={[0, -k * 0.4, 0]} castShadow>
                        <cylinderGeometry args={[0.12, 0.15, 0.35, 16]} />
                        <meshStandardMaterial
                          color="#f3f4f6"
                          metalness={0.0}
                          roughness={0.2}
                        />
                      </mesh>
                    ))}
                    {/* Conducteur */}
                    <mesh position={[0, -2, 0]} castShadow>
                      <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
                      <meshStandardMaterial
                        color="#fbbf24"
                        metalness={0.95}
                        roughness={0.1}
                      />
                    </mesh>
                  </group>
                </group>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* ==================== TRANSFORMATEURS D'INSTRUMENTATION ==================== */}
      {[
        { pos: [-18, 0, 0] },
        { pos: [18, 0, 0] },
      ].map((ti, i) => (
        <group key={`instrument-transformer-${i}`} position={ti.pos as [number, number, number]}>
          {/* Base */}
          <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.2, 0.6, 1.2]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>

          {/* TT (Transformateur de tension) */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 1.8, 16]} />
            <meshStandardMaterial
              color="#6366f1"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* Isolateur supérieur */}
          <mesh position={[0, 2.8, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 1, 16]} />
            <meshStandardMaterial
              color="#f3f4f6"
              metalness={0.0}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== CLÔTURE DE SÉCURITÉ ==================== */}
      {/* Poteaux de clôture */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 33;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={`fence-post-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 3, 12]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* Panneaux d'avertissement */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
        const radius = 33;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={`warning-sign-${i}`} position={[x, 1.5, z]} rotation={[0, angle + Math.PI, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.8, 0.05]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.3}
                roughness={0.6}
                emissive="#fbbf24"
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Symbole danger haute tension (triangle) */}
            <mesh position={[0, 0, 0.03]}>
              <coneGeometry args={[0.3, 0.5, 3]} />
              <meshStandardMaterial
                color="#000000"
                metalness={0.0}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== ÉCLAIRAGE DE SÉCURITÉ ==================== */}
      {[
        { pos: [-25, 0, -12] },
        { pos: [25, 0, -12] },
        { pos: [-25, 0, 12] },
        { pos: [25, 0, 12] },
      ].map((light, i) => (
        <group key={`security-light-${i}`} position={light.pos as [number, number, number]}>
          {/* Poteau */}
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 8, 16]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
          {/* Projecteur */}
          <mesh position={[0, 8.2, 0]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.5]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Lumière émissive */}
          <mesh position={[0, 8, 0.3]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.05]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}


