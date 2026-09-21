import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarGrid } from '../../components/CalendarGrid';
import { TodoItem } from '../../components/TodoItem';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { useTodos } from '../../context/TodoContext';
import {
  addDays,
  addMonths,
  dateKey,
  formatMonthYear,
  formatWeekRange,
  getMonthGrid,
  getWeekDays,
  isSameDay,
} from '../../lib/date';

type Mode = 'week' | 'month';

export default function CalendarScreen() {
  const { todos, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [mode, setMode] = useState<Mode>('week');
  const [refDate, setRefDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weeks = useMemo(() => (mode === 'week' ? [getWeekDays(refDate)] : getMonthGrid(refDate)), [mode, refDate]);

  const taskCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const todo of todos) {
      if (!todo.dueDate) continue;
      const key = dateKey(new Date(todo.dueDate));
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [todos]);

  const tasksForSelectedDate = useMemo(
    () => todos.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)),
    [todos, selectedDate],
  );

  const goPrev = () => setRefDate((d) => (mode === 'week' ? addDays(d, -7) : addMonths(d, -1)));
  const goNext = () => setRefDate((d) => (mode === 'week' ? addDays(d, 7) : addMonths(d, 1)));

  const toggleMode = () => {
    setMode((m) => (m === 'week' ? 'month' : 'week'));
    setRefDate(selectedDate);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    if (mode === 'week') setRefDate(date);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Calendar</Text>

        <View style={styles.navRow}>
          <Pressable onPress={goPrev} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.navLabel}>{mode === 'week' ? formatWeekRange(refDate) : formatMonthYear(refDate)}</Text>
          <Pressable onPress={goNext} hitSlop={8}>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.modeToggle} onPress={toggleMode}>
            <Text style={styles.modeToggleText}>{mode === 'week' ? 'Month' : 'Week'}</Text>
          </Pressable>
        </View>

        <CalendarGrid
          weeks={weeks}
          selectedDate={selectedDate}
          focusMonth={refDate}
          taskCountByDate={taskCountByDate}
          onSelectDate={selectDate}
        />

        <Text style={styles.listHeader}>
          {isSameDay(selectedDate, new Date())
            ? 'Today'
            : selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </Text>

        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No tasks due this day.</Text>}
          contentContainerStyle={tasksForSelectedDate.length === 0 ? styles.emptyContainer : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { ...typography.title, color: colors.text, marginBottom: spacing.md },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  navLabel: { ...typography.heading, color: colors.text, flex: 1, textAlign: 'center' },
  modeToggle: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  modeToggleText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  listHeader: { ...typography.heading, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  emptyContainer: { flexGrow: 1 },
});
