import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import HD5Container from './HD5Container';
import Transformer3D from './Transformer3D';
import Switchgear3D from './Switchgear3D';
import Substation200MW from './Substation200MW';
import PowerBlock3D from './PowerBlock3D';
import SceneLighting from './Lighting';
import * as THREE from 'three';

interface Element3DPreviewProps {
  elementType: 'container' | 'transformer' | 'switchgear' | 'substation' | 'powerblock';
  elementId?: string;
  onSelect?: () => void;
}

function Element3DPreview({ elementType, elementId, onSelect }: Element3DPreviewProps) {
  return (
    <>
      <SceneLighting />
      <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
      
      {elementType === 'container' && (
        <HD5Container
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          onObjectClick={onSelect}
        />
      )}
      
      {elementType === 'transformer' && (
        <Transformer3D
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          onObjectClick={onSelect}
        />
      )}
      
      {elementType === 'switchgear' && (
        <Switchgear3D
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          onObjectClick={onSelect}
        />
      )}
      
      {elementType === 'substation' && (
        <Substation200MW
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          onObjectClick={onSelect}
        />
      )}
      
      {elementType === 'powerblock' && (
        <PowerBlock3D
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          onObjectClick={onSelect}
        />
      )}
    </>
  );
}

interface ElementCardProps {
  title: string;
  description: string;
  elementType: 'container' | 'transformer' | 'switchgear' | 'substation' | 'powerblock';
  icon: string;
  onSelect: () => void;
}

function ElementCard({ title, description, elementType, icon, onSelect }: ElementCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all hover:shadow-xl hover:scale-105"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div className="h-64 bg-gray-100 relative">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <Element3DPreview elementType={elementType} onSelect={onSelect} />
          </Suspense>
        </Canvas>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
          {icon}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

interface Element3DGalleryProps {
  onElementSelect?: (elementType: string, elementId?: string) => void;
  onBackTo3D?: () => void;
  onShowSavedProjects?: () => void;
}

export default function Element3DGallery({ onElementSelect, onBackTo3D, onShowSavedProjects }: Element3DGalleryProps) {
  const elements = [
    {
      id: 'substation',
      title: 'Substation 200 MW',
      description: 'Sous-station principale 132/33 kV',
      type: 'substation' as const,
      icon: '⚡',
    },
    {
      id: 'powerblock',
      title: 'Power Block',
      description: 'Bloc d\'alimentation 50 MW',
      type: 'powerblock' as const,
      icon: '🔌',
    },
    {
      id: 'transformer',
      title: 'Transformateur',
      description: 'Transformateur 4 MVA',
      type: 'transformer' as const,
      icon: '🔄',
    },
    {
      id: 'switchgear',
      title: 'Switchgear',
      description: 'Tableau de distribution',
      type: 'switchgear' as const,
      icon: '🔧',
    },
    {
      id: 'container',
      title: 'Container HD5',
      description: 'Container de mining 40\' Hydro Bitmain',
      type: 'container' as const,
      icon: '📦',
    },
  ];

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Galerie d'Éléments 3D
            </h1>
            <p className="text-gray-600">
              Visualisez tous les éléments disponibles pour votre projet
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onShowSavedProjects && (
              <button
                onClick={onShowSavedProjects}
                className="px-3 py-1.5 bg-[#8AFD81] text-[#0a0b0d] hover:bg-[#8AFD81]/80 rounded-lg transition-all flex items-center gap-2 font-medium"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Projets Sauvegardés</span>
              </button>
            )}
            {onBackTo3D && (
              <button
                onClick={onBackTo3D}
                className="px-3 py-1.5 bg-[#8AFD81] text-[#0a0b0d] hover:bg-[#8AFD81]/80 rounded-lg transition-all flex items-center gap-2 font-medium"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Retour à la vue 3D</span>
              </button>
            )}
          </div>
        </div>

        {/* Grille d'éléments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elements.map((element) => (
            <ElementCard
              key={element.id}
              title={element.title}
              description={element.description}
              elementType={element.type}
              icon={element.icon}
              onSelect={() => onElementSelect?.(element.type, element.id)}
            />
          ))}
        </div>

        {/* Section Systèmes de Refroidissement */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Systèmes de Refroidissement</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-4xl mb-2">❄️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Hydro Cooling</h3>
                <p className="text-sm text-gray-600">Refroidissement par eau avec échangeurs de chaleur</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-4xl mb-2">🌊</div>
                <h3 className="font-semibold text-gray-900 mb-1">Immersion Cooling</h3>
                <p className="text-sm text-gray-600">Refroidissement par immersion dans liquide diélectrique</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-4xl mb-2">💨</div>
                <h3 className="font-semibold text-gray-900 mb-1">Air Cooling</h3>
                <p className="text-sm text-gray-600">Refroidissement par air avec ventilateurs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Mineurs ASIC */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mineurs ASIC</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-4xl mb-2">⛏️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Antminer S21 Hydro</h3>
                <p className="text-sm text-gray-600 mb-2">Bitmain - 335 TH/s, 5.36 kW</p>
                <div className="text-xs text-gray-500">
                  <div>Efficacité: 16 J/TH</div>
                  <div>180 machines par container</div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-1">Production</h3>
                <p className="text-sm text-gray-600 mb-2">Hashrate total par container</p>
                <div className="text-xs text-gray-500">
                  <div>~60,000 TH/s par container</div>
                  <div>Production BTC/jour variable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

