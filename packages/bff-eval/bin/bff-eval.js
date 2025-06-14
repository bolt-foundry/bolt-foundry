#!/usr/bin/env node

// Forward all arguments to "bff eval" command
const { spawn } = require("child_process");

// Get all arguments after the script name
const args = ["eval", ...process.argv.slice(2)];

// Spawn the bff command with all arguments
const bff = spawn("bff", args, {
  stdio: "inherit",
  shell: true,
});

// Forward the exit code
bff.on("exit", (code) => {
  process.exit(code || 0);
});

// Handle errors
bff.on("error", (err) => {
  console.error(`Failed to execute bff eval: ${err.message}`);
  process.exit(1);
});
