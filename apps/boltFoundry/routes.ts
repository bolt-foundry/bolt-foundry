import type { ReactNode } from "react";
import {
  entrypointFormatter,
  entrypointHome,
  entrypointLogin,
} from "@bfmono/apps/boltFoundry/__generated__/builtRoutes.ts";

export type ComponentWithHeader = {
  (): ReactNode;
  HeaderComponent?: () => ReactNode;
};

export type RouteGuts = {
  Component: ComponentWithHeader;
};

// Regular app routes (non-isograph)
export const appRoutes = new Map<string, RouteGuts>();

// Isograph routes with entrypoints
export const isographAppRoutes = new Map<string, any>([
  ["/", entrypointHome],
  ["/formatter", entrypointFormatter],
  ["/login", entrypointLogin],
]);
