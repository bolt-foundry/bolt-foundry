import { React } from "deps.ts";
import {
  BfDsContext,
  BfDsContextType,
} from "packages/bfDs/contexts/BfDsContext.tsx";
const { useContext } = React;

export const useBfDs = (): BfDsContextType => {
  const context = useContext(BfDsContext);
  if (context === undefined) {
    throw new Error("useBfDs must be used within a BfDsProvider");
  }
  return context;
};
