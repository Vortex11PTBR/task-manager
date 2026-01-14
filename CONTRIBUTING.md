# Contributing

Thanks for your interest in contributing! To make this project attractive to developers in North America we keep a tight, documented workflow.

- Code style: TypeScript, Tailwind utility classes, no trailing semicolons enforced by project linting.
- Before opening a PR:
  - Run `npm ci` and `npm run build` locally.
  - Run `npx tsc --noEmit` to typecheck.
  - If you change the Prisma schema run `npx prisma migrate dev` and include the generated migration.
- Testing: Add unit tests where applicable (we prefer Vitest/Jest). CI will run build + typecheck on PRs.

We welcome issues, feature requests, and PRs. Keep changes focused and include screenshots or GIFs for UI changes.
