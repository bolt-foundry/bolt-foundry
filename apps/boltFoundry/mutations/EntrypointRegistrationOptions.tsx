import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const RegistrationOptions = iso(`
  field Mutation.RegistrationOptions($email: String!) {
    registrationOptions(email: $email)
  }
`)(function RegistrationOptions({ data }) {
  if (data?.registrationOptions == null) {
    return null;
  }
  const registrationOptions = JSON.parse(data.registrationOptions);
  return registrationOptions;
});
