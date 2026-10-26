import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { useProfile } from '@/lib/profile';

export default function TabLayout() {
  const { profile } = useProfile();
  if (!profile) return <Redirect href="/onboarding" />;
  return <AppTabs />;
}
