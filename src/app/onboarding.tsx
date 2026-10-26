import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, OptionCard, Screen } from '@/components/ui';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPostcode, lookupPostcode, normalisePostcode, type Address } from '@/lib/pdok';
import {
  contractLabels,
  heatingLabels,
  useProfile,
  type EnergyContract,
  type HeatingType,
} from '@/lib/profile';

const heatingHints: Record<HeatingType, string> = {
  gas_boiler: 'A boiler box on the wall, usually in the kitchen or attic',
  district_heating: 'A heat unit (afleverset) instead of a boiler',
  heat_pump: 'No gas connection, heating runs on electricity',
  unsure: 'You can change this later in My Area',
};

const contractHints: Record<EnergyContract, string> = {
  single_rate: 'Same price all day',
  dual_rate: 'Cheaper at night and at weekends',
  dynamic: 'Price changes every hour',
};

export default function OnboardingScreen() {
  const theme = useTheme();
  const { saveProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [address, setAddress] = useState<Address | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [heatingType, setHeatingType] = useState<HeatingType | null>(null);
  const [contract, setContract] = useState<EnergyContract | null>(null);

  async function findAddress() {
    const postcode = normalisePostcode(postcodeInput);
    if (!postcode) {
      setLookupError('Enter a Dutch postcode like 1012 AB.');
      return;
    }
    setLoading(true);
    setLookupError(null);
    try {
      const result = await lookupPostcode(postcode, houseNumber.trim());
      setAddress(result);
      if (!result) setLookupError('We could not find that address. Check the postcode and number.');
    } catch {
      setLookupError('No connection. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  async function finish() {
    if (!address || !heatingType || !contract) return;
    await saveProfile({
      postcode: address.postcode,
      houseNumber: houseNumber.trim() || undefined,
      municipality: address.municipality,
      province: address.province,
      heatingType,
      energyContract: contract,
    });
    router.replace('/');
  }

  const inputStyle = [
    styles.input,
    { borderColor: theme.text, backgroundColor: theme.backgroundElement, color: theme.text },
  ];

  const footers = [
    address ? (
      <Button key="next-0" label="Continue" onPress={() => setStep(1)} />
    ) : (
      <Button key="lookup" label={loading ? 'Looking up…' : 'Find my address'} onPress={findAddress} disabled={loading} />
    ),
    <Button key="next-1" label="Continue" onPress={() => setStep(2)} disabled={!heatingType} />,
    <Button key="finish" label="Start using NestMate" onPress={finish} disabled={!contract} />,
  ];

  return (
    <Screen footer={footers[step]}>
      <View style={styles.progress}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.progressBar, { backgroundColor: i <= step ? theme.accent : theme.border }]}
          />
        ))}
      </View>
      <ThemedText type="eyebrow">Step {step + 1} of 3</ThemedText>

      {step === 0 && (
        <>
          <ThemedText type="title">Where do you live?</ThemedText>
          <ThemedText themeColor="textSecondary">
            Your postcode sets local waste rules, water hardness and nearby shops. It stays on your phone.
          </ThemedText>
          <ThemedText type="smallBold">Postcode</ThemedText>
          <TextInput
            style={inputStyle}
            value={postcodeInput}
            onChangeText={(text) => {
              setPostcodeInput(text);
              setAddress(null);
            }}
            placeholder="1012 AB"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
          <ThemedText type="smallBold">House number (optional)</ThemedText>
          <TextInput
            style={inputStyle}
            value={houseNumber}
            onChangeText={(text) => {
              setHouseNumber(text);
              setAddress(null);
            }}
            placeholder="12"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
          />
          {address && (
            <Card tone="mint">
              <ThemedText type="smallBold">
                {address.municipality} · {formatPostcode(address.postcode)}
              </ThemedText>
              <ThemedText type="small">{address.province}</ThemedText>
            </Card>
          )}
          {lookupError && <ThemedText themeColor="danger">{lookupError}</ThemedText>}
        </>
      )}

      {step === 1 && (
        <>
          <ThemedText type="title">How is your home heated?</ThemedText>
          <ThemedText themeColor="textSecondary">You will only see guides that fit your system.</ThemedText>
          {(Object.keys(heatingLabels) as HeatingType[]).map((type) => (
            <OptionCard
              key={type}
              title={heatingLabels[type]}
              description={heatingHints[type]}
              selected={heatingType === type}
              onPress={() => setHeatingType(type)}
            />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <ThemedText type="title">Which energy contract do you have?</ThemedText>
          <ThemedText themeColor="textSecondary">
            This sets when electricity is cheapest for you. Check your contract or energy app if unsure.
          </ThemedText>
          {(Object.keys(contractLabels) as EnergyContract[]).map((type) => (
            <OptionCard
              key={type}
              title={contractLabels[type]}
              description={contractHints[type]}
              selected={contract === type}
              onPress={() => setContract(type)}
            />
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.bodyBold,
    fontSize: 20,
  },
});
