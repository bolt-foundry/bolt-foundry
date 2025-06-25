import * as React from "react";
import {
  CfDsContext,
  type CfDsContextType,
} from "@bfmono/apps/cfDs/contexts/CfDsContext.tsx";
const { useContext } = React;

export const useCfDs = (): CfDsContextType => {
  const context = useContext(CfDsContext);
  if (context === undefined) {
    throw new Error("useCfDs must be used within a CfDsProvider");
  }
  return context;
};
