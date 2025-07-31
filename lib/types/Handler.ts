/**
 * Handler type for HTTP request handlers
 */
export type Handler = (
  request: Request,
  routeParams: Record<string, string>,
) => Promise<Response> | Response;
