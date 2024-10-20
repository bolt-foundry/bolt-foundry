import { build as slimBuild } from "infra/build/slimBuild.ts";
import { register } from "infra/bff/mod.ts";
import { buildRelay } from "infra/bff/friends/relay.bff.ts";
import { buildVcs } from "infra/bff/friends/vcs.bff.ts";
import { ci } from "infra/bff/friends/ci.bff.ts";

register("build", "Builds the client.", async (_options) => {
  await slimBuild();
  return 0;
});

register(
  "build:deploy",
  "build the client and include building the environment",
  async (_options) => {
    const mappedSlimBuild = async () => {
      try {
        await slimBuild();
        return 0;
      } catch {
        return 1;
      }
    };

    const fnsToRun = [buildRelay, mappedSlimBuild, buildVcs];
    for (const fn of fnsToRun) {
      const code = await fn();
      if (code !== 0) {
        return code;
      }
    }
    return 0;
  },
);
