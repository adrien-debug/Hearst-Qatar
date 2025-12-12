import { useRef, useState, useEffect } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SubstationContainer3DProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

// Dimensions basées sur la description précise
// Module Inférieur (Conteneur Pelin) - Standard
const CONTAINER_LENGTH = 12.196;  // m (longueur standard conteneur)
const CONTAINER_WIDTH = 2.438;    // m (largeur standard conteneur)
const CONTAINER_HEIGHT = 2.896;   // m (hauteur standard conteneur)

// Module Supérieur (Structure avec radiateur en V) - Même longueur/largeur, hauteur moitié
const UPPER_STRUCTURE_LENGTH = 12.196;  // m (même longueur)
const UPPER_STRUCTURE_WIDTH = 2.438;     // m (même largeur)
const UPPER_STRUCTURE_HEIGHT = 1.448;  // m (environ la moitié du conteneur)

export default function SubstationContainer3D({ 
  position, 
  containerId, 
  onSelect,
  isSelected = false 
}: SubstationContainer3DProps) {
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
      {/* ========== MODULE INFÉRIEUR - CONTENEUR PELIN ========== */}
      
      {/* Structure principale du conteneur (blanc cassé/gris clair) */}
      <mesh position={[0, CONTAINER_HEIGHT/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[CONTAINER_LENGTH, CONTAINER_HEIGHT, CONTAINER_WIDTH]} />
        <meshStandardMaterial 
          color={isSelected ? '#e8e8e8' : '#f5f5f5'} 
          metalness={0.1}
          roughness={0.7}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Tôle ondulée verticale caractéristique des conteneurs de fret */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh 
          key={`corrugation-vertical-${i}`}
          position={[-CONTAINER_LENGTH/2 + 0.5 + i * 1, CONTAINER_HEIGHT/2, CONTAINER_WIDTH/2 + 0.01]} 
          castShadow
        >
          <boxGeometry args={[0.8, CONTAINER_HEIGHT * 0.95, 0.02]} />
          <meshStandardMaterial 
            color="#f0f0f0" 
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Éléments structurels renforcés aux coins (plus épais et lisses) */}
      {[
        [-CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2, CONTAINER_WIDTH/2],
        [CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2, CONTAINER_WIDTH/2],
        [-CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2, -CONTAINER_WIDTH/2],
        [CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2, -CONTAINER_WIDTH/2],
      ].map((corner, i) => (
        <group key={`corner-${i}`} position={corner as [number, number, number]}>
          {/* Coin vertical */}
          <mesh castShadow>
            <boxGeometry args={[0.15, CONTAINER_HEIGHT, 0.15]} />
            <meshStandardMaterial 
              color="#e0e0e0" 
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Logo ANTSPACE au centre de la face avant (A stylisé avec icône de fourmi) */}
      <group position={[0, CONTAINER_HEIGHT/2 + 0.3, CONTAINER_WIDTH/2 + 0.02]}>
        {/* Icône stylisée (fourmi/circuit) au-dessus du texte */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
        {/* Texte "ANTSPACE" */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.25, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Marquage "BITMAIN" coin inférieur gauche */}
      <mesh position={[-CONTAINER_LENGTH/2 + 0.3, CONTAINER_HEIGHT/2 - 1.2, CONTAINER_WIDTH/2 + 0.02]}>
        <boxGeometry args={[1.0, 0.2, 0.01]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* Marquage "HD5" coin inférieur droit avec icône carrée */}
      <group position={[CONTAINER_LENGTH/2 - 0.6, CONTAINER_HEIGHT/2 - 1.2, CONTAINER_WIDTH/2 + 0.02]}>
        {/* Petite icône carrée */}
        <mesh position={[-0.15, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
        {/* Texte "HD5" */}
        <mesh position={[0.1, 0, 0]}>
          <boxGeometry args={[0.5, 0.2, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Protubérance rectangulaire horizontale côté gauche (milieu-gauche face latérale) avec grille d'aération */}
      <group position={[-CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2, 0]}>
        {/* Protubérance */}
        <mesh position={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
        {/* Grille d'aération sur le côté gauche de la protubérance */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh 
            key={`protrusion-grill-${i}`}
            position={[-0.3, -0.15 + i * 0.05, 0]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.03, 0.3]} />
            <meshStandardMaterial 
              color="#1f2937" 
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Grille d'aération rectangulaire verticale coin inférieur gauche extrême */}
      <mesh position={[-CONTAINER_LENGTH/2 - 0.01, CONTAINER_HEIGHT/2 - 1.3, -CONTAINER_WIDTH/2 + 0.15]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.6}
          roughness={0.4}
          opacity={0.8}
          transparent
        />
      </mesh>

      {/* Verrous de conteneur aux coins */}
      {[
        [-CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2 + 0.1, CONTAINER_WIDTH/2 + 0.05],
        [CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2 + 0.1, CONTAINER_WIDTH/2 + 0.05],
        [-CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2 + 0.1, -CONTAINER_WIDTH/2 - 0.05],
        [CONTAINER_LENGTH/2, CONTAINER_HEIGHT/2 + 0.1, -CONTAINER_WIDTH/2 - 0.05],
      ].map((lockPos, i) => (
        <mesh key={`lock-${i}`} position={lockPos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial 
            color="#4a5568" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ========== MODULE SUPÉRIEUR - STRUCTURE AVEC RADIATEUR EN V ========== */}
      
      {/* Cadre extérieur lisse blanc */}
      <mesh position={[0, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2, 0]} castShadow>
        <boxGeometry args={[UPPER_STRUCTURE_LENGTH, UPPER_STRUCTURE_HEIGHT, UPPER_STRUCTURE_WIDTH]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* Structure verticale blanche fine supportant les panneaux en V */}
      {Array.from({ length: 9 }).map((_, i) => {
        const strutSpacing = UPPER_STRUCTURE_LENGTH / 9;
        const strutX = -UPPER_STRUCTURE_LENGTH/2 + i * strutSpacing;
        return (
          <mesh 
            key={`strut-${i}`}
            position={[strutX, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2, UPPER_STRUCTURE_WIDTH/2 - 0.05]} 
            castShadow
          >
            <boxGeometry args={[0.04, UPPER_STRUCTURE_HEIGHT * 0.9, 0.04]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.1}
              roughness={0.6}
            />
          </mesh>
        );
      })}

      {/* Logo ANTSPACE et texte BITMAIN sur la bande blanche au-dessus des panneaux (face avant) */}
      <group position={[-UPPER_STRUCTURE_LENGTH/2 + 1.5, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT - 0.1, UPPER_STRUCTURE_WIDTH/2 + 0.01]}>
        {/* Logo ANTSPACE (petit) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
      </group>
      <mesh position={[UPPER_STRUCTURE_LENGTH/2 - 1, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT - 0.1, UPPER_STRUCTURE_WIDTH/2 + 0.01]}>
        <boxGeometry args={[0.5, 0.1, 0.01]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* 8 Panneaux inclinés en forme de persiennes - bleu-gris foncé avec intérieur visible */}
      {Array.from({ length: 8 }).map((_, i) => {
        const panelSpacing = UPPER_STRUCTURE_LENGTH / 9;
        const panelX = -UPPER_STRUCTURE_LENGTH/2 + (i + 0.5) * panelSpacing;
        const panelHeight = UPPER_STRUCTURE_HEIGHT * 0.9;
        const panelWidth = panelSpacing * 0.85;
        // Angle d'inclinaison uniforme (de haut à gauche vers le bas à droite) - environ 25-30 degrés
        const angle = -Math.PI / 7;
        
        return (
          <group key={`v-panel-${i}`}>
            {/* Panneau incliné principal (bleu-gris foncé) */}
            <mesh 
              position={[panelX, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2, UPPER_STRUCTURE_WIDTH/2 - 0.08]}
              rotation={[angle, 0, 0]}
              castShadow
            >
              <boxGeometry args={[panelWidth, panelHeight, 0.12]} />
              <meshStandardMaterial 
                color="#334155" 
                metalness={0.35}
                roughness={0.35}
              />
            </mesh>
            {/* Intérieur bleu foncé visible derrière le panneau (radiateur/échangeur de chaleur) */}
            <mesh 
              position={[panelX, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2 - 0.05, UPPER_STRUCTURE_WIDTH/2 - 0.15]}
              rotation={[angle, 0, 0]}
            >
              <boxGeometry args={[panelWidth * 0.92, panelHeight * 0.85, 0.08]} />
              <meshStandardMaterial 
                color="#1e293b" 
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Grand compartiment extrémité gauche avec système de refroidissement complexe */}
      <group position={[-UPPER_STRUCTURE_LENGTH/2, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2, 0]}>
        {/* Structure principale du compartiment (blanc) */}
        <mesh position={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.7, UPPER_STRUCTURE_HEIGHT, UPPER_STRUCTURE_WIDTH]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1}
            roughness={0.6}
          />
        </mesh>

        {/* Face avant trapézoïdale (section centrale blanche inclinée) */}
        <mesh 
          position={[0, -UPPER_STRUCTURE_HEIGHT/4, UPPER_STRUCTURE_WIDTH/2 + 0.01]} 
          rotation={[Math.PI / 12, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.5, UPPER_STRUCTURE_HEIGHT * 0.6, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1}
            roughness={0.6}
          />
        </mesh>

        {/* Boîtier de commande rectangulaire blanc sur la face avant */}
        <group position={[0, -UPPER_STRUCTURE_HEIGHT/4, UPPER_STRUCTURE_WIDTH/2 + 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.15, 0.05]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.1}
              roughness={0.6}
            />
          </mesh>
          {/* Voyant rouge en haut */}
          <mesh position={[0, 0.04, 0.03]}>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
            <meshStandardMaterial 
              color={ledBlink ? "#ff0000" : "#cc0000"} 
              emissive="#ff0000"
              emissiveIntensity={ledBlink ? 0.5 : 0.2}
            />
          </mesh>
          {/* Voyant vert en bas */}
          <mesh position={[0, -0.04, 0.03]}>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Flèche jaune pointant vers le haut */}
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.02, 0.03, 3]} />
            <meshStandardMaterial 
              color="#ffd700" 
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          {/* Élément cylindrique horizontal noir (enrouleur de câble/moteur) */}
          <mesh position={[0, -0.08, 0.03]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 16]} />
            <meshStandardMaterial 
              color="#1a1a1a" 
              metalness={0.4}
              roughness={0.7}
            />
          </mesh>
        </group>

        {/* Conduits diagonaux argentés (depuis les coins supérieurs vers le bas) */}
        {[
          [-0.2, UPPER_STRUCTURE_HEIGHT/2 - 0.1, UPPER_STRUCTURE_WIDTH/2 + 0.05],
          [0.2, UPPER_STRUCTURE_HEIGHT/2 - 0.1, UPPER_STRUCTURE_WIDTH/2 + 0.05],
        ].map((startPos, i) => (
          <mesh 
            key={`diagonal-conduit-${i}`}
            position={[startPos[0], startPos[1] - 0.3, startPos[2]]}
            rotation={[Math.PI / 6, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.4, 0.08]} />
            <meshStandardMaterial 
              color="#c0c0c0" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Inscriptions sur le cadre vertical gauche : "45SX" et "KSBU 8143280" */}
        <mesh position={[-0.65, UPPER_STRUCTURE_HEIGHT/2 - 0.2, UPPER_STRUCTURE_WIDTH/2 + 0.01]}>
          <boxGeometry args={[0.15, 0.05, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
        <mesh position={[-0.65, UPPER_STRUCTURE_HEIGHT/2 - 0.4, UPPER_STRUCTURE_WIDTH/2 + 0.01]}>
          <boxGeometry args={[0.25, 0.05, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>

        {/* Étiquettes d'information sur la traverse supérieure (MAX. GROSS, TARE, NET, CU. CAP.) */}
        <mesh position={[0, UPPER_STRUCTURE_HEIGHT/2 - 0.05, UPPER_STRUCTURE_WIDTH/2 + 0.01]}>
          <boxGeometry args={[0.4, 0.03, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>

        {/* Marquages de danger rayés jaune et noir (coins inférieurs du cadre avant) */}
        {[
          [-0.25, -UPPER_STRUCTURE_HEIGHT/2 + 0.1, UPPER_STRUCTURE_WIDTH/2 + 0.01],
          [0.25, -UPPER_STRUCTURE_HEIGHT/2 + 0.1, UPPER_STRUCTURE_WIDTH/2 + 0.01],
        ].map((pos, i) => (
          <mesh key={`danger-stripe-${i}`} position={pos as [number, number, number]}>
            <boxGeometry args={[0.15, 0.1, 0.01]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#ffd700" : "#000000"} 
              metalness={0.0}
              roughness={0.9}
            />
          </mesh>
        ))}

        {/* Ailettes de radiateur verticales claires (côté gauche du compartiment) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh 
            key={`radiator-fin-${i}`}
            position={[-0.6, -UPPER_STRUCTURE_HEIGHT/2 + 0.1 + i * (UPPER_STRUCTURE_HEIGHT - 0.2) / 12, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, (UPPER_STRUCTURE_HEIGHT - 0.2) / 12, UPPER_STRUCTURE_WIDTH * 0.85]} />
            <meshStandardMaterial 
              color="#e0e0e0" 
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        ))}

        {/* Grille de radiateur derrière les tuyaux (côté gauche) */}
        <mesh 
          position={[-0.55, 0, 0]} 
          castShadow
        >
          <boxGeometry args={[0.1, UPPER_STRUCTURE_HEIGHT * 0.8, UPPER_STRUCTURE_WIDTH * 0.85]} />
          <meshStandardMaterial 
            color="#d0d0d0" 
            metalness={0.3}
            roughness={0.4}
            opacity={0.7}
            transparent
          />
        </mesh>

        {/* Tubes et tuyaux métalliques argentés horizontaux et verticaux */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={`vent-pipe-h-${i}`}
            position={[-0.25, -UPPER_STRUCTURE_HEIGHT/2 + 0.15 + i * 0.2, UPPER_STRUCTURE_WIDTH/2 + 0.15]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
            <meshStandardMaterial 
              color="#c0c0c0" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Tuyaux verticaux se connectant vers les radiateurs en V */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh 
            key={`connector-pipe-v-${i}`}
            position={[0.1, CONTAINER_HEIGHT + 0.2 + i * 0.25, UPPER_STRUCTURE_WIDTH/2 - 0.05]}
            rotation={[0, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, 0.4, 16]} />
            <meshStandardMaterial 
              color="#c0c0c0" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Poignée verticale blanche extrémité droite */}
      <group position={[UPPER_STRUCTURE_LENGTH/2, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2, UPPER_STRUCTURE_WIDTH/2 + 0.05]}>
        {/* Poignée verticale principale */}
        <mesh castShadow>
          <boxGeometry args={[0.08, UPPER_STRUCTURE_HEIGHT * 0.6, 0.06]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1}
            roughness={0.6}
          />
        </mesh>
        {/* Petite boîte/capteur rectangulaire blanc attaché juste en dessous */}
        <mesh 
          position={[0, -UPPER_STRUCTURE_HEIGHT/3, 0.05]}
          castShadow
        >
          <boxGeometry args={[0.12, 0.08, 0.04]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Côté droit de l'unité supérieure : sections bleues avec barre diagonale blanche (environ 10 sections) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const sectionSpacing = UPPER_STRUCTURE_HEIGHT / 11;
        const sectionY = -UPPER_STRUCTURE_HEIGHT/2 + (i + 0.5) * sectionSpacing;
        return (
          <group key={`right-section-${i}`} position={[UPPER_STRUCTURE_LENGTH/2 - 0.05, CONTAINER_HEIGHT + sectionY, 0]}>
            {/* Section bleue principale */}
            <mesh castShadow>
              <boxGeometry args={[0.1, sectionSpacing * 0.8, UPPER_STRUCTURE_WIDTH * 0.9]} />
              <meshStandardMaterial 
                color="#1e3a5f" 
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            {/* Barre diagonale blanche (de haut gauche au bas droit) */}
            <mesh 
              position={[0, 0, UPPER_STRUCTURE_WIDTH/2 - 0.01]}
              rotation={[0, 0, Math.PI / 4]}
              castShadow
            >
              <boxGeometry args={[sectionSpacing * 1.2, 0.02, 0.01]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.1}
                roughness={0.6}
              />
            </mesh>
          </group>
        );
      })}

      {/* Tuyaux métalliques argentés au-dessus des radiateurs en V (s'étendant du module de ventilation gauche) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh 
          key={`overhead-pipe-${i}`}
          position={[-UPPER_STRUCTURE_LENGTH/2 + 0.5 + i * 2, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT - 0.05, UPPER_STRUCTURE_WIDTH/2 - 0.03]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.02, 1.5, 16]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* 4 Conduits métalliques verticaux argentés reliant les deux unités (visibles sur la face avant) */}
      {Array.from({ length: 4 }).map((_, i) => {
        const conduitSpacing = CONTAINER_LENGTH / 5;
        const conduitX = -CONTAINER_LENGTH/2 + (i + 1) * conduitSpacing;
        return (
          <mesh 
            key={`vertical-conduit-${i}`}
            position={[conduitX, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT/2, CONTAINER_WIDTH/2 + 0.05]}
            castShadow
          >
            <cylinderGeometry args={[0.04, 0.04, UPPER_STRUCTURE_HEIGHT * 0.8, 16]} />
            <meshStandardMaterial 
              color="#c0c0c0" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      {/* Ventilateur/tuyau sur le dessus (vers l'extrémité gauche) */}
      <group position={[-UPPER_STRUCTURE_LENGTH/2 + 0.5, CONTAINER_HEIGHT + UPPER_STRUCTURE_HEIGHT + 0.08, UPPER_STRUCTURE_WIDTH/2 - 0.3]}>
        {/* Tuyau/cheminée métallique verticale */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}
