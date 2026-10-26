/**
 * Cleaning tasks, stored on the device only. Reminders are re-synced whenever tasks change.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { syncReminders } from '@/lib/reminders';
import type { CleaningTask } from '@/lib/schedule';

const STORAGE_KEY = 'nestmate.cleaning.v1';

type CleaningState = {
  tasks: CleaningTask[];
  addTask: (task: Omit<CleaningTask, 'id' | 'doneDates'>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleDone: (id: string, dayKey: string) => Promise<void>;
  resync: () => Promise<void>;
};

const CleaningContext = createContext<CleaningState | null>(null);

export function CleaningProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const stored = raw ? (JSON.parse(raw) as CleaningTask[]) : [];
        setTasks(stored);
        return syncReminders(stored);
      })
      .catch(() => setTasks([]));
  }, []);

  async function persist(next: CleaningTask[]) {
    setTasks(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    await syncReminders(next);
  }

  async function addTask(task: Omit<CleaningTask, 'id' | 'doneDates'>) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await persist([...tasks, { ...task, id, doneDates: [] }]);
  }

  async function removeTask(id: string) {
    await persist(tasks.filter((task) => task.id !== id));
  }

  async function toggleDone(id: string, dayKey: string) {
    await persist(
      tasks.map((task) => {
        if (task.id !== id) return task;
        const done = task.doneDates.includes(dayKey);
        return {
          ...task,
          doneDates: done
            ? task.doneDates.filter((d) => d !== dayKey)
            : [...task.doneDates, dayKey],
        };
      }),
    );
  }

  return (
    <CleaningContext.Provider
      value={{ tasks, addTask, removeTask, toggleDone, resync: () => syncReminders(tasks) }}>
      {children}
    </CleaningContext.Provider>
  );
}

export function useCleaning() {
  const value = useContext(CleaningContext);
  if (!value) throw new Error('useCleaning must be used inside CleaningProvider');
  return value;
}
