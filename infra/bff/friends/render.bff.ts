import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { parse } from "std/flags/mod.ts";

import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

async function render(args) {
  const options = parse(args);
  let inputVideo = options.i;
  if (inputVideo) {
    logger.info("Using input video:", inputVideo);
  } else {
    inputVideo = "../example-data/short_clip.mp4";
    logger.info("No input video specified (-i), using default:", inputVideo)
  }

  logger.info("Rendering");
  const stopSpinner = startSpinner();

  const cwd = new URL(
    import.meta.resolve("packages/vcs/cli-render/bf-vcscut-tools"),
  );

  const renderCmd = new Deno.Command("direnv", {
    args: ["exec", cwd.pathname, "npm", "run", "render", inputVideo],
    stdout: "inherit",
    stderr: "inherit",
    cwd,
  });
  const { code } = await renderCmd.output();

  stopSpinner();
  return code;
}

register(
  "render",
  "renders vcs composition",
  render,
);
