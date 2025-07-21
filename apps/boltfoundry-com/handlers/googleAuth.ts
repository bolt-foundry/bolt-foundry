import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { getLogger } from "@bolt-foundry/logger";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { setLoginSuccessHeaders } from "@bfmono/apps/bfDb/graphql/utils/graphqlContextUtils.ts";

const logger = getLogger(import.meta);

export async function handleGoogleAuthRequest(
  request: Request,
): Promise<Response> {
  try {
    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Parse request body
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid idToken" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    logger.info("Processing Google authentication request");

    // Check if this is a test token for E2E testing (only in E2E test mode)
    if (
      idToken === "mock.jwt.token.for.testing" &&
      getConfigurationVariable("BF_E2E_MODE") === "true"
    ) {
      logger.info(
        "🧪 Detected E2E test token in E2E mode, using mock authentication",
      );

      // Set mock authentication cookies for testing
      const headers = new Headers({ "Content-Type": "application/json" });
      headers.append(
        "Set-Cookie",
        "bf_access=mock-access-token; HttpOnly; SameSite=Lax; Path=/; Max-Age=900",
      );
      headers.append(
        "Set-Cookie",
        "bf_refresh=mock-refresh-token; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000",
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: "E2E test authentication successful",
          redirectTo: "/",
        }),
        {
          status: 200,
          headers,
        },
      );
    }

    // Use the existing CurrentViewer.loginWithGoogleToken method
    // This handles Google token verification, user creation, and returns authenticated viewer
    const viewer = await CurrentViewer.loginWithGoogleToken(idToken);

    // If we get here, authentication was successful (loginWithGoogleToken throws on failure)
    logger.info("Google authentication successful", {
      personGid: viewer.personBfGid,
      orgOid: viewer.orgBfOid,
    });

    // Set authentication cookies using the existing utility
    const headers = new Headers({ "Content-Type": "application/json" });
    await setLoginSuccessHeaders(headers, viewer.personBfGid, viewer.orgBfOid);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Authentication successful",
        redirectTo: "/", // Redirect to home page after successful login
      }),
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    logger.error("Google authentication error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
