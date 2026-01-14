#!/usr/bin/env node
// Dev reminder worker: polls the DB and logs reminders when applicable.
// Usage: node scripts/run_reminder_worker.js

const { PrismaClient } = require('@prisma/client');
const { RRule } = require('rrule');
const prisma = new PrismaClient();

async function fetchTasksWithReminders() {
  return await prisma.task.findMany({
    where: { reminders: { not: null } },
    select: { id: true, title: true, dueDate: true, doDate: true, recurrenceRule: true, reminders: true }
  });
}

function parseReminders(reminders) {
  if (!reminders) return [];
  return reminders.map(r => {
    // if numeric string interpret as minutes before
    const n = parseInt(r, 10);
    if (!isNaN(n)) return { type: 'minutes', value: n };
    return { type: 'raw', value: r };
  });
}

function occurrencesFromTask(task, windowStart, windowEnd) {
  const occ = [];
  if (task.recurrenceRule) {
    try {
      const rule = RRule.fromString(task.recurrenceRule);
      const dates = rule.between(windowStart, windowEnd, true);
      for (const d of dates) occ.push(d);
    } catch (e) {}
  }
  if (task.dueDate) {
    const d = new Date(task.dueDate);
    if (d >= windowStart && d <= windowEnd) occ.push(d);
  }
  if (task.doDate) {
    const d = new Date(task.doDate);
    if (d >= windowStart && d <= windowEnd) occ.push(d);
  }
  return occ;
}

async function tick() {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 1000 * 30); // 30s ago
  const windowEnd = new Date(now.getTime() + 1000 * 30); // 30s ahead

  const tasks = await fetchTasksWithReminders();
  for (const t of tasks) {
    const reminders = parseReminders(t.reminders);
    const occs = occurrencesFromTask(t, new Date(now.getTime() - 1000 * 60 * 60 * 24), new Date(now.getTime() + 1000 * 60 * 60 * 24));
    for (const o of occs) {
      for (const r of reminders) {
        if (r.type === 'minutes') {
          const trigger = new Date(o.getTime() - r.value * 60 * 1000);
          if (trigger >= windowStart && trigger <= windowEnd) {
            console.log(`[REMINDER] Task: ${t.title} | due at ${o.toISOString()} | reminder ${r.value}m before -> triggered at ${now.toISOString()}`);
          }
        }
      }
    }
  }
}

console.log('Starting reminder worker (dev) - polling every 30s');
setInterval(() => {
  tick().catch(err => console.error('Reminder worker error', err));
}, 30 * 1000);

// run immediately once
tick().catch(err => console.error('Reminder worker initial error', err));
