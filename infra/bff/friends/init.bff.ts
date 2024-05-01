import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "init",
  "Log in (using github) to begin development for the app.",
  async () => {
    const HOME = Deno.env.get("HOME") ?? "";
    const REPL_SLUG = Deno.env.get("REPL_SLUG") ?? "";
    if (REPL_SLUG === "BF-Base") {
      throw new Error("Don't log into the base please! Fork instead.")
    }
    await Deno.writeTextFile(
      `${HOME}/${REPL_SLUG}/.config/gh/hosts.yml`,
      // the spacing is very significant b/c yaml.
      `github.com:
    git_protocol: https
  `,
      { create: true },
    );
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
    const username = usernameRaw.trim();
    const email = emailRaw.trim();
    await runShellCommand([
      "sl",
      "config",
      "--user",
      "ui.username",
      `${username} <${email}>`,
    ]);
    return 0;
  },
);
