import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

export const LoginPage = iso(`
  field Query.LoginPage @component {
    currentViewer {
      __typename
      asCurrentViewerLoggedIn {
        personBfGid
        orgBfOid
      }
      asCurrentViewerLoggedOut {
        id
      }
      GoogleSignInButton
    }
  }
`)(function LoginPage({ data }) {
  const viewer = data.currentViewer;

  // If already logged in, show different content
  if (viewer?.asCurrentViewerLoggedIn) {
    return (
      <div data-testid="login-page" data-testid-state="already-logged-in">
        <h1>You're Already Signed In</h1>
        <p>You're currently signed in to Bolt Foundry.</p>
        <p data-testid="user-info">
          User ID: {viewer.asCurrentViewerLoggedIn.personBfGid}
        </p>
        <BfDsButton
          data-testid="go-to-rlhf-button"
          variant="primary"
        >
          Go to RLHF Interface
        </BfDsButton>
      </div>
    );
  }

  // Show login form for unauthenticated users
  return (
    <div data-testid="login-page" data-testid-state="logged-out">
      <h1>Sign In to Bolt Foundry</h1>
      <p>
        Please sign in with your Google Workspace account to access the RLHF
        interface.
      </p>

      {viewer?.GoogleSignInButton && <viewer.GoogleSignInButton />}
    </div>
  );
});
