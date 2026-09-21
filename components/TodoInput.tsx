import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';
import { QUICK_ADD_SUBJECTS } from '../constants/subjects';
import { TaskMetaFields } from './TaskMetaFields';
import type { Priority } from '../context/TodoContext';

type Props = {
  onAdd: (title: string, opts?: { dueDate?: string; priority?: Priority }) => void;
  suggestions?: string[];
};

export function TodoInput({ onAdd, suggestions = [] }: Props) {
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value, { dueDate: dueDate?.toISOString(), priority });
    setValue('');
    setPriority(undefined);
    setDueDate(undefined);
  };

  const matchingSuggestions =
    value.trim().length > 0
      ? suggestions
          .filter((s) => s.toLowerCase().includes(value.trim().toLowerCase()))
          .filter((s) => s.toLowerCase() !== value.trim().toLowerCase())
          .slice(0, 5)
      : [];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Add a task..."
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={submit}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={submit} hitSlop={8}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      {matchingSuggestions.length > 0 ? (
        <View style={styles.suggestionsBox}>
          {matchingSuggestions.map((s) => (
            <Pressable key={s} style={styles.suggestionRow} onPress={() => setValue(s)}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.optionsRow}>
        {QUICK_ADD_SUBJECTS.map((subject) => (
          <Pressable
            key={subject}
            style={[styles.pill, styles.subjectPill]}
            onPress={() => setValue(subject)}
          >
            <Text style={[styles.pillLabel, { color: colors.text }]}>{subject}</Text>
          </Pressable>
        ))}
      </View>

      <TaskMetaFields
        priority={priority}
        onPriorityChange={setPriority}
        dueDate={dueDate}
        onDueDateChange={setDueDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  pillLabel: { ...typography.caption, fontWeight: '600' },
  subjectPill: { backgroundColor: colors.surface, borderColor: colors.border },
  suggestionsBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: { ...typography.body, color: colors.text },
});
