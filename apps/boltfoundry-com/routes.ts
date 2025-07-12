import type { BfIsographEntrypoint } from "./lib/BfIsographEntrypoint.ts";
import {
  entrypointHome,
  entrypointUIDemo,
} from "./__generated__/builtRoutes.ts";

export type ComponentWithHeader = React.ComponentType<unknown> & {
  HeaderComponent?: React.ComponentType<unknown>;
};

export type RouteGuts = {
  Component: ComponentWithHeader;
};

export type RouteMap = Map<string, RouteGuts>;
export type IsographRoute = BfIsographEntrypoint;

// Traditional React routes
export const appRoutes = new Map<string, RouteGuts>([
  // No routes here anymore - moved /ui to isograph
]);

// Isograph-powered routes
export const isographAppRoutes = new Map<string, IsographRoute>([
  ["/", entrypointHome],
  ["/ui", entrypointUIDemo],
]);
