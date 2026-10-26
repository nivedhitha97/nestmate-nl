import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Screen } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCleaning } from '@/lib/cleaning';
import { fromDayKey, occurrencesBetween, repeatLabels, tasksOnDay, toDayKey } from '@/lib/schedule';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** Day cells for a month grid starting on Monday; null = padding before the 1st. */
function monthCells(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const padding = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array<null>(padding).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
}

export default function CleaningScreen() {
  const theme = useTheme();
  const { tasks, toggleDone, removeTask } = useCleaning();
  const todayKey = toDayKey(new Date());
  const [selected, setSelected] = useState(todayKey);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const { year, month } = visibleMonth;
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const kindsByDay = new Map<string, Set<string>>();
  for (const task of tasks) {
    for (const day of occurrencesBetween(task, monthStart, monthEnd)) {
      kindsByDay.set(day, (kindsByDay.get(day) ?? new Set()).add(task.kind));
    }
  }

  const dayTasks = tasksOnDay(tasks, selected);
  const monthLabel = monthStart.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const selectedLabel = fromDayKey(selected).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  function shiftMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setVisibleMonth({ year: next.getFullYear(), month: next.getMonth() });
  }

  function confirmRemove(id: string, title: string) {
    Alert.alert('Delete routine?', `“${title}” and its reminders will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeTask(id) },
    ]);
  }

  return (
    <Screen
      inTabs
      footer={
        <Button
          label="Add cleaning routine"
          onPress={() => router.push({ pathname: '/cleaning-new', params: { date: selected } })}
        />
      }>
      <ThemedText type="title">Cleaning</ThemedText>

      <Card>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={12} accessibilityLabel="Previous month">
            <ThemedText type="subtitle">‹</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">{monthLabel}</ThemedText>
          <Pressable onPress={() => shiftMonth(1)} hitSlop={12} accessibilityLabel="Next month">
            <ThemedText type="subtitle">›</ThemedText>
          </Pressable>
        </View>
        <View style={styles.grid}>
          {WEEKDAYS.map((day) => (
            <View key={day} style={styles.cell}>
              <ThemedText type="small">{day}</ThemedText>
            </View>
          ))}
          {monthCells(year, month).map((date, i) => {
            if (!date) return <View key={`pad-${i}`} style={styles.cell} />;
            const key = toDayKey(date);
            const kinds = kindsByDay.get(key);
            const isSelected = key === selected;
            return (
              <Pressable
                key={key}
                onPress={() => setSelected(key)}
                style={[styles.cell, isSelected && { backgroundColor: theme.accent, borderRadius: Radius.small }]}>
                <ThemedText
                  type={key === todayKey ? 'smallBold' : 'small'}
                  themeColor={isSelected ? 'backgroundElement' : 'text'}>
                  {date.getDate()}
                </ThemedText>
                <View style={styles.dots}>
                  {kinds?.has('regular') && <View style={[styles.dot, { backgroundColor: isSelected ? theme.backgroundElement : theme.accent }]} />}
                  {kinds?.has('deep') && <View style={[styles.dot, { backgroundColor: isSelected ? theme.backgroundElement : theme.good }]} />}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: theme.accent }]} />
          <ThemedText type="small">Regular</ThemedText>
          <View style={[styles.dot, { backgroundColor: theme.good }]} />
          <ThemedText type="small">Deep clean</ThemedText>
        </View>
      </Card>

      <ThemedText type="subtitle">{selectedLabel}</ThemedText>
      {dayTasks.length === 0 && <ThemedText type="small">Nothing planned for this day.</ThemedText>}
      {dayTasks.map((task) => {
        const done = task.doneDates.includes(selected);
        return (
          <Pressable
            key={task.id}
            onPress={() => toggleDone(task.id, selected)}
            onLongPress={() => confirmRemove(task.id, task.title)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: done }}>
            <Card style={styles.taskRow}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.good, backgroundColor: done ? theme.good : 'transparent' },
                ]}
              />
              <View style={styles.taskText}>
                <ThemedText style={done && styles.doneText}>{task.title}</ThemedText>
                <ThemedText type="small">
                  {task.kind === 'deep' ? 'Deep clean' : 'Regular'} · {repeatLabels[task.repeat]} · {task.reminderTime}
                </ThemedText>
              </View>
            </Card>
          </Pressable>
        );
      })}
      {dayTasks.length > 0 && <ThemedText type="small">Tap to tick off. Long-press to delete.</ThemedText>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
  },
  taskText: {
    flex: 1,
    gap: Spacing.half,
  },
  doneText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
