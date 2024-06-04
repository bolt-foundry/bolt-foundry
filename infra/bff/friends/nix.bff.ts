import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

export function buildNix() {
  return runShellCommand(["nix", "build", "--out-link", "build/system"]);
}

register("nix", "Builds the current nix system using flake.nix", () => {
  return buildNix();
});
