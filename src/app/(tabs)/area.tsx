import { router } from 'expo-router';
import { Alert, Linking } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Screen } from '@/components/ui';
import { formatPostcode } from '@/lib/pdok';
import { contractLabels, heatingLabels, useProfile } from '@/lib/profile';

export default function AreaScreen() {
  const { profile, clearProfile } = useProfile();
  if (!profile) return null;

  function resetProfile() {
    Alert.alert('Change your home details?', 'You will go through the setup again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Change',
        onPress: async () => {
          await clearProfile();
          router.replace('/onboarding');
        },
      },
    ]);
  }

  return (
    <Screen inTabs>
      <ThemedText type="title">My area</ThemedText>
      <ThemedText type="small">
        {profile.municipality} · {formatPostcode(profile.postcode)} · {profile.province}
      </ThemedText>

      <Card>
        <ThemedText type="subtitle">Waste and recycling</ThemedText>
        {/* TODO: per-municipality waste rules for the pilot cities (Amsterdam, Utrecht, Rotterdam) */}
        <ThemedText type="small">
          Rules for {profile.municipality} are coming. Until then, check your municipality’s waste calendar.
        </ThemedText>
        <ThemedText type="link" onPress={() => Linking.openURL('https://www.mijnafvalwijzer.nl/')}>
          Open De Afvalwijzer →
        </ThemedText>
      </Card>

      <Card>
        <ThemedText type="subtitle">Useful contacts</ThemedText>
        <ThemedText>Emergency: 112</ThemedText>
        <ThemedText>Municipality: 14 + area code (e.g. 14 020 in Amsterdam)</ThemedText>
        <ThemedText type="link" onPress={() => Linking.openURL('https://www.huurcommissie.nl/support/onderhoud-en-gebreken-check')}>
          Huurcommissie Gebrekencheck →
        </ThemedText>
        <ThemedText type="link" onPress={() => Linking.openURL('https://www.juridischloket.nl/')}>
          Het Juridisch Loket →
        </ThemedText>
      </Card>

      <Card tone="mint">
        <ThemedText type="subtitle">Your home</ThemedText>
        <ThemedText type="small">{heatingLabels[profile.heatingType]}</ThemedText>
        <ThemedText type="small">{contractLabels[profile.energyContract]}</ThemedText>
      </Card>
      <Button label="Change home details" variant="secondary" onPress={resetProfile} />

      <ThemedText type="small">
        NestMate NL gives general information, not legal or technical advice. Your rental contract comes
        first.
      </ThemedText>
    </Screen>
  );
}
