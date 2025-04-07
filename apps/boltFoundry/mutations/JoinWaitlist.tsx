import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const JoinWaitlistMutation = iso(`
  field Mutation.JoinWaitlist($name: String!, $email: String!, $company: String!) {
    joinWaitlist(name: $name, email: $email, company: $company){
      success
      message
    }
  }
`)(function JoinWaitlist({ data }) {
  logger.debug("joinWaitlistMutation", data);
  return data;
});
