import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TodoInput } from '../../components/TodoInput';
import { TodoItem } from '../../components/TodoItem';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { useTodos, type Priority } from '../../context/TodoContext';

type SortBy = 'date' | 'priority';

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function priorityRank(priority: Priority | undefined): number {
  return priority ? PRIORITY_RANK[priority] : 3;
}

function dueDateTime(dueDate: string | undefined): number {
  return dueDate ? new Date(dueDate).getTime() : Infinity;
}

export default function TodosScreen() {
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const sortedTodos = useMemo(() => {
    const copy = [...todos];
    if (sortBy === 'date') {
      copy.sort((a, b) => dueDateTime(a.dueDate) - dueDateTime(b.dueDate) || priorityRank(a.priority) - priorityRank(b.priority));
    } else {
      copy.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || dueDateTime(a.dueDate) - dueDateTime(b.dueDate));
    }
    return copy;
  }, [todos, sortBy]);

  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const todo of todos) {
      const key = todo.title.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(todo.title);
      }
    }
    return unique.slice(0, 10);
  }, [todos]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Tasks</Text>
        <TodoInput onAdd={addTodo} suggestions={suggestions} />

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by</Text>
          {(['date', 'priority'] as SortBy[]).map((option) => {
            const selected = sortBy === option;
            return (
              <Pressable
                key={option}
                style={[styles.sortPill, selected && styles.sortPillSelected]}
                onPress={() => setSortBy(option)}
              >
                <Text style={[styles.sortPillText, selected && styles.sortPillTextSelected]}>
                  {option === 'date' ? 'Date' : 'Priority'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isLoading ? null : (
          <FlatList
            data={sortedTodos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
            )}
            ListEmptyComponent={<Text style={styles.empty}>No tasks yet — add one above to get started.</Text>}
            contentContainerStyle={sortedTodos.length === 0 ? styles.emptyContainer : undefined}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { ...typography.title, color: colors.text, marginBottom: spacing.md },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  sortLabel: { ...typography.caption, color: colors.textMuted, marginRight: spacing.xs },
  sortPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  sortPillSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortPillText: { ...typography.caption, fontWeight: '600', color: colors.textMuted },
  sortPillTextSelected: { color: '#fff' },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  emptyContainer: { flexGrow: 1 },
});
