import Head from 'next/head';
import { useState, useEffect } from 'react';
import SplineScene from '../components/3d/SplineScene';
import ViewModeSelector, { ViewMode } from '../components/3d/ViewModeSelector';

/**
 * Page de visualisation 3D utilisant Spline au lieu de React Three Fiber
 * 
 * Cette page remplace pages/substation-3d.tsx avec une solution beaucoup plus simple
 * 
 * Pour utiliser cette page :
 * 1. Créez votre scène dans Spline
 * 2. Exportez-la et obtenez l'URL
 * 3. Remplacez SPLINE_SCENE_URL ci-dessous par votre URL
 */
const SPLINE_SCENE_URL = 'https://prod.spline.design/YOUR-SCENE-ID.splinecode';

interface SelectedObjectInfo {
  name: string;
  type: string;
  position: { x: number; y: number };
}

export default function Substation3DSplinePage() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [objectInfo, setObjectInfo] = useState<SelectedObjectInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleObjectClick = (objectName: string) => {
    setSelectedObject(objectName);

    // Déterminer le type et le nom d'affichage
    let displayName = objectName;
    let typeName = 'Élément';

    if (objectName === 'Substation_200MW') {
      typeName = 'Substation';
      displayName = 'Substation 200 MW';
    } else if (objectName.startsWith('PowerBlock_')) {
      typeName = 'Power Block';
      displayName = objectName.replace('_', ' ');
    } else if (objectName.includes('Transformer')) {
      typeName = 'Transformateur';
      displayName = objectName.replace(/_/g, ' ');
    } else if (objectName.includes('SG_') || objectName.includes('Switchgear')) {
      typeName = 'Switchgear';
      displayName = objectName.replace(/_/g, ' ');
    } else if (objectName.includes('HD5') || objectName.includes('Container')) {
      typeName = 'Container HD5';
      displayName = objectName.replace(/_/g, ' ');
    }

    setObjectInfo({
      name: displayName,
      type: typeName,
      position: { x: 0, y: 0 },
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Vous pouvez contrôler la caméra Spline ici si nécessaire
  };

  const handleSplineLoad = (spline: any) => {
    console.log('Scène Spline chargée, vous pouvez maintenant interagir avec:', spline);
    
    // Exemple : Configurer des animations ou des interactions supplémentaires
    // spline.setVariable('someVariable', 'someValue');
  };

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Visualisation 3D - Substation 200 MW (Spline)</title>
        <meta name="description" content="Visualisation 3D interactive de la ferme énergétique - Powered by Spline" />
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50" style={{ margin: 0, padding: 0 }}>
        {/* Panneau d'information */}
        {objectInfo && (
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-bold text-lg mb-2">{objectInfo.type}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Nom:</span> {objectInfo.name}
            </p>
            <button
              onClick={() => {
                setSelectedObject(null);
                setObjectInfo(null);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Sélecteur de mode de vue */}
        <div className="absolute top-4 right-4 z-10">
          <ViewModeSelector
            currentMode={viewMode}
            onModeChange={handleViewModeChange}
          />
        </div>

        {/* Contrôles */}
        <div className="absolute top-24 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-sm mb-2">Contrôles</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>🖱️ Clic gauche: Rotation</li>
            <li>🖱️ Clic droit: Pan</li>
            <li>🖱️ Molette: Zoom</li>
            <li>🖱️ Clic sur objet: Sélection</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-semibold">Spline</span>
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-bold text-sm mb-2">Structure Industrielle</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>1 Substation 200 MW</li>
            <li>4 Power Blocks</li>
            <li>24 Transformateurs</li>
            <li>24 Switchgears</li>
            <li>48 Containers HD5</li>
          </ul>
        </div>

        {/* Scène Spline */}
        <SplineScene
          sceneUrl={SPLINE_SCENE_URL}
          onObjectClick={handleObjectClick}
          selectedObject={selectedObject}
          onLoad={handleSplineLoad}
        />
      </div>
    </>
  );
}
