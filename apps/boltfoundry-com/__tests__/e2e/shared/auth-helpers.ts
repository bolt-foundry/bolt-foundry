import type { E2ETestContext } from "@bfmono/infra/testing/e2e/setup.ts";
import { navigateTo } from "@bfmono/infra/testing/e2e/setup.ts";
import { smoothClick } from "@bfmono/infra/testing/video-recording/smooth-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface AuthState {
  hasAuthCookies: boolean;
  hasLogoutButton: boolean;
  cookieNames: string[];
  isAuthenticated: boolean;
  currentUrl: string;
}

/**
 * Performs dev mode authentication for e2e tests
 */
export async function performDevAuth(
  context: E2ETestContext,
): Promise<boolean> {
  logger.info("🔐 Performing dev mode authentication");

  // Navigate to login page
  await navigateTo(context, "/login");
  await context.page.waitForNetworkIdle({ timeout: 3000 });

  // Check if Dev Auth button exists
  const devButtonExists = await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.some((btn) => btn.textContent?.includes("Dev Mode Sign In"));
  });

  if (!devButtonExists) {
    logger.info(
      "❌ Dev Auth button not found - ensure BF_E2E_MODE=true is set",
    );
    return false;
  }

  // Add a data attribute to make the button easier to select
  await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const devButton = buttons.find((btn) =>
      btn.textContent?.includes("Dev Mode Sign In")
    );
    if (devButton) {
      devButton.setAttribute("data-testid", "dev-auth-button");
    }
  });

  // Use smooth click for natural interaction
  await smoothClick(context, '[data-testid="dev-auth-button"]');
  logger.info("✅ Clicked Dev Auth button");

  // Wait for navigation or auth response
  await context.page.waitForNetworkIdle({ timeout: 5000 });

  return true;
}

/**
 * Verifies the current authentication state
 */
export async function verifyAuthState(
  context: E2ETestContext,
): Promise<AuthState> {
  const cookies = await context.page.cookies();
  const authCookies = cookies.filter((cookie) =>
    cookie.name === "bf_access" || cookie.name === "bf_refresh"
  );

  const hasLogoutButton = await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.some((btn) => btn.textContent?.includes("Logout"));
  });

  const currentUrl = context.page.url();
  const hasAuthCookies = authCookies.length > 0;
  const isAuthenticated = hasAuthCookies && hasLogoutButton;

  logger.info(
    `📊 Auth State: ${isAuthenticated ? "Authenticated" : "Not Authenticated"}`,
  );
  if (hasAuthCookies) {
    logger.info(
      `   🍪 Auth cookies: ${authCookies.map((c) => c.name).join(", ")}`,
    );
  }
  if (hasLogoutButton) {
    logger.info(`   🔘 Logout button: Present`);
  }
  logger.info(`   📍 Current URL: ${currentUrl}`);

  return {
    hasAuthCookies,
    hasLogoutButton,
    cookieNames: authCookies.map((c) => c.name),
    isAuthenticated,
    currentUrl,
  };
}

/**
 * Checks if the login UI elements are present
 */
export async function verifyLoginPageElements(
  context: E2ETestContext,
): Promise<{
  hasGoogleSignIn: boolean;
  hasDevAuth: boolean;
  pageTitle: string;
}> {
  await navigateTo(context, "/login");
  await context.page.waitForNetworkIdle({ timeout: 3000 });

  const pageTitle = await context.page.title();

  const hasGoogleSignIn = await context.page.evaluate(() => {
    // Check for Google Sign In button by text content
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.some((btn) =>
      btn.textContent?.includes("Sign in with Google")
    );
  });

  const hasDevAuth = await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.some((btn) => btn.textContent?.includes("Dev Mode Sign In"));
  });

  return {
    hasGoogleSignIn,
    hasDevAuth,
    pageTitle,
  };
}

/**
 * Tests protected route access
 */
export async function testProtectedRouteAccess(
  context: E2ETestContext,
  protectedPath: string = "/dash",
): Promise<{
  wasRedirected: boolean;
  finalUrl: string;
  statusCode?: number;
}> {
  const currentUrl = context.page.url();
  const baseUrl = currentUrl.substring(0, currentUrl.indexOf("/", 8)); // Extract base URL
  const response = await context.page.goto(
    `${baseUrl}${protectedPath}`,
    { waitUntil: "networkidle2" },
  );

  const finalUrl = context.page.url();
  const wasRedirected = !finalUrl.includes(protectedPath);

  return {
    wasRedirected,
    finalUrl,
    statusCode: response?.status(),
  };
}

/**
 * Performs logout action
 */
export async function performLogout(context: E2ETestContext): Promise<boolean> {
  const hasLogoutButton = await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const logoutButton = buttons.find((btn) =>
      btn.textContent?.includes("Logout")
    );
    if (logoutButton) {
      logoutButton.setAttribute("data-testid", "logout-button");
      return true;
    }
    return false;
  });

  if (!hasLogoutButton) {
    logger.info("❌ Logout button not found");
    return false;
  }

  await smoothClick(context, '[data-testid="logout-button"]');
  await context.page.waitForNetworkIdle({ timeout: 3000 });

  logger.info("✅ Clicked logout button");
  return true;
}
