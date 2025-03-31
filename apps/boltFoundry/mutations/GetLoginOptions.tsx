import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const GetLoginOptionsMutation = iso(`
  field Mutation.GetLoginOptions($email: String!) {
    getLoginOptions(email: $email)
  }
`)(function GetLoginOptionsMutation({ data }) {
  return data?.getLoginOptions;
});
