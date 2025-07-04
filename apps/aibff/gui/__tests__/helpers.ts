import {
  type E2ETestContext,
  setupE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

/**
 * Sets up e2e test for aibff GUI with automatic server startup
 */
export async function setupAibffGuiTest(options: {
  headless?: boolean;
} = {}): Promise<E2ETestContext> {
  return await setupE2ETest({
    server: import.meta.resolve("../guiServer.ts"),
    headless: options.headless,
  });
}
