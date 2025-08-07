/**
 * Design system theme configuration.
 * Inspired by modern design systems and Jafra+ project structure.
 */

export const theme = {
  borderRadius: {
    // 12px
    '2xl': '1rem',

    // 2px
    base: '0.25rem',

    // 16px
    full: '9999px',

    // 6px
    lg: '0.5rem',

    // 4px
    md: '0.375rem',

    none: '0',

    sm: '0.125rem',
    // 8px
    xl: '0.75rem',
  },

  breakpoints: {
    '2xl': '1536px',
    lg: '1024px',
    md: '768px',
    sm: '640px',
    xl: '1280px',
  },

  colors: {
    black: '#000000',

    error: {
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Gray scale for text and UI elements
    gray: {
      100: '#f3f4f6',
      200: '#E5E7EB',
      // "Borde de la tarjeta e inputs"
      300: '#d1d5db',
      400: '#9CA3AF',
      50: '#f9fafb', // "Placeholder / iconos secundarios" y "Iconos de nav inactivos"
      500: '#6B7280', // "Subtítulo 'Frente a la playa'"
      600: '#4b5563',
      700: '#374151',
      800: '#1F2937', // "Labels (Fecha, Hora, Habitación)"
      900: '#111827', // "Título 'Hotel Miramar'"
    },
    info: {
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Brand colors based on new corporate identity
    // Primary brand colors - Purple tones (matches #4F46E5)
    primary: {
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      50: '#eef2ff',
      500: '#4F46E5', // Main brand purple - "Texto Reservar (primario)"
      600: '#4338ca',
      700: '#3730a3',
      800: '#312e81',
      900: '#1e1b4b',
    },

    // Secondary/accent colors - Orange tones (matches #FF8A00)
    secondary: {
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      50: '#fff7ed',
      500: '#FF8A00', // Main brand orange - "Botón Reservar (fondo)"
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },

    // Semantic colors (keeping existing for consistency)
    success: {
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    transparent: 'transparent',

    warning: {
      100: '#fef3c7',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // Base colors
    white: '#FFFFFF',
  },

  shadows: {
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    // 32px
    10: '2.5rem',

    // 40px
    12: '3rem',

    // 48px
    16: '4rem',

    // 4px
    2: '0.5rem',

    // 64px
    20: '5rem',

    // 80px
    24: '6rem',

    // 8px
    3: '0.75rem',

    // 96px
    32: '8rem',

    // 12px
    4: '1rem',

    // 16px
    5: '1.25rem',

    // 20px
    6: '1.5rem',
    // 24px
    8: '2rem', // 128px
  },

  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },

  typography: {
    fontFamily: {
      // Secondary font for body text, paragraphs, and content
      body: [
        'var(--font-lato)',
        'Lato',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif',
      ],

      // Primary font for headings, titles, and UI elements
      heading: [
        'var(--font-montserrat)',
        'Montserrat',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      // Monospace font for code
      mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      // Legacy support - keeping for existing components
      sans: [
        'var(--font-lato)',
        'Lato',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
    },

    fontSize: {
      // 20px
      '2xl': '1.5rem',

      // 24px
      '3xl': '1.875rem',

      // 30px
      '4xl': '2.25rem',

      // 36px
      '5xl': '3rem',

      // 14px
      base: '1rem',

      // 16px
      lg: '1.125rem',

      // 12px
      sm: '0.875rem',

      // 18px
      xl: '1.25rem',

      xs: '0.75rem', // 48px
    },

    fontWeight: {
      bold: 700,
      medium: 500,
      normal: 400,
      semibold: 600,
    },

    lineHeight: {
      normal: 1.5,
      relaxed: 1.75,
      tight: 1.25,
    },
  },

  zIndex: {
    dropdown: 1000,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    sticky: 1020,
    tooltip: 1060,
  },
} as const;

export type Theme = typeof theme;
