# Frontend Authentication Implementation Plan

_Google OAuth integration for boltfoundry-com app_

**Date**: 2025-07-20\
**Status**: Planning\
**Target**: 1-2 days before RLHF MVP\
**Dependencies**: Required before Simple RLHF MVP can begin

## Executive Summary

The boltfoundry-com app has complete backend authentication infrastructure but
lacks frontend components. This plan outlines building the minimal frontend
authentication needed to enable user login, organization creation, and access to
the RLHF interface.

## Current State Analysis

### ✅ **COMPLETE BACKEND INFRASTRUCTURE**

- **Google OAuth Backend**: Full token verification and session management
- **JWT Sessions**: Dual-token system with automatic refresh (15min access,
  30day refresh)
- **Organization Auto-Creation**: New orgs created from Google Workspace domains
- **GraphQL Integration**: `currentViewer` query and `loginWithGoogle` mutation
- **Database Models**: BfOrganization and BfPerson with proper relationships

### ✅ **EXISTING FRONTEND PATTERNS (apps/boltFoundry)**

- **Complete GSI Implementation**: LoginWithGoogleButton component fully coded
  (but commented out)
- **Google Script Loading**: Established pattern for loading Google Identity
  Services
- **ID Token Handling**: Working credential response processing
- **Environment Configuration**: GOOGLE_OAUTH_CLIENT_ID setup pattern
- **E2E Testing**: Complete authentication flow test suite
- **Backend Integration**: Proven GraphQL mutation integration

**Reference Files**:

- `/apps/boltFoundry/components/CurrentViewer/LoginWithGoogleButton.tsx` -
  Complete GSI implementation
- `/apps/boltFoundry/__tests__/e2e/loginPage.test.e2e.ts` - Authentication
  testing patterns
- `/apps/boltFoundry/__generated__/configKeys.ts` - Environment variable setup

### ❌ **MISSING IN boltfoundry-com**

- **Adapted Components**: Need to copy/adapt boltFoundry patterns to
  boltfoundry-com
- **Authentication Context**: React context for user state management
- **Route Protection**: Protected routes and navigation
- **Isograph Integration**: currentViewer queries adapted for boltfoundry-com

## Implementation Plan

### Step 1: Adapt Google OAuth from boltFoundry

**1.1 Copy and Adapt LoginWithGoogleButton Component**

**Reference**:
`/apps/boltFoundry/components/CurrentViewer/LoginWithGoogleButton.tsx`

```typescript
// apps/boltfoundry-com/components/auth/GoogleSignInButton.tsx
// Adapted from boltFoundry implementation (currently commented out)

export function GoogleSignInButton() {
  // Follow exact pattern from boltFoundry:
  // 1. Dynamic Google script loading
  // 2. google.accounts.id.initialize()
  // 3. Button rendering with established styling
  // 4. Credential response handling
  // 5. GraphQL mutation integration
}
```

**Key Implementation Details from boltFoundry**:

- **Script Loading**: Dynamic script injection for Google Identity Services
- **Initialization**: `google.accounts.id.initialize()` with client ID
- **Button Styling**: Established theme, size, and alignment preferences
- **Error Handling**: Loading states and credential response error handling

**1.2 Environment Configuration (Follow boltFoundry Pattern)**

**Reference**: `/apps/boltFoundry/__generated__/configKeys.ts`

```typescript
// Correct pattern: Use getConfigurationVariable (NOT import.meta.env)
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

const googleClientId = getConfigurationVariable("GOOGLE_OAUTH_CLIENT_ID");
if (!googleClientId) {
  logger.error("GOOGLE_OAUTH_CLIENT_ID is not set");
  // Handle configuration error
}
```

**Environment Setup**:

```bash
# Add to .env.local (or use bff inject-secrets for 1Password)
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
```

**Note**: `GOOGLE_OAUTH_CLIENT_ID` is a **PUBLIC** configuration key, so it's
available in both server and browser environments.

**1.3 Google Identity Services Setup (Proven Pattern)**

Follow the exact GSI integration pattern from boltFoundry:

```typescript
// Script loading (from boltFoundry reference)
const script = document.createElement("script");
script.src = "https://accounts.google.com/gsi/client";
script.async = true;
script.defer = true;

// Initialization (from boltFoundry reference)
google.accounts.id.initialize({
  client_id: GOOGLE_OAUTH_CLIENT_ID,
  callback: handleCredentialResponse,
  auto_select: false,
  cancel_on_tap_outside: true,
});

// Button rendering (from boltFoundry reference)
google.accounts.id.renderButton(buttonRef.current, {
  type: "standard",
  theme: "outline",
  size: "large",
  text: "signin_with",
  shape: "rectangular",
  logo_alignment: "left",
});
```

### Step 2: Authentication Context Provider

**2.1 CurrentViewer Context**

```typescript
// apps/boltfoundry-com/contexts/CurrentViewerContext.tsx
interface CurrentViewerContextType {
  currentViewer: CurrentViewer | null;
  isLoading: boolean;
  login: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const CurrentViewerProvider = ({ children }) => {
  // Use Isograph for currentViewer query
  // Handle login/logout mutations
  // Manage loading states
};
```

**2.2 Authentication Hook**

```typescript
// apps/boltfoundry-com/hooks/useAuth.ts
export function useAuth() {
  const context = useContext(CurrentViewerContext);
  if (!context) {
    throw new Error("useAuth must be used within CurrentViewerProvider");
  }
  return context;
}
```

### Step 3: Isograph Authentication Integration

**3.1 CurrentViewer Query**

```typescript
// apps/boltfoundry-com/src/components/__isograph/Query/currentViewer.ts
export const Query_currentViewer = iso(`
  field Query.currentViewer {
    __typename
    ... on CurrentViewerLoggedIn {
      personBfGid
      orgBfOid
      person {
        name
        email
      }
      organization {
        name
        domain
      }
    }
    ... on CurrentViewerLoggedOut {
      id
    }
  }
`)(function CurrentViewerQuery({ data }) {
  return data.currentViewer;
});
```

**3.2 Login Mutation**

```typescript
// apps/boltfoundry-com/src/components/__isograph/Mutation/loginWithGoogle.ts
export const Mutation_loginWithGoogle = iso(`
  field Mutation.loginWithGoogle(idToken: String!) {
    __typename
    ... on CurrentViewerLoggedIn {
      personBfGid
      orgBfOid
      person {
        name
        email
      }
    }
  }
`)(function LoginWithGoogleMutation() {
  // Return mutation function
});
```

### Step 4: Authentication UI Components

**4.1 Login Page**

```typescript
// apps/boltfoundry-com/components/auth/LoginPage.tsx
export function LoginPage() {
  const { currentViewer, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (currentViewer?.__typename === "CurrentViewerLoggedIn") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-container">
      <h1>Welcome to Bolt Foundry</h1>
      <p>Sign in with your Google Workspace account</p>
      <GoogleSignInButton />
    </div>
  );
}
```

**4.2 Protected Route Component**

```typescript
// apps/boltfoundry-com/components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentViewer, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (currentViewer?.__typename === "CurrentViewerLoggedOut") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

**4.3 Navigation with Auth State**

```typescript
// apps/boltfoundry-com/components/layout/Navigation.tsx
export function Navigation() {
  const { currentViewer, logout } = useAuth();

  return (
    <nav>
      {currentViewer?.__typename === "CurrentViewerLoggedIn"
        ? (
          <div>
            <span>Welcome, {currentViewer.person.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        )
        : <Link to="/login">Login</Link>}
    </nav>
  );
}
```

### Step 5: App Integration

**5.1 Root App Setup**

```typescript
// apps/boltfoundry-com/src/App.tsx
function App() {
  return (
    <IsographEnvironmentProvider environment={environment}>
      <CurrentViewerProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/rlhf"
              element={
                <ProtectedRoute>
                  <RlhfInterface />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </CurrentViewerProvider>
    </IsographEnvironmentProvider>
  );
}
```

**5.2 Isograph Environment with Auth**

```typescript
// apps/boltfoundry-com/src/isographEnvironment.ts
const networkRequest = (request: IsographNetworkRequest) => {
  return fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Cookies automatically included for authentication
    },
    credentials: "include", // Important for JWT cookies
    body: JSON.stringify(request),
  });
};
```

## File Structure

```
apps/boltfoundry-com/
├── components/
│   ├── auth/
│   │   ├── GoogleSignInButton.tsx
│   │   ├── LoginPage.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   └── Navigation.tsx
│   └── __isograph/
│       ├── Query/
│       │   └── currentViewer.ts
│       └── Mutation/
│           └── loginWithGoogle.ts
├── contexts/
│   └── CurrentViewerContext.tsx
├── hooks/
│   └── useAuth.ts
├── src/
│   ├── App.tsx
│   ├── config.ts
│   └── isographEnvironment.ts
└── index.html (Google script)
```

## Environment Variables Required

```bash
# In .env.local (root of monorepo or use bff inject-secrets)
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id

# Alternative: Use 1Password integration
bff inject-secrets  # Automatically injects from 1Password vault
```

**Important**: This codebase uses `getConfigurationVariable()` from
`@bolt-foundry/get-configuration-var`, **NOT** standard `import.meta.env` or
`process.env` patterns.

## Testing Strategy

### Follow boltFoundry Testing Patterns

**Reference**: `/apps/boltFoundry/__tests__/e2e/loginPage.test.e2e.ts`

The boltFoundry app has **comprehensive E2E testing** for authentication that we
can adapt:

**Key Testing Patterns from boltFoundry**:

- **Google OAuth Stubbing**: Mock Google tokeninfo endpoint responses
- **GSI API Mocking**: Stub Google Identity Services JavaScript API
- **Session Testing**: Verify JWT cookie persistence and refresh
- **Organization Creation**: Test automatic org creation on first login
- **Error Handling**: Test various authentication failure scenarios

### Unit Tests

- GoogleSignInButton component rendering (adapt from boltFoundry)
- CurrentViewerContext state management
- useAuth hook functionality
- Protected route logic

### Integration Tests

- Complete login flow with mocked Google response (follow boltFoundry patterns)
- Session persistence across page refreshes (use boltFoundry cookie testing)
- Logout functionality and cookie clearing
- Route protection and redirects

### E2E Tests

- End-to-end authentication flow
- Organization creation on first login
- RLHF interface access after authentication

## Risk Assessment

### Low Risk

- **Google OAuth Integration**: Well-documented, standard implementation
- **React Context**: Straightforward state management pattern
- **Isograph Queries**: Following established patterns in codebase

### Medium Risk

- **Session Management**: Ensuring cookies work correctly across environments
- **Route Protection**: Proper redirect logic and state management
- **Google Script Loading**: Handling async script loading and initialization

### High Risk

- **First Implementation**: No existing auth patterns in boltfoundry-com to
  follow
- **Environment Configuration**: Getting OAuth client ID configured correctly
- **Backend Integration**: Ensuring frontend connects properly to existing
  backend

## Success Criteria

### Functional Requirements

- [ ] Users can sign in with Google Workspace accounts
- [ ] Organizations are automatically created on first login
- [ ] Sessions persist across page refreshes
- [ ] Users can log out and clear sessions
- [ ] Protected routes redirect unauthenticated users
- [ ] Authentication state is available throughout the app

### Technical Requirements

- [ ] Uses existing backend GraphQL mutations
- [ ] Follows Isograph patterns for data fetching
- [ ] Secure cookie handling for JWT tokens
- [ ] Proper error handling for auth failures
- [ ] Loading states during authentication operations

## Dependencies and Blockers

### Required Before Starting

- [ ] Google OAuth client ID configured in environment
- [ ] Backend GraphQL server running
- [ ] Isograph compiler configured for boltfoundry-com

### Enables After Completion

- [ ] Simple RLHF MVP implementation
- [ ] User-scoped data access
- [ ] Organization-specific demo content
- [ ] BfOrganization.afterCreate() hook testing

## Timeline Estimate

- **Day 1**: Google OAuth setup, basic components, context provider
- **Day 2**: Isograph integration, route protection, testing
- **Buffer**: Environment setup, debugging, edge cases

Total: **2 days** before RLHF MVP can begin

## Next Steps

1. **Set up Google OAuth credentials** in Google Cloud Console
2. **Configure environment variables** for boltfoundry-com
3. **Implement Google Sign-In button** component
4. **Build authentication context** and hooks
5. **Create Isograph queries/mutations** for auth
6. **Add route protection** and navigation
7. **Test complete authentication flow**
8. **Proceed to RLHF MVP implementation**

This authentication implementation unblocks the entire RLHF MVP by enabling user
login, organization creation, and access to the GraphQL API with proper user
context.

---

## Appendix

### Google Documentation Links

#### Google Identity Services (Primary Documentation)

- **[Google Identity Services Overview](https://developers.google.com/identity/gsi/web/guides/overview)** -
  Main documentation for GSI integration
- **[Display the Sign In With Google button](https://developers.google.com/identity/gsi/web/guides/display-button)** -
  Button integration guide
- **[Handle credential responses](https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions)** -
  Credential response handling
- **[JavaScript API reference](https://developers.google.com/identity/gsi/web/reference/js-reference)** -
  Complete GSI JavaScript API
- **[HTML API reference](https://developers.google.com/identity/gsi/web/reference/html-reference)** -
  HTML data attributes and configuration

#### Google Cloud Console Setup

- **[Set up your Google API console project](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)** -
  OAuth client ID creation
- **[Google Cloud Console](https://console.cloud.google.com/)** - Main Google
  Cloud Console
- **[OAuth consent screen setup](https://developers.google.com/identity/oauth2/web-server#creatingclientidsecrets)** -
  Consent screen configuration
- **[Authorized JavaScript origins](https://developers.google.com/identity/oauth2/web-server#authorized-redirect-uris)** -
  Domain authorization setup

#### OAuth 2.0 and JWT

- **[Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)** -
  OAuth 2.0 flow documentation
- **[ID Token validation](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)** -
  Server-side token verification
- **[JWT.io](https://jwt.io/)** - JWT token decoder and debugger

#### Security Best Practices

- **[Security best practices for Google Sign-In](https://developers.google.com/identity/gsi/web/guides/security-best-practices)** -
  Security recommendations
- **[Cross-Site Request Forgery protection](https://developers.google.com/identity/gsi/web/guides/security-best-practices#csrf-protection)** -
  CSRF prevention
- **[Domain verification](https://developers.google.com/identity/gsi/web/guides/security-best-practices#domain-verification)** -
  Domain security

### Internal Reference Files

#### Backend Implementation (Complete)

- **[`apps/bfDb/classes/CurrentViewer.ts`](../../../../apps/bfDb/classes/CurrentViewer.ts)** -
  Complete Google OAuth backend implementation
  - Google token verification via tokeninfo endpoint
  - JWT session management with dual-token system
  - Organization auto-creation from Google Workspace domains
  - User profile creation and management

- **[`apps/bfDb/graphql/utils/graphqlContextUtils.ts`](../../../../apps/bfDb/graphql/utils/graphqlContextUtils.ts)** -
  JWT session utilities
  - Access token refresh logic
  - Cookie configuration and security
  - Session versioning and revocation

- **[`apps/bfDb/graphql/__generated__/schema.graphql`](../../../../apps/bfDb/graphql/__generated__/schema.graphql)** -
  GraphQL schema
  - `CurrentViewer` interface definition
  - `loginWithGoogle(idToken: String!)` mutation
  - `currentViewer` query

#### Frontend Reference Implementation (boltFoundry)

- **[`apps/boltFoundry/components/CurrentViewer/LoginWithGoogleButton.tsx`](../../../../apps/boltFoundry/components/CurrentViewer/LoginWithGoogleButton.tsx)** -
  Complete GSI implementation (commented out)
  - Google script loading and initialization
  - Button rendering and styling
  - Credential response handling
  - GraphQL mutation integration
  - Error handling and loading states

- **[`apps/boltFoundry/components/CurrentViewer/LoginPage.tsx`](../../../../apps/boltFoundry/components/CurrentViewer/LoginPage.tsx)** -
  Login page implementation (commented out)
  - Isograph integration patterns
  - Authentication state management
  - Redirect logic

- **[`apps/boltFoundry/contexts/AppEnvironmentContext.tsx`](../../../../apps/boltFoundry/contexts/AppEnvironmentContext.tsx)** -
  App context patterns
  - User state management
  - Feature flags and configuration
  - Environment variable handling

- **[`apps/boltFoundry/__generated__/configKeys.ts`](../../../../apps/boltFoundry/__generated__/configKeys.ts)** -
  Environment configuration
  - `GOOGLE_OAUTH_CLIENT_ID` setup example
  - Configuration variable patterns

#### Testing References

- **[`apps/boltFoundry/__tests__/e2e/loginPage.test.e2e.ts`](../../../../apps/boltFoundry/__tests__/e2e/loginPage.test.e2e.ts)** -
  Complete E2E authentication tests
  - Google OAuth mocking patterns
  - Session persistence testing
  - Organization creation testing
  - Cookie handling verification

- **[`apps/boltFoundry/__tests__/e2e/utils.ts`](../../../../apps/boltFoundry/__tests__/e2e/utils.ts)** -
  E2E testing utilities
  - Authentication test helpers
  - Mock user creation
  - Test data patterns

#### Configuration and Infrastructure

- **[`packages/get-configuration-var/get-configuration-var.ts`](../../../../packages/get-configuration-var/get-configuration-var.ts)** -
  Configuration management
  - Correct pattern for environment variables
  - 1Password integration for secrets
  - Browser-safe configuration loading

- **[`deno.jsonc`](../../../../deno.jsonc)** - Project configuration
  - Import maps and path aliases
  - Workspace configuration
  - Compiler options

- **[`apps/boltfoundry-com/isograph.config.json`](../../isograph.config.json)** -
  Isograph configuration
  - GraphQL schema endpoint
  - Generated code output paths
  - Type generation settings

#### Database Models

- **[`apps/bfDb/nodeTypes/BfOrganization.ts`](../../../../apps/bfDb/nodeTypes/BfOrganization.ts)** -
  Organization model
  - Auto-creation from Google Workspace domains
  - Lifecycle hooks for demo data
  - Relationship to BfPerson

- **[`apps/bfDb/nodeTypes/BfPerson.ts`](../../../../apps/bfDb/nodeTypes/BfPerson.ts)** -
  User model
  - Email and profile management
  - Organization membership
  - GraphQL type definitions

#### Design System Components

- **[`apps/bfDs/components/BfDsButton.tsx`](../../../../apps/bfDs/components/BfDsButton.tsx)** -
  Button component for login UI
- **[`apps/bfDs/components/BfDsForm.tsx`](../../../../apps/bfDs/components/BfDsForm.tsx)** -
  Form components
- **[`apps/bfDs/components/BfDsSpinner.tsx`](../../../../apps/bfDs/components/BfDsSpinner.tsx)** -
  Loading indicators
- **[`apps/bfDs/components/BfDsCallout.tsx`](../../../../apps/bfDs/components/BfDsCallout.tsx)** -
  Error/success messages

#### Build and Development

- **[`apps/boltfoundry-com/vite.config.ts`](../../vite.config.ts)** - Vite build
  configuration
- **[`apps/boltfoundry-com/deno.jsonc`](../../deno.jsonc)** - App-specific Deno
  configuration
- **[`infra/bft/tasks/build.bft.ts`](../../../../infra/bft/tasks/build.bft.ts)** -
  Build task implementation

### Related Implementation Plans

- **[`apps/boltfoundry-com/memos/plans/simple-rlhf-mvp.md`](../simple-rlhf-mvp.md)** -
  RLHF MVP plan (depends on auth)
- **[`memos/plans/kamal-hetzner-deployment.md`](../../../../memos/plans/kamal-hetzner-deployment.md)** -
  Production deployment plan
- **[`docs/guides/getting-started.md`](../../../../docs/guides/getting-started.md)** -
  General project setup guide

### Troubleshooting Resources

- **[`packages/logger/logger.ts`](../../../../packages/logger/logger.ts)** -
  Logging utilities for debugging
- **[`CLAUDE.md`](../../../../CLAUDE.md)** - Development environment setup and
  commands
- **[`README.md`](../../../../README.md)** - Project overview and quick start

### Environment Setup Files

- **[`.env.local`](../../../../.env.local)** - Local environment variables (add
  GOOGLE_OAUTH_CLIENT_ID)
- **[`infra/bff/commands/inject-secrets.bff.ts`](../../../../infra/bff/commands/inject-secrets.bff.ts)** -
  1Password secrets injection
- **[`packages/get-configuration-var/README.md`](../../../../packages/get-configuration-var/README.md)** -
  Configuration management guide
