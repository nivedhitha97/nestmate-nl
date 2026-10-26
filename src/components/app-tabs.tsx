import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.backgroundElement}
      indicatorColor={theme.accentSoft}
      tintColor={theme.accent}
      labelStyle={{ selected: { color: theme.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="guides">
        <NativeTabs.Trigger.Label>Guides</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wrench.and.screwdriver" md="build" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cleaning">
        <NativeTabs.Trigger.Label>Cleaning</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="energy">
        <NativeTabs.Trigger.Label>Energy</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bolt" md="bolt" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="area">
        <NativeTabs.Trigger.Label>My Area</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="mappin.and.ellipse" md="location_on" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
