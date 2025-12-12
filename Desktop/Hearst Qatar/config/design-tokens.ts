/**
 * Design Tokens - Système de design unifié
 * Extrait de la page Overview pour cohérence visuelle
 * Étendu avec tokens 3D et système d'espacements standardisé
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
  
  // Couleurs 3D - Matériaux et objets
  threeD: {
    // Containers HD5
    container: {
      base: '#ffffff',           // Blanc pour container de base
      baseSelected: '#e0e0e0',    // Gris clair pour sélection
      corrugation: '#ffffff',    // Blanc pour panneaux corrugués
      dark: '#1a1a1a',           // Noir pour structure sombre
      darkAlt: '#2a2a2a',        // Noir alternatif
      darkSelected: '#4a9eff',   // Bleu pour sélection
    },
    // Modules de refroidissement
    cooling: {
      chassis: '#1a1a1a',        // Noir pour châssis
      radiator: '#c0c0c0',        // Argent pour radiateur
      fan: '#1a1a1a',            // Noir pour ventilateurs
      roof: '#0a0a0a',           // Noir très foncé pour toit
      panel: '#4b5563',          // Gris foncé pour panneaux
      pump: '#22c55e',           // Vert pour pompes
      pumpActive: '#16a34a',     // Vert foncé pour pompes actives
      led: '#10b981',            // Vert pour LED
      ledInactive: '#065f46',    // Vert très foncé pour LED inactive
      emissive: '#0ea5e9',       // Bleu pour émission
    },
    // Infrastructure
    infrastructure: {
      concrete: '#BDBDBD',       // Béton gris
      concreteAlt: '#B0B0B0',     // Béton alternatif
      asphalt: '#808080',        // Asphalte gris
      metal: '#4A4A4A',          // Métal gris foncé
      metalLight: '#C0C0C0',     // Métal clair
      warning: '#FFEB3B',        // Jaune avertissement
      warningEmissive: '#FFEB3B', // Jaune émissif
      danger: '#EF4444',         // Rouge danger
      dangerEmissive: '#EF4444', // Rouge émissif
      info: '#2563EB',           // Bleu information
      infoEmissive: '#2563EB',   // Bleu émissif
      success: '#10B981',        // Vert succès
      successEmissive: '#10B981', // Vert émissif
    },
    // Éléments UI 3D
    ui: {
      selection: '#00ff00',      // Vert pour sélection
      hover: '#4a9eff',          // Bleu pour survol
      highlight: '#3b82f6',      // Bleu pour mise en évidence
    },
  },
};

export const formTokens = {
  // Radius (coins arrondis)
  radius: {
    standard: '8px',         // Radius standard pour cartes et boutons
    default: 'rounded-[8px]', // Classe Tailwind
  },
  
  // Spacing - Système standardisé
  spacing: {
    // Padding responsive standardisé
    padding: {
      xs: 'p-2',              // Extra small (8px)
      sm: 'p-4',              // Small - Mobile (16px)
      md: 'p-6',              // Medium - Tablet (24px)
      lg: 'p-8',              // Large - Desktop (32px)
      responsive: 'p-4 sm:p-6 md:p-8', // Responsive standard
    },
    // Padding horizontal
    paddingX: {
      xs: 'px-2',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
      responsive: 'px-4 sm:px-6 md:px-8',
    },
    // Padding vertical
    paddingY: {
      xs: 'py-2',
      sm: 'py-4',
      md: 'py-6',
      lg: 'py-8',
      responsive: 'py-4 sm:py-6 md:py-8',
    },
    // Marges verticales standardisées
    margin: {
      xs: 'mb-2',             // Extra small (8px)
      sm: 'mb-4',             // Small (16px)
      md: 'mb-6',             // Medium (24px)
      lg: 'mb-8',             // Large (32px)
      xl: 'mb-12',            // Extra large (48px)
    },
    // Gaps standardisés
    gap: {
      xs: 'gap-2',            // Extra small (8px)
      sm: 'gap-4',            // Small (16px)
      md: 'gap-6',            // Medium (24px)
      lg: 'gap-8',            // Large (32px)
      responsive: 'gap-4 sm:gap-6 md:gap-8', // Responsive standard
    },
    // Espacements verticaux (space-y)
    spaceY: {
      xs: 'space-y-2',
      sm: 'space-y-4',
      md: 'space-y-6',
      lg: 'space-y-8',
    },
    // Espacements horizontaux (space-x)
    spaceX: {
      xs: 'space-x-2',
      sm: 'space-x-4',
      md: 'space-x-6',
      lg: 'space-x-8',
    },
    // Container
    containerMax: 'max-w-7xl',
    // Card padding (legacy - utiliser padding.md)
    cardPadding: 'p-6',
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

// Utilitaires pour les couleurs 3D
export const get3DColor = (category: keyof typeof colorTokens.threeD, variant: string): string => {
  const categoryColors = colorTokens.threeD[category];
  if (typeof categoryColors === 'object' && variant in categoryColors) {
    return (categoryColors as any)[variant];
  }
  return '#ffffff'; // Fallback blanc
};

// Utilitaires pour les espacements
export const getSpacing = (type: 'padding' | 'margin' | 'gap' | 'spaceY' | 'spaceX', size: 'xs' | 'sm' | 'md' | 'lg' | 'responsive' = 'md'): string => {
  const spacing = formTokens.spacing;
  
  // Gérer le cas 'responsive' pour les types qui ne le supportent pas
  const effectiveSize = size === 'responsive' && (type === 'margin' || type === 'spaceY' || type === 'spaceX') 
    ? 'md' 
    : size;
  
  switch (type) {
    case 'padding':
      return spacing.padding[effectiveSize as keyof typeof spacing.padding] || spacing.padding.md;
    case 'margin':
      return spacing.margin[effectiveSize as keyof typeof spacing.margin] || spacing.margin.md;
    case 'gap':
      return spacing.gap[effectiveSize as keyof typeof spacing.gap] || spacing.gap.md;
    case 'spaceY':
      return spacing.spaceY[effectiveSize as keyof typeof spacing.spaceY] || spacing.spaceY.md;
    case 'spaceX':
      return spacing.spaceX[effectiveSize as keyof typeof spacing.spaceX] || spacing.spaceX.md;
    default:
      return '';
  }
};

// Classes Tailwind pour les couleurs (pour utilisation directe dans className)
export const colorClasses = {
  // Backgrounds
  bgDark: `bg-[${colorTokens.background.dark}]`,
  bgLightGray: `bg-[${colorTokens.background.lightGray}]`,
  bgWhite: 'bg-white',
  // Text colors
  textPrimary: `text-[${colorTokens.text.primary}]`,
  textSecondary: `text-[${colorTokens.text.secondary}]`,
  textAccent: `text-[${colorTokens.primary.accent}]`,
  textAccentHover: `text-[${colorTokens.primary.accentHover}]`,
  // Border colors
  borderLight: `border-[${colorTokens.border.light}]`,
  borderSubtle: colorTokens.border.subtle, // Déjà au format Tailwind
  borderAccentHover: colorTokens.border.accentHover, // Déjà au format Tailwind
  // Accent backgrounds
  bgAccent: `bg-[${colorTokens.primary.accent}]`,
  bgAccentHover: `bg-[${colorTokens.primary.accentHover}]`,
  bgAccent10: `bg-[${colorTokens.primary.accent}]/10`,
  bgAccent20: `bg-[${colorTokens.primary.accent}]/20`,
  bgAccent30: `bg-[${colorTokens.primary.accent}]/30`,
};

