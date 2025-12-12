import { useMemo } from 'react';
import * as THREE from 'three';

interface PositionProposal {
  position: [number, number, number];
  confidence: number;
  reason: string;
  source: string;
}

interface PositionProposalSystemProps {
  mousePosition: { x: number; y: number } | null;
  equipmentType: 'container' | 'generator' | 'transformer' | 'switchgear' | 'gravel' | 'none';
  existingObjects: Array<{
    id: string;
    type: string;
    position: [number, number, number];
  }>;
  roads: Array<{
    id: string;
    points: [number, number, number][];
    width?: number;
  }>;
  containers: Array<{
    id: string;
    position: [number, number, number];
  }>;
  enabled?: boolean;
  onProposalSelect?: (proposal: PositionProposal) => void;
}

export default function PositionProposalSystem({
  mousePosition,
  equipmentType,
  existingObjects,
  roads,
  containers,
  enabled = true,
  onProposalSelect,
}: PositionProposalSystemProps) {
  const proposals = useMemo(() => {
    if (!enabled || !mousePosition || equipmentType === 'none') return [];

    const proposals: PositionProposal[] = [];

    // LIMITER les calculs pour éviter les surcharges
    const MAX_ROADS = 10;
    const MAX_CONTAINERS = 20;
    const limitedRoads = roads.slice(0, MAX_ROADS);
    const limitedContainers = containers.slice(0, MAX_CONTAINERS);

    // Pour le gravier : suggérer des emplacements entre routes et conteneurs
    if (equipmentType === 'gravel') {
      limitedRoads.forEach((road) => {
        if (road.points.length < 2) return;

        // Trouver les conteneurs proches de cette route - LIMITER
        limitedContainers.forEach((container) => {
          const roadStart = new THREE.Vector3(...road.points[0]);
          const roadEnd = new THREE.Vector3(...road.points[road.points.length - 1]);
          const containerPos = new THREE.Vector3(...container.position);

          // Calculer le point le plus proche sur la route
          const roadDir = roadEnd.clone().sub(roadStart).normalize();
          const toContainer = containerPos.clone().sub(roadStart);
          const projection = toContainer.dot(roadDir);
          const closestPoint = roadStart.clone().add(roadDir.multiplyScalar(projection));

          // Distance entre le conteneur et la route
          const distance = containerPos.distanceTo(closestPoint);

          // Si la distance est raisonnable (entre 2m et 10m), suggérer un emplacement
          if (distance > 2 && distance < 10) {
            const midPoint = containerPos.clone().add(closestPoint).multiplyScalar(0.5);
            const confidence = 1 - (distance - 2) / 8; // Plus proche = plus confiant

            proposals.push({
              position: [midPoint.x, 0, midPoint.z],
              confidence: Math.max(0.3, confidence),
              reason: `Zone entre route et conteneur ${container.id}`,
              source: 'Analyse spatiale',
            });
          }
        });

        // Suggérer des emplacements entre deux routes parallèles - LIMITER
        limitedRoads.forEach((otherRoad) => {
          if (road.id === otherRoad.id || otherRoad.points.length < 2) return;

          const road1Start = new THREE.Vector3(...road.points[0]);
          const road1End = new THREE.Vector3(...road.points[road.points.length - 1]);
          const road2Start = new THREE.Vector3(...otherRoad.points[0]);
          const road2End = new THREE.Vector3(...otherRoad.points[otherRoad.points.length - 1]);

          // Vérifier si les routes sont approximativement parallèles
          const road1Dir = road1End.clone().sub(road1Start).normalize();
          const road2Dir = road2End.clone().sub(road2Start).normalize();
          const dotProduct = Math.abs(road1Dir.dot(road2Dir));

          // Si les routes sont parallèles (dot product proche de 1)
          if (dotProduct > 0.8) {
            const midPoint1 = road1Start.clone().add(road1End).multiplyScalar(0.5);
            const midPoint2 = road2Start.clone().add(road2End).multiplyScalar(0.5);
            const betweenPoint = midPoint1.clone().add(midPoint2).multiplyScalar(0.5);
            const distance = midPoint1.distanceTo(midPoint2);

            if (distance > 3 && distance < 15) {
              proposals.push({
                position: [betweenPoint.x, 0, betweenPoint.z],
                confidence: 0.7,
                reason: 'Zone entre deux routes parallèles',
                source: 'Analyse géométrique',
              });
            }
          }
        });
      });
    } else {
      // Pour les équipements : suggérer des emplacements alignés avec les conteneurs existants - LIMITER
      limitedContainers.forEach((container) => {
        const containerPos = new THREE.Vector3(...container.position);

        // Suggérer des positions alignées (grille)
        const spacing = 15; // Espacement standard entre conteneurs
        const offsets = [
          [spacing, 0],
          [-spacing, 0],
          [0, spacing],
          [0, -spacing],
          [spacing, spacing],
          [-spacing, -spacing],
        ];

        offsets.forEach(([dx, dz]) => {
          const proposedPos: [number, number, number] = [
            containerPos.x + dx,
            0,
            containerPos.z + dz,
          ];

          // Vérifier si l'emplacement est libre
          const isFree = !existingObjects.some((obj) => {
            const objPos = new THREE.Vector3(...obj.position);
            return objPos.distanceTo(new THREE.Vector3(...proposedPos)) < 5;
          });

          if (isFree) {
            proposals.push({
              position: proposedPos,
              confidence: 0.6,
              reason: `Aligné avec conteneur ${container.id}`,
              source: 'Grille standard',
            });
          }
        });
      });

      // Suggérer des emplacements près des routes - LIMITER
      limitedRoads.forEach((road) => {
        if (road.points.length < 2) return;

        const roadStart = new THREE.Vector3(...road.points[0]);
        const roadEnd = new THREE.Vector3(...road.points[road.points.length - 1]);
        const roadMid = roadStart.clone().add(roadEnd).multiplyScalar(0.5);
        const roadDir = roadEnd.clone().sub(roadStart).normalize();
        const perpendicular = new THREE.Vector3(-roadDir.z, 0, roadDir.x);

        // Suggérer des positions de chaque côté de la route
        const sideOffset = (road.width || 5) / 2 + 5; // 5m de marge
        [-1, 1].forEach((side) => {
          const proposedPos: [number, number, number] = [
            roadMid.x + perpendicular.x * sideOffset * side,
            0,
            roadMid.z + perpendicular.z * sideOffset * side,
          ];

          const isFree = !existingObjects.some((obj) => {
            const objPos = new THREE.Vector3(...obj.position);
            return objPos.distanceTo(new THREE.Vector3(...proposedPos)) < 5;
          });

          if (isFree) {
            proposals.push({
              position: proposedPos,
              confidence: 0.5,
              reason: `À côté de la route`,
              source: 'Analyse routière',
            });
          }
        });
      });
    }

    // Trier par confiance et limiter à 3 propositions (réduit pour performance)
    return proposals
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }, [mousePosition, equipmentType, existingObjects, roads, containers, enabled]);

  if (!enabled || proposals.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 z-50 bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl p-4 max-w-sm">
      <h3 className="text-sm font-bold text-[#8AFD81] mb-3 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        💡 Suggestions d'emplacements
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {proposals.map((proposal, index) => (
          <div
            key={index}
            className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            onClick={() => onProposalSelect?.(proposal)}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <div className="text-xs text-white/80 font-medium mb-1">
                  Position: ({proposal.position[0].toFixed(1)}, {proposal.position[2].toFixed(1)})
                </div>
                <div className="text-xs text-white/60">{proposal.reason}</div>
              </div>
              <div className="text-xs text-[#8AFD81] font-medium">
                {Math.round(proposal.confidence * 100)}%
              </div>
            </div>
            <div className="text-xs text-white/40 mt-1">Source: {proposal.source}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs text-white/60">
          Cliquez sur une suggestion pour placer l'équipement à cet emplacement
        </p>
      </div>
    </div>
  );
}

