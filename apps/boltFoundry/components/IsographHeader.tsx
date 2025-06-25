import { useLazyReference, useResult } from "@isograph/react";
import type { BfIsographEntrypoint } from "@bfmono/lib/BfIsographEntrypoint.ts";
import type { ServerProps } from "@bfmono/apps/boltFoundry/contexts/AppEnvironmentContext.tsx";
import { AppEnvironmentProvider } from "@bfmono/apps/boltFoundry/contexts/AppEnvironmentContext.tsx";

export function IsographHeaderComponent(
  { entrypoint }: {
    entrypoint: BfIsographEntrypoint;
  },
) {
  const { fragmentReference } = useLazyReference(entrypoint, {});
  const result = useResult(fragmentReference);
  const title = result.title;
  return <title className="dynamic">{title}</title>;
}

export function getIsographHeaderComponent(
  environment: ServerProps,
  entrypoint: BfIsographEntrypoint,
) {
  return function IsographHeader() {
    return (
      <AppEnvironmentProvider {...environment}>
        <IsographHeaderComponent entrypoint={entrypoint} />
      </AppEnvironmentProvider>
    );
  };
}
