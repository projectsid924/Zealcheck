import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, priorityColors, radius, spacing, typography } from '../constants/theme';
import { formatDueDate } from '../lib/date';
import type { Priority } from '../context/TodoContext';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

type Props = {
  priority: Priority | undefined;
  onPriorityChange: (priority: Priority | undefined) => void;
  dueDate: Date | undefined;
  onDueDateChange: (dueDate: Date | undefined) => void;
};

export function TaskMetaFields({ priority, onPriorityChange, dueDate, onDueDateChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      onDueDateChange(selectedDate);
    }
  };

  return (
    <View>
      <View style={styles.optionsRow}>
        {PRIORITIES.map((p) => {
          const selected = priority === p;
          return (
            <Pressable
              key={p}
              style={[
                styles.pill,
                { borderColor: priorityColors[p] },
                selected && { backgroundColor: priorityColors[p] },
              ]}
              onPress={() => onPriorityChange(selected ? undefined : p)}
            >
              <Text style={[styles.pillLabel, { color: selected ? '#fff' : priorityColors[p] }]}>
                {p[0].toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          style={[
            styles.pill,
            styles.dueDatePill,
            { borderColor: dueDate ? colors.primary : colors.border },
            dueDate && { backgroundColor: colors.primaryMuted },
          ]}
          onPress={() => setShowPicker((s) => !s)}
        >
          <Ionicons name="calendar-outline" size={14} color={dueDate ? colors.primary : colors.textMuted} />
          <Text style={[styles.pillLabel, { color: dueDate ? colors.primary : colors.textMuted, marginLeft: 4 }]}>
            {dueDate ? formatDueDate(dueDate.toISOString()) : 'Due date'}
          </Text>
        </Pressable>
        {dueDate ? (
          <Pressable onPress={() => onDueDateChange(undefined)} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {showPicker ? (
        <View style={styles.pickerWrap}>
          <DateTimePicker
            value={dueDate ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
            minimumDate={startOfToday()}
          />
          {Platform.OS === 'ios' ? (
            <Pressable style={styles.doneButton} onPress={() => setShowPicker(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  dueDatePill: { flexDirection: 'row', alignItems: 'center' },
  pickerWrap: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
  },
  doneButton: {
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  doneButtonText: { color: '#fff', fontWeight: '600' },
});
