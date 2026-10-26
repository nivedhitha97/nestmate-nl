/**
 * The user's home profile, stored on the device only (AsyncStorage). No account, no server.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type HeatingType = 'gas_boiler' | 'district_heating' | 'heat_pump' | 'unsure';
export type EnergyContract = 'single_rate' | 'dual_rate' | 'dynamic';

export type Profile = {
  postcode: string;
  houseNumber?: string;
  municipality: string;
  province: string;
  heatingType: HeatingType;
  energyContract: EnergyContract;
};

const STORAGE_KEY = 'nestmate.profile.v1';

type ProfileState = {
  profile: Profile | null;
  ready: boolean;
  saveProfile: (profile: Profile) => Promise<void>;
  clearProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setProfile(raw ? (JSON.parse(raw) as Profile) : null))
      .catch(() => setProfile(null))
      .finally(() => setReady(true));
  }, []);

  async function saveProfile(next: Profile) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
  }

  async function clearProfile() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }

  return (
    <ProfileContext.Provider value={{ profile, ready, saveProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileProvider');
  return value;
}

export const heatingLabels: Record<HeatingType, string> = {
  gas_boiler: 'Gas boiler (CV-ketel)',
  district_heating: 'District heating (stadsverwarming)',
  heat_pump: 'Heat pump / all-electric',
  unsure: 'Not sure yet',
};

export const contractLabels: Record<EnergyContract, string> = {
  single_rate: 'Single rate (enkeltarief)',
  dual_rate: 'Dual rate (dubbeltarief)',
  dynamic: 'Dynamic (dynamisch)',
};
