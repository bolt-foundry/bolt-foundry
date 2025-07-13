import type * as React from "react";
import type { ExtractReadFromStore, FragmentReference } from "@isograph/react";
import { useResult } from "@isograph/react";
import { BfError } from "@bfmono/lib/BfError.ts";
import type { RouteEntrypoint } from "@bfmono/apps/boltFoundry/__generated__/builtRoutes.ts";
import type { BfIsographEntrypoint } from "@bfmono/lib/BfIsographEntrypoint.ts";

type NetworkRequestReaderOptions = {
  suspendIfInFlight: boolean;
  throwOnNetworkError: boolean;
};

export function BfIsographFragmentReader<
  TEntrypoint extends BfIsographEntrypoint,
>(
  props: {
    fragmentReference: FragmentReference<
      ExtractReadFromStore<TEntrypoint>,
      RouteEntrypoint
    >;
    networkRequestOptions?: Partial<NetworkRequestReaderOptions>;
    additionalProps?: Record<string, unknown>;
  },
): React.ReactNode {
  const { Body } = useResult(
    props.fragmentReference,
    props.networkRequestOptions,
  );

  if (!Body) {
    throw new BfError("Couldn't load a valid component");
  }

  return <Body {...props.additionalProps} />;
}
