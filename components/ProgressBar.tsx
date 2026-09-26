import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

type Props = {
  ratio: number;
  label?: string;
  fillColor?: string;
  trackColor?: string;
};

export function ProgressBar({ ratio, label, fillColor = colors.primary, trackColor = colors.primaryMuted }: Props) {
  const clamped = Math.max(0, Math.min(1, ratio));
  return (
    <View>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <View style={[styles.fill, { width: `${Math.round(clamped * 100)}%`, backgroundColor: fillColor }]} />
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
  label: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
