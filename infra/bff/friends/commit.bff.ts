import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";
import { getLogger } from "packages/logger/logger.ts";
import { generateBluey } from "lib/generateBluey.ts";

const logger = getLogger(import.meta);

async function openSapling() {
  const output = await runShellCommandWithOutput([
    "sl",
    "web",
    "--json",
  ]);
  const json = JSON.parse(output);
  const url = new URL(json.url);

  const localhostUrl = `http://localhost:8283/${
    Deno.env.get("REPLIT_SESSION")
  }/files/open-multiple`;

  await fetch(localhostUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls: [url],
    }),
  });

  logger.info(
    generateBluey(
      `Click this: ${url.protocol}//${url.host} \n \n and then paste this \n \n ${url.search} \n \n to get to sapling`,
    ),
  );
}

register(
  "commit",
  "Get ready to send your work to github",
  async () => {
    const XDG_CONFIG_HOME = Deno.env.get("XDG_CONFIG_HOME")!;
    const REPL_SLUG = Deno.env.get("REPL_SLUG") ?? "";
    const HOME = Deno.env.get("HOME") ?? "";

    if (REPL_SLUG === "Bolt-Foundry-Base") {
      throw new Error("Don't log into the base please! Fork instead.");
    }

    const saplingConfig = await runShellCommandWithOutput(["sl", "config"]);
    if (saplingConfig.includes("ui.username=")) {
      logger.info("You are already logged in to sapling, opening isl now");
      await openSapling();
      return 0;
    }

    const cmd = ["gh", "auth", "login", "-p", "https", "-w", "-s", "user"];
    await runShellCommand(cmd, undefined, false);

    const nameRawPromise = runShellCommandWithOutput([
      "gh",
      "api",
      "/user",
      "--jq",
      ".name",
    ]);

    const emailRawPromise = runShellCommandWithOutput([
      "gh",
      "api",
      "/user/emails",
      "--jq",
      '.[] | select(.email | contains("boltfoundry.com")) | .email',
    ]);

    const [nameRaw, emailRaw] = await Promise.all([
      nameRawPromise,
      emailRawPromise,
    ]);

    const hostsYml = await Deno.readTextFile(
      `${XDG_CONFIG_HOME}/gh/hosts.yml`,
    );

    // who needs a yaml parser when you live on the edge?
    const token = hostsYml.split("oauth_token:")[1].trim().split("\n")[0];
    let name = nameRaw.trim();
    if (name == "") {
      logger.warn(
        "\n Github user should create a display name on their profile page.\n",
      );
      name = "unknown Bolt Foundry Replit contributor";
    }
    const email = emailRaw.trim() ?? "unknown@boltfoundry.com";
    const gitFile = `${XDG_CONFIG_HOME}/git/config`;
    try {
      await Deno.remove(gitFile);
    } catch {
      logger.info("no git config file");
    }
    await Promise.all([
      runShellCommand([
        "git",
        "config",
        "--file",
        gitFile,
        `url.https://${token}@github.com/.insteadOf`,
        "https://github.com/",
      ]),
      runShellCommand([
        "sl",
        "config",
        "--user",
        "ui.username",
        `${name} <${email}>`,
      ]),
      runShellCommand([
        "ln",
        "-s",
        `${HOME}/${REPL_SLUG}/.local`,
        `${HOME}/.local`,
      ]),
    ]);
    await runShellCommand([
      "sl",
      "config",
      "--user",
      "github.preferred_submit_command",
      "pr",
    ]);
    await runShellCommand([
      "sl",
      "pull",
    ]);

    await openSapling();

    return 0;
  },
);
