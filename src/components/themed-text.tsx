import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'small' | 'smallBold' | 'eyebrow' | 'link';
  themeColor?: ThemeColor;
};

const defaultColors: Partial<Record<NonNullable<ThemedTextProps['type']>, ThemeColor>> = {
  small: 'textSecondary',
  eyebrow: 'accent',
  link: 'accent',
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = theme[themeColor ?? defaultColors[type] ?? 'text'];

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: Fonts.displayMedium,
    fontSize: 19,
    lineHeight: 24,
  },
  small: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  eyebrow: {
    fontFamily: Fonts.bodyHeavy,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  link: {
    fontFamily: Fonts.bodyHeavy,
    fontSize: 14,
    lineHeight: 20,
  },
});
