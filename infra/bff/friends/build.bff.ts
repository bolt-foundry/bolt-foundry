import { build } from "infra/build/build.ts";
import { register } from "infra/bff/mod.ts";

register("build", "Builds the client.", async (_options) => {await build(); return 0;})