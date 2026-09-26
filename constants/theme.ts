// Duolingo-inspired palette: Feather green, Macaw blue, Bee gold, Cardinal red.
export const colors = {
  background: '#F7F9FA',
  surface: '#FFFFFF',
  border: '#E5E5E5',
  text: '#3C3C3C',
  textMuted: '#777777',
  primary: '#58CC02',
  primaryMuted: '#E1FFC7',
  success: '#58CC02',
  danger: '#FF4B4B',
} as const;

export const priorityColors = {
  low: '#1CB0F6',
  medium: '#E8A400',
  high: '#FF4B4B',
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
