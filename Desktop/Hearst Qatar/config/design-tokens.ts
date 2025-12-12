/**
 * Design Tokens - Système de design unifié
 * Extrait de la page Overview pour cohérence visuelle
 */

export const colorTokens = {
  // Couleurs primaires
  primary: {
    dark: '#0a0b0d',        // Fond sombre principal
    darkText: '#0b1120',     // Texte sombre principal
    accent: '#8AFD81',       // Vert néon - accent principal
    accentHover: '#6FD96A',  // Vert néon hover
  },
  
  // Couleurs de texte
  text: {
    primary: '#0b1120',      // Texte principal foncé
    secondary: '#64748b',    // Texte secondaire gris
    light: 'white',          // Texte blanc
    muted: 'white/70',       // Texte blanc atténué
    dimmed: 'white/60',      // Texte blanc très atténué
  },
  
  // Couleurs de fond
  background: {
    white: 'white',
    lightGray: '#f8f9fa',
    dark: '#0a0b0d',
  },
  
  // Couleurs de bordure
  border: {
    light: '#e2e8f0',
    subtle: 'white/5',
    accentHover: '#8AFD81/20',
  },
};

export const formTokens = {
  // Radius (coins arrondis)
  radius: {
    standard: '8px',         // Radius standard pour cartes et boutons
    default: 'rounded-[8px]', // Classe Tailwind
  },
  
  // Spacing
  spacing: {
    cardPadding: 'p-6',
    containerMax: 'max-w-7xl',
  },
  
  // Typography
  typography: {
    title: {
      size: 'text-3xl',
      weight: 'font-bold',
      color: 'text-[#0b1120]',
      tracking: 'tracking-wide',
    },
    kpiLabel: {
      size: 'text-xs',
      weight: 'font-medium',
      color: 'text-white/70',
      transform: 'uppercase',
      tracking: 'tracking-wider',
    },
    kpiValue: {
      size: 'text-4xl',
      weight: 'font-bold',
      color: 'text-[#8AFD81]',
      tracking: 'tracking-tight',
    },
    kpiUnit: {
      size: 'text-lg',
      weight: 'font-medium',
      color: 'text-white/60',
      tracking: 'tracking-wide',
    },
    description: {
      size: 'text-sm',
      color: 'text-[#64748b]',
      leading: 'leading-relaxed',
    },
  },
  
  // Composants
  components: {
    card: {
      background: 'bg-[#0a0b0d]',
      border: 'border border-white/5',
      hover: 'hover:border-[#8AFD81]/20',
      radius: 'rounded-[8px]',
      padding: 'p-6',
      transition: 'transition-colors',
    },
    button: {
      primary: 'bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold py-3 px-8 rounded-[8px] transition-colors',
    },
    kpiCard: {
      container: 'flex-shrink-0 flex-1 min-w-[150px]',
      spacing: 'space-x-2',
      valueLine: 'flex items-baseline space-x-2',
    },
  },
};

// Utilitaire pour générer des classes CSS
export const getCardClasses = () => {
  const { card } = formTokens.components;
  return `${card.background} ${card.radius} ${card.padding} ${card.border} ${card.hover} ${card.transition}`;
};

export const getKPICardClasses = () => {
  return getCardClasses() + ' w-full';
};

