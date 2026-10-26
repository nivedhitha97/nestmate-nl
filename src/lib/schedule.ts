/**
 * Cleaning schedule maths. Dates are local calendar days stored as "YYYY-MM-DD".
 */

export type CleaningKind = 'regular' | 'deep';
export type Repeat = 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export type CleaningTask = {
  id: string;
  title: string;
  kind: CleaningKind;
  repeat: Repeat;
  /** First day the task is due, "YYYY-MM-DD". */
  startDate: string;
  /** Reminder time, "HH:MM" (24-hour). */
  reminderTime: string;
  /** Days on which this task was ticked off. */
  doneDates: string[];
};

export const repeatLabels: Record<Repeat, string> = {
  once: 'Once',
  daily: 'Every day',
  weekly: 'Every week',
  biweekly: 'Every 2 weeks',
  monthly: 'Every month',
  quarterly: 'Every 3 months',
};

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Adds months, keeping the start day but clamping to the month's last day (31 Jan → 28/29 Feb). */
function addMonthsClamped(start: Date, months: number): Date {
  const target = new Date(start.getFullYear(), start.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(start.getDate(), lastDay));
  return target;
}

/** The n-th occurrence (0 = start date) of a task. */
function occurrence(task: CleaningTask, n: number): Date {
  const start = fromDayKey(task.startDate);
  switch (task.repeat) {
    case 'once':
      return start;
    case 'daily':
      return addDays(start, n);
    case 'weekly':
      return addDays(start, 7 * n);
    case 'biweekly':
      return addDays(start, 14 * n);
    case 'monthly':
      return addMonthsClamped(start, n);
    case 'quarterly':
      return addMonthsClamped(start, 3 * n);
  }
}

/** Day keys on which the task is due, between `from` and `to` inclusive. */
export function occurrencesBetween(task: CleaningTask, from: Date, to: Date): string[] {
  const fromKey = toDayKey(from);
  const toKey = toDayKey(to);
  const days: string[] = [];
  for (let n = 0; n < 1000; n++) {
    const key = toDayKey(occurrence(task, n));
    if (key > toKey) break;
    if (key >= fromKey) days.push(key);
    if (task.repeat === 'once') break;
  }
  return days;
}

export function tasksOnDay(tasks: CleaningTask[], dayKey: string): CleaningTask[] {
  const day = fromDayKey(dayKey);
  return tasks.filter((task) => occurrencesBetween(task, day, day).length > 0);
}

/** Starter tasks offered when the calendar is empty. Users can edit or delete them. */
export const suggestedTasks: Pick<CleaningTask, 'title' | 'kind' | 'repeat'>[] = [
  { title: 'Clean bathroom and toilet', kind: 'regular', repeat: 'weekly' },
  { title: 'Vacuum and mop floors', kind: 'regular', repeat: 'weekly' },
  { title: 'Change bed sheets', kind: 'regular', repeat: 'biweekly' },
  { title: 'Clean fridge and throw out old food', kind: 'regular', repeat: 'monthly' },
  { title: 'Deep clean oven and extractor filter', kind: 'deep', repeat: 'quarterly' },
  { title: 'Descale washing machine and kettle', kind: 'deep', repeat: 'quarterly' },
  { title: 'Clean windows and window frames', kind: 'deep', repeat: 'quarterly' },
];
