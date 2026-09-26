import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';
import { ProgressBar } from './ProgressBar';

type Props = {
  minutes: number;
  target: number;
  onChange: (minutes: number) => void;
};

export function WalkingTracker({ minutes, target, onChange }: Props) {
  const handleChangeText = (text: string) => {
    if (text.trim() === '') {
      onChange(0);
      return;
    }
    const num = parseInt(text, 10);
    if (!Number.isNaN(num)) onChange(num);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="walk-outline" size={18} color={colors.textMuted} />
          <Text style={styles.heading}>Walking</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={minutes > 0 ? String(minutes) : ''}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.unit}>/ {target} min</Text>
        </View>
      </View>
      <ProgressBar ratio={target > 0 ? minutes / target : 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  heading: { ...typography.heading, color: colors.text },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 50,
    textAlign: 'right',
    color: colors.text,
    fontSize: 14,
  },
  unit: { ...typography.caption, color: colors.textMuted },
});
