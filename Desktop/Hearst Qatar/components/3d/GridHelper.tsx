import * as THREE from 'three';

/**
 * Grille de référence et axes pour la scène 3D
 */
export default function SceneGridHelper() {
  return (
    <>
      {/* Grille de référence (200m x 200m, 20 divisions) */}
      <gridHelper args={[200, 20, '#666666', '#333333']} />
      
      {/* Axes helper (50m) */}
      <axesHelper args={[50]} />
    </>
  );
}
