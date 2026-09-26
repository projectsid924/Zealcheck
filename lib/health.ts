export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export type Profile = {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
};

export const ACTIVITY_LEVELS: { key: ActivityLevel; label: string; multiplier: number }[] = [
  { key: 'sedentary', label: 'Sedentary', multiplier: 1.2 },
  { key: 'light', label: 'Light', multiplier: 1.375 },
  { key: 'moderate', label: 'Moderate', multiplier: 1.55 },
  { key: 'active', label: 'Active', multiplier: 1.725 },
  { key: 'veryActive', label: 'Very Active', multiplier: 1.9 },
];

/** Mifflin-St Jeor equation. */
export function calculateBMR(profile: Profile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.sex === 'male' ? base + 5 : base - 161;
}

export function calculateCalorieTarget(profile: Profile): number {
  const bmr = calculateBMR(profile);
  const activity = ACTIVITY_LEVELS.find((a) => a.key === profile.activityLevel);
  return Math.round(bmr * (activity?.multiplier ?? 1.2));
}

const ML_PER_GLASS = 250;
const ML_PER_KG = 35;

/** Recommended daily water intake in glasses, based on ~35ml per kg body weight. */
export function calculateWaterGlassTarget(weightKg: number): number {
  return Math.max(4, Math.round((weightKg * ML_PER_KG) / ML_PER_GLASS));
}
