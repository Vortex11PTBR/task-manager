import { rrulestr } from "rrule";

type TaskLike = {
  id: string;
  title: string;
  dueDate?: Date | null;
  doDate?: Date | null;
  isRecurring?: boolean | null;
  recurrenceRule?: string | null;
  category?: string | null;
  totalMinutes?: number | null;
};

export type Occurrence = {
  taskId: string;
  title: string;
  date: Date;
  original?: TaskLike;
  category?: string | null;
  totalMinutes?: number | null;
};

export function expandTasksForRange(tasks: TaskLike[], start: Date, end: Date): Occurrence[] {
  const occurrences: Occurrence[] = [];

  for (const t of tasks) {
    // non-recurring: push dueDate and doDate if in range
    if (!t.isRecurring) {
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        if (d >= start && d <= end) occurrences.push({ taskId: t.id, title: t.title, date: d, original: t });
      }
      if (t.doDate) {
        const d2 = new Date(t.doDate);
        if (d2 >= start && d2 <= end) occurrences.push({ taskId: t.id, title: t.title, date: d2, original: t });
      }
      continue;
    }

    // recurring: use RRULE string if present
    if (t.recurrenceRule) {
      try {
        const rule = rrulestr(t.recurrenceRule);
        const dates = rule.between(start, end, true);
        for (const d of dates) occurrences.push({ taskId: t.id, title: t.title, date: d, original: t, category: t.category, totalMinutes: t.totalMinutes });
      } catch (e) {
        // ignore malformed rule
        continue;
      }
    } else if (t.dueDate) {
      // fallback: repeat on same weekday between range (simple weekly)
      const base = new Date(t.dueDate);
      const current = new Date(start);
      while (current <= end) {
        if (current.getDay() === base.getDay()) {
          occurrences.push({ taskId: t.id, title: t.title, date: new Date(current), original: t, category: t.category, totalMinutes: t.totalMinutes });
        }
        current.setDate(current.getDate() + 1);
      }
    }
  }

  // sort
  occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
  return occurrences;
}
