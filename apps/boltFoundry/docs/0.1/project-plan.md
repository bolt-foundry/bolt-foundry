# Bolt Foundry – Google‑Only Login Route Plan

---

## Current Status

| Phase                                                  | Status             | Notes                                                                                               |
| ------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------- |
| **Phase A – Data‑Model & GraphQL Contract**            | ✅ **Completed**   | Schema changes compile, GraphQL contract in place, unit tests pass                                  |
| **Phase B – Backend Auth Implementation**              | ⏳ **In Progress** | `verifyLogin` helper exists; resolver wiring & session cookie work underway; red tests guiding work |
| **Phase C – Frontend Skeleton & Mutation Integration** | 🔜 **Not Started** |                                                                                                     |
| **Phase D – Protected Route Guard**                    | 🔜 **Not Started** |                                                                                                     |
| **Phase E – Testing & QA**                             | 🔜 **Not Started** |                                                                                                     |

---

## Next Action

Continue **Phase B – Backend Auth Implementation**:

1. Finish `loginWithGoogle(token)` resolver in **`AuthRoot`**.
2. Generate & set signed JWT (`bf_session` HttpOnly cookie).
3. Teach `createContext()` to parse cookie and load viewer.
4. Turn failing red tests green.

(Once backend auth flows work end‑to‑end, move on to Phase C.)

---

## 1 Goals & Scope

- Authenticate visitors exclusively via **Sign‑in with Google** using **Google
  Identity Services (GIS)**, automatically leveraging **FedCM** in Chrome.
- `/login` route shows a Google sign‑in button (and One‑Tap prompt when
  permitted).
- Protected pages redirect to `/login` when session missing.

---

## 2 Success Criteria

- GIS One‑Tap or button flow yields an ID‑token that logs the user in.
- Browser shows FedCM account‑chooser dialog in Chrome ≥108; other browsers fall
  back to GIS legacy flow.
- Session persisted via secure HttpOnly cookie; logout clears it.

---

## 3 Architecture Notes

- **Data model update**:
  - Add **`domain: string`** prop to `BfOrganization` (see note about
    `BfConsistencyRule`).
  - Define an **`OrganizationRole`** enum (`OWNER`, `ADMIN`, `MEMBER`) and
    introduce **`BfEdgeOrganizationMember`** (extends `BfEdge`) with props
    `{ role: OrganizationRole, joinedAt: Date }`. This edge connects `BfPerson`
    → `BfOrganization` and enforces one membership per org/person.
- **Frontend**: use the GIS JS SDK (`accounts.id.initialize`). Pass
  `use_fedcm_for_prompt: true` so Chrome uses FedCM automatically.
- **GraphQL**: single mutation `loginWithGoogle(token: String!): AuthPayload`.
- **Backend**: verify ID‑token signature & audience and ensure the `hd`
  (hosted‑domain) claim exists and is _not_ `gmail.com` (i.e. only
  Google Workspace), then create/fetch `BfPerson` and issue JWT session cookie.

---

## 4 Work Breakdown (Backend → Frontend)

### Phase A – Data‑Model & GraphQL Contract — **✅ Completed**

1. **Schema changes**
   - Add `domain: string` prop to `BfOrganization` (unique, indexed).
   - Add `OrganizationRole` enum (`OWNER`, `ADMIN`, `MEMBER`).
   - Introduce `BfEdgeOrganizationMember` (extends `BfEdge`) with props
     `{ role: OrganizationRole, joinedAt: Date }` (unique on
     `personId+organizationId`).
2. **Mutation definition**
   - Add `loginWithGoogle(token: String!): AuthPayload` where
     `AuthPayload { viewer: BfCurrentViewer!, success: Boolean!, errors: [AuthError!] }`.

### Phase B – Backend Auth Implementation — **⏳ In Progress**

1. **Resolver** `loginWithGoogle(token)`
   - Verify ID‑token (Google certs, audience).
   - Reject if `hd` missing or `gmail.com`.
   - **Org logic**:
     - Derive `domain = hd`.
     - If org exists → create `BfEdgeOrganizationMember`
       `{ role: OrganizationRole.MEMBER, joinedAt: now }`.
     - Else create `BfOrganization { name: domain, domain }` → edge
       `{ role: OrganizationRole.OWNER, joinedAt: now }`.
   - Issue signed JWT, set `bf_session` (`HttpOnly; SameSite=Lax; Secure`).
2. **Context** `createContext()`
   - Parse/verify cookie, load viewer (`BfCurrentViewerLoggedIn` or LoggedOut).

### Phase C – Frontend Skeleton & Mutation Integration — **🔜 Not Started**

1. **Utilities & Components**
   - `useGoogleSignIn` hook (lazy GIS loader via ref).
   - `SignInWithGoogleButton` component.
2. **LoginPage** (`iso` component) with auto redirect if already logged in.
3. **Entrypoint & Router**
   - `loginEntrypoint.ts` prefetches `me`.
   - Add `"/login"` to `isographAppRoutes`.
   - **Add `/logout` route** (server‑only; clears cookie and redirects).
4. **Mutation success handler** – invalidate store and redirect to `login_next`.

### Phase D – Protected Route Guard — **🔜 Not Started**

- Mark routes with `requiresAuth`.
- Router guard redirects unauthenticated users to `/login` and stores
  `login_next` cookie.

### Phase E – Testing & QA — **🔜 Not Started**

- **Unit**: token verification, workspace filter, org creation, edge write.
- **E2E**: Chrome FedCM happy path, Firefox fallback, guard → redirect → return
  flow.

---

## 5 Analytics & Telemetry

- `$pageview` for `/login` (PostHog).
- Events: `login start`, `login success`, `login failure`, `logout`.

---

## 6 Risks & Mitigations

| Risk                | Mitigation                                                          |
| ------------------- | ------------------------------------------------------------------- |
| FedCM UX changes    | Keep GIS SDK updated; it shields breaking changes.                  |
| Non‑Chrome browsers | GIS automatically falls back to iframe/redirect; we test regularly. |
| Token spoofing      | Always verify JWT with Google certs server‑side.                    |

---

## 7 Out‑of‑Scope

- Email/password auth
- Multi‑factor auth
- Additional SSO providers

---

## 8 Future Work – `BfConsistencyRule`

Because node props are stored as JSON blobs, current schema changes cannot
declare database‑level constraints such as unique indexes. A dedicated
**`BfConsistencyRule`** mechanism would let us express and enforce invariants in
application code:

| Rule type                 | Example                                                                              | Enforcement strategy                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Uniqueness**            | `BfOrganization.domain` must be unique                                               | Pre‑insert query + transactional edge creation; background job audits & fixes conflicts. |
| **Referential integrity** | A `BfEdgeOrganizationMember` must reference existing `BfPerson` and `BfOrganization` | Hook in edge factory; nightly checker.                                                   |
| **Custom predicates**     | `BfPerson.email` domain must match linked org domain                                 | Validator function attached to rule.                                                     |

`BfConsistencyRule` objects could be registered on startup; each provides:

```ts
{
  id: "org-domain-unique",
  description: "Organization domains must be globally unique",
  check(): Promise<Violation[]>,
  fix?(violation: Violation): Promise<void>,
}
```

During writes, fast in‑process checks run; a background worker periodically runs
full scans, reports violations, and optionally auto‑fixes where safe.

---

## 9 Future Work – `BfPrivacyPolicy`

To manage fine‑grained **authorization** inside the graph we’ll introduce a
declarative **`BfPrivacyPolicy`** system. Each node class can register a
`privacyPolicy` object that receives the `currentViewer`, requested `field`, and
node instance, and returns `ALLOW`, `DENY`, or `PARTIAL`.

```ts
export const BfOrganizationPrivacy: BfPrivacyPolicy = {
  canView(node, viewer) {
    // Owners and admins can view all fields
    if (viewer.edgeTo(node)?.role !== OrganizationRole.MEMBER) return "ALLOW";
    // members can’t see billingEmail or apiKeys
    return "PARTIAL";
  },
  canEdit(node, viewer) {
    return viewer.edgeTo(node)?.role === OrganizationRole.OWNER
      ? "ALLOW"
      : "DENY";
  },
};
```

- **Integration point**: GraphQL resolvers call `privacyPolicy.canView` before
  returning each field; violations throw `BfErrorNotAuthorized`.
- **Schema helper**: builder DSL can accept `@private` directive for per‑field
  policy hooks.
- **Testing**: static analyzer runs across sample viewers to ensure no policy
  gaps.

---
