export type PetStage = {
  name: string;
  emoji: string;
  /** Cumulative XP required to reach this stage. */
  xpRequired: number;
};

export const XP_PER_TASK = 10;

export const PET_STAGES: PetStage[] = [
  { name: 'Newborn Pup', emoji: '🐾', xpRequired: 0 },
  { name: 'Puppy', emoji: '🐶', xpRequired: 50 },
  { name: 'Young Dog', emoji: '🐕', xpRequired: 150 },
  { name: 'Loyal Dog', emoji: '🦮', xpRequired: 350 },
  { name: 'Champion Dog', emoji: '🐩', xpRequired: 700 },
];

export type PetProgress = {
  stageIndex: number;
  stage: PetStage;
  level: number;
  isMaxStage: boolean;
  xpIntoStage: number;
  xpForNextStage: number | null;
  progressRatio: number;
};

export function getPetProgress(xp: number): PetProgress {
  let stageIndex = 0;
  for (let i = PET_STAGES.length - 1; i >= 0; i--) {
    if (xp >= PET_STAGES[i].xpRequired) {
      stageIndex = i;
      break;
    }
  }

  const stage = PET_STAGES[stageIndex];
  const nextStage = PET_STAGES[stageIndex + 1] ?? null;
  const isMaxStage = nextStage === null;

  const xpIntoStage = xp - stage.xpRequired;
  const xpForNextStage = nextStage ? nextStage.xpRequired - stage.xpRequired : null;
  const progressRatio = isMaxStage || xpForNextStage === 0 ? 1 : Math.min(1, xpIntoStage / (xpForNextStage as number));

  return {
    stageIndex,
    stage,
    level: stageIndex + 1,
    isMaxStage,
    xpIntoStage,
    xpForNextStage,
    progressRatio,
  };
}
