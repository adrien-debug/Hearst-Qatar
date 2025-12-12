import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { allObjectNames } from '../../data/splineSceneData';
import * as THREE from 'three';
import type { EditMode, PlacedObject } from './SceneEditor';

// Import dynamique de Spline pour éviter les problèmes SSR
// Note: Utilisation de l'import standard avec résolution manuelle
const Spline = dynamic(
  async () => {
    try {
      // Essayer d'importer depuis le package
      const splineModule = await import('@splinetool/react-spline');
      return splineModule.default || splineModule;
    } catch (error) {
      console.error('Erreur lors du chargement de Spline:', error);
      // Retourner un composant de fallback
      return () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <p className="text-red-500">Erreur de chargement de la scène Spline</p>
            <p className="text-sm mt-2">Vérifiez que @splinetool/react-spline est installé</p>
          </div>
        </div>
      );
    }
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement de la scène 3D...</p>
        </div>
      </div>
    ),
  }
);

interface SplineSceneProps {
  sceneUrl: string; // URL de votre scène Spline exportée
  onObjectClick?: (objectName: string) => void;
  selectedObject?: string | null;
  onLoad?: (spline: any) => void;
  editMode?: EditMode;
  onPlaceObject?: (type: 'wall' | 'portal', position: { x: number; y: number; z: number }) => void;
  placedObjects?: PlacedObject[];
  onDeletePlacedObject?: (id: string) => void;
}

/**
 * Composant wrapper pour intégrer une scène Spline dans Next.js
 * 
 * Remplace votre ancien système React Three Fiber par Spline
 * 
 * Usage:
 * <SplineScene 
 *   sceneUrl="https://prod.spline.design/your-scene.splinecode"
 *   onObjectClick={handleObjectClick}
 *   selectedObject={selectedObject}
 * />
 */
export default function SplineScene({
  sceneUrl,
  onObjectClick,
  selectedObject,
  onLoad,
  editMode = 'none',
  onPlaceObject,
  placedObjects = [],
  onDeletePlacedObject,
}: SplineSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const splineRef = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const placedObjectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoad = (spline: any) => {
    console.log('✅ Scène Spline chargée');
    splineRef.current = spline;
    setIsLoading(false);
    setError(null);

    // Accéder à la scène Three.js
    try {
      // Essayer différentes méthodes pour accéder à la scène
      if (spline.scene) {
        sceneRef.current = spline.scene;
      } else if ((spline as any).getScene) {
        sceneRef.current = (spline as any).getScene();
      } else if (spline.application?.scene) {
        sceneRef.current = spline.application.scene;
      }
      
      if (sceneRef.current) {
        raycasterRef.current = new THREE.Raycaster();
        console.log('✅ Scène Three.js accessible');
      } else {
        console.warn('⚠️ Scène Three.js non accessible directement, utilisation de méthodes alternatives');
      }
    } catch (e) {
      console.warn('⚠️ Impossible d\'accéder directement à la scène Three.js:', e);
    }

    // Configurer les interactions avec les objets
    if (spline && onObjectClick) {
      setupInteractions(spline);
    }

    // Charger les objets sauvegardés
    loadPlacedObjects(spline);

    // Configurer les événements de clic pour le mode édition
    setupEditMode(spline);

    // Appeler le callback onLoad si fourni
    if (onLoad) {
      onLoad(spline);
    }
  };

  const setupInteractions = (spline: any) => {
    try {
      // Utiliser les noms d'objets depuis splineSceneData
      const objectNames = allObjectNames.length > 0 ? allObjectNames : [
        'Substation_200MW',
        'PowerBlock_1',
        'PowerBlock_2',
        'PowerBlock_3',
        'PowerBlock_4',
      ];

      objectNames.forEach((objectName) => {
        try {
          const obj = spline.findObjectByName(objectName);
          if (obj) {
            // Écouter les clics
            obj.addEventListener('click', () => {
              if (onObjectClick) {
                onObjectClick(objectName);
              }
            });

            // Changer la couleur si sélectionné
            if (selectedObject === objectName) {
              // Mettre en surbrillance (vous pouvez personnaliser)
              if (obj.material) {
                obj.material.color = '#00ff00'; // Vert pour sélection
              }
            }
          }
        } catch (e) {
          // Ignorer si l'objet n'existe pas (normal si la scène n'est pas encore complète)
          // console.warn(`Objet "${objectName}" non trouvé dans la scène`);
        }
      });
    } catch (e) {
      console.error('Erreur lors de la configuration des interactions:', e);
    }
  };

  const handleError = (error: any) => {
    console.error('❌ Erreur lors du chargement de la scène Spline:', error);
    setError(`Erreur lors du chargement de la scène 3D. Vérifiez que l'URL est correcte et que la scène est bien exportée depuis Spline.`);
    setIsLoading(false);
  };

  // Mettre à jour la sélection quand elle change
  useEffect(() => {
    if (splineRef.current && selectedObject) {
      updateSelection(splineRef.current, selectedObject);
    }
  }, [selectedObject]);

  const updateSelection = (spline: any, objectName: string) => {
    try {
      // Réinitialiser toutes les sélections
      const allObjects = spline.getAllObjects();
      allObjects.forEach((obj: any) => {
        if (obj.material && obj.material.color) {
          // Restaurer la couleur originale (vous devrez la stocker)
          // Pour l'instant, on utilise une couleur par défaut
        }
      });

      // Mettre en surbrillance l'objet sélectionné
      const selectedObj = spline.findObjectByName(objectName);
      if (selectedObj && selectedObj.material) {
        selectedObj.material.color = '#00ff00'; // Vert pour sélection
      }
    } catch (e) {
      console.error('Erreur lors de la mise à jour de la sélection:', e);
    }
  };

  // Fonction pour créer un mur
  const createWall = (
    spline: any,
    position: { x: number; y: number; z: number },
    id: string
  ): THREE.Mesh | null => {
    try {
      const wallGeometry = new THREE.BoxGeometry(10, 3, 0.2);
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.3,
        roughness: 0.7,
      });
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);

      wall.position.set(position.x, position.y + 1.5, position.z);
      wall.name = `Wall_${id}`;
      wall.userData = { type: 'wall', id, originalPosition: position };

      // Ajouter à la scène - essayer différentes méthodes
      let added = false;
      if (sceneRef.current) {
        sceneRef.current.add(wall);
        added = true;
      } else if (spline.scene) {
        spline.scene.add(wall);
        added = true;
      } else if ((spline as any).getScene) {
        (spline as any).getScene().add(wall);
        added = true;
      } else if (spline.application?.scene) {
        spline.application.scene.add(wall);
        added = true;
      }
      
      if (!added) {
        console.warn('Impossible d\'ajouter le mur: scène non accessible');
        return null;
      }

      // Rendre cliquable pour suppression
      wall.addEventListener('click', () => {
        if (onDeletePlacedObject && editMode === 'none') {
          onDeletePlacedObject(id);
        }
      });

      placedObjectsRef.current.set(id, wall);
      return wall;
    } catch (e) {
      console.error('Erreur lors de la création du mur:', e);
      return null;
    }
  };

  // Fonction pour créer un portail
  const createPortal = (
    spline: any,
    position: { x: number; y: number; z: number },
    id: string
  ): THREE.Group | null => {
    try {
      const portalGroup = new THREE.Group();
      portalGroup.name = `Portal_${id}`;
      portalGroup.userData = { type: 'portal', id, originalPosition: position };

      // Cadre du portail (4 piliers)
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        metalness: 0.2,
        roughness: 0.8,
      });

      const frameWidth = 3;
      const frameHeight = 4;
      const frameDepth = 0.3;
      const pillarWidth = 0.2;

      // Pilier gauche
      const leftPillar = new THREE.Mesh(
        new THREE.BoxGeometry(pillarWidth, frameHeight, frameDepth),
        frameMaterial
      );
      leftPillar.position.set(-frameWidth / 2, frameHeight / 2, 0);
      portalGroup.add(leftPillar);

      // Pilier droit
      const rightPillar = new THREE.Mesh(
        new THREE.BoxGeometry(pillarWidth, frameHeight, frameDepth),
        frameMaterial
      );
      rightPillar.position.set(frameWidth / 2, frameHeight / 2, 0);
      portalGroup.add(rightPillar);

      // Linteau (haut)
      const lintel = new THREE.Mesh(
        new THREE.BoxGeometry(frameWidth, pillarWidth, frameDepth),
        frameMaterial
      );
      lintel.position.set(0, frameHeight, 0);
      portalGroup.add(lintel);

      // Seuil (bas)
      const threshold = new THREE.Mesh(
        new THREE.BoxGeometry(frameWidth, pillarWidth, frameDepth),
        frameMaterial
      );
      threshold.position.set(0, 0, 0);
      portalGroup.add(threshold);

      portalGroup.position.set(position.x, position.y, position.z);

      // Ajouter à la scène - essayer différentes méthodes
      let added = false;
      if (sceneRef.current) {
        sceneRef.current.add(portalGroup);
        added = true;
      } else if (spline.scene) {
        spline.scene.add(portalGroup);
        added = true;
      } else if ((spline as any).getScene) {
        (spline as any).getScene().add(portalGroup);
        added = true;
      } else if (spline.application?.scene) {
        spline.application.scene.add(portalGroup);
        added = true;
      }
      
      if (!added) {
        console.warn('Impossible d\'ajouter le portail: scène non accessible');
        return null;
      }

      // Rendre cliquable pour suppression
      portalGroup.addEventListener('click', () => {
        if (onDeletePlacedObject && editMode === 'none') {
          onDeletePlacedObject(id);
        }
      });

      placedObjectsRef.current.set(id, portalGroup);
      return portalGroup;
    } catch (e) {
      console.error('Erreur lors de la création du portail:', e);
      return null;
    }
  };

  // Charger les objets sauvegardés
  const loadPlacedObjects = (spline: any) => {
    placedObjects.forEach((obj) => {
      if (obj.type === 'wall') {
        createWall(spline, obj.position, obj.id);
      } else if (obj.type === 'portal') {
        createPortal(spline, obj.position, obj.id);
      }
    });
  };

  // Configurer le mode édition
  const setupEditMode = (spline: any) => {
    if (!spline || !onPlaceObject) return;

    const canvas = document.querySelector('canvas');
    if (!canvas) {
      // Réessayer après un court délai
      setTimeout(() => setupEditMode(spline), 500);
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (editMode === 'none') return;

      // Empêcher le comportement par défaut si on est en mode édition
      event.stopPropagation();

      // Calculer la position de la souris en coordonnées normalisées
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Utiliser la caméra de Spline
      try {
        // Essayer différentes méthodes pour obtenir la caméra
        let camera: THREE.Camera | null = null;
        
        if (spline.camera) {
          camera = spline.camera;
        } else if ((spline as any).getCamera) {
          camera = (spline as any).getCamera();
        } else if (sceneRef.current) {
          // Chercher la caméra dans la scène
          sceneRef.current.traverse((obj: any) => {
            if (obj.isCamera && !camera) {
              camera = obj;
            }
          });
        }

        if (!camera) {
          console.warn('Caméra non accessible, utilisation d\'une position par défaut');
          // Position par défaut au centre de la scène
          onPlaceObject(editMode as 'wall' | 'portal', {
            x: 0,
            y: 0,
            z: 0,
          });
          return;
        }

        // Initialiser le raycaster si nécessaire
        if (!raycasterRef.current) {
          raycasterRef.current = new THREE.Raycaster();
        }

        raycasterRef.current.setFromCamera(mouseRef.current, camera);

        // Intersection avec le sol (plan Y=0)
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        
        if (raycasterRef.current.ray.intersectPlane(plane, intersectionPoint)) {
          onPlaceObject(editMode as 'wall' | 'portal', {
            x: intersectionPoint.x,
            y: intersectionPoint.y,
            z: intersectionPoint.z,
          });
        } else {
          // Si pas d'intersection avec le plan, utiliser une position approximative
          const distance = 20; // Distance par défaut
          const direction = raycasterRef.current.ray.direction;
          const origin = raycasterRef.current.ray.origin;
          const point = origin.clone().add(direction.multiplyScalar(distance));
          
          onPlaceObject(editMode as 'wall' | 'portal', {
            x: point.x,
            y: 0,
            z: point.z,
          });
        }
      } catch (e) {
        console.error('Erreur lors du placement:', e);
        // En cas d'erreur, placer à une position par défaut
        onPlaceObject(editMode as 'wall' | 'portal', {
          x: 0,
          y: 0,
          z: 0,
        });
      }
    };

    // Nettoyer les anciens listeners
    const oldHandler = (canvas as any).__editModeHandler;
    if (oldHandler) {
      canvas.removeEventListener('click', oldHandler);
    }

    // Ajouter le nouveau listener
    canvas.addEventListener('click', handleClick);
    (canvas as any).__editModeHandler = handleClick;

    return () => {
      canvas.removeEventListener('click', handleClick);
      delete (canvas as any).__editModeHandler;
    };
  };

  // Mettre à jour les objets placés quand la liste change
  useEffect(() => {
    if (!splineRef.current) return;

    const spline = splineRef.current;
    const currentIds = new Set(placedObjects.map((obj) => obj.id));
    const existingIds = new Set(placedObjectsRef.current.keys());

    // Supprimer les objets qui ne sont plus dans la liste
    existingIds.forEach((id) => {
      if (!currentIds.has(id)) {
        const obj = placedObjectsRef.current.get(id);
        if (obj) {
          // Essayer différentes méthodes pour supprimer
          if (sceneRef.current) {
            sceneRef.current.remove(obj);
          } else if (spline.scene) {
            spline.scene.remove(obj);
          } else if ((spline as any).getScene) {
            (spline as any).getScene().remove(obj);
          } else if (spline.application?.scene) {
            spline.application.scene.remove(obj);
          }
          
          // Nettoyer la géométrie et le matériau
          if (obj instanceof THREE.Mesh) {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach((mat) => mat.dispose());
              } else {
                obj.material.dispose();
              }
            }
          } else if (obj instanceof THREE.Group) {
            obj.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                  } else {
                    child.material.dispose();
                  }
                }
              }
            });
          }
          
          placedObjectsRef.current.delete(id);
        }
      }
    });

    // Ajouter les nouveaux objets
    placedObjects.forEach((obj) => {
      if (!placedObjectsRef.current.has(obj.id)) {
        if (obj.type === 'wall') {
          createWall(spline, obj.position, obj.id);
        } else if (obj.type === 'portal') {
          createPortal(spline, obj.position, obj.id);
        }
      }
    });
  }, [placedObjects, editMode]);

  // Reconfigurer le mode édition quand il change
  useEffect(() => {
    if (splineRef.current && onPlaceObject) {
      const cleanup = setupEditMode(splineRef.current);
      return cleanup;
    }
  }, [editMode, onPlaceObject]);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initialisation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="text-red-500 mb-4">❌ {error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Chargement de la scène 3D...</p>
          </div>
        </div>
      )}
      <Spline
        scene={sceneUrl}
        onLoad={handleLoad}
        onError={handleError}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

/**
 * Hook personnalisé pour interagir avec la scène Spline
 * 
 * Usage:
 * const { spline, updateObjectColor, animateObject } = useSplineScene(splineRef);
 */
export function useSplineScene(splineRef: React.RefObject<any>) {
  const updateObjectColor = (objectName: string, color: string) => {
    if (splineRef.current) {
      try {
        const obj = splineRef.current.findObjectByName(objectName);
        if (obj && obj.material) {
          obj.material.color = color;
        }
      } catch (e) {
        console.error(`Erreur lors de la mise à jour de la couleur de ${objectName}:`, e);
      }
    }
  };

  const animateObject = (objectName: string, animationName: string) => {
    if (splineRef.current) {
      try {
        const obj = splineRef.current.findObjectByName(objectName);
        if (obj && obj.play) {
          obj.play(animationName);
        }
      } catch (e) {
        console.error(`Erreur lors de l'animation de ${objectName}:`, e);
      }
    }
  };

  const getObjectPosition = (objectName: string) => {
    if (splineRef.current) {
      try {
        const obj = splineRef.current.findObjectByName(objectName);
        if (obj && obj.position) {
          return {
            x: obj.position.x,
            y: obj.position.y,
            z: obj.position.z,
          };
        }
      } catch (e) {
        console.error(`Erreur lors de la récupération de la position de ${objectName}:`, e);
      }
    }
    return null;
  };

  return {
    spline: splineRef.current,
    updateObjectColor,
    animateObject,
    getObjectPosition,
  };
}
