import {
  runShellCommand,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register("nix", "Builds the current nix system using flake.nix", () => {
  return runShellCommand(["nix", "build", "--out-link", "build/system"]);
})