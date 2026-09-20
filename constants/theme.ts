export const colors = {
  background: '#FAFAF9',
  surface: '#FFFFFF',
  border: '#E7E5E4',
  text: '#1C1917',
  textMuted: '#78716C',
  primary: '#4F46E5',
  primaryMuted: '#E0E7FF',
  success: '#16A34A',
  danger: '#DC2626',
} as const;

export const priorityColors = {
  low: '#0EA5E9',
  medium: '#D97706',
  high: '#DC2626',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  heading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};
