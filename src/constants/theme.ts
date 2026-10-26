/**
 * NestMate NL colours and type. Matches the Figma board and the beta deck.
 * Light mode is the main design; dark mode keeps the same roles with deeper tones.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1F3A3D',
    textSecondary: '#4A5568',
    background: '#FBF7F0',
    backgroundElement: '#FFFDF9',
    backgroundSelected: '#EEF3EF',
    border: '#E6DFD3',
    accent: '#C8582A',
    accentSoft: '#FDF0E6',
    danger: '#B5432B',
    dangerSoft: '#FBE9E4',
    good: '#2F7D6D',
    inverse: '#1F3A3D',
    onInverse: '#FBF7F0',
  },
  dark: {
    text: '#FBF7F0',
    textSecondary: '#C9DCD8',
    background: '#142628',
    backgroundElement: '#1F3A3D',
    backgroundSelected: '#2A4B4F',
    border: '#2F5155',
    accent: '#F2A65A',
    accentSoft: '#3A3A2E',
    danger: '#E07A63',
    dangerSoft: '#3D2A27',
    good: '#6FC1AE',
    inverse: '#FBF7F0',
    onInverse: '#1F3A3D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Font family names as registered by `useFonts` in the root layout. */
export const Fonts = {
  display: 'Fredoka_600SemiBold',
  displayMedium: 'Fredoka_500Medium',
  body: 'NunitoSans_400Regular',
  bodyBold: 'NunitoSans_700Bold',
  bodyHeavy: 'NunitoSans_800ExtraBold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 12,
  medium: 16,
  large: 20,
} as const;

/** Space the tab bar takes over the bottom of tab screens (web uses the floating tab list). */
export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 88 }) ?? 0;
export const MaxContentWidth = 640;
