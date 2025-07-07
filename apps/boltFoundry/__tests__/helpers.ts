import {
  type E2ETestContext,
  setupE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

/**
 * Sets up e2e test for boltFoundry (DEPRECATED - these tests are disabled)
 */
export async function setupBoltFoundryTest(): Promise<E2ETestContext> {
  throw new Error(
    "boltFoundry e2e tests are disabled. These legacy tests are no longer maintained. " +
      "Please use the newer boltfoundry-com tests instead.",
  );
}
