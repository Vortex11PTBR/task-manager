This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## New scheduling features

- Natural-language scheduling: `CreateTask` supports NLP input (e.g. "every monday at 9am") which is parsed into an `RRULE`.
- Recurrence expansion: server exposes a tRPC endpoint `task.getOccurrences` which accepts `{ start: Date, end: Date }` and returns expanded occurrences for the authenticated user.
- 24h Timeline: `TaskCalendar` renders a 24-hour timeline with task blocks sized by `totalMinutes`.
- Business-days utilities: `src/lib/businessDays.ts` contains `addBusinessDays`, `isBusinessDay` and `businessDaysBetween`.
- Dev reminder worker: `scripts/run_reminder_worker.js` polls the DB and logs reminder triggers (development-only helper). Run with:

```bash
node scripts/run_reminder_worker.js
```

Notes:

- The reminder worker is a development helper that logs triggers; for production you should implement a persistent job (e.g., a cron job, server worker, or background job queue) and persist sent reminders to avoid duplicates.
- To compute occurrences server-side programmatically, call the new tRPC route `task.getOccurrences`.

## For North American developers (quick wins)

- Quick demo seed: populate demo data locally with `node scripts/seed_demo.js` (requires Prisma client + local DB). This helps reviewers quickly explore the timeline and dashboard UX.
- CI: A GitHub Actions workflow is included at `.github/workflows/ci.yml` that runs `npm ci`, `npm run build` and `tsc` on PRs to keep code quality high for contributors.
- Contributing: see `CONTRIBUTING.md` for coding standards and a quick local setup.

Run locally:

```bash
npm ci
npx prisma migrate dev # if you need to create DB
node scripts/seed_demo.js
npm run dev
```
