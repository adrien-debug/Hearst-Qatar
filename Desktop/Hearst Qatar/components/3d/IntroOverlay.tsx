import { useState, useEffect } from 'react';
import Image from 'next/image';

interface IntroOverlayProps {
  onFadeComplete: () => void;
}

/**
 * Overlay d'introduction avec logo Hearst et texte Qatar
 * Fait un fondu vers la scène 3D
 */
export default function IntroOverlay({ onFadeComplete }: IntroOverlayProps) {
  const [opacity, setOpacity] = useState(1);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Afficher le logo pendant 2 secondes, puis commencer le fondu
    const showTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Fondu progressif sur 1.5 secondes
    if (isFading) {
      const fadeInterval = setInterval(() => {
        setOpacity((prev) => {
          const newOpacity = prev - 0.05;
          if (newOpacity <= 0) {
            clearInterval(fadeInterval);
            onFadeComplete();
            return 0;
          }
          return newOpacity;
        });
      }, 75); // 75ms * 20 = 1.5s pour le fondu complet

      return () => {
        clearInterval(fadeInterval);
        clearTimeout(showTimer);
      };
    }

    return () => {
      clearTimeout(showTimer);
    };
  }, [isFading, onFadeComplete]);

  if (opacity <= 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1500"
      style={{ 
        opacity,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Logo Hearst - 4 fois plus grand */}
        <div className="relative" style={{ width: '2000px', height: '500px', maxWidth: '90vw', maxHeight: '70vh' }}>
          <Image
            src="/HEARST_LOGO.png"
            alt="Hearst Logo"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        
        {/* Texte Qatar - sous le logo */}
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide mt-4">
          QATAR
        </h2>
      </div>
    </div>
  );
}

