import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, priorityColors, radius, spacing, typography } from '../constants/theme';

type Props = {
  glasses: number;
  target: number;
  onChange: (glasses: number) => void;
};

export function WaterTracker({ glasses, target, onChange }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Water</Text>
        <Text style={styles.count}>
          {glasses} / {target} glasses
        </Text>
      </View>
      <View style={styles.dropletsRow}>
        {Array.from({ length: target }, (_, i) => {
          const filled = i < glasses;
          return (
            <Pressable key={i} onPress={() => onChange(filled && glasses === i + 1 ? i : i + 1)} hitSlop={4}>
              <Ionicons name={filled ? 'water' : 'water-outline'} size={26} color={priorityColors.low} />
            </Pressable>
          );
        })}
      </View>
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
  heading: { ...typography.heading, color: colors.text },
  count: { ...typography.caption, color: colors.textMuted },
  dropletsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
