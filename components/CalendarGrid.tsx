import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { dateKey, isSameDay } from '../lib/date';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type Props = {
  weeks: Date[][];
  selectedDate: Date;
  focusMonth: Date;
  taskCountByDate: Record<string, number>;
  onSelectDate: (date: Date) => void;
};

export function CalendarGrid({ weeks, selectedDate, focusMonth, taskCountByDate, onSelectDate }: Props) {
  const today = new Date();

  return (
    <View>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, i) => (
          <Text key={i} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day) => {
            const inFocusMonth = day.getMonth() === focusMonth.getMonth();
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate);
            const taskCount = taskCountByDate[dateKey(day)] ?? 0;

            return (
              <Pressable
                key={day.toISOString()}
                style={styles.dayCell}
                onPress={() => onSelectDate(day)}
              >
                <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected, isToday && !isSelected && styles.dayCircleToday]}>
                  <Text
                    style={[
                      styles.dayText,
                      !inFocusMonth && styles.dayTextDim,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayTextToday,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </View>
                <View style={[styles.dot, taskCount > 0 && { backgroundColor: colors.primary }]} />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weekdayRow: { flexDirection: 'row' },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  weekRow: { flexDirection: 'row' },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: { backgroundColor: colors.primary },
  dayCircleToday: { borderWidth: 1.5, borderColor: colors.primary },
  dayText: { ...typography.body, color: colors.text },
  dayTextDim: { color: colors.textMuted, opacity: 0.4 },
  dayTextSelected: { color: '#fff', fontWeight: '700' },
  dayTextToday: { color: colors.primary, fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: radius.full, backgroundColor: 'transparent', marginTop: 2 },
});
