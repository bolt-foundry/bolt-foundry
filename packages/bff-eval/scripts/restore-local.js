#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Restore from backup
const packagePath = path.join(__dirname, "..", "package.json");
const backupPath = packagePath + ".backup";

if (fs.existsSync(backupPath)) {
  const backup = fs.readFileSync(backupPath, "utf8");
  fs.writeFileSync(packagePath, backup);
  fs.unlinkSync(backupPath);
  console.log("✅ Restored local package.json");
} else {
  console.log("⚠️  No backup found");
}
