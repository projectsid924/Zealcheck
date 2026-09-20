import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import { getPetProgress, XP_PER_TASK, type PetProgress } from '../constants/petStages';

type PetState = {
  xp: number;
  isLoading: boolean;
};

type Action = { type: 'hydrate'; xp: number } | { type: 'award'; amount: number };

function reducer(state: PetState, action: Action): PetState {
  switch (action.type) {
    case 'hydrate':
      return { xp: action.xp, isLoading: false };
    case 'award':
      return { ...state, xp: state.xp + action.amount };
    default:
      return state;
  }
}

type PetContextValue = {
  xp: number;
  isLoading: boolean;
  progress: PetProgress;
  awardXp: (amount?: number) => void;
  leveledUp: boolean;
  acknowledgeLevelUp: () => void;
};

const PetContext = createContext<PetContextValue | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { xp: 0, isLoading: true });
  const [leveledUp, setLeveledUp] = useState(false);
  const prevStageIndex = useRef<number | null>(null);

  useEffect(() => {
    loadJSON(STORAGE_KEYS.pet, { xp: 0 }).then((saved) => {
      dispatch({ type: 'hydrate', xp: saved.xp });
    });
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveJSON(STORAGE_KEYS.pet, { xp: state.xp });
    }
  }, [state.xp, state.isLoading]);

  const progress = getPetProgress(state.xp);

  useEffect(() => {
    if (state.isLoading) return;
    if (prevStageIndex.current === null) {
      prevStageIndex.current = progress.stageIndex;
      return;
    }
    if (progress.stageIndex > prevStageIndex.current) {
      setLeveledUp(true);
    }
    prevStageIndex.current = progress.stageIndex;
  }, [progress.stageIndex, state.isLoading]);

  const awardXp = (amount: number = XP_PER_TASK) => {
    dispatch({ type: 'award', amount });
  };

  const acknowledgeLevelUp = () => setLeveledUp(false);

  return (
    <PetContext.Provider
      value={{ xp: state.xp, isLoading: state.isLoading, progress, awardXp, leveledUp, acknowledgeLevelUp }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be used within a PetProvider');
  return ctx;
}
