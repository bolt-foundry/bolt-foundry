import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const CheckEmailMutation = iso(`
  field Mutation.CheckEmail($email: String!) {
    checkEmail(email: $email)
  }
`)(function CheckEmailMutation({ data }) {
  logger.debug("CheckEmailMutation", data);
  return data?.checkEmail;
});
