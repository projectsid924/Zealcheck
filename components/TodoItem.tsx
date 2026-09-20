import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';
import type { Todo } from '../context/TodoContext';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
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
        {todo.dueDate ? <Text style={styles.due}>{todo.dueDate}</Text> : null}
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
  due: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
