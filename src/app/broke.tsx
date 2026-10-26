import { router } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, OptionCard, Screen } from '@/components/ui';

type Problem = { label: string; hint: string; guideId?: string };

// No guideId = usually the landlord's job, or not covered yet.
const problems: Problem[] = [
  { label: 'Shower drains slowly', hint: 'Water stays in the tray', guideId: 'unblock-shower-drain' },
  { label: 'Radiator cold at the top', hint: 'Bottom is warm, top is cold', guideId: 'bleed-radiator' },
  { label: 'Kettle full of limescale', hint: 'White flakes in the water', guideId: 'descale-kettle' },
  { label: 'No heating or hot water at all', hint: 'Whole home is cold' },
  { label: 'Leak from the ceiling or a pipe', hint: 'Water where it should not be' },
  { label: 'Something else', hint: 'Not on this list' },
];

type Step = 'safety' | 'problem' | 'danger' | 'diy' | 'landlord';

export default function SomethingBrokeScreen() {
  const [step, setStep] = useState<Step>('safety');
  const [choice, setChoice] = useState<Problem | null>(null);

  if (step === 'safety') {
    return (
      <Screen
        footer={
          <>
            <Button label="Yes, it's urgent" variant="danger" onPress={() => setStep('danger')} />
            <Button label="No" onPress={() => setStep('problem')} />
          </>
        }>
        <ThemedText type="eyebrow">Question 1</ThemedText>
        <ThemedText type="title">Is anyone in danger right now?</ThemedText>
        <ThemedText themeColor="textSecondary">
          For example: you smell gas, see sparks or smoke, or water is leaking into a neighbour’s home.
        </ThemedText>
      </Screen>
    );
  }

  if (step === 'danger') {
    return (
      <Screen footer={<Button label="Close" variant="secondary" onPress={() => router.back()} />}>
        <Card tone="danger">
          <ThemedText type="title">Get help now</ThemedText>
          <ThemedText>Life in danger, fire or smoke: call 112.</ThemedText>
          <ThemedText>Gas smell: leave the home, don’t use switches, then call 0800-9009 (national gas and power outage line).</ThemedText>
          <ThemedText>Water leak: close the main water tap, then call your landlord’s emergency line.</ThemedText>
        </Card>
        <Button label="Call 112" variant="danger" onPress={() => Linking.openURL('tel:112')} />
      </Screen>
    );
  }

  if (step === 'problem') {
    return (
      <Screen
        footer={
          <Button
            label="Next"
            disabled={!choice}
            onPress={() => setStep(choice?.guideId ? 'diy' : 'landlord')}
          />
        }>
        <ThemedText type="eyebrow">Question 2</ThemedText>
        <ThemedText type="title">What is the problem?</ThemedText>
        {problems.map((p) => (
          <OptionCard
            key={p.label}
            title={p.label}
            description={p.hint}
            selected={choice === p}
            onPress={() => setChoice(p)}
          />
        ))}
      </Screen>
    );
  }

  if (step === 'diy' && choice?.guideId) {
    const guideId = choice.guideId;
    return (
      <Screen
        footer={
          <>
            <Button
              label="Open the guide"
              onPress={() => router.replace({ pathname: '/guide/[id]', params: { id: guideId } })}
            />
            <Button label="Close" variant="secondary" onPress={() => router.back()} />
          </>
        }>
        <Card tone="accent">
          <ThemedText type="eyebrow">Usually your job</ThemedText>
          <ThemedText type="title">You can fix this yourself</ThemedText>
          <ThemedText>This is a small repair under the Dutch rules for tenants.</ThemedText>
        </Card>
        <NotSureCard />
      </Screen>
    );
  }

  return (
    <Screen footer={<Button label="Close" variant="secondary" onPress={() => router.back()} />}>
      <Card>
        <ThemedText type="eyebrow">Probably the landlord’s job</ThemedText>
        <ThemedText type="title">Tell your landlord</ThemedText>
        <ThemedText>
          Describe the problem in writing, with photos and the date it started. Keep a copy.
        </ThemedText>
        {/* TODO: draft-letter generator in English and Dutch (screen 10 on the Figma board) */}
      </Card>
      <NotSureCard />
    </Screen>
  );
}

function NotSureCard() {
  return (
    <Card tone="mint">
      <ThemedText type="smallBold">Not sure who pays?</ThemedText>
      <ThemedText type="small">
        Check your lease or the official Huurcommissie Gebrekencheck. This is general information, not
        legal advice.
      </ThemedText>
      <ThemedText
        type="link"
        onPress={() => Linking.openURL('https://www.huurcommissie.nl/support/onderhoud-en-gebreken-check')}>
        Open the Gebrekencheck →
      </ThemedText>
    </Card>
  );
}
