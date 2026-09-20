import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

type Props = {
  progressRatio: number;
  xpIntoStage: number;
  xpForNextStage: number | null;
  isMaxStage: boolean;
};

export function XPBar({ progressRatio, xpIntoStage, xpForNextStage, isMaxStage }: Props) {
  return (
    <View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(progressRatio * 100)}%` }]} />
      </View>
      <Text style={styles.label}>
        {isMaxStage ? `${xpIntoStage} XP · Max stage reached` : `${xpIntoStage} / ${xpForNextStage} XP`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  label: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
