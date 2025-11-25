/**
 * Design Tokens - Extracted from landing page
 * Maintains consistency across all pages
 */

export const colors = {
  gold: {
    50: '#FCF9EE',
    100: '#F8F1D8',
    200: '#EFDEAA',
    300: '#E6CB7D',
    400: '#DDB753',
    500: '#D4AF37', // Classic Gold
    600: '#AA8C2C',
    700: '#806921',
    800: '#554616',
    900: '#2B230B',
  },
  rose: {
    50: '#FFF0F5', // Lavender Blush
    100: '#FFE4E9',
    200: '#FFC9D2', // Soft Pink
    300: '#FF9EB5',
    800: '#9E1B32', // Deep Red/Pink for text
  },
} as const;

export const fonts = {
  sans: ['Inter', 'sans-serif'],
  serif: ['Playfair Display', 'serif'],
} as const;

export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} as const;

export const borderRadius = {
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  gold: '0 10px 15px -3px rgba(212, 175, 55, 0.1)',
  rose: '0 10px 15px -3px rgba(255, 201, 210, 0.2)',
} as const;

export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
  smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type ColorScale = keyof typeof colors.gold;
export type RoseScale = keyof typeof colors.rose;

