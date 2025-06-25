import { appRoutes, type RouteGuts } from "@bfmono/apps/boltFoundry/routes.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export type MatchedRoute = {
  match: boolean;
  params: Record<string, string>;
  queryParams: Record<string, string>;
  routeParams: Record<string, string>;
  route?: RouteGuts;
  handler?: (
    request: Request,
    routeParams: Record<string, string>,
  ) => Promise<Response> | Response;
};

export function matchRoute(pathRaw = "", pathTemplate?: string): MatchedRoute {
  const [path, search] = pathRaw.split("?");
  const searchParams = new URLSearchParams(search);
  const queryParams = Object.fromEntries(searchParams.entries());
  const defaultParams = {
    match: false,
    params: {},
    queryParams,
    route: appRoutes.get(path),
    routeParams: {},
  };

  const pathsToMatch = pathTemplate ? [pathTemplate] : Array(...dynamicRoutes);
  logger.debug(`matchRoute: path: ${path}, pathsToMatch: ${pathsToMatch}`);

  const match = pathsToMatch.map((pathTemplate) => {
    const pathTemplateParts = pathTemplate.split("/");
    const currentPathParts = path.split("/");

    if (
      !pathTemplateParts.some((p) => p.endsWith("?")) &&
      pathTemplateParts.length !== currentPathParts.length
    ) {
      return defaultParams;
    }

    const params = pathTemplateParts.reduce((acc, part, i) => {
      if (part.startsWith(":")) {
        const paramName = part.endsWith("?")
          ? part.slice(1, -1)
          : part.slice(1);
        acc[paramName] = currentPathParts[i] || null;
      }
      return acc;
    }, {} as Record<string, string | null>);

    for (let i = 0; i < pathTemplateParts.length; i++) {
      if (pathTemplateParts[i].startsWith(":")) {
        if (!currentPathParts[i] && !pathTemplateParts[i].endsWith("?")) {
          return defaultParams;
        }
      } else if (pathTemplateParts[i] !== currentPathParts[i]) {
        return defaultParams;
      }
    }

    const route = appRoutes.get(pathTemplate);
    return { match: true, params, route, queryParams, routeParams: params };
  }).find((route) => route.match === true);

  return match ?? defaultParams;
}

export const registeredRoutes = new Set<string>();
export const dynamicRoutes = new Set<string>();
