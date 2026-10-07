# Dependency update guide

Rules for upgrading dependencies in this project. Version-agnostic: follow the
process regardless of which packages `pnpm outdated` reports.

## Process

1. `pnpm outdated` — list what is behind.
2. Classify each package (below) and read its changelog if the bump is MAJOR
   (or any `0.x` minor) — find every entry marked **BREAKING**.
3. One branch, **one commit per group**: 🟢 then 🟡 then 🔴, each 🔴 on its own.
4. After every commit, run the gate (below). Red → fix or revert that commit;
   never stack a broken upgrade on another.
5. Commit `package.json` **and** `pnpm-lock.yaml` together, always.

## Classification

| Group | Rule |
|-------|------|
| 🟢 low | Patch or minor bump |
| 🟡 medium | Major, but confined (telemetry, one feature, test-only tooling) |
| 🔴 high | Framework or toolchain major (affects every file or the build/test pipeline) |
| ⛔ defer | Major not yet proven in the wider ecosystem (e.g. new compiler rewrites) — skip until `vue-tsc` and tooling support it |

Coupled packages must move in the **same commit**: `vite` + `vitest` +
`@vitest/coverage-v8`; `jsdom` + `@types/jsdom`; `@zxcvbn-ts/core` +
`@zxcvbn-ts/language-common`; `@quasar/vite-plugin` with the Quasar major it targets.
`0.x` packages: treat minors as potentially breaking.

## Commands

```bash
pnpm outdated                    # what's behind
pnpm up <pkgs> --latest          # move packages to latest
pnpm up <pkgs>                   # only within existing ^ ranges (zero-risk)
pnpm list <pkg>                  # verify installed version
```

## Gate — run after every commit, in this order

```bash
pnpm type-check && pnpm lint && pnpm test:unit --run && pnpm build:prod
```

Then a manual smoke test (`pnpm dev`): login, one main workflow, a page with
charts, one with rendered markdown, the password-strength field, browser
console clean.

Green → commit and continue. Red → read the changelog and fix; failing that,
`git revert <commit>` and park the package (note it in the PR).

## Rollback

Unpushed: `git reset --hard <commit-before>`. Pushed/merged: `git revert` per
group commit. Production issue: `git bisect` across the round commits.

## Changelogs

GitHub repos: append `/releases`.

Runtime: `axios` axios/axios · `chart.js` chartjs/Chart.js · `quasar`,
`@quasar/extras`, `@quasar/vite-plugin` quasarframework/quasar ·
`@sentry/vue` getsentry/sentry-javascript · `@zxcvbn-ts/*` zxcvbn-ts/zxcvbn ·
`marked` markedjs/marked · `pinia` vuejs/pinia · `vue` vuejs/core ·
`vue-chartjs` apertureless/vue-chartjs · `vue-i18n` intlify/vue-i18n ·
`vue-matomo` AmazingDreams/vue-matomo · `vue-router` vuejs/router

Dev: `@faker-js/faker` faker-js/faker · `@types/jsdom`, `@types/node`
DefinitelyTyped (no releases — use npm Versions tab) ·
`@vitejs/plugin-vue` vitejs/vite-plugin-vue · `vitest`, `@vitest/*`
vitest-dev/vitest · `@vue/eslint-config-*` vuejs/eslint-config ·
`@vue/test-utils` vuejs/test-utils · `@vue/tsconfig` vuejs/tsconfig ·
`eslint` eslint/eslint · `eslint-plugin-oxlint` oxc-project/eslint-plugin-oxlint ·
`eslint-plugin-vue` vuejs/eslint-plugin-vue · `husky` typicode/husky ·
`jiti` unjs/jiti · `jsdom` jsdom/jsdom · `npm-run-all2` bcomnes/npm-run-all2 ·
`oxlint` oxc-project/oxc · `prettier` prettier/prettier ·
`sass-embedded` googlechrome/sass-embedded · `typescript` microsoft/TypeScript ·
`vite` vitejs/vite · `vite-plugin-vue-devtools` vuejs/devtools ·
`vue-tsc` vuejs/language-tools
