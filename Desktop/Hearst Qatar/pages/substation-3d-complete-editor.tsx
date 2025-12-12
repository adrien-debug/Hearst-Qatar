import Head from 'next/head';
import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import CompleteSceneEditor, { SceneObject } from '../components/3d/CompleteSceneEditor';
import { generateCompleteSceneData, DIMENSIONS } from '../data/splineSceneData';
import { savePlacedObjects, loadPlacedObjects, clearPlacedObjects } from '../utils/sceneStorage';
import * as THREE from 'three';

// Composant de sol
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#d4a574" />
    </mesh>
  );
}

// Panneau de contrôle
function ControlPanel({
  editMode,
  onEditModeChange,
  selectedObject,
  onUpdateObject,
  onDeleteObject,
  onClearAll,
  objects,
  roadStartPoint,
  onCancelRoad,
}: {
  editMode: string;
  onEditModeChange: (mode: string) => void;
  selectedObject: SceneObject | null;
  onUpdateObject: (updates: Partial<SceneObject>) => void;
  onDeleteObject: () => void;
  onClearAll: () => void;
  objects: SceneObject[];
  roadStartPoint: [number, number, number] | null;
  onCancelRoad: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const objectCounts = objects.reduce((acc, obj) => {
    acc[obj.type] = (acc[obj.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="absolute bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm">
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🛠️</span>
          <h3 className="font-bold text-sm">Éditeur Complet</h3>
        </div>
        <button className="text-white/80 hover:text-white">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Modes d'édition */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'select', label: '👆 Sélection', icon: '👆' },
                { id: 'move', label: '↔️ Déplacer', icon: '↔️' },
                { id: 'scale', label: '📏 Redimensionner', icon: '📏' },
                { id: 'rotate', label: '🔄 Rotation', icon: '🔄' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onEditModeChange(mode.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    editMode === mode.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Placer des objets */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Placer
            </p>
            {editMode === 'place-road' && roadStartPoint && (
              <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                🛣️ Cliquez pour définir le point d'arrivée de la route
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'place-wall', label: '🧱 Mur', icon: '🧱' },
                { id: 'place-portal', label: '🚪 Portail', icon: '🚪' },
                { id: 'place-camera', label: '📷 Caméra', icon: '📷' },
                { id: 'place-parking', label: '🅿️ Parking', icon: '🅿️' },
                { id: 'place-tree', label: '🌳 Arbre', icon: '🌳' },
                { id: 'place-road', label: '🛣️ Route', icon: '🛣️' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'place-road' && roadStartPoint) {
                      // Annuler la création de route
                      onCancelRoad();
                    }
                    onEditModeChange(item.id as any);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    editMode === item.id
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Objet sélectionné */}
          {selectedObject && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Objet sélectionné
                </p>
                <button
                  onClick={onDeleteObject}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-600">Type:</span>{' '}
                  <span className="font-semibold">{selectedObject.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Position:</span>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      value={selectedObject.position[0].toFixed(1)}
                      onChange={(e) =>
                        onUpdateObject({
                          position: [
                            parseFloat(e.target.value) || 0,
                            selectedObject.position[1],
                            selectedObject.position[2],
                          ],
                        })
                      }
                      className="w-16 px-2 py-1 border rounded text-xs"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={selectedObject.position[1].toFixed(1)}
                      onChange={(e) =>
                        onUpdateObject({
                          position: [
                            selectedObject.position[0],
                            parseFloat(e.target.value) || 0,
                            selectedObject.position[2],
                          ],
                        })
                      }
                      className="w-16 px-2 py-1 border rounded text-xs"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={selectedObject.position[2].toFixed(1)}
                      onChange={(e) =>
                        onUpdateObject({
                          position: [
                            selectedObject.position[0],
                            selectedObject.position[1],
                            parseFloat(e.target.value) || 0,
                          ],
                        })
                      }
                      className="w-16 px-2 py-1 border rounded text-xs"
                      step="0.1"
                    />
                  </div>
                </div>
                {editMode === 'scale' && (
                  <div>
                    <span className="text-gray-600">Échelle:</span>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        value={(selectedObject.scale?.[0] || 1).toFixed(1)}
                        onChange={(e) =>
                          onUpdateObject({
                            scale: [
                              parseFloat(e.target.value) || 1,
                              selectedObject.scale?.[1] || 1,
                              selectedObject.scale?.[2] || 1,
                            ],
                          })
                        }
                        className="w-16 px-2 py-1 border rounded text-xs"
                        step="0.1"
                        min="0.1"
                        max="10"
                      />
                      <input
                        type="number"
                        value={(selectedObject.scale?.[1] || 1).toFixed(1)}
                        onChange={(e) =>
                          onUpdateObject({
                            scale: [
                              selectedObject.scale?.[0] || 1,
                              parseFloat(e.target.value) || 1,
                              selectedObject.scale?.[2] || 1,
                            ],
                          })
                        }
                        className="w-16 px-2 py-1 border rounded text-xs"
                        step="0.1"
                        min="0.1"
                        max="10"
                      />
                      <input
                        type="number"
                        value={(selectedObject.scale?.[2] || 1).toFixed(1)}
                        onChange={(e) =>
                          onUpdateObject({
                            scale: [
                              selectedObject.scale?.[0] || 1,
                              selectedObject.scale?.[1] || 1,
                              parseFloat(e.target.value) || 1,
                            ],
                          })
                        }
                        className="w-16 px-2 py-1 border rounded text-xs"
                        step="0.1"
                        min="0.1"
                        max="10"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistiques */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Objets ({objects.length} total)
              </p>
              <button
                onClick={onClearAll}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Tout supprimer
              </button>
            </div>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
              {Object.entries(objectCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{type}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
            {/* Indicateur des bâtiments principaux */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Bâtiments:</p>
              <div className="text-xs space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Substation: {objectCounts.substation || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Power Blocks: {objectCounts.powerblock || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Substation3DCompleteEditorPage() {
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState<'select' | 'move' | 'scale' | 'rotate' | 'place-wall' | 'place-portal' | 'place-camera' | 'place-parking' | 'place-tree' | 'place-road'>('select');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [roadStartPoint, setRoadStartPoint] = useState<[number, number, number] | null>(null);

  // Fonction wrapper pour convertir string en type spécifique
  const handleEditModeChange = (mode: string) => {
    const validModes: Array<'select' | 'move' | 'scale' | 'rotate' | 'place-wall' | 'place-portal' | 'place-camera' | 'place-parking' | 'place-tree' | 'place-road'> = [
      'select', 'move', 'scale', 'rotate', 'place-wall', 'place-portal', 'place-camera', 'place-parking', 'place-tree', 'place-road'
    ];
    if (validModes.includes(mode as any)) {
      setEditMode(mode as typeof editMode);
    }
  };

  // Charger les objets existants de la substation
  useEffect(() => {
    setMounted(true);
    
    const sceneData = generateCompleteSceneData();
    const initialObjects: SceneObject[] = [];

    // Substation - Centrer pour visibilité
    initialObjects.push({
      id: sceneData.substation.name,
      type: 'substation',
      position: [0, 0, 0], // Centré pour être visible
    });

    // Power Blocks et leurs composants - Ajuster les positions
    sceneData.powerBlocks.forEach((pb) => {
      initialObjects.push({
        id: pb.id,
        type: 'powerblock',
        position: [pb.position.x, 0, pb.position.z - 30], // Ajuster pour visibilité
      });

      pb.transformers.forEach((tr) => {
        initialObjects.push({
          id: tr.id,
          type: 'transformer',
          position: [tr.position.x, tr.position.y, tr.position.z],
        });

        tr.containers.forEach((container) => {
          initialObjects.push({
            id: container.id,
            type: 'container',
            position: [container.position.x, container.position.y, container.position.z],
          });
        });

        tr.switchgears.forEach((switchgear) => {
          initialObjects.push({
            id: switchgear.id,
            type: 'switchgear',
            position: [switchgear.position.x, switchgear.position.y, switchgear.position.z],
          });
        });
      });
    });

    // Charger les objets sauvegardés (murs, portails, etc.)
    const saved = loadPlacedObjects();
    if (saved && saved.length > 0) {
      saved.forEach((obj: any) => {
        if (['wall', 'portal', 'camera', 'parking', 'tree', 'road'].includes(obj.type)) {
          // Pour les routes, récupérer les points depuis dimensions
          const data = obj.dimensions || {};
          if (obj.type === 'road' && data.points) {
            initialObjects.push({
              id: obj.id,
              type: obj.type,
              position: [
                (data.points[0][0] + data.points[1][0]) / 2,
                obj.position.y || 0,
                (data.points[0][2] + data.points[1][2]) / 2,
              ],
              data: { width: data.width || 5, points: data.points },
            });
          } else {
            initialObjects.push({
              id: obj.id,
              type: obj.type,
              position: [obj.position.x, obj.position.y || 0, obj.position.z],
              data: data,
            });
          }
        }
      });
    }

    setObjects(initialObjects);
    console.log('🏗️ Objets chargés:', initialObjects.length);
    console.log('📦 Substation:', initialObjects.find(o => o.type === 'substation'));
    console.log('⚡ Power Blocks:', initialObjects.filter(o => o.type === 'powerblock').length);
  }, []);

  // Sauvegarder les objets personnalisés
  useEffect(() => {
    if (mounted) {
      const customObjects = objects.filter((o) =>
        ['wall', 'portal', 'camera', 'parking', 'tree', 'road'].includes(o.type)
      );
      const toSave = customObjects.map((obj) => {
        const base = {
          id: obj.id,
          type: obj.type,
          position: { x: obj.position[0], y: obj.position[1], z: obj.position[2] },
        };
        
        // Pour les routes, sauvegarder les points dans dimensions
        if (obj.type === 'road' && obj.data?.points) {
          return {
            ...base,
            dimensions: { ...obj.data, points: obj.data.points },
          };
        }
        
        return {
          ...base,
          dimensions: obj.data,
        };
      });
      savePlacedObjects(toSave as any);
    }
  }, [objects, mounted]);

  const handlePlaceObject = (type: SceneObject['type'], position: [number, number, number]) => {
    if (type === 'road') {
      // Pour les routes, on crée d'un point à un autre
      if (!roadStartPoint) {
        // Premier clic : définir le point de départ
        setRoadStartPoint(position);
        return;
      } else {
        // Deuxième clic : créer la route
        const newObject: SceneObject = {
          id: `road_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'road',
          position: [
            (roadStartPoint[0] + position[0]) / 2,
            (roadStartPoint[1] + position[1]) / 2,
            (roadStartPoint[2] + position[2]) / 2,
          ],
          data: {
            width: 5,
            points: [roadStartPoint, position],
          },
        };
        setObjects((prev) => [...prev, newObject]);
        setRoadStartPoint(null);
        setEditMode('select');
        return;
      }
    }

    const newObject: SceneObject = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      data: getDefaultData(type),
    };
    setObjects((prev) => [...prev, newObject]);
    setEditMode('select');
  };

  const getDefaultData = (type: SceneObject['type']) => {
    switch (type) {
      case 'wall':
        return { length: 10, height: 3 };
      case 'portal':
        return { width: 3, height: 4 };
      case 'parking':
        return { width: 20, length: 30 };
      case 'road':
        return { width: 5, length: 20 };
      default:
        return {};
    }
  };

  const handleUpdateObject = (id: string, updates: Partial<SceneObject>) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  };

  const handleDeleteObject = (id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  };

  const handleClearAll = () => {
    if (confirm('Supprimer tous les objets personnalisés (murs, portails, etc.) ?')) {
      setObjects((prev) => prev.filter((obj) => !['wall', 'portal', 'camera', 'parking', 'tree', 'road'].includes(obj.type)));
      clearPlacedObjects();
    }
  };

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement de la scène...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Éditeur Complet 3D - Substation</title>
        <meta name="description" content="Éditeur complet pour manipuler tous les objets de la substation" />
      </Head>

      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900">
        {/* Instructions */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-md">
          <h2 className="font-bold text-sm mb-2">🎯 Éditeur Complet</h2>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>📐 <strong>Grille:</strong> Visible pour référence (rouge = sections principales)</li>
            <li>🏗️ <strong>Bâtiments:</strong> Substation (bleu), Power Blocks (violet) visibles</li>
            <li>🖱️ <strong>Clic:</strong> Sélectionner un objet</li>
            <li>🖱️ <strong>Double-clic:</strong> Supprimer un objet</li>
            <li>🖱️ <strong>Mode Déplacer:</strong> Utiliser les contrôles numériques</li>
            <li>🛣️ <strong>Routes:</strong> Clic point 1 → Clic point 2</li>
            <li>🖱️ <strong>Navigation:</strong> Rotation/Pan/Zoom avec la souris</li>
          </ul>
        </div>

        {/* Panneau de contrôle */}
        <ControlPanel
          editMode={editMode}
          onEditModeChange={handleEditModeChange}
          selectedObject={selectedObject || null}
          onUpdateObject={(updates) => selectedObjectId && handleUpdateObject(selectedObjectId, updates)}
          onDeleteObject={() => selectedObjectId && handleDeleteObject(selectedObjectId)}
          onClearAll={handleClearAll}
          objects={objects}
          roadStartPoint={roadStartPoint}
          onCancelRoad={() => setRoadStartPoint(null)}
        />

        {/* Scène 3D */}
        <Canvas
          shadows
          gl={{ antialias: true }}
          camera={{ position: [0, 100, 150], fov: 60 }}
        >
          <Suspense fallback={null}>
            {/* Éclairage */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[50, 50, 25]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-200}
              shadow-camera-right={200}
              shadow-camera-top={200}
              shadow-camera-bottom={-200}
            />
            <pointLight position={[-50, 50, -50]} intensity={0.4} />

            {/* Sol */}
            <Ground />

            {/* Grille très visible */}
            <Grid
              args={[500, 50]}
              cellColor="#888888"
              sectionColor="#ff6b6b"
              cellThickness={1}
              sectionThickness={2}
              fadeDistance={300}
              fadeStrength={0.5}
              position={[0, 0.01, 0]}
            />
            
            {/* Grille secondaire plus fine */}
            <Grid
              args={[500, 500]}
              cellColor="#444444"
              sectionColor="#666666"
              cellThickness={0.3}
              sectionThickness={0.5}
              fadeDistance={200}
              fadeStrength={1}
              position={[0, 0.02, 0]}
            />

            {/* Éditeur */}
            <CompleteSceneEditor
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
              onUpdateObject={handleUpdateObject}
              onDeleteObject={handleDeleteObject}
              editMode={editMode}
              onPlaceObject={handlePlaceObject}
            />

            {/* Indicateur pour route en cours */}
            {editMode === 'place-road' && roadStartPoint && (
              <mesh position={roadStartPoint}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={0xff6b6b} />
              </mesh>
            )}

            {/* Contrôles de caméra */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={30}
              maxDistance={500}
              target={[0, 15, 30]}
            />
            
            {/* Axes helper pour référence */}
            <axesHelper args={[50]} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

