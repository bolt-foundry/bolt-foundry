import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

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
    // await runShellCommand([
    //   "sl",
    //   "goto",
    //   "main",
    // ]);
    const localhostUrl = `http://localhost:8283/${
      Deno.env.get("REPLIT_SESSION")
    }/files/open-multiple`;

    const vscodeUrl = `vscode://vscode-remote/ssh-remote+${
      Deno.env.get("REPL_ID")
    }@${Deno.env.get("REPLIT_DEV_DOMAIN")}:22${Deno.env.get("REPL_HOME")}`;

    await fetch(localhostUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [vscodeUrl],
      }),
    });
    return 0;
  },
);
