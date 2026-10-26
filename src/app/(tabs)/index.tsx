import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Screen } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCleaning } from '@/lib/cleaning';
import { formatDuration, isOffPeak, minutesUntilOffPeak, offPeakStartHour } from '@/lib/energy';
import { formatPostcode } from '@/lib/pdok';
import { useProfile } from '@/lib/profile';
import { tasksOnDay, toDayKey } from '@/lib/schedule';

const tiles: { title: string; href: Href }[] = [
  { title: 'Fix-It Guides', href: '/guides' },
  { title: 'Cleaning', href: '/cleaning' },
  { title: 'Where to Buy', href: '/buy' },
  { title: 'My Area', href: '/area' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const { profile } = useProfile();
  const { tasks } = useCleaning();
  if (!profile) return null;

  const today = toDayKey(new Date());
  const todaysTasks = tasksOnDay(tasks, today);

  return (
    <Screen inTabs>
      <View style={styles.header}>
        <View>
          <ThemedText type="small">Goedendag</ThemedText>
          <ThemedText type="title">Your home</ThemedText>
        </View>
        <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">{formatPostcode(profile.postcode)}</ThemedText>
        </View>
      </View>

      <Pressable onPress={() => router.push('/broke')} accessibilityRole="button">
        <Card tone="inverse">
          <ThemedText type="subtitle" themeColor="onInverse">
            Something broke?
          </ThemedText>
          <ThemedText themeColor="onInverse">Find out what to do next →</ThemedText>
        </Card>
      </Pressable>

      <EnergyCard province={profile.province} contract={profile.energyContract} />

      <Card>
        <ThemedText type="eyebrow">Cleaning today</ThemedText>
        {todaysTasks.length === 0 ? (
          <ThemedText type="small">Nothing planned. Add a routine in the Cleaning tab.</ThemedText>
        ) : (
          todaysTasks.map((task) => (
            <ThemedText key={task.id}>
              {task.doneDates.includes(today) ? '✓ ' : '• '}
              {task.title}
            </ThemedText>
          ))
        )}
      </Card>

      <ThemedText type="eyebrow" themeColor="textSecondary">
        Explore
      </ThemedText>
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.title}
            onPress={() => router.push(tile.href)}
            style={[styles.tile, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText type="subtitle">{tile.title}</ThemedText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

function EnergyCard({ province, contract }: { province: string; contract: string }) {
  if (contract !== 'dual_rate') {
    return (
      <Card tone="mint">
        <ThemedText type="eyebrow" themeColor="good">
          Energy tip
        </ThemedText>
        <ThemedText>
          {contract === 'dynamic'
            ? "Check tomorrow's prices in your supplier's app and run the washing machine in the cheapest block."
            : 'Your price is the same all day. Save with eco programmes and full loads.'}
        </ThemedText>
      </Card>
    );
  }

  const now = new Date();
  const offPeak = isOffPeak(now, province);
  return (
    <Card tone="mint">
      <ThemedText type="eyebrow" themeColor="good">
        {offPeak ? 'Cheap hours now' : `Cheap hours start ${offPeakStartHour(province)}:00`}
      </ThemedText>
      <ThemedText>
        {offPeak
          ? 'Good time for the washing machine or dishwasher.'
          : `In ${formatDuration(minutesUntilOffPeak(now, province))}. Set the delay timer tonight.`}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 999,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  tile: {
    flexBasis: '46%',
    flexGrow: 1,
    height: 96,
    borderWidth: 1,
    borderRadius: Radius.large,
    padding: Spacing.three,
    justifyContent: 'flex-end',
  },
});
