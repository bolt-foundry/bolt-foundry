import { PageUIDemo } from "apps/boltFoundry/pages/PageUIDemo.tsx";
import { EditorPage as LexicalDemo } from "apps/boltFoundry/components/lexical/LexicalDemo.tsx";
import { Plinko } from "apps/boltFoundry/pages/Plinko.tsx";

function fileHandlerFactory(url: string) {
  return function FileHandler() {
    return url;
  };
}

export type ComponentWithHeader = React.ComponentType<unknown> & {
  HeaderComponent?: React.ComponentType<unknown>;
};

export type RouteGuts = {
  Component: ComponentWithHeader;
};

export type RouteMap = Map<string, RouteGuts>;

export const appRoutes: RouteMap = new Map([
  ["/ui", { Component: PageUIDemo }],
  ["/justin", { Component: LexicalDemo }],
  ["/plinko", { Component: Plinko }],
]);

export type IsographRoute = BfIsographEntrypoint;

export type RouteEntrypoint = {
  Body: React.FC | null | undefined;
  title: string;
};

import {
  entrypointHome,
} from "apps/boltFoundry/__generated__/builtRoutes.ts";
import type { BfIsographEntrypoint } from "lib/BfIsographEntrypoint.ts";

export const loggedInAppRoutes = new Map<string, IsographRoute>([]);

export const isographAppRoutes = new Map<string, IsographRoute>([
  ["/", entrypointHome],
  ...loggedInAppRoutes,
]);

export const toolRoutes: RouteMap = new Map([
  ["/tools/jupyter-notebook", {
    Component: fileHandlerFactory("jupyter-notebook-open"),
  }],
  ["/tools/jupyter-console", {
    Component: fileHandlerFactory("jupyter-console-open"),
  }],
  ["/tools/sapling", {
    Component: fileHandlerFactory("sapling-open"),
  }],
]);
