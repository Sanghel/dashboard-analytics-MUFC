# Fix CI/Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the failing GitHub Actions CI pipeline by correcting a TypeScript type error in `useLiveFixtures.ts` and closing 4 obsolete open issues.

**Architecture:** The root cause is `queryFn: fetchLiveFixtures` passing the function reference directly to React Query. Because `fetchLiveFixtures` has a `teamId?: number` parameter, TypeScript infers the first arg as `number`, but React Query passes a `QueryFunctionContext` object — type mismatch. The fix is wrapping it: `queryFn: () => fetchLiveFixtures()`. The 4 open issues (#23, #31, #32, #33) are already implemented and just need to be closed.

**Tech Stack:** TypeScript 5.9, React Query v5 (`@tanstack/react-query`), Vitest, GitHub CLI (`gh`)

---

### Task 1: Create GitHub issue for the CI bug

- [ ] **Step 1: Create issue with bug template**

```bash
gh issue create \
  --title "[BUG] CI failing — TypeScript error in useLiveFixtures queryFn type mismatch" \
  --label "bug" \
  --body "## Description

The CI pipeline fails on the \`Build\` step due to a TypeScript type error introduced when \`useLiveFixtures\` was implemented.

## Steps to Reproduce

1. Push any commit to \`develop\` or \`main\`
2. CI step \`Build\` fails

## Expected Behavior

All CI steps (Lint, Test with coverage, Build) pass.

## Actual Behavior

\`Build\` fails with:

\`\`\`
src/presentation/hooks/useLiveFixtures.ts(8,5): error TS2769: No overload matches this call.
  Type '(teamId?: number) => Promise<Fixture[]>' is not assignable to type 'QueryFunction<Fixture[], readonly unknown[]>'.
\`\`\`

Root cause: \`queryFn: fetchLiveFixtures\` passes the function reference directly. React Query injects a \`QueryFunctionContext\` object as the first argument, not a \`number\`. Fix: \`queryFn: () => fetchLiveFixtures()\`.

## Environment

- Node version: 20.x
- TypeScript: ~5.9.3
- @tanstack/react-query: ^5.95.2"
```

Note the issue number returned — it will be referenced in the branch name and PR.

---

### Task 2: Create fix branch and correct the TypeScript error

**Files:**

- Modify: `src/presentation/hooks/useLiveFixtures.ts:8`

- [ ] **Step 1: Create and checkout branch**

```bash
git checkout develop
git pull origin develop
git checkout -b fix/ci-live-fixtures-queryfn-type-<ISSUE_NUMBER>
```

Replace `<ISSUE_NUMBER>` with the number from Task 1.

- [ ] **Step 2: Verify the current failing test (TypeScript check)**

```bash
npx tsc -b --noEmit 2>&1
```

Expected: 3 errors — `useLiveFixtures.ts(8,5)`, `useLiveFixtures.ts(14,33)`, `LiveMatchPage.tsx(46,38)`

- [ ] **Step 3: Apply the fix**

In `src/presentation/hooks/useLiveFixtures.ts`, change line 8:

```ts
// Before
queryFn: fetchLiveFixtures,

// After
queryFn: () => fetchLiveFixtures(),
```

Full file after fix:

```ts
import { useQuery } from '@tanstack/react-query';
import { fetchLiveFixtures } from '@/infrastructure/api/endpoints/liveFixtures.api';
import type { Fixture } from '@/shared/types/football';

export function useLiveFixtures() {
  const { data, isLoading } = useQuery<Fixture[]>({
    queryKey: ['fixtures', 'live'],
    queryFn: () => fetchLiveFixtures(),
    refetchInterval: 30_000,
    staleTime: 0,
  });

  const fixtures = data ?? [];
  const hasLiveMatch = fixtures.length > 0;

  return { fixtures, hasLiveMatch, isLoading };
}
```

- [ ] **Step 4: Verify TypeScript build passes**

```bash
npx tsc -b --noEmit 2>&1
```

Expected: no output (zero errors)

- [ ] **Step 5: Verify tests still pass**

```bash
npm run test:coverage 2>&1 | tail -20
```

Expected: all tests pass, coverage ≥ 80%

- [ ] **Step 6: Verify lint passes**

```bash
npm run lint 2>&1
```

Expected: 0 errors (warnings are OK)

- [ ] **Step 7: Verify full build passes**

```bash
npm run build 2>&1
```

Expected: `✓ built in Xs` with no errors

- [ ] **Step 8: Commit and push**

```bash
git add src/presentation/hooks/useLiveFixtures.ts
git commit -m "fix(live): wrap fetchLiveFixtures in arrow fn to fix queryFn type mismatch"
git push -u origin fix/ci-live-fixtures-queryfn-type-<ISSUE_NUMBER>
```

---

### Task 3: Create PR, code review, and merge

- [ ] **Step 1: Create PR to develop**

```bash
gh pr create \
  --base develop \
  --title "fix(live): wrap fetchLiveFixtures in arrow fn to fix queryFn type mismatch" \
  --body "## Description

Fixes a TypeScript type error that was breaking the CI pipeline on the Build step.

**Root cause:** \`queryFn: fetchLiveFixtures\` passes the raw function reference to React Query. Since \`fetchLiveFixtures\` has a \`teamId?: number\` parameter, TypeScript infers the first argument as \`number\`. React Query injects a \`QueryFunctionContext\` object as the first argument — incompatible types.

**Fix:** Wrap in an arrow function: \`queryFn: () => fetchLiveFixtures()\`

## Related Issue

Closes #<ISSUE_NUMBER>

## Type of Change

- [x] Bug fix

## Checklist

- [x] Tests added/updated
- [x] Build passes (\`npm run build\`)
- [x] Lint passes (\`npm run lint\`)
- [x] Tests pass (\`npm run test\`)
- [x] Self-review completed"
```

- [ ] **Step 2: Run code review**

Invoke `superpowers:requesting-code-review` or `code-review:code-review` skill on the PR.

- [ ] **Step 3: Merge PR**

```bash
gh pr merge <PR_NUMBER> --squash --delete-branch
```

---

### Task 4: Close obsolete open issues

These issues were implemented in prior sessions but never closed.

- [ ] **Step 1: Close issue #23**

```bash
gh issue close 23 --comment "Implemented in a previous session. The \`useFixtureDetail\` hook was created at \`src/presentation/hooks/useFixtureDetail.ts\` combining \`/fixtures/events\` and \`/fixtures/statistics\` queries."
```

- [ ] **Step 2: Close issue #31**

```bash
gh issue close 31 --comment "Implemented by PR #34. The \`liveFixtures.api.ts\` endpoint was created at \`src/infrastructure/api/endpoints/liveFixtures.api.ts\`."
```

- [ ] **Step 3: Close issue #32**

```bash
gh issue close 32 --comment "Implemented by PR #35. The \`useLiveFixtures\` hook was created at \`src/presentation/hooks/useLiveFixtures.ts\` with 30s polling."
```

- [ ] **Step 4: Close issue #33**

```bash
gh issue close 33 --comment "Implemented by PR #36. LiveMatchPage was updated to prioritize live fixtures with animated LIVE badge."
```
