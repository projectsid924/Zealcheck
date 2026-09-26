import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';

type Props = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  completed: boolean;
  calories: number | null;
  onToggle: () => void;
  onCaloriesChange: (calories: number | null) => void;
};

export function MealCard({ label, icon, completed, calories, onToggle, onCaloriesChange }: Props) {
  const handleChangeText = (text: string) => {
    if (text.trim() === '') {
      onCaloriesChange(null);
      return;
    }
    const num = parseInt(text, 10);
    if (!Number.isNaN(num)) onCaloriesChange(num);
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={onToggle} hitSlop={8} style={styles.left}>
        <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
          {completed && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={[styles.label, completed && styles.labelCompleted]}>{label}</Text>
      </Pressable>
      <View style={styles.caloriesField}>
        <TextInput
          style={styles.caloriesInput}
          value={calories !== null ? String(calories) : ''}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={styles.kcalLabel}>kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: { backgroundColor: colors.success, borderColor: colors.success },
  label: { ...typography.body, color: colors.text },
  labelCompleted: { color: colors.success, fontWeight: '600' },
  caloriesField: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  caloriesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 60,
    textAlign: 'right',
    color: colors.text,
    fontSize: 14,
  },
  kcalLabel: { ...typography.caption, color: colors.textMuted },
});
