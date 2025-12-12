import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Contrôleur de caméra animé pour la vue overview
 * Séquence automatique en boucle : zoom → droite → gauche → descente
 */
export default function AnimatedCameraController() {
  const { camera } = useThree();
  const startTimeRef = useRef<number | null>(null);
  const animationPhaseRef = useRef<number>(0);
  
  // Point de regard vers les containers avec logos Hearst
  const logoLookAt = new THREE.Vector3(0, 1.8, -30);
  
  // Positions de caméra pour chaque phase
  const phases = [
    // Phase 0: Vue d'ensemble montrant les containers avec logos Hearst visibles (3s)
    {
      startPos: new THREE.Vector3(0, 100, -250),
      endPos: new THREE.Vector3(0, 80, -180),
      lookAt: logoLookAt,
      duration: 3000,
    },
    // Phase 1: Zoom progressif vers les logos Hearst (10s)
    {
      startPos: new THREE.Vector3(0, 80, -180),
      endPos: new THREE.Vector3(0, 2, -35), // Zoom jusqu'au niveau des containers
      lookAt: logoLookAt,
      duration: 10000,
    },
    // Phase 2: Zoom out (recul) en remontant (8s)
    {
      startPos: new THREE.Vector3(0, 2, -35),
      endPos: new THREE.Vector3(0, 80, -200),
      lookAt: logoLookAt,
      duration: 8000,
    },
    // Phase 3: Tourne à droite, même hauteur et distance (8s)
    {
      startPos: new THREE.Vector3(0, 80, -200),
      endPos: new THREE.Vector3(100, 80, -200),
      lookAt: logoLookAt,
      duration: 8000,
    },
    // Phase 4: Tourne à gauche, même hauteur et distance (8s)
    {
      startPos: new THREE.Vector3(100, 80, -200),
      endPos: new THREE.Vector3(-100, 80, -200),
      lookAt: logoLookAt,
      duration: 8000,
    },
    // Phase 5: Retour à la vue d'ensemble (5s)
    {
      startPos: new THREE.Vector3(-100, 80, -200),
      endPos: new THREE.Vector3(0, 100, -250),
      lookAt: logoLookAt,
      duration: 5000,
    },
  ];

  useEffect(() => {
    startTimeRef.current = Date.now();
    animationPhaseRef.current = 0;
  }, []);

  // Fonction d'easing ease-in-out-cubic (plus fluide et douce)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Fonction d'easing ease-in-out pour mouvement très fluide
  const easeInOut = (t: number): number => {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  };

  // Fonction d'easing avec léger overshoot pour la descente
  const easeOutBack = (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  useFrame(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      // Initialiser la caméra à la position de départ de la première phase
      camera.position.copy(phases[0].startPos);
      camera.lookAt(phases[0].lookAt);
      return;
    }

    const currentTime = Date.now();
    const elapsed = currentTime - startTimeRef.current;
    const currentPhase = phases[animationPhaseRef.current];
    
    if (!currentPhase) {
      // Réinitialiser pour boucler - transition douce vers la phase 0
      camera.position.copy(phases[0].startPos);
      camera.lookAt(phases[0].lookAt);
      startTimeRef.current = currentTime;
      animationPhaseRef.current = 0;
      return;
    }

    // Calculer le progrès dans la phase actuelle
    const phaseProgress = Math.min(elapsed / currentPhase.duration, 1);
    
    // Choisir la fonction d'easing selon la phase (toutes fluides et à la même vitesse)
    let eased: number;
    if (animationPhaseRef.current === 0) {
      // Phase de descente - très fluide
      eased = easeInOut(phaseProgress);
    } else {
      // Autres phases avec easing smooth et fluide
      eased = easeInOut(phaseProgress);
    }

    // Initialiser la position de départ au début de la phase
    if (phaseProgress === 0) {
      camera.position.copy(currentPhase.startPos);
    }

    // Interpoler la position de la caméra de manière fluide
    camera.position.lerpVectors(
      currentPhase.startPos,
      currentPhase.endPos,
      eased
    );

    // Maintenir le regard vers les logos Hearst
    camera.lookAt(currentPhase.lookAt);

    // Passer à la phase suivante si terminée
    if (phaseProgress >= 1) {
      const nextPhaseIndex = (animationPhaseRef.current + 1) % phases.length;
      const nextPhase = phases[nextPhaseIndex];
      
      if (nextPhase) {
        // Positionner la caméra à la position de départ de la prochaine phase
        // Toutes les phases se connectent maintenant de manière fluide (y compris la phase 4 qui revient à la phase 0)
        camera.position.copy(nextPhase.startPos);
      }
      
      animationPhaseRef.current = nextPhaseIndex;
      startTimeRef.current = currentTime;
    }
  });

  return null;
}

