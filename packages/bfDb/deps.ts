export * from "https://deno.land/x/djwt@v2.9.1/mod.ts";
// @deno-types="npm:@replit/object-storage"
import { Client } from "@replit/object-storage";
import { getLogger } from "deps.ts";
export { Readable } from "node:stream";
const logger = getLogger(import.meta);
const REPLIT_OBJECT_STORAGE_BUCKET_URL =
  "http://127.0.0.1:1106/object-storage/default-bucket";
const bucketId = await fetch(REPLIT_OBJECT_STORAGE_BUCKET_URL).then((res) =>
  res.json()
).then((obj) => obj.bucketId).catch(() =>
  logger.error("no object storage bucket detected")
);
export const objectStorageClient = bucketId ? new Client() : null;
