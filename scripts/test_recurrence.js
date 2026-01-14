// Simple test runner for recurrence + rruleify + recurrence expansion
const { rruleFromText } = require('../src/lib/rruleify');
const { expandTasksForRange } = require('../src/lib/recurrence');

async function test() {
  console.log('Testing rruleFromText...');
  const examples = [
    'every monday at 9am',
    'daily at 8am',
    'every other week on tuesday at 14:30',
  ];
  for (const ex of examples) {
    const r = rruleFromText(ex, new Date());
    console.log('Input:', ex, '\nRRULE:', r, '\n');
  }

  console.log('Testing expandTasksForRange...');
  const tasks = [
    { id: 't1', title: 'Test Weekly', isRecurring: true, recurrenceRule: rruleFromText('every monday at 9am'), dueDate: null },
  ];
  const now = new Date();
  const s = new Date(now.getFullYear(), now.getMonth(), 1);
  const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const occ = expandTasksForRange(tasks, s, e);
  console.log('Occurrences in month:', occ.length);
  console.log(occ.slice(0,5));
}

test().catch(console.error);
