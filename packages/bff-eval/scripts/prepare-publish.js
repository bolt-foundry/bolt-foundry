#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read package.json
const packagePath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

// Save original for restoration
const originalPkg = JSON.stringify(pkg, null, 2);
fs.writeFileSync(packagePath + ".backup", originalPkg);

// Replace local dependencies with published versions
if (pkg.dependencies) {
  if (pkg.dependencies["@bolt-foundry/bolt-foundry"] === "dev") {
    pkg.dependencies["@bolt-foundry/bolt-foundry"] = "^0.1.0"; // Use appropriate version
  }
  if (pkg.dependencies["@bolt-foundry/bolt-foundry"]?.startsWith("file:")) {
    pkg.dependencies["@bolt-foundry/bolt-foundry"] = "^0.1.0"; // Use appropriate version
  }
}

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");

console.log("✅ Updated package.json for publishing");
