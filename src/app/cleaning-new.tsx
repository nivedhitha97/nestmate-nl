import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Screen } from '@/components/ui';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCleaning } from '@/lib/cleaning';
import { ensureReminderPermission } from '@/lib/reminders';
import {
  fromDayKey,
  repeatLabels,
  suggestedTasks,
  toDayKey,
  type CleaningKind,
  type Repeat,
} from '@/lib/schedule';

const REMINDER_TIMES = ['08:00', '10:00', '13:00', '18:00', '20:00'];

export default function NewCleaningTaskScreen() {
  const theme = useTheme();
  const { addTask } = useCleaning();
  const params = useLocalSearchParams<{ date?: string }>();
  const startDate = params.date ?? toDayKey(new Date());

  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<CleaningKind>('regular');
  const [repeat, setRepeat] = useState<Repeat>('weekly');
  const [reminderTime, setReminderTime] = useState('10:00');

  async function save() {
    if (!title.trim()) return;
    const granted = await ensureReminderPermission();
    await addTask({ title: title.trim(), kind, repeat, startDate, reminderTime });
    if (!granted && Platform.OS !== 'web') {
      Alert.alert(
        'Reminders are off',
        "Your routine is saved, but notifications are blocked. Turn them on in your phone's settings to get reminders.",
      );
    }
    router.back();
  }

  const startLabel = fromDayKey(startDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Screen
      footer={
        <>
          <Button label="Save routine" onPress={save} disabled={!title.trim()} />
          <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
        </>
      }>
      <ThemedText type="title">New cleaning routine</ThemedText>
      <ThemedText themeColor="textSecondary">Starts {startLabel}. You’ll get a reminder each time it’s due.</ThemedText>

      <ThemedText type="smallBold">Suggestions</ThemedText>
      <View style={styles.chips}>
        {suggestedTasks.map((s) => (
          <Chip
            key={s.title}
            label={s.title}
            selected={title === s.title}
            onPress={() => {
              setTitle(s.title);
              setKind(s.kind);
              setRepeat(s.repeat);
            }}
          />
        ))}
      </View>

      <ThemedText type="smallBold">What needs doing?</ThemedText>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Clean the bathroom"
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { borderColor: theme.border, backgroundColor: theme.backgroundElement, color: theme.text },
        ]}
      />

      <ThemedText type="smallBold">Type</ThemedText>
      <View style={styles.chips}>
        <Chip label="Regular cleaning" selected={kind === 'regular'} onPress={() => setKind('regular')} />
        <Chip label="Deep cleaning" selected={kind === 'deep'} onPress={() => setKind('deep')} />
      </View>

      <ThemedText type="smallBold">Repeat</ThemedText>
      <View style={styles.chips}>
        {(Object.keys(repeatLabels) as Repeat[]).map((r) => (
          <Chip key={r} label={repeatLabels[r]} selected={repeat === r} onPress={() => setRepeat(r)} />
        ))}
      </View>

      <ThemedText type="smallBold">Reminder time</ThemedText>
      <View style={styles.chips}>
        {REMINDER_TIMES.map((t) => (
          <Chip key={t} label={t} selected={reminderTime === t} onPress={() => setReminderTime(t)} />
        ))}
      </View>

      {Platform.OS === 'web' && (
        <ThemedText type="small">Reminders only work in the iOS and Android app.</ThemedText>
      )}
    </Screen>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          borderColor: selected ? theme.accent : theme.border,
          backgroundColor: selected ? theme.accentSoft : theme.backgroundElement,
        },
      ]}>
      <ThemedText type="smallBold" themeColor={selected ? 'accent' : 'text'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.body,
    fontSize: 17,
  },
});
