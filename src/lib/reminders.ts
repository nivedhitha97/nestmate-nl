/**
 * Local cleaning reminders (no server). Every upcoming occurrence is scheduled as a one-off
 * DATE notification, so "every 2 weeks" and "every 3 months" work the same way on iOS and Android.
 * iOS keeps at most 64 pending notifications, so we only schedule the next few weeks and
 * re-sync whenever tasks change or the app starts.
 */

import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { fromDayKey, occurrencesBetween, type CleaningTask } from '@/lib/schedule';

const CHANNEL_ID = 'cleaning-reminders';
const LOOKAHEAD_DAYS = 45;
const MAX_SCHEDULED = 60;
const supported = Platform.OS === 'ios' || Platform.OS === 'android';

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureReminderPermission(): Promise<boolean> {
  if (!supported) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Cleaning reminders',
      importance: AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function syncReminders(tasks: CleaningTask[]): Promise<void> {
  if (!supported) return;
  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();
  const until = new Date(now);
  until.setDate(until.getDate() + LOOKAHEAD_DAYS);

  const upcoming = tasks
    .flatMap((task) =>
      occurrencesBetween(task, now, until).map((dayKey) => {
        const [hour, minute] = task.reminderTime.split(':').map(Number);
        const date = fromDayKey(dayKey);
        date.setHours(hour, minute, 0, 0);
        return { task, dayKey, date };
      }),
    )
    .filter(({ task, dayKey, date }) => date > now && !task.doneDates.includes(dayKey))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, MAX_SCHEDULED);

  for (const { task, date } of upcoming) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: task.kind === 'deep' ? 'Deep cleaning today' : 'Cleaning reminder',
        body: task.title,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: CHANNEL_ID,
      },
    });
  }
}
