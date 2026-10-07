export const THEME_CONSTANTS = {
  appName: 'Portfolio OS',
  accentColor: '#F97316', // Orange-500
  backgroundColor: '#09090B',
  surfaceColor: '#121215',
  cardColor: '#18181B',
  borderColor: '#27272A',
  
  breakpoints: {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  transitions: {
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  iconSizes: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;
