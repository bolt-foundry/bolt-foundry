import { build } from "infra/build/build.ts";
import { register } from "infra/bff/mod.ts";
import { buildNix } from "infra/bff/friends/nix.bff.ts";
import { buildRelay } from "infra/bff/friends/relay.bff.ts";
import { buildVcs } from "infra/bff/friends/vcs.bff.ts";

register("build", "Builds the client.", async (_options) => {
  await build();
  return 0;
});

register(
  "build:deploy",
  "build the client and include building the environment",
  async (_options) => {
    await buildRelay();
    await build();
    await buildVcs();
    return 0;
  },
);
