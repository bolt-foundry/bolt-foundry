import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import {
  type E2ETestContext,
  setupE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

/**
 * Sets up e2e test for aibff GUI using pre-started server from environment
 */
export async function setupAibffGuiTest(): Promise<E2ETestContext> {
  const baseUrl = getConfigurationVariable("BF_E2E_AIBFF_GUI_URL") ||
    "http://localhost:8001";
  return await setupE2ETest({
    baseUrl,
  });
}
