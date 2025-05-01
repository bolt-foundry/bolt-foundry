# 1Password **onepassword‑sdk‑js** Integration Plan

## 0 · Why we're doing this

- **Centralised secrets** → nothing plaintext in GitHub, Vercel, Fly.
- **Per‑environment vaults** for dev / test / prod.
- **Service‑account JSON** for CI & runtime; **OAuth click‑to‑login** for
  day‑to‑day developer work.

---

## 1 · High‑level architecture

| Layer               | Responsibility                         | 1Password Piece                              |
| ------------------- | -------------------------------------- | -------------------------------------------- |
| **Vaults**          | Isolation per env                      | `BF – Dev`, `BF – Test`, `BF – Prod`         |
| **Service Account** | Headless machine token                 | `bf‑dev‑svc`, etc.                           |
| **OAuth users**     | Interactive dev access                 | Devs' own 1Password accounts                 |
| **SDK wrapper**     | Thin abstraction around `createClient` | `packages/get-configuration-var/opClient.ts` |

> The wrapper auto‑selects **service‑account JSON** when present, else falls
> back to **OAuth / CLI** for local dev.

---

## 2 · Prerequisites

### 2.1 Org setup

1. Create the three vaults.
2. One **service account per vault**; download its JSON.
3. Add devs to the **Dev** vault with read‑only rights.

### 2.2 Tooling on dev machines

| Purpose                      | Option A                                            | Option B                                  |
| ---------------------------- | --------------------------------------------------- | ----------------------------------------- |
| Backend scripts / Deno tests | 1Password CLI ≥ 2.26 (`brew install 1password-cli`) | export `OP_SERVICE_ACCOUNT_JSON` manually |
| Front‑end click‑to‑login     | 1Password browser extension (Edge/Chrome/Firefox)   | —                                         |

---

## 3 · Implementation steps

### 3.1 SDK wrapper – `packages/get-configuration-var/opClient.ts`

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

### 3.2 Front‑end "Sign in with 1Password" button

```tsx
// apps/web/components/OpLoginButton.tsx
import { createClient } from "@1password/sdk";
import { fromApp } from "@1password/sdk/dist/auth/from-app.js";

export function OpLoginButton() {
  async function handleClick() {
    const op = createClient({ auth: fromApp() });
    await op.user.authenticate(); // opens extension popup once
    alert("Signed in – you can now fetch secrets");
  }
  return (
    <button onClick={handleClick} className="btn-primary">
      Sign in with 1Password
    </button>
  );
}
```

_After sign‑in, **`fromApp()`** auto‑refreshes tokens under the hood._

### 3.3 Config helper integration

We'll extend the existing `getConfigurationVariable` function to get secrets
from 1Password when not available in environment variables:

```ts
// packages/get-configuration-var/get-configuration-var.ts
import { getSecret } from "./opClient.ts";

// Secret mapping for 1Password retrieval
const secretMap: Record<
  string,
  { vaultId: string; itemId: string; field: string }
> = {
  "API_KEY": { vaultId: "vault_abc123", itemId: "item_xyz789", field: "key" },
  // Add more mappings as needed
};

// In-memory cache to avoid repeated 1Password calls
const secretCache: Record<string, string> = {};

export async function getConfigurationVariable(
  configVar: string,
): Promise<string | undefined> {
  // 1️⃣ Try environment variable first
  let value = undefined;
  if (typeof Deno === "undefined") {
    // @ts-expect-error global environment variables
    value = globalThis.__ENVIRONMENT__?.[configVar];
  } else {
    value = Deno.env.get(configVar);
  }
  if (value && value !== "") {
    return value;
  }

  // 2️⃣ Check cache
  if (secretCache[configVar]) {
    return secretCache[configVar];
  }

  // 3️⃣ Try 1Password if mapped
  if (secretMap[configVar]) {
    try {
      const { vaultId, itemId, field } = secretMap[configVar];
      const secret = await getSecret(vaultId, itemId, field);
      secretCache[configVar] = secret; // Cache for future calls
      return secret;
    } catch (error) {
      console.error(`Failed to retrieve ${configVar} from 1Password:`, error);
    }
  }

  return undefined;
}
```

---

## 4 · CI / runtime wiring

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

`OpLoginButton` opens the 1Password extension's OAuth flow; no env vars needed.

---

## 5 · Comprehensive testing strategy

We want confidence at **three layers**: library correctness, environment wiring,
and user‑facing behaviour.\
Below is a menu of concrete tests to add to the repo.

### 5.1 Unit tests (Deno `@std/testing`)

| Target                     | What we assert                                                                                        | How we stub                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `selectAuth()`             | Picks **fromEnv** when `OP_SERVICE_ACCOUNT_JSON` present; falls back to **fromCli**, then **fromApp** | Monkey‑patch `Deno.env` and import‑override `fromCli` / `fromApp` with spies |
| `getSecret()`              | Returns correct field, throws typed error on missing field                                            | Inject mock `op.item.get` returning fixture item                             |
| `getConfigurationVariable` | Env var precedence > 1Password > cache                                                                | Provide fake `secretMap`, stub `getSecret`                                   |
| `OpLoginButton`            | Calls `op.user.authenticate()` on click                                                               | Render with React Testing Library + jest.fn()                                |

### 5.2 Backend integration tests

- **Happy path**: Launch tests with `OP_SERVICE_ACCOUNT_JSON` pointing to a
  sandbox service‑account JSON; create a temp item via 1Password CLI in the
  sandbox vault, then fetch it through `getConfigurationVariable()`.
- **CLI auth fallback**: Simulate a signed‑in CLI by exporting
  `OP_SESSION_<shorthand>` and verify `fromCli()` branch fetches secrets when
  JSON is absent.
- **Failure modes**: unset envs → expect `Missing1PasswordAuthError`. Expire
  token (set past expiry) → expect refresh attempt & specific error.

## 6 · Future enhancements

- bff friend to scaffold new secret items directly from code.
- **AST lint**: custom ESLint rule banning `"secret"` literals and direct
  `Deno.env.get(<PROD_KEY>)` usage outside getConfigurationVariable.
- **Policy test**: Attempt 1Password fetch from a non‑whitelisted item ID in
  prod build → expect CI failure (ensures secretMap is the only gate).
