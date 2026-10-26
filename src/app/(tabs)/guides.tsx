import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Screen } from '@/components/ui';
import { guidesFor } from '@/content/guides';
import { heatingLabels, useProfile } from '@/lib/profile';

export default function GuidesScreen() {
  const { profile } = useProfile();
  const list = guidesFor(profile?.heatingType);

  return (
    <Screen inTabs>
      <ThemedText type="title">Fix-It Guides</ThemedText>
      {profile && (
        <ThemedText type="small">Showing guides for: {heatingLabels[profile.heatingType]}</ThemedText>
      )}
      {list.map((guide) => (
        <Pressable
          key={guide.id}
          onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
          accessibilityRole="button">
          <Card>
            <ThemedText type="subtitle">{guide.title.en}</ThemedText>
            <ThemedText type="small">
              {guide.title.nl} · {guide.difficulty} · {guide.minutes} min
              {guide.testedAtHome ? '' : ' · not yet tested'}
            </ThemedText>
          </Card>
        </Pressable>
      ))}
      <ThemedText type="small">Missing a guide? Tell us what broke and we’ll draw it next.</ThemedText>
    </Screen>
  );
}
