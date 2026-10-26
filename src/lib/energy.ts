/**
 * Dual-rate (dubbeltarief) off-peak rules.
 *
 * Most of the Netherlands: weekdays 23:00–07:00, plus all weekend and public holidays.
 * Noord-Brabant and Limburg (Enexis area): off-peak starts at 21:00 on weekdays.
 * Suppliers can differ, so the app always tells users to check their own contract.
 */

const EARLY_START_PROVINCES = ['Noord-Brabant', 'Limburg'];
const OFF_PEAK_END_HOUR = 7;

export function offPeakStartHour(province: string): number {
  return EARLY_START_PROVINCES.includes(province) ? 21 : 23;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// TODO: public holidays (Koningsdag, Christmas, etc.) also count as off-peak.
export function isOffPeak(date: Date, province: string): boolean {
  if (isWeekend(date)) return true;
  const hour = date.getHours();
  return hour >= offPeakStartHour(province) || hour < OFF_PEAK_END_HOUR;
}

/** Minutes until the next off-peak window starts, or 0 when it is off-peak now. */
export function minutesUntilOffPeak(now: Date, province: string): number {
  if (isOffPeak(now, province)) return 0;
  const start = new Date(now);
  start.setHours(offPeakStartHour(province), 0, 0, 0);
  return Math.round((start.getTime() - now.getTime()) / 60000);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} h ${rest} min` : `${rest} min`;
}
