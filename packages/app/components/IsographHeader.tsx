
import React from "react";
import { useLazyReference, useResult } from "@isograph/react";
import type { BfIsographEntrypoint } from "lib/BfIsographEntrypoint.ts";
import type { ServerProps } from "packages/app/contexts/AppEnvironmentContext.tsx";
import { AppEnvironmentProvider } from "packages/app/contexts/AppEnvironmentContext.tsx";

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
