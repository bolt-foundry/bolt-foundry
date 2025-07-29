import type * as React from "react";
import { BfDsToastProvider } from "./BfDsToastProvider.tsx";

export function BfDsProvider({ children }: React.PropsWithChildren) {
  return (
    <BfDsToastProvider>
      {children}
    </BfDsToastProvider>
  );
}
