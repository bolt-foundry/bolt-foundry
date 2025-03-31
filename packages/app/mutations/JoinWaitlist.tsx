import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

export const JoinWaitlistMutation = iso(`
  field Mutation.JoinWaitlist($name: String!, $email: String!, $company: String!) {
    joinWaitlist(name: $name, email: $email, company: $company){
      success
      message
    }
  }
`)(function JoinWaitlist({ data }) {
  logger.info("joinWaitlistMutation", data);
  return data;
});
