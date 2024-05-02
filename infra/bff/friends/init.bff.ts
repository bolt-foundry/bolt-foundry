import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

//           git config --global url.https://${{ secrets.PAT }}@github.com/.insteadOf https://github.com/

register(
  "init",
  "Log in (using github) to begin development for the app.",
  async () => {
    const XDG_CONFIG_HOME = Deno.env.get("XDG_CONFIG_HOME")!;
    const REPL_SLUG = Deno.env.get("REPL_SLUG") ?? "";
    if (REPL_SLUG === "BF-Base") {
      throw new Error("Don't log into the base please! Fork instead.")
    }
    const cmd = ["gh", "auth", "login", "-p", "https", "-w", "-s", "user"];
    await runShellCommand(cmd, false);
    
    const usernameRawPromise = runShellCommandWithOutput([
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

    const [usernameRaw, emailRaw] = await Promise.all([
      usernameRawPromise,
      emailRawPromise,
    ]);

    const hostsYml = await Deno.readTextFile(
      `${XDG_CONFIG_HOME}/gh/hosts.yml`,
    );

    const token = hostsYml.split("oauth_token:")[1].trim().split("\n")[0];

    runShellCommand(["git", 'config', '--global', `url.https://${token}@github.com/.insteadOf`, 'https://github.com/'])
    const username = usernameRaw.trim();
    const email = emailRaw.trim();
    await runShellCommand([
      "sl",
      "config",
      "--user",
      "ui.username",
      `${username} <${email}>`,
    ]);
    await runShellCommand([
      "sl",
      "pull",
    ])
    return 0;
  },
);