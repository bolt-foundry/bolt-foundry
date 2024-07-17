import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export async function buildVcs(_args?: Array<string>) {
  const stopSpinner = startSpinner();

  const cwd = new URL(
    import.meta.resolve("thirdParty/daily-vcs-main/js"),
  );
  // yarn install
  const installCmd = new Deno.Command("yarn", {
    args: ["install"],
    stdout: "inherit",
    stderr: "inherit",
    env: Deno.env.toObject(),
    cwd,
  });
  await installCmd.output();

  // yarn build-composition-module-for-web dev:bf
  const buildCmd = new Deno.Command("yarn", {
    args: ["build-composition-module-for-web", "dev:bf"],
    stdout: "inherit",
    stderr: "inherit",
    cwd,
  });
  const { code } = await buildCmd.output();
  const source = `${cwd.pathname}/dist/dev_bf.bundle.js`;
  const destination = `${Deno.env.get("BF_PATH")}/resources/dev_bf.bundle.js`;
  await Deno.rename(source, destination);
  stopSpinner();
  return code;
}

register(
  "vcs",
  "Build VCS",
  buildVcs,
);
