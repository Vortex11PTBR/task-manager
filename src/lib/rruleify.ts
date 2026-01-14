import { RRule } from "rrule";
import * as chrono from "chrono-node";

const WEEKDAY_MAP: Record<string, any | null> = {
  sunday: RRule.SU,
  sun: RRule.SU,
  monday: RRule.MO,
  mon: RRule.MO,
  tuesday: RRule.TU,
  tue: RRule.TU,
  wednesday: RRule.WE,
  wed: RRule.WE,
  thursday: RRule.TH,
  thu: RRule.TH,
  friday: RRule.FR,
  fri: RRule.FR,
  saturday: RRule.SA,
  sat: RRule.SA,
};

function extractInterval(text: string): { interval: number; unit: string } | undefined {
  const m = text.match(/every\s+(\d+)\s+(day|week|month|year)s?/i);
  if (m) return { interval: parseInt(m[1], 10), unit: m[2].toLowerCase() };
  if (/every\s+other\s+week/i.test(text)) return { interval: 2, unit: 'week' };
  return undefined;
}

export function rruleFromText(text: string, referenceDate?: Date): string | null {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  // freq detection
  let freq: number | null = null;
  let byweekday: any[] | undefined;
  const intervalObj = extractInterval(t);
  const interval = intervalObj?.interval;
  const intervalUnit = intervalObj?.unit;

  if (intervalUnit) {
    if (intervalUnit === 'day') freq = RRule.DAILY;
    else if (intervalUnit === 'week') freq = RRule.WEEKLY;
    else if (intervalUnit === 'month') freq = RRule.MONTHLY;
    else if (intervalUnit === 'year') freq = RRule.YEARLY;
  }

  if (!freq) {
    if (t.includes('every day') || t.includes('everyday') || t.includes('daily')) {
      freq = RRule.DAILY;
    } else if (t.includes('every weekday') || t.includes('weekdays')) {
      freq = RRule.WEEKLY;
      byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
    } else if (t.includes('monthly') || t.includes('every month')) {
      freq = RRule.MONTHLY;
    } else if (t.includes('yearly') || t.includes('every year')) {
      freq = RRule.YEARLY;
    }
  }

  // specific weekdays (use word boundaries and dedupe)
  const daySet = new Set<any>();
  for (const name of Object.keys(WEEKDAY_MAP)) {
    const re = new RegExp(`\\b${name}\\b`, 'i');
    if (re.test(t)) {
      const w = WEEKDAY_MAP[name];
      if (w) daySet.add(w);
    }
  }
  const days = Array.from(daySet.values());
  if (days.length > 0) {
    freq = freq || RRule.WEEKLY;
    byweekday = days;
  }

  // parse time
  const parsed = chrono.parseDate(text, referenceDate || new Date());
  const dtstart = parsed || referenceDate || new Date();
  let byhour: number | undefined;
  let byminute: number | undefined;
  if (parsed) {
    byhour = parsed.getHours();
    byminute = parsed.getMinutes();
  }

  // if nothing detected and contains weekdays words, default to weekly
  if (!freq && days.length > 0) freq = RRule.WEEKLY;
  if (!freq) return null;

  const options: any = {
    freq,
    dtstart,
  };
  if (interval && interval > 1) options.interval = interval as any;
  if (byweekday) options.byweekday = byweekday as any;
  if (typeof byhour === "number") options.byhour = byhour as any;
  if (typeof byminute === "number") options.byminute = byminute as any;

  try {
    const rule = new RRule(options);
    return rule.toString();
  } catch (e) {
    return null;
  }
}
