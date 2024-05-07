import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "commit",
  "Get ready to send your work to github",
  async () => {
    const XDG_CONFIG_HOME = Deno.env.get("XDG_CONFIG_HOME")!;
    const REPL_SLUG = Deno.env.get("REPL_SLUG") ?? "";
    
    if (REPL_SLUG === "BF-Base") {
      throw new Error("Don't log into the base please! Fork instead.")
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

    const usernameRawPromise = runShellCommandWithOutput([
      "gh",
      "api",
      "/user",
      "--jq",
      ".login",
    ]);
    
    const emailRawPromise = runShellCommandWithOutput([
      "gh",
      "api",
      "/user/emails",
      "--jq",
      '.[] | select(.email | contains("boltfoundry.com")) | .email',
    ]);

    const [nameRaw, emailRaw, usernameRaw] = await Promise.all([
      nameRawPromise,
      emailRawPromise,
      usernameRawPromise
    ]);

    const hostsYml = await Deno.readTextFile(
      `${XDG_CONFIG_HOME}/gh/hosts.yml`,
    );

    // who needs a yaml parser when you live on the edge?
    const token = hostsYml.split("oauth_token:")[1].trim().split("\n")[0];
    const name = nameRaw.trim();
    const email = emailRaw.trim();
    const username = usernameRaw.trim();
    await runShellCommand([
      "git",
      "config",
      "--file",
      `${XDG_CONFIG_HOME}/git/config`,
      `url.https://${username}:${token}@github.com/.insteadOf`,
      "https://github.com/",
    ],);
    
    await runShellCommand([
      "sl",
      "config",
      "--user",
      "ui.username",
      `${name} <${email}>`,
    ]);
    await runShellCommand([
      "sl",
      "pull",
    ]);
    await runShellCommand([
      "sl",
      "goto",
      "main",
    ]);
    const localhostUrl = `http://localhost:8283/${Deno.env.get("REPLIT_SESSION")}/files/open-multiple`;
    const vscodeUrl = `vscode://vscode-remote/ssh-remote+${Deno.env.get("REPL_ID")}@ssh.${Deno.env.get("REPLIT_CLUSTER")}.replit.dev:22/${Deno.env.get("HOME")}/${REPL_SLUG}/bolt-foundry`;
    
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
