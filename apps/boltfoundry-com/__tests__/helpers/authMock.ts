import type { Page } from "puppeteer-core";

/**
 * Sets up Google OAuth mock for E2E tests
 * Call this before navigation to mock authentication
 */
export async function setupGoogleOAuthMock(page: Page): Promise<void> {
  // Mock Google OAuth requests
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const url = req.url();

    // Block Google Identity Services JS and replace with mock
    if (url.startsWith("https://accounts.google.com/gsi/client")) {
      return req.respond({
        status: 200,
        contentType: "text/javascript",
        body: "",
      });
    }

    // Mock Google's tokeninfo endpoint for backend authentication
    if (url.startsWith("https://oauth2.googleapis.com/tokeninfo")) {
      return req.respond({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          email: "demo@example.com",
          email_verified: true,
          sub: "123456789",
          hd: "example.com",
          name: "Demo User",
        }),
      });
    }

    req.continue();
  });

  // Inject Google OAuth mock into page
  await page.evaluateOnNewDocument(() => {
    let interceptedCallback:
      | ((response: { credential: string; select_by: string }) => void)
      | undefined;

    (globalThis as { google?: unknown }).google = {
      accounts: {
        id: {
          initialize({ callback }: {
            callback: (
              response: { credential: string; select_by: string },
            ) => void;
          }) {
            interceptedCallback = callback;
          },
          renderButton(el: HTMLElement) {
            el.innerHTML =
              '<button id="mock-google-signin" style="padding: 12px 24px; border: 1px solid #dadce0; border-radius: 4px; background: white; cursor: pointer; font-size: 16px; font-weight: 500; font-family: system-ui, -apple-system, sans-serif; color: #3c4043; min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 8px;">🔧 Sign in with Google (mocked for test)</button>';
            el.querySelector("button")?.addEventListener("click", () => {
              interceptedCallback?.({
                credential: "mock.jwt.token.for.testing",
                select_by: "btn",
              });
            });
          },
          prompt() {},
          disableAutoSelect() {},
        },
      },
    };
  });
}

/**
 * Attempts to login if a login button is present
 * Returns true if login was attempted, false if already logged in
 */
export async function attemptLogin(context: {
  page: Page;
  smoothClickText: (text: string) => Promise<void>;
  smoothWait: (duration: number) => Promise<void>;
}): Promise<boolean> {
  const pageText = await context.page.evaluate(() => document.body.innerText);
  const needsLogin = pageText.includes("Sign In") ||
    pageText.includes("Sign in with Google");

  if (needsLogin) {
    // Click the mocked Google Sign-In button
    await context.smoothClickText("Sign in with Google (mocked for test)");

    await context.smoothWait(2000);

    // Wait for authentication and page reload
    await context.page.waitForNetworkIdle({ timeout: 5000 });
    return true;
  }

  return false;
}
