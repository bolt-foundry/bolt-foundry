# Login Phase 0 — Project Plan

> **Purpose:** establish the minimum viable authentication flow so internal
> developers can sign in with Google, unblock GraphQL development, and lay
> automated‑test foundations. Breaking existing unauthenticated flows is
> acceptable in this phase.

---
## Current Status

- [x] Implement red tests
- [ ] Build implementations to fix red tests
---

## 1 — Objectives

- ✅ Add unit “red tests” + e2e smoke test harness (Puppeteer).

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

1. **Root query**
   - `currentViewer: CurrentViewer!` added to root.
2. **Google login stub**
   - New endpoint `/api/dev/google-login` returns signed JWT for predefined test
     user.
   - Front‑end util `devGoogleLogin()` used by e2e.
3. **Unit tests (red → green)**
   - `CurrentViewer.test.ts` covers resolver returns correct type after stub
     login.
   - `Query.test.ts` checks `currentViewer` query.
   - Schema compilation test validates type inheritance.
4. **E2E Tests** (Puppeteer)
   - `login.test.e2e.ts` – navigate to `/login`, invoke stub, assert landing
     page shows user name.
   - Pattern mirrors `joinWaitlist.test.e2e.ts` (uses `PuppeteerTestEnv`).
5. **CI updates**
   - Set secret `DEV_GOOGLE_JWT`.
