import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TodoInput } from '../../components/TodoInput';
import { TodoItem } from '../../components/TodoItem';
import { colors, spacing, typography } from '../../constants/theme';
import { useTodos } from '../../context/TodoContext';

export default function TodosScreen() {
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Tasks</Text>
        <TodoInput onAdd={addTodo} />
        {isLoading ? null : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
            )}
            ListEmptyComponent={<Text style={styles.empty}>No tasks yet — add one above to get started.</Text>}
            contentContainerStyle={todos.length === 0 ? styles.emptyContainer : undefined}
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
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  emptyContainer: { flexGrow: 1 },
});
