import {
  type E2ETestContext,
  setupE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

/**
 * Sets up e2e test for boltfoundry-com
 * Requires server to be pre-started by bft e2e via the server registry
 */
export async function setupBoltFoundryComTest(): Promise<E2ETestContext> {
  // Check if bft e2e has started the server
  const preStartedUrl = Deno.env.get("BF_E2E_BOLTFOUNDRY_COM_URL");

  if (preStartedUrl) {
    // Use the pre-started server from bft e2e
    return await setupE2ETest({
      baseUrl: preStartedUrl,
    });
  } else {
    // No server available - this test must be run through bft e2e
    throw new Error(
      `boltfoundry-com server not found. This test requires the server to be started by 'bft e2e' ` +
        `which will automatically start required servers based on the registry. ` +
        `Please run: bft e2e ${import.meta.url.split("/").pop()}`,
    );
  }
}
