import { getLogger } from "packages/logger.ts";
import { iso } from "packages/app/__generated__/__isograph/iso.ts";

const logger = getLogger(import.meta);

export const LoginAsDemoPersonMutation = iso(`
  field Mutation.LoginAsDemoPerson @component {
    loginAsDemoPerson {
      __typename
    }
  }
`)(function LoginAsDemoPersonMutation({ data }) {
  if (data?.loginAsDemoPerson?.__typename) {
    // navigate(data.register.nextPage)

    logger.debug("Logged in!");
  }
  return null;
});
