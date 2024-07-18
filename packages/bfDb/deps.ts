export * from "https://deno.land/x/djwt@v2.9.1/mod.ts";
// @deno-types="npm:@replit/object-storage"
import { Client } from "@replit/object-storage";
export const objectStorageClient = new Client();