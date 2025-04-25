# Login Phase 0 — Project Plan

> **Purpose:** establish the minimum viable authentication flow so internal developers can sign in with Google, unblock GraphQL development, and lay automated‑test foundations. Breaking existing unauthenticated flows is acceptable in this phase.

---
## Current Status

- [x] Implement red tests
- [ ] Build implementations to fix red tests

---

## 1 — Objectives

- 🔑 Enable Google‑based login stub in dev & CI environments.
- 🆔 Rename **`BfCurrentViewer`**\*\* ➜ \*\***`CurrentViewer`** and migrate all references.
- 📜 Expose **`currentViewer`** root query (replace `authRoot`, `me`, `loginWithGoogle`).
- ✅ Add unit “red tests” + e2e smoke test harness (Puppeteer).
- 🛠️ Accept temporary breakage of unauthenticated paths; focus on compile‑green + tests‑green.

---

## 2 — Scope

### In‑Scope

- Code moves/renames inside **`apps/bfDb`** and **`apps/boltFoundry`**.
- GraphQL type & schema generation via new builder.
- Dev‑only Google login shim (JWT generated with Google test account in CI).
- Test scaffolding (unit + e2e) and CI wiring.

### Out‑of‑Scope

- Production OAuth consent screen & captcha solving.
- UI polish / error states.
- Permissions / RBAC; treated as Phase 1.

---

## 3 — Deliverables

1. **CurrentViewer class**
   - File moved to `apps/bfDb/classes/CurrentViewer.ts`.
   - `static gqlSpec` uses `this.defineGqlNode()`; inherits fields when extended.
2. **Root query**
   - `currentViewer: CurrentViewer!` added to builder root.
   - Remove `authRoot`, `me`, `loginWithGoogle` stalemates.
3. **Google login stub**
   - New endpoint `/api/dev/google-login` returns signed JWT for predefined test user.
   - Front‑end util `devGoogleLogin()` used by e2e.
4. **Unit tests (red → green)**
   - `CurrentViewer.spec.ts` covers resolver returns correct type after stub login.
   - `Query.test.ts` checks `currentViewer` query.
   - Schema compilation test validates type inheritance.
5. **E2E Tests** (Puppeteer)
   - `login.spec.e2e.ts` – navigate to `/login`, invoke stub, assert landing page shows user name.
   - Pattern mirrors `joinWaitlist.test.e2e.ts` (uses `PuppeteerTestEnv`).
6. **CI updates**
   - Add `yarn test:e2e-login` to GitHub Actions.
   - Set secret `DEV_GOOGLE_JWT`.
7. **Docs**
   - This file + README excerpt with local login instructions.

---

## 4 — Task Breakdown & Owners

|  # | Task                                                              | Owner       | Blockers |
| -- | ----------------------------------------------------------------- | ----------- | -------- |
|  1 | Rename & move `BfCurrentViewer` → `CurrentViewer`; update imports | **Randall** | —        |
|  2 | Refactor GraphQL builder to auto‑inherit `gqlSpec`                | **Dan**     | 1        |
|  3 | Add `currentViewer` root field & remove old auth types            | **Dan**     | 2        |
|  4 | Implement dev Google JWT endpoint & client util                   | **Colby**   | —        |
|  5 | Write unit red tests (CurrentViewer, Query)                       | **Randall** | 1‑3      |
|  6 | Port e2e harness, add `login.spec.e2e.ts`                         | **Colby**   | 4        |
|  7 | CI job + secrets                                                  | **Randall** | 4,5,6    |
|  8 | Doc updates (this file, README)                                   | **Dan**     | 1‑7      |

---

---

## 6 — Testing Strategy Details

### Unit Test Conventions

- Locate beside modules: `CurrentViewer.test.ts` in same folder.
- Use builder DSL helpers; no Nexus types in test code.
- Snapshot SDL where helpful; prefer explicit assertions.

### E2E Considerations

- JWT injected via localStorage key `devJwt` before page reload.
- Avoid network to real Google endpoints.

---

## 7 — Risk & Mitigation

|  Risk                                | Mitigation                                                       |
| ------------------------------------ | ---------------------------------------------------------------- |
| Import cascade breakage after rename | Use TypeScript `paths` alias + codemod, run `tsc --noEmit` early |
| Google captcha blocks automation     | Stub JWT; future Phase 1 will integrate real flow                |
| Undefined inheritance edge cases     | Add schema compilation test + example subclass                   |

---

---
