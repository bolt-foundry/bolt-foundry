import type * as React from "react";
import { useAppState } from "packages/client/contexts/AppStateContext.tsx";
import { BfDsToggle } from "packages/bfDs/BfDsToggle.tsx";

type Props = {
  fallback?: React.ReactNode;
  name: string;
  toggle?: boolean;
};

export function FeatureFlag({
  children,
  fallback,
  name,
  toggle,
}: React.PropsWithChildren<Props>) {
  const { getFeatureFlag, setFeatureFlag } = useAppState();

  const isFeatureEnabled = getFeatureFlag(name);

  if (toggle) {
    return (
      <BfDsToggle
        label={name}
        size="small"
        value={!!isFeatureEnabled}
        onChange={() => {
          setFeatureFlag(name);
        }}
      />
    );
  }

  return isFeatureEnabled ? children : fallback ?? null;
}
