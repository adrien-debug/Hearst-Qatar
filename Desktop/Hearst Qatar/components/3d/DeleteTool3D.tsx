import { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Object3D } from 'three';
import { Html } from '@react-three/drei';

interface DeletableObject {
  id: string;
  type: 'golf-cart' | 'wall' | 'container' | 'transformer' | 'switchgear' | 'generator';
  name: string;
  position: [number, number, number];
}

interface DeleteTool3DProps {
  enabled: boolean;
  deletableObjects: DeletableObject[];
  onObjectSelect?: (objectId: string | null) => void;
  selectedObjectId: string | null;
  onDelete?: (objectId: string) => void;
  alwaysEnabled?: boolean; // Si true, fonctionne même sans mode activation
}

/**
 * Outil pour sélectionner et supprimer des objets 3D
 */
export default function DeleteTool3D({
  enabled,
  deletableObjects,
  onObjectSelect,
  selectedObjectId,
  onDelete,
  alwaysEnabled = false,
}: DeleteTool3DProps) {
  const { camera, raycaster, gl, scene } = useThree();
  const mouseRef = useRef(new Vector2());
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const isActive = enabled || alwaysEnabled;
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 DeleteTool3D useEffect - isActive:', isActive, 'enabled:', enabled, 'alwaysEnabled:', alwaysEnabled);
    }
    
    if (!isActive) {
      setHoveredObject(null);
      if (onObjectSelect && !alwaysEnabled) {
        onObjectSelect(null);
      }
      gl.domElement.style.cursor = 'default';
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ DeleteTool3D activé - Objets supprimables:', deletableObjects.length);
    }

    const handleClick = (event: MouseEvent) => {
      if (!isActive) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ DeleteTool3D - Clic ignoré car isActive = false');
        }
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🖱️ DeleteTool3D - Clic détecté');
      }

      const target = event.target as HTMLElement;
      // Ignorer les clics sur les éléments HTML
      if (
        target.closest('[data-html]') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('.delete-tool-ui')
      ) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Clic ignoré - élément HTML');
        }
        return;
      }

      // Bloquer la propagation pour éviter que les autres handlers interceptent
      event.stopPropagation();
      event.preventDefault();

      const rect = gl.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);

      // Trouver les objets dans la scène avec les noms correspondants
      const intersections = raycaster.intersectObjects(scene.children, true);
      
      let clickedObjectId: string | null = null;

      // Chercher l'objet cliqué parmi les objets supprimables
      for (const intersection of intersections) {
        let obj: Object3D | null = intersection.object;
        
        // Remonter dans la hiérarchie pour trouver le groupe parent avec le nom ou selectableId
        while (obj) {
          const objectId = obj.name || obj.userData?.selectableId;
          
          // Debug en développement
          if (process.env.NODE_ENV === 'development' && objectId) {
            const isDeletable = deletableObjects.some(dObj => dObj.id === objectId);
            if (isDeletable) {
              console.log('🔍 Objet supprimable trouvé:', objectId, 'Type:', obj.userData?.type, 'Obj name:', obj.name, 'userData:', obj.userData);
            }
          }
          
          if (objectId && deletableObjects.some(dObj => dObj.id === objectId)) {
            clickedObjectId = objectId;
            break;
          }
          obj = obj.parent;
        }
        
        if (clickedObjectId) break;
      }

      // Debug en développement
      if (process.env.NODE_ENV === 'development') {
        if (clickedObjectId) {
          console.log('✅ Objet sélectionné pour suppression:', clickedObjectId);
        } else if (intersections.length > 0) {
          console.log('⚠️ Intersection trouvée mais objet non supprimable.');
          console.log('   Intersections:', intersections.length);
          console.log('   Premier objet:', intersections[0]?.object?.name, intersections[0]?.object?.userData);
          console.log('   Objets supprimables:', deletableObjects.length);
          // Afficher les IDs des premiers objets supprimables pour debug
          if (deletableObjects.length > 0) {
            console.log('   Exemples d\'IDs supprimables:', deletableObjects.slice(0, 5).map(o => o.id));
          }
        }
      }

      if (clickedObjectId) {
        if (onObjectSelect) {
          if (selectedObjectId === clickedObjectId) {
            // Désélectionner si on clique à nouveau sur le même objet
            onObjectSelect(null);
          } else {
            onObjectSelect(clickedObjectId);
          }
        }
      } else {
        // Désélectionner si on clique ailleurs
        if (onObjectSelect) {
          onObjectSelect(null);
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isActive) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);

      // Trouver l'objet survolé
      const intersections = raycaster.intersectObjects(scene.children, true);
      
      let hovered: string | null = null;

      for (const intersection of intersections) {
        let obj: Object3D | null = intersection.object;
        
        while (obj) {
          const objectId = obj.name || obj.userData?.selectableId;
          if (objectId && deletableObjects.some(dObj => dObj.id === objectId)) {
            hovered = objectId;
            break;
          }
          obj = obj.parent;
        }
        
        if (hovered) break;
      }

      setHoveredObject(hovered);
      gl.domElement.style.cursor = hovered ? 'pointer' : 'default';
    };

    if (isActive) {
      // Utiliser capture phase pour intercepter les clics avant les autres handlers
      gl.domElement.addEventListener('click', handleClick, true);
      gl.domElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      gl.domElement.removeEventListener('click', handleClick, true);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.style.cursor = 'default';
    };
  }, [isActive, camera, raycaster, gl, scene, deletableObjects, onObjectSelect, selectedObjectId, alwaysEnabled]);

  // Afficher l'UI de suppression pour l'objet sélectionné
  const selectedObject = deletableObjects.find((obj) => obj.id === selectedObjectId);

  return (
    <>
      {selectedObject && isActive && (
        <Html position={[selectedObject.position[0], selectedObject.position[1] + 3, selectedObject.position[2]]} center>
          <div className="delete-tool-ui bg-white rounded-lg shadow-lg p-3 border-2 border-red-500 min-w-[150px]">
            <div className="text-sm font-semibold text-gray-800 mb-2">
              {selectedObject.name}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) {
                    onDelete(selectedObject.id);
                  }
                  if (onObjectSelect) {
                    onObjectSelect(null);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition-colors flex-1"
              >
                Supprimer
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onObjectSelect) {
                    onObjectSelect(null);
                  }
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded font-semibold text-sm transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

