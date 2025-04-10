/**
 * Main request handler for the collector service
 * Handles request capturing for OpenAI API calls
 */
import { PostHog } from "posthog-node";

const posthogApiKey = Deno.env.get("APPS_COLLECTOR_POSTHOG_API_KEY");
if (!posthogApiKey) {
  throw new Error("Missing PostHog API key");
}
// Create PostHog instance
const _posthog = new PostHog(posthogApiKey, {
  host: "https://app.posthog.com",
  flushInterval: 0,
});

export function handleRequest(_request: Request): Promise<Response> {
  // Return success
  return Promise.resolve(
    new Response(
      JSON.stringify({
        success: true,
        // request_id: requestId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    ),
  );
}
