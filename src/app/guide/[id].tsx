import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Screen } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { guideById, storeLabels } from '@/content/guides';
import { useTheme } from '@/hooks/use-theme';

export default function GuideScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = guideById(id);
  // -1 = overview with shopping list, 0..n-1 = steps
  const [step, setStep] = useState(-1);

  if (!guide) {
    return (
      <Screen footer={<Button label="Back" onPress={() => router.back()} />}>
        <ThemedText type="title">Guide not found</ThemedText>
      </Screen>
    );
  }

  const last = guide.steps.length - 1;

  if (step === -1) {
    return (
      <Screen
        footer={
          <>
            <Button label="Start" onPress={() => setStep(0)} />
            <Button label="Back" variant="secondary" onPress={() => router.back()} />
          </>
        }>
        <ThemedText type="eyebrow">
          {guide.whoseJob === 'tenant_usually' ? 'Usually your job' : "Usually the landlord's job"}
        </ThemedText>
        <ThemedText type="title">{guide.title.en}</ThemedText>
        <ThemedText type="small">
          {guide.title.nl} · {guide.difficulty} · about {guide.minutes} minutes
        </ThemedText>
        <Card>
          <ThemedText type="subtitle">You’ll need</ThemedText>
          {guide.items.map((item) => (
            <View key={item.en} style={styles.itemRow}>
              <ThemedText style={styles.itemName}>{item.en}</ThemedText>
              <ThemedText type="small">
                {item.nl} · {storeLabels[item.store]}
              </ThemedText>
            </View>
          ))}
        </Card>
        {!guide.testedAtHome && (
          <ThemedText type="small">This guide hasn’t been tested at home yet. Tell us if a step is unclear.</ThemedText>
        )}
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <View style={styles.footerRow}>
          <View style={styles.flex}>
            <Button label="Back" variant="secondary" onPress={() => setStep(step - 1)} />
          </View>
          <View style={styles.flex}>
            <Button
              label={step === last ? 'Done' : 'Next step'}
              onPress={() => (step === last ? router.back() : setStep(step + 1))}
            />
          </View>
        </View>
      }>
      <View style={styles.progress}>
        {guide.steps.map((_, i) => (
          <View
            key={i}
            style={[styles.progressBar, { backgroundColor: i <= step ? theme.accent : theme.border }]}
          />
        ))}
      </View>
      {/* TODO: replace with the step's SVG illustration */}
      <View style={[styles.illustration, { backgroundColor: theme.backgroundSelected }]}>
        <ThemedText type="small">Illustration coming soon</ThemedText>
      </View>
      <ThemedText type="eyebrow">
        Step {step + 1} of {guide.steps.length}
      </ThemedText>
      <ThemedText type="subtitle">{guide.steps[step].text}</ThemedText>
      {guide.stopAndCall && (
        <Card tone="danger">
          <ThemedText type="smallBold">Stop and call if:</ThemedText>
          <ThemedText type="small" themeColor="text">
            {guide.stopAndCall}
          </ThemedText>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    gap: Spacing.half,
    paddingVertical: Spacing.one,
  },
  itemName: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  progress: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  illustration: {
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
