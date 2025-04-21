# Bolt Foundry – Google‑Only Login Route Plan

---

## Next Action:

Begin **Phase A – Data‑Model & GraphQL Contract**:

1. Add `domain` prop to `BfOrganization` (JSON schema + migration).
2. Create `OrganizationRole` enum (`OWNER`, `ADMIN`, `MEMBER`).
3. Implement `BfEdgeOrganizationMember` edge class.
4. Add `loginWithGoogle(token: String!): AuthPayload` to the GraphQL schema.

Once these backend pieces compile and unit tests pass, proceed to Phase B to
implement the resolver logic.

[📄 ChatGPT Canvas](https://chatgpt.com/canvas/shared/680670148f188191a1cd20b4910e3453)

---

## 1 Goals & Scope

- Authenticate visitors exclusively via **Sign‑in with Google** using **Google
  Identity Services (GIS)**, which automatically leverages **FedCM** in Chrome.
- `/login` route shows a Google sign‑in button (and One‑Tap prompt when
  permitted).
- Protected pages redirect to `/login` when session missing.

## 2 Success Criteria

- GIS One‑Tap or button flow yields an ID‑token that logs the user in.
- Browser shows FedCM account‑chooser dialog in Chrome ≥108; other browsers fall
  back to GIS legacy flow.
- Session persisted via secure HttpOnly cookie; logout clears it.

## 3 Architecture Notes

- **Data model update**:

  - Add **`domain: string`** prop to `BfOrganization` (see note about
    BfConsistencyRule)
  - Define an **`OrganizationRole`** enum (`OWNER`, `ADMIN`, `MEMBER`) and
    introduce **`BfEdgeOrganizationMember`** (extends `BfEdge`) with props
    `{ role: OrganizationRole, joinedAt: Date }`. This edge connects `BfPerson`
    → `BfOrganization` and enforces one membership per org/person.

- **Frontend**: use the GIS JS SDK (`accounts.id.initialize`). Pass
  `use_fedcm_for_prompt: true` so Chrome uses FedCM automatically.

- **GraphQL**: single mutation `loginWithGoogle(token: String!): AuthPayload`.

- **Backend**: verify ID‑token signature & audience **and ensure the `hd`
  (hosted‑domain) claim exists and is _not_ `gmail.com`** (i.e. only
  Google Workspace), then create/fetch `BfPerson` and issue JWT session
  cookie.`** (i.e. only Google Workspace), then create/fetch`BfPerson` and issue
  JWT session cookie.

## 4 Work Breakdown (Backend → Frontend)

### Phase A – Data‑Model & GraphQL Contract

1. **Schema changes**
   - Add `domain: string` prop to `BfOrganization` (unique, indexed).
   - Add `OrganizationRole` enum (`OWNER`, `ADMIN`, `MEMBER`).
   - Introduce `BfEdgeOrganizationMember` (extends `BfEdge`) with props
     `{ role: OrganizationRole, joinedAt: Date }` (unique on
     `personId+organizationId`).
2. **Mutation definition**
   - Add `loginWithGoogle(token: String!): AuthPayload` where
     `AuthPayload { viewer: BfCurrentViewer!, success: Boolean!, errors: [AuthError!] }`.

### Phase B – Backend Auth Implementation

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

### Phase C – Frontend Skeleton & Mutation Integration

1. **Utilities & Components**
   - `useGoogleSignIn` hook (lazy GIS loader via ref).
   - `SignInWithGoogleButton` component.
2. **LoginPage** (`iso` component) with auto redirect if already logged in.
3. **Entrypoint & Router**
   - `loginEntrypoint.ts` prefetches `me`.
   - Add `"/login"` to `isographAppRoutes`.
4. **Mutation success handler**

```ts
commit({ token }, {
  onComplete() {
    isographEnvironment.commitUpdate((s) => s.invalidateStore());
    const cookies = Object.fromEntries(
      document.cookie.split("; ").map((c) => c.split("=")),
    );
    let next = decodeURIComponent(cookies.login_next ?? "/") as string;
    if (!next.startsWith("/")) next = "/";
    document.cookie = "login_next=; Max-Age=0; path=/; SameSite=Lax";
    router.replace(next);
  },
});
```

### Phase D – Protected Route Guard

- Mark routes with `requiresAuth`.
- In router guard: if unauthenticated
  ```ts
  const currentPath = location.pathname + location.search;
  if (currentPath.startsWith("/")) {
    document.cookie = `login_next=${
      encodeURIComponent(currentPath)
    }; Max-Age=300; path=/; SameSite=Lax`;
  }
  navigate("/login");
  ```

### Phase E – Testing & QA

- **Unit**: token verification, workspace filter, org creation, edge write.
- **E2E**: Chrome FedCM happy path, Firefox fallback, guard → redirect → return
  flow.

## 5 Analytics & Telemetry

- `$pageview` for `/login` (PostHog).
- Events: `login start`, `login success`, `login failure`, `logout`.

## 6 Risks & Mitigations

| Risk                | Mitigation                                                          |
| ------------------- | ------------------------------------------------------------------- |
| FedCM UX changes    | Keep GIS SDK updated; it shields breaking changes.                  |
| Non‑Chrome browsers | GIS automatically falls back to iframe/redirect; we test regularly. |
| Token spoofing      | Always verify JWT with Google certs server‑side.                    |

## 7 Out‑of‑Scope

- Email/password auth
- Multi‑factor auth
- Additional SSO providers
