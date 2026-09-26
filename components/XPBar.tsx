import { ProgressBar } from './ProgressBar';

type Props = {
  progressRatio: number;
  xpIntoStage: number;
  xpForNextStage: number | null;
  isMaxStage: boolean;
};

export function XPBar({ progressRatio, xpIntoStage, xpForNextStage, isMaxStage }: Props) {
  return (
    <ProgressBar
      ratio={progressRatio}
      label={isMaxStage ? `${xpIntoStage} XP · Max stage reached` : `${xpIntoStage} / ${xpForNextStage} XP`}
    />
  );
}
