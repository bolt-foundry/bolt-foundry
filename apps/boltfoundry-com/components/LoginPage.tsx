import { iso } from "@iso-bfc";
import { LoginWithGoogleButton } from "./LoginWithGoogleButton.tsx";

export const LoginPage = iso(`
  field CurrentViewer.LoginPage @component {
    __typename
  }
`)(function LoginPageComponent({ data }) {
  if (data.__typename === "CurrentViewerLoggedIn") {
    return (
      <div>
        <h1>Already Signed In</h1>
        <p>Welcome back! You're already signed in.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign In to Bolt Foundry</h1>
      <p>Sign in with your Google Workspace account to continue</p>
      <LoginWithGoogleButton />
    </div>
  );
});
