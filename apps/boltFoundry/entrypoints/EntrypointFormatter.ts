import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { useEffect } from "react";
import type { RouteEntrypoint } from "apps/boltFoundry/__generated__/builtRoutes.ts";

const _logger = getLogger(import.meta);

export const EntrypointFormatter = iso(`
  field Query.EntrypointFormatter {
  # field Query.EntrypointFormatter {
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
`)(function EntrypointFormatter({ data }): RouteEntrypoint {
  const { replace } = useRouter();
  const hasVoice = data?.me?.asBfCurrentViewerLoggedIn?.organization?.identity;
  useEffect(() => {
    if (hasVoice) {
      replace("/formatter/editor");
      return;
    }
    replace("/formatter/voice");
  }, []);
  return { Body: () => null, title: "Formatter™" };
});
