import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export function logoutHandler(_req: Request): Response {
  logger.info("Logout request received");

  // Clear session cookies
  const headers = new Headers();

  // Clear access token cookie
  headers.append(
    "Set-Cookie",
    `access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );

  // Clear refresh token cookie
  headers.append(
    "Set-Cookie",
    `refresh_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}
