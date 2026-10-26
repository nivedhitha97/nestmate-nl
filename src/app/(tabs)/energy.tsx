import { ThemedText } from '@/components/themed-text';
import { Card, Screen } from '@/components/ui';
import { offPeakStartHour } from '@/lib/energy';
import { contractLabels, useProfile } from '@/lib/profile';

const applianceTips = [
  { title: 'Washing machine', tip: 'Wash at 30 °C on eco with a full load. Use the delay timer for cheap hours.' },
  { title: 'Dishwasher', tip: 'Eco mode, and only when full. No need to rinse plates under a hot tap first.' },
  { title: 'Tumble dryer', tip: 'The biggest user of the three. Air-dry when you can.' },
  { title: 'Neighbours', tip: 'Late-night washing can break house rules in apartments. Weekends are a good alternative.' },
];

export default function EnergyScreen() {
  const { profile } = useProfile();
  if (!profile) return null;

  const start = offPeakStartHour(profile.province);

  return (
    <Screen inTabs>
      <ThemedText type="title">When is power cheapest?</ThemedText>
      <ThemedText type="small">Your contract: {contractLabels[profile.energyContract]}</ThemedText>

      <Card tone="mint">
        {profile.energyContract === 'dual_rate' && (
          <>
            <ThemedText type="subtitle">
              Weekdays {start}:00 – 07:00, plus all weekend and public holidays
            </ThemedText>
            <ThemedText type="small">
              {start === 21
                ? 'In Noord-Brabant and Limburg, cheap hours start at 21:00.'
                : 'In most of the Netherlands, cheap hours start at 23:00.'}{' '}
              Some suppliers differ, so check your contract.
            </ThemedText>
          </>
        )}
        {profile.energyContract === 'single_rate' && (
          <ThemedText type="subtitle">Same price all day. Timing doesn’t change your bill.</ThemedText>
        )}
        {profile.energyContract === 'dynamic' && (
          <>
            <ThemedText type="subtitle">Prices change every day</ThemedText>
            <ThemedText type="small">
              Tomorrow’s prices are set the afternoon before. They are often low around midday on sunny
              days and at night, and often highest in the early evening. Check your supplier’s app.
            </ThemedText>
          </>
        )}
      </Card>

      <ThemedText type="eyebrow" themeColor="textSecondary">
        Appliance tips
      </ThemedText>
      {applianceTips.map((item) => (
        <Card key={item.title}>
          <ThemedText type="subtitle">{item.title}</ThemedText>
          <ThemedText type="small">{item.tip}</ThemedText>
        </Card>
      ))}
    </Screen>
  );
}
