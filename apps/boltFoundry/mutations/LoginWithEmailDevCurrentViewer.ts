import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const LoginWithEmailDevCurrentViewerMutation = iso(`
  field Mutation.LoginWithEmailDevCurrentViewer($email: String!) {
    loginWithEmailDevCurrentViewer(email: $email) {
      currentViewer {
        __typename
      }
    }
  }
`)(function LoginWithEmailDevCurrentViewer({ data }) {
  logger.debug("loginWithEmailDevCurrentViewer", data);
  return data;
});
