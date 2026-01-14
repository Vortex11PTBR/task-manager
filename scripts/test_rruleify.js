const chrono = require('chrono-node');
const { RRule } = require('rrule');

const WEEKDAY_MAP = {
  sunday: RRule.SU, sun: RRule.SU,
  monday: RRule.MO, mon: RRule.MO,
  tuesday: RRule.TU, tue: RRule.TU,
  wednesday: RRule.WE, wed: RRule.WE,
  thursday: RRule.TH, thu: RRule.TH,
  friday: RRule.FR, fri: RRule.FR,
  saturday: RRule.SA, sat: RRule.SA,
};

function extractInterval(text) {
  const m = text.match(/every\s+(\d+)\s+(day|week|month|year)s?/i);
  if (m) return { interval: parseInt(m[1], 10), unit: m[2].toLowerCase() };
  if (/every\s+other\s+week/i.test(text)) return { interval: 2, unit: 'week' };
  return undefined;
}

function rruleFromText(text, referenceDate) {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  let freq = null;
  let byweekday = undefined;
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

  const daySet = new Set();
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

  const parsed = chrono.parseDate(text, referenceDate || new Date());
  const dtstart = parsed || referenceDate || new Date();
  let byhour;
  let byminute;
  if (parsed) {
    byhour = parsed.getHours();
    byminute = parsed.getMinutes();
  }

  if (!freq && days.length > 0) freq = RRule.WEEKLY;
  if (!freq) return null;

  const options = {
    freq,
    dtstart,
  };
  if (interval && interval > 1) options.interval = interval;
  if (byweekday) options.byweekday = byweekday;
  if (typeof byhour === 'number') options.byhour = byhour;
  if (typeof byminute === 'number') options.byminute = byminute;

  try {
    const rule = new RRule(options);
    return rule.toString();
  } catch (e) {
    return null;
  }
}

const examples = [
  'every monday at 9am',
  'every other week on tuesday at 14:30',
  'daily at 8am',
  'every weekday at 7:00',
  'every month on the 15th at 10am',
  'every year on Jan 1st',
  'every 3 days at 6pm',
  'every friday',
  'everyday at 18:00',
];

for (const ex of examples) {
  const rule = rruleFromText(ex);
  console.log('Input:', ex);
  console.log('RRULE:', rule);
  if (rule) {
    try {
      const r = RRule.fromString(rule);
      console.log('Next 3 occurrences:', r.after(new Date(0), true), r.after(new Date(), true));
    } catch (e) {}
  }
  console.log('---');
}
