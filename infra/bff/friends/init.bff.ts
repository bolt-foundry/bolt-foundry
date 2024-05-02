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
    const HOME = Deno.env.get("HOME") ?? "";
    const REPL_SLUG = Deno.env.get("REPL_SLUG") ?? "";
    if (REPL_SLUG === "BF-Base") {
      throw new Error("Don't log into the base please! Fork instead.")
    }
    const ghTokenRaw = await runShellCommandWithOutput(["replit-git-askpass", "Password for 'https://token@github.com': "])
    const ghToken = ghTokenRaw.trim();
    Deno.env.set("GH_TOKEN", ghToken)
    
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
    const ghUsernameRawPromise = runShellCommandWithOutput([
      "gh",
      "api",
      "/user",
      "--jq",
      ".login",
    ]);
    const [usernameRaw, emailRaw, ghUsernameRaw] = await Promise.all([
      usernameRawPromise,
      emailRawPromise,
      ghUsernameRawPromise,
    ]);
    

    runShellCommand(["git", 'config', '--global', `url.https://${ghToken}@github.com/.insteadOf`, 'https://github.com/'])
    const username = usernameRaw.trim();
    const email = emailRaw.trim();
    const ghUsername = ghUsernameRaw.trim();
    await Deno.writeTextFile(
      `${HOME}/${REPL_SLUG}/.config/gh/hosts.yml`,
      // the spacing is very significant b/c yaml.
      `github.com:
    git_protocol: https
    oauth_token: ${ghToken}
    user: ${ghUsername}
  `,
      { create: true },
    );
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