import { assertEquals } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import { BfCurrentViewer } from "../BfCurrentViewer.ts";
import { BfGid, toBfGid } from "../BfNodeBase.ts";
import { BfNodeOnDisk } from "../../coreModels/BfNodeOnDisk.ts";

// Test specific implementation of BfNodeOnDisk
class TestNodeOnDisk extends BfNodeOnDisk<{
  name: string;
  value: number;
}> {
  static {
    this.setDataDirectory("./data/test");
  }
}

// Create mocks
const mockViewer = new BfCurrentViewer("test-user");

Deno.test("BfNodeOnDisk basic functionality", async () => {
  // Clean up test directory first if it exists
  if (await exists("./data/test")) {
    await Deno.remove("./data/test", { recursive: true });
  }

  // Test node creation
  const testNode = await TestNodeOnDisk.__DANGEROUS__createUnattached(
    mockViewer,
    { name: "Test Node", value: 42 },
  );

  // Verify node properties
  assertEquals(testNode.props.name, "Test Node");
  assertEquals(testNode.props.value, 42);

  // Test saving node
  await testNode.save();

  // Verify node was saved to disk
  const filePath = join(
    "./data/test",
    `${testNode.metadata.bfGid.toString()}.json`,
  );
  assertEquals(await exists(filePath), true);

  // Test loading node
  const loadedNode = await TestNodeOnDisk.findX(
    mockViewer,
    testNode.metadata.bfGid,
  );
  assertEquals(loadedNode.props.name, "Test Node");
  assertEquals(loadedNode.props.value, 42);

  // Test updating node
  loadedNode.props.name = "Updated Test Node";
  await loadedNode.save();

  // Test querying nodes
  const queryResult = await TestNodeOnDisk.query(mockViewer, {}, {
    name: "Updated Test Node",
  }, []);
  assertEquals(queryResult.length, 1);
  assertEquals(queryResult[0].props.name, "Updated Test Node");

  // Test deleting node
  const deleteResult = await testNode.delete();
  assertEquals(deleteResult, true);
  assertEquals(await exists(filePath), false);

  // Clean up
  await Deno.remove("./data/test", { recursive: true }).catch(() => {});
});
