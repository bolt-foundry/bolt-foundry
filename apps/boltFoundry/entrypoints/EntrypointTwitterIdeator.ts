import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { useEffect } from "react";
import type { RouteEntrypoint } from "apps/boltFoundry/__generated__/builtRoutes.ts";

const _logger = getLogger(import.meta);

export const EntrypointTwitterIdeator = iso(`
  field Query.EntrypointTwitterIdeator {
  # field Query.EntrypointTwitterIdeator($researchSlug: String) {
    me {
      asBfCurrentViewerLoggedIn {
        organization {
          identity {
            voice {
              voiceSummary
              voice
            }
          }
        }
      }
    }
  }
`)(function EntrypointTwitterIdeator({ data }): RouteEntrypoint {
  const { replace } = useRouter();
  const showSimpleComposers = true;
  const hasVoice = data?.me?.asBfCurrentViewerLoggedIn?.organization?.identity;
  useEffect(() => {
    if (hasVoice) {
      const url = showSimpleComposers
        ? "/twitter/compose"
        : "/twitter/research";
      replace(url);
      return;
    }
    replace("/twitter/voice");
  }, []);
  return { Body: () => null, title: "Twitter Ideator™" };
});
