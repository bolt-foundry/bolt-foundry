# 1Password **onepassword‑sdk‑js** Integration Plan

## 0 · Why we’re doing this

- **Centralised secrets** → nothing plaintext in GitHub, Vercel, Fly.
- **Per‑environment vaults** for dev / test / prod.
- **Service‑account JSON** for CI & runtime; **OAuth click‑to‑login** for
  day‑to‑day developer work.

---

## 1 · High‑level architecture

| Layer               | Responsibility                         | 1Password Piece                      |
| ------------------- | -------------------------------------- | ------------------------------------ |
| **Vaults**          | Isolation per env                      | `BF – Dev`, `BF – Test`, `BF – Prod` |
| **Service Account** | Headless machine token                 | `bf‑dev‑svc`, etc.                   |
| **OAuth users**     | Interactive dev access                 | Devs’ own 1Password accounts         |
| **SDK wrapper**     | Thin abstraction around `createClient` | `packages/secrets/opClient.ts`       |

> The wrapper auto‑selects **service‑account JSON** when present, else falls
> back to **OAuth / CLI** for local dev.

---

## 2 · Prerequisites

### 2.1 Org setup

1. Create the three vaults.
2. One **service account per vault**; download its JSON.
3. Add devs to the **Dev** vault with read‑only rights.

### 2.2 Tooling on dev machines

| Purpose                      | Option A                                            | Option B                                  |
| ---------------------------- | --------------------------------------------------- | ----------------------------------------- |
| Backend scripts / Deno tests | 1Password CLI ≥ 2.26 (`brew install 1password-cli`) | export `OP_SERVICE_ACCOUNT_JSON` manually |
| Front‑end click‑to‑login     | 1Password browser extension (Edge/Chrome/Firefox)   | —                                         |

---

## 3 · Implementation steps

### 3.1 SDK wrapper – `packages/secrets/opClient.ts`

```ts
import { createClient } from "@1password/sdk";
import { fromEnv } from "@1password/sdk/dist/auth/from-env.js";
import { fromCli } from "@1password/sdk/dist/auth/from-cli.js";
import { fromApp } from "@1password/sdk/dist/auth/from-app.js";

function selectAuth() {
  // 1️⃣ CI / prod: Service‑account JSON in env
  if (Deno.env.get("OP_SERVICE_ACCOUNT_JSON")) {
    return fromEnv("OP_SERVICE_ACCOUNT_JSON");
  }
  // 2️⃣ Local backend: use signed‑in CLI session if present
  try {
    return fromCli();
  } catch (_) {
    /* continue */
  }
  // 3️⃣ Browser / SPA: interactive OAuth via extension
  return fromApp();
}

export const op = createClient({ auth: selectAuth() });

export async function getSecret(
  vaultId: string,
  itemId: string,
  field: string,
) {
  const item = await op.item.get(vaultId, itemId);
  const val = item.fields?.find((f) => f.label === field)?.value;
  if (!val) throw new Error(`Field ${field} missing on item ${item.title}`);
  return val;
}
```

### 3.2 Front‑end "Sign in with 1Password" button

```tsx
// apps/web/components/OpLoginButton.tsx
import { createClient } from "@1password/sdk";
import { fromApp } from "@1password/sdk/dist/auth/from-app.js";

export function OpLoginButton() {
  async function handleClick() {
    const op = createClient({ auth: fromApp() });
    await op.user.authenticate(); // opens extension popup once
    alert("Signed in – you can now fetch secrets");
  }
  return (
    <button onClick={handleClick} className="btn-primary">
      Sign in with 1Password
    </button>
  );
}
```

_After sign‑in, **`fromApp()`** auto‑refreshes tokens under the hood._

### 3.3 Config helper bridge (unchanged)

See previous section – still loads from env first, then 1Password.

---

## 4 · CI / runtime wiring

### GitHub Actions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      OP_SERVICE_ACCOUNT_JSON: ${{ secrets.PROD_OP_SA_JSON }}
    steps:
      - uses: actions/checkout@v4
      - run: deno task test
```

### Front‑end dev

`OpLoginButton` opens the 1Password extension’s OAuth flow; no env vars needed.

---

## 5 · Comprehensive testing strategy

We want confidence at **three layers**: library correctness, environment wiring,
and user‑facing behaviour.\
Below is a menu of concrete tests to add to the repo.

### 5.1 Unit tests (Deno `std/testing` or Vitest)

| Target                            | What we assert                                                                                        | How we stub                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `selectAuth()`                    | Picks **fromEnv** when `OP_SERVICE_ACCOUNT_JSON` present; falls back to **fromCli**, then **fromApp** | Monkey‑patch `Deno.env` and import‑override `fromCli` / `fromApp` with spies |
| `getSecret()`                     | Returns correct field, throws typed error on missing field                                            | Inject mock `op.item.get` returning fixture item                             |
| `config/getConfigurationVariable` | Env var precedence > 1Password > cache                                                                | Provide fake `secretMap`, stub `getSecret`                                   |
| `OpLoginButton`                   | Calls `op.user.authenticate()` on click                                                               | Render with React Testing Library + jest.fn()                                |

### 5.2 Backend integration tests

- **Happy path**: Launch tests with `OP_SERVICE_ACCOUNT_JSON` pointing to a
  sandbox service‑account JSON; create a temp item via 1Password CLI in the
  sandbox vault, then fetch it through `getSecret()`.
- **CLI auth fallback**: Simulate a signed‑in CLI by exporting
  `OP_SESSION_<shorthand>` and verify `fromCli()` branch fetches secrets when
  JSON is absent.
- **Failure modes**: unset envs → expect `Missing1PasswordAuthError`. Expire
  token (set past expiry) → expect refresh attempt & specific error.

### 5.3 Browser/component tests

- **Component unit**: Render `OpLoginButton` → fire click → assert that
  `authenticate()` mock called once and UI updates state.
- **Security guard**: Attempt to fetch a prod‑scoped secret while extension is
  authenticated to **Dev** vault → expect 403 error surfaced to toast.

### 5.4 End‑to‑end (Puppeteer)

| Scenario           | What happens                                                                                                                                                                                                                                                       | Key Puppeteer APIs                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Dev OAuth flow** | `page.goto('/dev-tools')` → click **Sign in with 1Password**. We stub `window.opSdkAuth` via `page.exposeFunction()` to return a fake OAuth token so no real extension popup is needed. After the click, call backend route `/api/dev/echo-secret` and expect 200. | `page.click()`, `page.exposeFunction()`, network interception     |
| **CI smoke**       | Headless Chrome with `OP_SERVICE_ACCOUNT_JSON` env. `page.goto('/health/secrets')` which triggers server‑side fetch via `getSecret()`; expect **HTTP 200** and body "ok".                                                                                          | `puppeteer.launch({ headless: 'new' })`, `page.waitForResponse()` |
| **Token refresh**  | Mock 401 on first secret fetch → SDK should auto‑refresh; in Puppeteer intercept fetch and return 401 once, then real 200; assert UI recovers without error toast.                                                                                                 | `page.setRequestInterception(true)`, `request.continue()`         |

> **Tip:** Wrap Puppeteer helpers in `test/lib/puppetUtils.ts` so individual
> spec files stay terse.


### 5.6 Test data / fixtures

- **`test/fixtures/op‑item.json`** – minimal item payload with one password
  field.
- **Sandbox vault** – created once, ID checked in
  `<repo>/test/op‑sandbox‑ids.ts` (dev‑only file)

## 6 · Future enhancements

- bff friend to scaffold new secret items directly from code.
- **AST lint**: custom ESLint rule banning `"secret"` literals and direct
  `Deno.env.get(<PROD_KEY>)` usage outside config helper.
- **Policy test**: Attempt 1Password fetch from a non‑whitelisted item ID in
  prod build → expect CI failure (ensures secretMap is the only gate).
