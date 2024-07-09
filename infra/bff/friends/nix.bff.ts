import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

export function buildNix(profile = ".") {
  return runShellCommand([
    "nix",
    "build",
    profile,
    "--out-link",
    "build/system",
  ]);
}

register("nix", "Builds the current nix system using flake.nix", () => {
  return buildNix();
});

register(
  "nix:deploy",
  "Builds the current nix system using flake.nix with only deployment packages",
  () => {
    return buildNix(".#deploy");
  },
);
