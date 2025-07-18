# CurrentViewer Concrete Types Implementation Plan

## Overview

This plan outlines how to implement `CurrentViewerLoggedIn` and
`CurrentViewerLoggedOut` as concrete GraphQL types that implement the
`CurrentViewer` interface, enabling proper type discrimination in Isograph
components.

## Current State Analysis

### ✅ What's Already Working

- `CurrentViewer` interface exists in GraphQL schema with proper fields (`id`,
  `personBfGid`, `orgBfOid`)
- Authentication flow with JWT cookies (`bf_access`, `bf_refresh`) is
  implemented
- `loginWithGoogle` mutation exists and works correctly
- TypeScript classes `CurrentViewerLoggedIn` and `CurrentViewerLoggedOut` exist
- GraphQL context provides proper authentication state

### ❌ Current Issues

- Concrete types are **not registered in GraphQL schema** as implementing the
  interface
- Classes are in `apps/bfDb/classes/` but need to be in `apps/bfDb/nodeTypes/`
  for auto-discovery
- Isograph cannot use `asCurrentViewerLoggedIn`/`asCurrentViewerLoggedOut`
  because types don't exist in schema
- E2E tests pass but don't actually test authentication flow

## Implementation Plan

### Phase 1: Move Concrete Types to Node Types Directory

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/nodeTypes/CurrentViewerLoggedIn.ts`

```typescript
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode((gql) => gql // Additional fields specific to logged-in users could go here
    // For now, just inherit from CurrentViewer interface
  );

  // Implement any logged-in specific methods
  get isLoggedIn(): boolean {
    return true;
  }
}
```

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/nodeTypes/CurrentViewerLoggedOut.ts`

```typescript
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

export class CurrentViewerLoggedOut extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .mutation("loginWithGoogle", {
        args: (a) => a.nonNull.string("idToken"),
        returns: "CurrentViewer",
        resolve: async (_src, args, ctx) => {
          const idToken = args.idToken as string;
          const currentViewer = await ctx.loginWithGoogleToken(idToken);
          return currentViewer.toGraphql();
        },
      })
  );

  get isLoggedIn(): boolean {
    return false;
  }
}
```

### Phase 2: Update CurrentViewer Base Class

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/classes/CurrentViewer.ts`

**Changes Required:**

1. **Remove concrete class definitions** - move `CurrentViewerLoggedIn` and
   `CurrentViewerLoggedOut` to nodeTypes
2. **Keep interface definition** - maintain `@GraphQLInterface` decorator and
   base implementation
3. **Update imports** - import concrete types from nodeTypes directory
4. **Move loginWithGoogle mutation** - transfer to `CurrentViewerLoggedOut` in
   nodeTypes

```typescript
// Remove these class definitions from CurrentViewer.ts:
// export class CurrentViewerLoggedIn extends CurrentViewer { ... }
// export class CurrentViewerLoggedOut extends CurrentViewer { ... }

// Add imports for the moved classes:
import { CurrentViewerLoggedIn } from "@bfmono/apps/bfDb/nodeTypes/CurrentViewerLoggedIn.ts";
import { CurrentViewerLoggedOut } from "@bfmono/apps/bfDb/nodeTypes/CurrentViewerLoggedOut.ts";

// Keep the rest of the interface implementation unchanged
```

### Phase 3: Verify Auto-Discovery

**Check:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/models/__generated__/nodeTypesList.ts`

After moving the files, run:

```bash
bft genGqlTypes
```

The generated file should include:

```typescript
export { CurrentViewerLoggedIn } from "../nodeTypes/CurrentViewerLoggedIn.ts";
export { CurrentViewerLoggedOut } from "../nodeTypes/CurrentViewerLoggedOut.ts";
```

### Phase 4: Update Schema Generation

**Verify:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/graphql/__generated__/schema.graphql`

After running `bft genGqlTypes`, the schema should include:

```graphql
interface CurrentViewer {
  id: ID
  orgBfOid: String
  personBfGid: String
}

type CurrentViewerLoggedIn implements CurrentViewer {
  id: ID
  orgBfOid: String
  personBfGid: String
}

type CurrentViewerLoggedOut implements CurrentViewer {
  id: ID
  orgBfOid: String
  personBfGid: String
}

type Mutation {
  loginWithGoogle(idToken: String!): CurrentViewer
}
```

### Phase 5: Update Isograph Components

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/boltfoundry-com/components/LogInOrOutButton.tsx`

```typescript
import { iso } from "@iso-bfc";

export const LogInOrOutButton = iso(`
  field CurrentViewer.LogInOrOutButton @component {
    asCurrentViewerLoggedIn {
      LogOutButton
    }
    asCurrentViewerLoggedOut {
      LogInButton
    }
  }
`)(function LogInOrOutButton({ data }) {
  const LoginComponent = data.asCurrentViewerLoggedIn?.LogOutButton ??
    data.asCurrentViewerLoggedOut?.LogInButton;

  return LoginComponent ? <LoginComponent /> : "";
});
```

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/boltfoundry-com/components/LogInButton.tsx`

```typescript
import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
import { useState } from "react";

export const LogInButton = iso(`
  field CurrentViewerLoggedOut.LogInButton @component {
    loginWithGoogle {
      __typename
    }
  }
`)(function LogInButton({ data }) {
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success">(
    "idle",
  );

  const handleGoogleLogin = async () => {
    setLoginState("loading");

    try {
      // Use the actual mutation from the schema
      const result = await data.loginWithGoogle({ idToken: "mock-token-123" });
      setLoginState("success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginState("idle");
    }
  };

  return (
    <BfDsButton
      variant="primary"
      onClick={handleGoogleLogin}
      disabled={loginState === "loading"}
    >
      {loginState === "loading" ? "Signing in..." : "Continue with Google"}
    </BfDsButton>
  );
});
```

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/boltfoundry-com/components/LogOutButton.tsx`

```typescript
import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";

export const LogOutButton = iso(`
  field CurrentViewerLoggedIn.LogOutButton @component {
    __typename
  }
`)(function LogOutButton({ data }) {
  const handleLogout = () => {
    window.location.href = "/logout";
  };

  return (
    <BfDsButton variant="secondary" onClick={handleLogout}>
      Sign Out
    </BfDsButton>
  );
});
```

### Phase 6: Update Home Component

**File:**
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/boltfoundry-com/components/Home.tsx`

```typescript
export const Home = iso(`
  field Query.Home @component {
    __typename
    currentViewer {
      LogInOrOutButton
    }
  }
`)(function Home({ data }) {
  // ... existing code ...

  <div style={{ marginTop: "2rem" }}>
    <data.currentViewer.LogInOrOutButton />
  </div>;

  // ... rest of component
});
```

## Testing Plan

### Step 1: Validate Schema Generation

```bash
bft genGqlTypes
bft iso
deno check apps/boltfoundry-com/server.tsx
```

### Step 2: Test E2E Flow

```bash
bft e2e apps/boltfoundry-com/__tests__/e2e/auth.test.e2e.ts
```

The test should now:

- ✅ Find the `#test-google-signin` button (rendered by LogInButton)
- ✅ Execute the mock Google OAuth flow
- ✅ Validate JWT cookie structure
- ✅ Verify authentication state changes

### Step 3: Manual Testing

1. Start server: `bft app boltfoundry-com`
2. Navigate to homepage
3. Verify "Continue with Google" button appears
4. Click button and verify login flow
5. Check that cookies are set correctly

## Implementation Order

1. **Move concrete types** to nodeTypes directory (Phase 1)
2. **Update CurrentViewer base class** (Phase 2)
3. **Generate schema** and verify auto-discovery (Phase 3-4)
4. **Test schema generation** before UI changes
5. **Update Isograph components** (Phase 5)
6. **Update Home component** (Phase 6)
7. **Run comprehensive tests** (Testing Plan)

## Potential Issues & Solutions

### Issue 1: Import Circular Dependencies

**Problem:** Moving concrete types might create circular imports **Solution:**
Use dynamic imports or restructure to avoid cycles

### Issue 2: Type Resolution Conflicts

**Problem:** GraphQL might not properly resolve concrete types **Solution:**
Ensure `__typename` is set correctly in constructors

### Issue 3: Isograph Cache Invalidation

**Problem:** Existing generated Isograph code might conflict **Solution:**
Delete `__generated__` directories and regenerate

### Issue 4: Authentication Flow Breaks

**Problem:** Moving loginWithGoogle mutation might break existing flow
**Solution:** Test authentication flow thoroughly after each change

## Success Criteria

- ✅ GraphQL schema includes concrete types implementing CurrentViewer interface
- ✅ Isograph components can use
  `asCurrentViewerLoggedIn`/`asCurrentViewerLoggedOut`
- ✅ E2E tests pass with actual authentication flow testing
- ✅ Homepage correctly shows login/logout buttons based on auth state
- ✅ Google OAuth mock flow works in tests
- ✅ JWT cookies are properly set and validated

## Next Steps for Tomorrow

1. Start with Phase 1 - move concrete types to nodeTypes
2. Test schema generation after each phase
3. Validate Isograph compilation before moving to UI components
4. Test authentication flow thoroughly
5. Update e2e tests to properly validate the complete flow

This implementation will enable the proper abstract type pattern for
authentication UI components and provide a solid foundation for the Phase 3 RLHF
chat + cards interface.
