import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

export async function bfLlmRouter(req: Request): Promise<Response> {
  logger.debug("bfLlmRouter called");

  try {
    const url = new URL(req.url);
    const openRouterUrl = new URL(
      `https://openrouter.ai${url.pathname}${url.search}`,
    );

    const headers = new Headers(req.headers);

    const openRouterRequest = new Request(openRouterUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      redirect: "follow",
    });

    const response = await fetch(openRouterRequest);

    return response;
  } catch (error) {
    logger.error("Error in bfLlmRouter:", error);
    return new Response(
      JSON.stringify({ error: "Couldn't connect to upstream provider" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
