/**
 * Simple business-days utilities.
 * - `isBusinessDay(date)` returns false for Saturday/Sunday.
 * - `addBusinessDays(date, n)` adds n business days (skips weekends).
 */
export function isBusinessDay(d: Date): boolean {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

export function addBusinessDays(date: Date, days: number): Date {
  const dir = days < 0 ? -1 : 1;
  let remaining = Math.abs(days);
  const result = new Date(date);
  while (remaining > 0) {
    result.setDate(result.getDate() + dir);
    if (isBusinessDay(result)) remaining -= 1;
  }
  return result;
}

export function businessDaysBetween(a: Date, b: Date): number {
  const start = new Date(a);
  const end = new Date(b);
  if (start > end) return -businessDaysBetween(end, start);
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (isBusinessDay(cur)) count += 1;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}
