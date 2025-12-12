import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Import dynamique de Spline pour éviter les problèmes SSR
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Chargement de la scène 3D...</p>
      </div>
    </div>
  ),
});

interface SplineSceneProps {
  sceneUrl: string; // URL de votre scène Spline exportée
  onObjectClick?: (objectName: string) => void;
  selectedObject?: string | null;
  onLoad?: (spline: any) => void;
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
}: SplineSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const splineRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoad = (spline: any) => {
    console.log('✅ Scène Spline chargée');
    splineRef.current = spline;
    setIsLoading(false);
    setError(null);

    // Configurer les interactions avec les objets
    if (spline && onObjectClick) {
      setupInteractions(spline);
    }

    // Appeler le callback onLoad si fourni
    if (onLoad) {
      onLoad(spline);
    }
  };

  const setupInteractions = (spline: any) => {
    try {
      // Exemple : Configurer les clics sur les containers HD5
      // Remplacez ces noms par les noms réels de vos objets dans Spline
      const objectNames = [
        'HD5_Container_A',
        'HD5_Container_B',
        'Transformer',
        'Switchgear_L',
        'Switchgear_R',
        'PowerBlock_1',
        'Substation_200MW',
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
          // Ignorer si l'objet n'existe pas
          console.warn(`Objet "${objectName}" non trouvé dans la scène`);
        }
      });
    } catch (e) {
      console.error('Erreur lors de la configuration des interactions:', e);
    }
  };

  const handleError = (error: any) => {
    console.error('❌ Erreur lors du chargement de la scène Spline:', error);
    setError('Erreur lors du chargement de la scène 3D');
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
