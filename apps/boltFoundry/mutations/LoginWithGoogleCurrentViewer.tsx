import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

/**
 * Uses the backend alias `loginWithGoogleCurrentViewer`.
 * Returns the new CurrentViewer so the Login page can refresh.
 */
export const LoginWithGoogleCurrentViewerMutation = iso(`
  field Mutation.LoginWithGoogleCurrentViewer($idToken: String!) {
    loginWithGoogleCurrentViewer(idToken: $idToken) {
      currentViewer { __typename }
    }
  }
`)(function LoginWithGoogleCurrentViewer({ data }) {
  logger.debug("loginWithGoogleCurrentViewer", data);
  return () => (
    <div>
      logged in as {data.loginWithGoogleCurrentViewer?.currentViewer.__typename}
    </div>
  );
});
