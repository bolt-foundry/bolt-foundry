import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

enum _SubPages {
  RESEARCH = "research",
}

export const EntrypointTwitterIdeatorWorkshop = iso(`
  field Query.EntrypointTwitterIdeatorWorkshop {
    me {
      organization {
        Workshopping
      }
    }
  }
`)(
  function EntrypointTwitterIdeatorWorkshop(
    { data },
  ) {
    return {
      Body: data?.me?.organization?.Workshopping,
      title: "Twitter Workshopping",
    };
  },
);
