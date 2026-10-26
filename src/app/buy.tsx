import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Screen } from '@/components/ui';
import { guides, storeLabels } from '@/content/guides';

export default function WhereToBuyScreen() {
  const items = guides.flatMap((guide) => guide.items);
  const unique = items.filter((item, i) => items.findIndex((other) => other.en === item.en) === i);

  return (
    <Screen footer={<Button label="Back" variant="secondary" onPress={() => router.back()} />}>
      <ThemedText type="title">Where to buy</ThemedText>
      <ThemedText type="small">The Dutch word and the type of shop to try first.</ThemedText>
      {unique.map((item) => (
        <Card key={item.en}>
          <ThemedText type="subtitle">{item.en}</ThemedText>
          <ThemedText type="small">
            {item.nl} · {storeLabels[item.store]}
          </ThemedText>
        </Card>
      ))}
      {/* TODO: map of nearby shops from OpenStreetMap (show "© OpenStreetMap contributors") */}
    </Screen>
  );
}
