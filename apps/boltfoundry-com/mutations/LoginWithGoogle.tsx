import { iso } from "@iso-bfc";

export const LoginWithGoogle = iso(`
  field Mutation.LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      __typename
      asCurrentViewerLoggedIn {
        personBfGid
        orgBfOid
      }
      asCurrentViewerLoggedOut {
        id
      }
    }
  }
`)(function LoginWithGoogle({ data }) {
  // This component handles the mutation response
  if (data.loginWithGoogle?.asCurrentViewerLoggedIn) {
    // Login was successful
    // Login successful, reloading page
    // Reload the page to reflect the logged-in state
    globalThis.location.reload();
  }

  return null; // No UI needed for this mutation response
});
