import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointFormatterVoice = iso(`
  field Query.EntrypointFormatterVoice {
  # field Query.EntrypointFormatterVoice($researchSlug: String) {
    me {
      asBfCurrentViewerLoggedIn {
        organization {
          IdentityEditor
        }
      }
    }
  }
`)(
  function EntrypointFormatterVoice(
    { data },
  ) {
    return {
      Body: data?.me?.asBfCurrentViewerLoggedIn?.organization?.IdentityEditor,
      title: "Formatter Voice",
    };
  },
);
