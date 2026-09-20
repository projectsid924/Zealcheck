import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, priorityColors, radius, spacing, typography } from '../constants/theme';
import { formatDueDate, isOverdue } from '../lib/date';
import type { Todo } from '../context/TodoContext';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  const overdue = !todo.completed && !!todo.dueDate && isOverdue(todo.dueDate);

  return (
    <View style={styles.row}>
      <Pressable onPress={() => onToggle(todo.id)} hitSlop={8}>
        <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
          {todo.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </Pressable>
      <View style={styles.textContainer}>
        <Text style={[styles.title, todo.completed && styles.titleCompleted]} numberOfLines={2}>
          {todo.title}
        </Text>
        {todo.priority || todo.dueDate ? (
          <View style={styles.metaRow}>
            {todo.priority ? (
              <View style={styles.metaItem}>
                <View style={[styles.priorityDot, { backgroundColor: priorityColors[todo.priority] }]} />
                <Text style={styles.metaText}>
                  {todo.priority[0].toUpperCase() + todo.priority.slice(1)}
                </Text>
              </View>
            ) : null}
            {todo.dueDate ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={12}
                  color={overdue ? colors.danger : colors.textMuted}
                />
                <Text style={[styles.metaText, overdue && styles.overdueText]}>
                  {formatDueDate(todo.dueDate)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
      <Pressable onPress={() => onDelete(todo.id)} hitSlop={8}>
        <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  textContainer: { flex: 1 },
  title: { ...typography.body, color: colors.text },
  titleCompleted: { color: colors.textMuted, textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priorityDot: { width: 8, height: 8, borderRadius: radius.full },
  metaText: { ...typography.caption, color: colors.textMuted },
  overdueText: { color: colors.danger, fontWeight: '600' },
});
