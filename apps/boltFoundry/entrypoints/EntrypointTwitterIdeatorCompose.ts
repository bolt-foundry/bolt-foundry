import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointTwitterIdeatorCompose = iso(`
  field Query.EntrypointTwitterIdeatorCompose {
    me {
      organization {
        SimpleComposer
      }
    }
  }
`)(
  function EntrypointTwitterIdeatorCompose(
    { data },
  ) {
    return {
      Body: data?.me?.organization?.SimpleComposer,
      title: "Twitter Simple Composer",
    };
  },
);
