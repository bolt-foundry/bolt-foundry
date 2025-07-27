import { assertEquals } from "@std/assert";
import {
  assetUploadCommand,
  calculateHash,
  getMimeType,
} from "../asset-upload.bft.ts";

Deno.test("asset-upload: shows help when --help flag is used", async () => {
  const exitCode = await assetUploadCommand(["--help"]);
  assertEquals(exitCode, 0);
});

Deno.test("asset-upload: returns error when no files specified", async () => {
  const exitCode = await assetUploadCommand([]);
  assertEquals(exitCode, 1);
});

Deno.test("asset-upload: handles non-existent file", async () => {
  const exitCode = await assetUploadCommand(["/non/existent/file.txt"]);
  assertEquals(exitCode, 1);
});

Deno.test("calculateHash: generates consistent 8-character hashes", async () => {
  const testData1 = new TextEncoder().encode("Hello, World!");
  const testData2 = new TextEncoder().encode("Hello, World!");
  const testData3 = new TextEncoder().encode("Different content");

  const hash1 = await calculateHash(testData1);
  const hash2 = await calculateHash(testData2);
  const hash3 = await calculateHash(testData3);

  // Same content should produce same hash
  assertEquals(hash1, hash2);

  // Different content should produce different hash
  assertEquals(hash1 === hash3, false);

  // Hash should be 8 characters long
  assertEquals(hash1.length, 8);
  assertEquals(hash3.length, 8);

  // Hash should be hexadecimal
  assertEquals(/^[0-9a-f]{8}$/.test(hash1), true);
  assertEquals(/^[0-9a-f]{8}$/.test(hash3), true);
});

Deno.test("asset-upload: handles missing credentials", async () => {
  // Ensure no credentials are set
  Deno.env.delete("S3_ACCESS_KEY");
  Deno.env.delete("S3_SECRET_KEY");

  const testFile = await Deno.makeTempFile({
    prefix: "test-asset-",
    suffix: ".txt",
  });
  await Deno.writeTextFile(testFile, "Test content");

  try {
    const exitCode = await assetUploadCommand([testFile]);
    // Should fail due to missing credentials
    assertEquals(exitCode, 1);
  } finally {
    await Deno.remove(testFile);
  }
});

Deno.test("getMimeType: detects correct MIME types", () => {
  // Image types
  assertEquals(getMimeType("photo.jpg"), "image/jpeg");
  assertEquals(getMimeType("photo.jpeg"), "image/jpeg");
  assertEquals(getMimeType("icon.png"), "image/png");
  assertEquals(getMimeType("animation.gif"), "image/gif");
  assertEquals(getMimeType("modern.webp"), "image/webp");
  assertEquals(getMimeType("logo.svg"), "image/svg+xml");

  // Video types
  assertEquals(getMimeType("video.mp4"), "video/mp4");
  assertEquals(getMimeType("video.webm"), "video/webm");

  // Document types
  assertEquals(getMimeType("document.pdf"), "application/pdf");
  assertEquals(getMimeType("readme.txt"), "text/plain");
  assertEquals(getMimeType("README.md"), "text/markdown");

  // Unknown types
  assertEquals(getMimeType("file.unknown"), "application/octet-stream");
  assertEquals(getMimeType("noextension"), "application/octet-stream");

  // Case insensitive
  assertEquals(getMimeType("IMAGE.PNG"), "image/png");
  assertEquals(getMimeType("VIDEO.MP4"), "video/mp4");
});
