import { Fredoka_500Medium, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { CleaningProvider } from '@/lib/cleaning';
import { ProfileProvider, useProfile } from '@/lib/profile';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ProfileProvider>
        <CleaningProvider>
          <AppStack fontsLoaded={fontsLoaded} />
        </CleaningProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

function AppStack({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready } = useProfile();

  useEffect(() => {
    if (fontsLoaded && ready) SplashScreen.hideAsync();
  }, [fontsLoaded, ready]);

  if (!fontsLoaded || !ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
      <Stack.Screen name="broke" options={{ presentation: 'modal' }} />
      <Stack.Screen name="cleaning-new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="guide/[id]" />
      <Stack.Screen name="buy" />
    </Stack>
  );
}
