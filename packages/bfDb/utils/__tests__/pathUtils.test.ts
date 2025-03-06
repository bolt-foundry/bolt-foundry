
import { assertEquals } from "@std/assert";
import { pathToBfGid, bfGidToPath } from "packages/bfDb/utils/pathUtils.ts";
import { join } from "@std/path";

Deno.test("pathUtils - pathToBfGid and bfGidToPath", () => {
  const testPath = join(Deno.cwd(), "content/test");
  
  // Test converting path to BfGid
  const bfGid = pathToBfGid(testPath);
  assertEquals(typeof bfGid.toString(), "string", "BfGid should convert to string");
  
  // Verify the BfGid contains file:// scheme (either directly or URL encoded)
  const idString = bfGid.toString();
  const hasFileScheme = idString.startsWith("file://") || 
                       idString.includes("file%3A%2F%2F");
  assertEquals(hasFileScheme, true, "BfGid should contain file:// scheme");
  
  // Test converting back from BfGid to path
  const roundTripPath = bfGidToPath(bfGid);
  assertEquals(roundTripPath, testPath, "Path should round-trip correctly");
});
