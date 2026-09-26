import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { ACTIVITY_LEVELS, type ActivityLevel, type Profile, type Sex } from '../lib/health';

type Props = {
  initialProfile: Profile | null;
  onSave: (profile: Profile) => void;
  onCancel?: () => void;
};

export function ProfileForm({ initialProfile, onSave, onCancel }: Props) {
  const [weight, setWeight] = useState(initialProfile ? String(initialProfile.weightKg) : '');
  const [height, setHeight] = useState(initialProfile ? String(initialProfile.heightCm) : '');
  const [age, setAge] = useState(initialProfile ? String(initialProfile.age) : '');
  const [sex, setSex] = useState<Sex>(initialProfile?.sex ?? 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialProfile?.activityLevel ?? 'sedentary');

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const ageNum = parseInt(age, 10);
  const isValid = weightNum > 0 && heightNum > 0 && ageNum > 0;

  const save = () => {
    if (!isValid) return;
    onSave({ weightKg: weightNum, heightCm: heightNum, age: ageNum, sex, activityLevel });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Your profile</Text>
      <Text style={styles.subtext}>Used to calculate your daily calorie and water targets.</Text>

      <View style={styles.fieldRow}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="70"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="170"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="25"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      <Text style={styles.fieldLabel}>Sex (for calorie formula)</Text>
      <View style={styles.pillRow}>
        {(['male', 'female'] as Sex[]).map((option) => (
          <Pressable
            key={option}
            style={[styles.pill, sex === option && styles.pillSelected]}
            onPress={() => setSex(option)}
          >
            <Text style={[styles.pillText, sex === option && styles.pillTextSelected]}>
              {option[0].toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.fieldLabel}>Activity level</Text>
      <View style={styles.pillRow}>
        {ACTIVITY_LEVELS.map((option) => (
          <Pressable
            key={option.key}
            style={[styles.pill, activityLevel === option.key && styles.pillSelected]}
            onPress={() => setActivityLevel(option.key)}
          >
            <Text style={[styles.pillText, activityLevel === option.key && styles.pillTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        {onCancel ? (
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        ) : null}
        <Pressable style={[styles.saveButton, !isValid && styles.saveButtonDisabled]} onPress={save} disabled={!isValid}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
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
  },
  heading: { ...typography.heading, color: colors.text },
  subtext: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  fieldRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  field: { flex: 1 },
  fieldLabel: { ...typography.caption, color: colors.textMuted, fontWeight: '600', marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  pill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pillSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { ...typography.caption, fontWeight: '600', color: colors.textMuted },
  pillTextSelected: { color: '#fff' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  cancelButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: { ...typography.caption, fontWeight: '600', color: colors.textMuted },
  saveButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { ...typography.caption, fontWeight: '600', color: '#fff' },
});
