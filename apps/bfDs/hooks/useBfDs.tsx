import * as React from "react";
import {
  BfDsContext,
  type BfDsContextType,
} from "@bfmono/apps/bfDs/contexts/BfDsContext.tsx";
const { useContext } = React;

export const useBfDs = (): BfDsContextType => {
  const context = useContext(BfDsContext);
  if (context === undefined) {
    throw new Error("useBfDs must be used within a BfDsProvider");
  }
  return context;
};
