import {
  type E2ETestContext,
  setupE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

export async function setupBoltFoundryComTest(options: {
  headless?: boolean;
} = {}): Promise<E2ETestContext> {
  return await setupE2ETest({
    server: import.meta.resolve("../server.ts"),
    headless: options.headless,
  });
}
