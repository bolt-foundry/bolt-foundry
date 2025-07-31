import { matchRouteWithParams } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";
import type { Handler } from "@bfmono/apps/web/web.tsx";

/**
 * Matches a route path to a handler and handles any redirects
 * Returns [handler, routeParams, needsRedirect, redirectTo]
 */
export function matchRoute(
  pathWithParams: string,
  routes: Map<string, Handler>,
  defaultRoute: Handler,
): [Handler, Record<string, string>, boolean, string?] {
  const match = matchRouteWithParams(pathWithParams);
  const matchedHandler = routes.get(match.pathTemplate) || defaultRoute;
  const routeParams = match.routeParams;
  const needsRedirect = match.needsRedirect;
  const redirectTo = match.redirectTo;
  return [matchedHandler, routeParams, needsRedirect, redirectTo];
}

/**
 * Handles a request after route matching
 */
export async function handleMatchedRoute(
  req: Request,
  pathWithParams: string,
  routes: Map<string, Handler>,
  defaultRoute: Handler,
): Promise<Response> {
  const [handler, routeParams, needsRedirect, redirectTo] = matchRoute(
    pathWithParams,
    routes,
    defaultRoute,
  );

  if (needsRedirect && redirectTo) {
    // Canonicalize trailing slash mismatch with a permanent redirect
    const redirectUrl = new URL(redirectTo, req.url);
    return Response.redirect(redirectUrl, 301);
  }

  return await handler(req, routeParams);
}
