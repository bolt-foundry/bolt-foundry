# Login Integration Project Plan

## Objective

Adding **user authentication** to Bolt Foundry’s web app. We’ll start with a
lightweight **email‑prompt proof‑of‑concept (POC)** and finish with
production‑ready **Google OAuth 2.0**. The legacy `AuthRoot` will be removed,
and all viewer logic will live under `CurrentViewer`.

---

## Current Status - Phase 1 (Google OAuth)

- [x] `CurrentViewer` class implemented with `LoggedIn`/`LoggedOut` subclasses
- [x] Basic session handling in `CurrentViewer.createFromRequest`
- [x] Login page component created
- [x] Session cookies implemented with proper validation
- [x] Server-side session validation

---

## Next Action – Phase 1 Implementation

- [ ] Create Google OAuth client in Google Cloud Console
- [ ] Implement Google Sign-In button on login page
- [ ] Create backend `/api/auth/google` endpoint
- [ ] Implement user upsert and session creation from Google profile

---

## Scope & Constraints

- **Frontend**: React + Isograph router (TypeScript).
- **Backend**: Deno runtime, Nexus GraphQL builder.
- **Data models**: `BfPerson`, `BfOrganization`, `CurrentViewer*`.
- **Security**: OAuth, CSRF/PKCE, and SameSite cookies.

---

## Milestones & Phases

| Phase                         | Goal                                                                  | Key Deliverables                                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **0 — POC (Email Prompt)** | Validate end‑to‑end login plumbing without external providers.        | - `/login` route & prompt- `currentViewer` root query- `loginWithEmailDev(email)` mutation- Local session storage & cookie helper |
| 🔜 **1 — Google OAuth (MVP)** | Replace prompt with Google Sign‑In button using OAuth 2.0 popup flow. | - Google Cloud OAuth client ID- `<GoogleLogin>` frontend- `/api/auth/google` endpoint- Upsert Person + Org, issue session cookie  |
| ▢ **2 — Cleanup & Security**  | Remove legacy code and harden auth.                                   | - Delete POC code - `/logout` route & mutation- CSRF middleware & refresh‑token rotation- Comprehensive unit + E2E tests          |

---

## Detailed Task Breakdown

### Phase 1 – Google OAuth

1. **Google Console** — create OAuth 2.0 Web client; whitelist dev & prod
   origins.
2. **Frontend** — implement `<GoogleLogin onSuccess={handleGoogle} />`; POST
   token to `/api/auth/google`.
3. **Backend** `/api/auth/google` — verify ID‑token, upsert user & org, return
   session cookie.
4. **GraphQL** — ensure `CurrentViewerLoggedIn` properly uses session cookie.
5. **Logout** — implement `/logout` route that clears cookie; update
   `currentViewer` to return `LoggedOut`.
6. **Tests** — create unit + E2E tests using stubbed Google token.

### Phase 2 – Cleanup & Hardening

- Remove POC code including email-based dev login
- Ensure `defineGqlNode` inheritance works for `CurrentViewer*`.
- Implement CSRF middleware, SameSite=Lax cookies, refresh‑token rotation.
- Update docs & README.

---

## File / Module Impact Matrix

| Area            | Files Touched                                                            | Status         |
| --------------- | ------------------------------------------------------------------------ | -------------- |
| **Router**      | `contexts/RouterContext.tsx`, route map                                  | ✅ Complete    |
| **Login UI**    | `components/Home.tsx`, `pages/Login.tsx`                                 | ✅ Complete    |
| **GraphQL**     | add `currentViewer` & mutation in `builder.ts`; `CurrentViewer*` classes | ✅ Complete    |
| **Google Auth** | `server/auth/google.ts`, OAuth handling                                  | 🔄 Not Started |
| **Tests**       | `*.test.ts`, `*.test.e2e.ts`                                             | 🔄 In Progress |

---

## End‑to‑End (E2E) Testing Strategy

We’ll extend the existing **BFF E2E harness** (Deno + Puppeteer) used in
`joinWaitlist.test.e2e.ts`.

### Tooling & Setup

- Entry‑point shebang: `#!/usr/bin/env -S bff e2e`.
- Helpers: `infra/testing/e2e/` (server spin‑up, browser, screenshots).
- Artifacts: `test‑artifacts/e2e/<timestamp>`.
- CI env vars: `BF_E2E_HEADLESS`, `GOOGLE_TEST_JWT`, `TEST_USER_EMAIL`.

### Phase Coverage

| Phase | Happy Path                                            | Edge Cases                              | Status         |
| ----- | ----------------------------------------------------- | --------------------------------------- | -------------- |
| **1** | Google button → consent → redirect, session persists. | Invalid JWT; logout clears cookie.      | 🔄 Not Started |
| **2** | Regression (login, logout, CSRF).                     | Expired session → redirect to `/login`. | 🔄 Not Started |

### Google OAuth Stub (Phase 1 E2E)

To avoid CAPTCHA and 2FA headaches, Phase 1 E2E tests **stub Google endpoints**
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

| Phase | Green Tests                                                                | Red Tests                                                               | Status         |
| ----- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------- |
| **1** | `/api/auth/google` verifies token; upserts user/org; logout clears cookie. | Disallowed domain → reject; expired JWT → 401.                          | 🔄 Not Started |
| **2** | CSRF token required; `CurrentViewerLoggedIn` inherits fields.              | Missing CSRF → `BfErrorCsrf`; inheritance red test until builder fixed. | 🔄 Not Started |

### Location Examples

- `apps/boltFoundry/server/__tests__/AuthGoogleEndpoint.test.ts` – Google
  endpoint.
- `apps/bfDb/graphql/builder/__tests__/Inheritance.test.ts` – `defineGqlNode`.
- `apps/bfDb/security/__tests__/Csrf.test.ts` – CSRF middleware.

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
