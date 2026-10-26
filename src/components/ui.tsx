/**
 * Small building blocks shared by every screen: page container, card, button and option card.
 */

import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Fonts, MaxContentWidth, Radius, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  /** Set on tab screens so content and footer stay clear of the tab bar. */
  inTabs?: boolean;
};

export function Screen({ children, footer, inTabs }: ScreenProps) {
  const theme = useTheme();
  const tabInset = inTabs ? BottomTabInset : 0;
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={inTabs ? ['top'] : ['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={[styles.scroll, !footer && { paddingBottom: Spacing.six + tabInset }]}>
        <View style={styles.column}>{children}</View>
      </ScrollView>
      {footer ? (
        <View style={[styles.column, styles.footer, { paddingBottom: Spacing.four + tabInset }]}>
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

type CardProps = ViewProps & { tone?: 'plain' | 'mint' | 'accent' | 'danger' | 'inverse' };

const cardTones: Record<NonNullable<CardProps['tone']>, { bg: ThemeColor; border: ThemeColor }> = {
  plain: { bg: 'backgroundElement', border: 'border' },
  mint: { bg: 'backgroundSelected', border: 'backgroundSelected' },
  accent: { bg: 'accentSoft', border: 'accent' },
  danger: { bg: 'dangerSoft', border: 'danger' },
  inverse: { bg: 'inverse', border: 'inverse' },
};

export function Card({ tone = 'plain', style, ...rest }: CardProps) {
  const theme = useTheme();
  const { bg, border } = cardTones[tone];
  return (
    <View
      style={[styles.card, { backgroundColor: theme[bg], borderColor: theme[border] }, style]}
      {...rest}
    />
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const theme = useTheme();
  const filled = variant !== 'secondary';
  const bg = variant === 'danger' ? theme.danger : theme.accent;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        filled
          ? { backgroundColor: bg }
          : { borderWidth: 2, borderColor: theme.border, backgroundColor: 'transparent' },
        (pressed || disabled) && styles.dimmed,
      ]}>
      <ThemedText
        style={[styles.buttonLabel, { color: filled ? theme.backgroundElement : theme.text }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

type OptionCardProps = {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionCard({ title, description, selected, onPress }: OptionCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.option,
        {
          borderColor: selected ? theme.accent : theme.border,
          backgroundColor: selected ? theme.accentSoft : theme.backgroundElement,
        },
      ]}>
      <View style={styles.optionText}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {description ? <ThemedText type="small">{description}</ThemedText> : null}
      </View>
      <View
        style={[
          styles.radio,
          { borderColor: selected ? theme.accent : theme.border, borderWidth: selected ? 7 : 2 },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.large,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  button: {
    height: 54,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonLabel: {
    fontFamily: Fonts.bodyHeavy,
    fontSize: 17,
  },
  dimmed: {
    opacity: 0.6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 2,
    borderRadius: Radius.large,
    padding: Spacing.three,
  },
  optionText: {
    flex: 1,
    gap: Spacing.half,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
