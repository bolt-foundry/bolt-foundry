#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net --allow-run

// Run npm dev for the Next.js sample app
const cmd = new Deno.Command("npm", {
  args: ["run", "dev"],
  cwd: import.meta.dirname,
});

const child = cmd.spawn();
await child.status;
