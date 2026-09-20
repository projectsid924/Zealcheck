import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, priorityColors, radius, spacing, typography } from '../constants/theme';
import { formatDueDate, isOverdue } from '../lib/date';
import { TaskMetaFields } from './TaskMetaFields';
import type { Todo, TodoEdits } from '../context/TodoContext';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, edits: TodoEdits) => void;
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate ? new Date(todo.dueDate) : undefined);

  const overdue = !todo.completed && !!todo.dueDate && isOverdue(todo.dueDate);

  const startEditing = () => {
    setTitle(todo.title);
    setPriority(todo.priority);
    setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    setIsEditing(true);
  };

  const save = () => {
    if (!title.trim()) return;
    onUpdate(todo.id, { title, dueDate: dueDate?.toISOString(), priority });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.row}>
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={title}
            onChangeText={setTitle}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={save}
          />
          <TaskMetaFields
            priority={priority}
            onPriorityChange={setPriority}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
          />
          <View style={styles.editActions}>
            <Pressable style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={save}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

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
      <Pressable onPress={startEditing} hitSlop={8}>
        <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
      </Pressable>
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
  editContainer: { flex: 1 },
  editInput: {
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
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
  saveButtonText: { ...typography.caption, fontWeight: '600', color: '#fff' },
});
