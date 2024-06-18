

import { register } from "infra/bff/mod.ts";
import { __DANGEROUSLY_DESTROY_THE_DATABASE__ } from "packages/bfDb/utils.ts";
import { upsertBfDb } from "packages/bfDb/utils.ts";


register("db:reset", "Resets the db, but only in development mode", async () => {
  if (Deno.env.get("BF_ENV") === "DEVELOPMENT") {
    await __DANGEROUSLY_DESTROY_THE_DATABASE__("I KNOW THIS IS GOING TO DESTROY EVERYTHING AND I WANT TO DO THAT");
    await upsertBfDb();
    return 0;
  }
  return 1337
});