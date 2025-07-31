import { useMutation } from "@bfmono/apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import type { BfIsographEntrypoint } from "@bfmono/lib/BfIsographEntrypoint.ts";

export function useEntrypoint<T extends BfIsographEntrypoint>(
  entrypoint: T,
) {
  const { commit, responseElement } = useMutation(entrypoint);
  return {
    load: commit,
    responseElement,
  };
}
