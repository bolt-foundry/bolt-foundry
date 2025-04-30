
# Login Integration Project Plan

## Objective

Adding **user authentication** to Bolt Foundry's web app. We'll start with a
lightweight **email‑prompt proof‑of‑concept (POC)** and finish with
production‑ready **Google OAuth 2.0**. The legacy `AuthRoot` will be removed,
and all viewer logic will live under `CurrentViewer`.

---

## Current Status - Phase 0 (Partially Complete)

- [x] `CurrentViewer` class implemented with `LoggedIn`/`LoggedOut` subclasses
- [x] GraphQL mutation `loginWithEmailDev(email)` implemented
- [x] Login page component with email form created
- [x] Basic session handling in `CurrentViewer.createFromRequest`
- [x] Store session in cookie with proper validation
- [x] Server-side session validation
- [x] Improve login success page to display current user information

---

## Next Action – Phase 0 Completion

- [x] Complete session cookie storage implementation
- [x] Validate session on server
- [x] Display current user on login success page. Show current user on login
      page if already logged in.

---

## Scope & Constraints

- **Frontend**: React + Isograph router (TypeScript).
- **Backend**: Deno runtime, Nexus GraphQL builder.
- **Data models**: `BfPerson`, `BfOrganization`, `CurrentViewer*`.
- **Security**: Minimal for Phase 0; OAuth, CSRF/PKCE, and SameSite cookies from
  Phase 1.

---

## Milestones & Phases

| Phase                      | Goal                                                                  | Key Deliverables                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **0 — POC (Email Prompt)** | Validate end‑to‑end login plumbing without external providers.        | - `/login` route & prompt- `currentViewer` root query- `loginWithEmailDev(email)` mutation- Local session storage & cookie helper |
| **1 — Google OAuth (MVP)** | Replace prompt with Google Sign‑In button using OAuth 2.0 popup flow. | - Google Cloud OAuth client ID- `<GoogleLogin>` frontend- `/api/auth/google` endpoint- Upsert Person + Org, issue session cookie  |
| **2 — Cleanup & Security** | Remove legacy code and harden auth.                                   | - Delete POC code - `/logout` route & mutation- CSRF middleware & refresh‑token rotation- Comprehensive unit + E2E tests          |

---

## Detailed Task Breakdown

### Phase 0 – Proof of Concept

1. **Router** — add `/login`; `Login` button navigates there. ✅
2. **Login Page** — on mount, run `prompt('Enter email')`; cancel returns home. ✅
   * *Note: Implemented as a form rather than a prompt* ✅
3. **GraphQL**
   - **Root query** `currentViewer: CurrentViewer!` → returns
     `CurrentViewerLoggedOut` or `CurrentViewerLoggedIn`. ✅
   - **Dev mutation**
     `loginWithEmailDev(email: String!): CurrentViewerLoggedIn`. ✅
   - Register both in `graphql/builder/builder.ts` and regenerate schema. ✅
4. **Tests** — E2E happy‑path: prompt → email → navbar shows name. ✅
5. **Session Handling** — store session in cookie. 🔄

### Phase 1 – Google OAuth

1. **Google Console** — create OAuth 2.0 Web client; whitelist dev & prod
   origins.
2. **Frontend** — replace prompt with
   `<GoogleLogin onSuccess={handleGoogle} />`; POST token to `/api/auth/google`.
3. **Backend** `/api/auth/google` — verify ID‑token, upsert user & org, return
   session cookie.
4. **GraphQL** — `CurrentViewerLoggedIn` backed by session cookie.
5. **Logout** — `/logout` clears cookie; `currentViewer` returns `LoggedOut`.
6. **Tests** — unit + E2E using stubbed Google token.

### Phase 2 – Cleanup & Hardening

- Remove POC code
- Ensure `defineGqlNode` inheritance works for `CurrentViewer*`.
- Implement CSRF middleware, SameSite=Lax cookies, refresh‑token rotation.
- Update docs & README.

---

## File / Module Impact Matrix

| Area             | Files Touched                                                            | Status      |
| ---------------- | ------------------------------------------------------------------------ | ----------- |
| **Router**       | `contexts/RouterContext.tsx`, route map                                  | ✅ Complete  |
| **Login UI**     | `components/Home.tsx`, `pages/Login.tsx`                                 | ✅ Complete  |
| **GraphQL**      | add `currentViewer` & mutation in `builder.ts`; `CurrentViewer*` classes | ✅ Complete  |
| **Backend Auth** | `server/auth/google.ts`, session utils                                   | 🔄 In Progress |
| **Tests**        | `*.test.ts`, `*.test.e2e.ts`                                             | ✅ Complete  |

---

## End‑to‑End (E2E) Testing Strategy

We'll extend the existing **BFF E2E harness** (Deno + Puppeteer) used in
`joinWaitlist.test.e2e.ts`.

### Tooling & Setup

- Entry‑point shebang: `#!/usr/bin/env -S bff e2e`.
- Helpers: `infra/testing/e2e/` (server spin‑up, browser, screenshots).
- Artifacts: `test‑artifacts/e2e/<timestamp>`.
- CI env vars: `BF_E2E_HEADLESS`, `GOOGLE_TEST_JWT`, `TEST_USER_EMAIL`.

### Phase Coverage

| Phase | Happy Path                                            | Edge Cases                              | Status      |
| ----- | ----------------------------------------------------- | --------------------------------------- | ----------- |
| **0** | Prompt login → email → redirect, navbar shows name.   | Cancel prompt → still logged out.       | ✅ Implemented |
| **1** | Google button → consent → redirect, session persists. | Invalid JWT; logout clears cookie.      | 🔄 Pending     |
| **2** | Regression (login, logout, CSRF).                     | Expired session → redirect to `/login`. | 🔄 Pending     |

### Google OAuth Stub (Phase 1 E2E)

To avoid CAPTCHA and 2FA headaches, Phase 1 E2E tests **stub Google endpoints**
instead of hitting the live consent screen:

1. **Intercept popup** – Use `context.page.route()` to catch requests to
   `https://accounts.google.com/*` and fulfill with an HTML snippet that
   immediately `postMessage`s a deterministic JWT (stored in `GOOGLE_TEST_JWT`).
2. **Stub token introspection** – Intercept
   `https://oauth2.googleapis.com/tokeninfo*` and return JSON
   `{ email, email_verified: true }`.
3. **Environment** – Add `GOOGLE_TEST_JWT` secret in CI; export locally with
   `export GOOGLE_TEST_JWT=$(node scripts/gen-test-jwt.js)`.
4. **Assertion** – After clicking "Sign in with Google", wait for navbar
   greeting (e.g., `text=Welcome, Tester`).

A template test lives at
`apps/boltFoundry/__tests__/e2e/googleLogin.test.e2e.ts` and can be copied for
variants.

---

## Unit & Red‑Test Strategy

### Structure

- Tests live in `__tests__/` adjacent to modules (e.g. `foo/Bar.test.ts`).
- Red‑first: commit failing tests before implementation.
- Use `withIsolatedDb()` + `CurrentViewer.__DANGEROUS_*` helpers.

### Phase Coverage

| Phase | Green Tests                                                                | Red Tests                                                                         | Status      |
| ----- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------- |
| **0** | `loginWithEmailDev` returns logged‑in viewer; viewer hook caches email.    | `currentViewer` before login → logged out; invalid email → `BfErrorInvalidEmail`. | ✅ Implemented |
| **1** | `/api/auth/google` verifies token; upserts user/org; logout clears cookie. | Disallowed domain → reject; expired JWT → 401.                                    | 🔄 Pending     |
| **2** | CSRF token required; `CurrentViewerLoggedIn` inherits fields.              | Missing CSRF → `BfErrorCsrf`; inheritance red test until builder fixed.           | 🔄 Pending     |

### Location Examples

- `apps/bfDb/graphql/__tests__/Query.test.ts` – root `currentViewer` + dev
  login.
- `apps/boltFoundry/server/__tests__/AuthGoogleEndpoint.test.ts` – Google
  endpoint.
- `apps/bfDb/graphql/builder/__tests__/Inheritance.test.ts` – `defineGqlNode`.
- `apps/bfDb/security/__tests__/Csrf.test.ts` – CSRF middleware.

---

## CurrentViewer Class Migration (Hard Cut‑over)

1. **Move & Rename** `BfCurrentViewer.ts` → `CurrentViewer.ts`; change
   class/export. ✅
2. **Codemod** replace `BfCurrentViewer` → `CurrentViewer`. ✅
3. **GraphQL** ensure `defineGqlNode` registers `CurrentViewer` type; subclasses
   inherit. ✅
4. **Fix Build** – update imports & generics until tests pass. ✅

---

## Risks & Mitigations

- **Google quota / consent‑screen delays** – start OAuth setup early.
- **Session desync** – centralise `sessionFromRequest()` in GraphQL context.
- **CSRF** – SameSite cookies + double‑submit token.

---

## Success Criteria

- Google login shows personalised navbar.
- Session persists across refresh & SSR.
- All tests green
