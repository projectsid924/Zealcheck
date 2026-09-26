import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { dateKey } from '../lib/date';
import { calculateCalorieTarget, calculateWaterGlassTarget, type Profile } from '../lib/health';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';

export type Meal = 'breakfast' | 'lunch' | 'dinner';

export type DailyLog = {
  waterGlasses: number;
  meals: Record<Meal, { completed: boolean; calories: number | null }>;
};

type DailyLogsMap = Record<string, DailyLog>;

function emptyLog(): DailyLog {
  return {
    waterGlasses: 0,
    meals: {
      breakfast: { completed: false, calories: null },
      lunch: { completed: false, calories: null },
      dinner: { completed: false, calories: null },
    },
  };
}

type State = {
  profile: Profile | null;
  logs: DailyLogsMap;
  isLoading: boolean;
};

type Action =
  | { type: 'hydrate'; profile: Profile | null; logs: DailyLogsMap }
  | { type: 'setProfile'; profile: Profile }
  | { type: 'updateLog'; key: string; log: DailyLog };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { profile: action.profile, logs: action.logs, isLoading: false };
    case 'setProfile':
      return { ...state, profile: action.profile };
    case 'updateLog':
      return { ...state, logs: { ...state.logs, [action.key]: action.log } };
    default:
      return state;
  }
}

type HealthContextValue = {
  profile: Profile | null;
  isLoading: boolean;
  saveProfile: (profile: Profile) => void;
  calorieTarget: number | null;
  waterTarget: number;
  todayLog: DailyLog;
  setWaterGlasses: (glasses: number) => void;
  toggleMeal: (meal: Meal) => void;
  setMealCalories: (meal: Meal, calories: number | null) => void;
  caloriesEaten: number;
};

const HealthContext = createContext<HealthContextValue | undefined>(undefined);

const DEFAULT_WATER_TARGET = 8;

export function HealthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { profile: null, logs: {}, isLoading: true });

  useEffect(() => {
    Promise.all([
      loadJSON<Profile | null>(STORAGE_KEYS.profile, null),
      loadJSON<DailyLogsMap>(STORAGE_KEYS.dailyLogs, {}),
    ]).then(([profile, logs]) => dispatch({ type: 'hydrate', profile, logs }));
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveJSON(STORAGE_KEYS.profile, state.profile);
    }
  }, [state.profile, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      saveJSON(STORAGE_KEYS.dailyLogs, state.logs);
    }
  }, [state.logs, state.isLoading]);

  const todayKey = dateKey(new Date());
  const todayLog = state.logs[todayKey] ?? emptyLog();

  const saveProfile = (profile: Profile) => dispatch({ type: 'setProfile', profile });

  const updateTodayLog = (updater: (log: DailyLog) => DailyLog) => {
    dispatch({ type: 'updateLog', key: todayKey, log: updater(todayLog) });
  };

  const setWaterGlasses = (glasses: number) => {
    updateTodayLog((log) => ({ ...log, waterGlasses: Math.max(0, glasses) }));
  };

  const toggleMeal = (meal: Meal) => {
    updateTodayLog((log) => ({
      ...log,
      meals: { ...log.meals, [meal]: { ...log.meals[meal], completed: !log.meals[meal].completed } },
    }));
  };

  const setMealCalories = (meal: Meal, calories: number | null) => {
    updateTodayLog((log) => ({
      ...log,
      meals: { ...log.meals, [meal]: { ...log.meals[meal], calories } },
    }));
  };

  const calorieTarget = useMemo(() => (state.profile ? calculateCalorieTarget(state.profile) : null), [state.profile]);
  const waterTarget = useMemo(
    () => (state.profile ? calculateWaterGlassTarget(state.profile.weightKg) : DEFAULT_WATER_TARGET),
    [state.profile],
  );

  const caloriesEaten = (Object.keys(todayLog.meals) as Meal[]).reduce(
    (sum, meal) => sum + (todayLog.meals[meal].calories ?? 0),
    0,
  );

  return (
    <HealthContext.Provider
      value={{
        profile: state.profile,
        isLoading: state.isLoading,
        saveProfile,
        calorieTarget,
        waterTarget,
        todayLog,
        setWaterGlasses,
        toggleMeal,
        setMealCalories,
        caloriesEaten,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error('useHealth must be used within a HealthProvider');
  return ctx;
}
