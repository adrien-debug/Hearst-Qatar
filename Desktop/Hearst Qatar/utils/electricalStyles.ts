// Utilitaires pour les styles du diagramme électrique - Version Subtile

export const electricalColors = {
  primary: '#8AFD81',
  secondary: '#6FD96A',
  accent: '#5BC550',
  dark: '#1e293b',
  background: 'rgba(30, 41, 59, 0.5)',
  border: 'rgba(138, 253, 129, 0.2)',
  glow: 'rgba(138, 253, 129, 0.25)',
};

export const electricalStatusColors = {
  ok: {
    primary: '#8AFD81',
    secondary: '#6FD96A',
    accent: '#5BC550',
    glow: 'rgba(138, 253, 129, 0.3)',
  },
  warning: {
    primary: '#FBBF24',
    secondary: '#F59E0B',
    accent: '#D97706',
    glow: 'rgba(251, 191, 36, 0.3)',
  },
  error: {
    primary: '#F87171',
    secondary: '#EF4444',
    accent: '#DC2626',
    glow: 'rgba(248, 113, 113, 0.3)',
  },
};

// Gradients subtils pour les flux électriques
export const getElectricGradient = (id: string) => ({
  id: `electricGradient-${id}`,
  stops: [
    { offset: '0%', color: '#8AFD81', opacity: 0.2 },
    { offset: '20%', color: '#8AFD81', opacity: 0.2 },
    { offset: '30%', color: '#6FD96A', opacity: 0.4 },
    { offset: '40%', color: '#8AFD81', opacity: 0.2 },
    { offset: '100%', color: 'transparent', opacity: 0 },
  ],
  duration: '2s',
});

// Gradients pour conteneurs
export const getContainerGradient = (status: 'ok' | 'warning' | 'error' = 'ok') => {
  const colors = electricalStatusColors[status];
  return {
    id: `containerGradient-${status}`,
    stops: [
      { offset: '0%', color: colors.primary, opacity: 0.85 },
      { offset: '50%', color: colors.secondary, opacity: 0.8 },
      { offset: '100%', color: colors.accent, opacity: 0.75 },
    ],
  };
};

// Gradients pour transformateurs
export const getTransformerGradient = (id: string) => ({
  id: `transformerGradient-${id}`,
  stops: [
    { offset: '0%', color: '#E2E8F0', opacity: 0.2 },
    { offset: '20%', color: '#94A3B8', opacity: 0.1 },
    { offset: '60%', color: '#475569', opacity: 0.7 },
    { offset: '100%', color: '#334155', opacity: 0.9 },
  ],
});

// Styles pour tooltips
export const tooltipStyles = {
  background: 'rgba(30, 41, 59, 0.5)',
  backdropBlur: '15px',
  border: '1px solid rgba(138, 253, 129, 0.2)',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(138, 253, 129, 0.1) inset',
};

// Styles pour badges
export const badgeStyles = {
  background: 'rgba(30, 41, 59, 0.5)',
  backdropBlur: '10px',
  borderRadius: '10px',
  padding: '6px 14px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
};

// Fonction pour obtenir les styles d'un conteneur selon son statut
export const getContainerStyles = (status: 'In Service' | 'Maintenance' | 'Standby', hasIssue: boolean) => {
  if (status !== 'In Service' || hasIssue) {
    return {
      gradient: {
        start: { color: '#e2e8f0', opacity: 0.5 },
        end: { color: '#cbd5e1', opacity: 0.6 },
      },
      border: '#94a3b8',
      opacity: 0.7,
    };
  }
  
  return {
    gradient: {
      start: { color: '#8AFD81', opacity: 0.85 },
      end: { color: '#5BC550', opacity: 0.75 },
    },
    border: '#1e293b',
    opacity: 1,
  };
};

// Animation durations (subtiles)
export const animationDurations = {
  fast: '0.25s',
  normal: '0.3s',
  slow: '0.4s',
  electric: '2s',
  reflect: '6s',
};

// Easing functions
export const easingFunctions = {
  ease: 'ease',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
};


