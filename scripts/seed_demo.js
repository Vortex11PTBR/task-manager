#!/usr/bin/env node
// Seed demo data for local development
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding demo data...');
  const user = await prisma.user.upsert({
    where: { email: 'demo@local' },
    update: {},
    create: {
      email: 'demo@local',
      name: 'Demo User',
      // adapt fields according to your User model
    }
  });

  const now = new Date();
  const tasks = [
    {
      title: 'Deep Work: Feature A',
      description: 'Focus session on feature A',
      category: 'Strategic',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 9, 0),
      doDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 9, 0),
      isRecurring: false,
      totalMinutes: 90,
      reminders: ['30']
    },
    {
      title: 'Weekly Sync (Team)',
      description: 'Weekly team sync meeting',
      category: 'Operations',
      isRecurring: true,
      recurrenceRule: 'DTSTART:'+new Date(now.getFullYear(), now.getMonth(), now.getDate(),10,0).toISOString().replace(/-|:|\.\d+/g,'')+'\nRRULE:FREQ=WEEKLY;BYDAY=TU;BYHOUR=10;BYMINUTE=0',
      totalMinutes: 60,
      reminders: ['15']
    },
    {
      title: 'Code Review Sprint',
      description: 'Review PRs and merge',
      category: 'Operations',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      totalMinutes: 120,
    }
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: { ...t, userId: user.id } });
  }

  console.log('Seeding complete.');
  await prisma.$disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
