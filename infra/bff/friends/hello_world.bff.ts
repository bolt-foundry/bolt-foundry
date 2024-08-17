import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

const HELLO_NAME = Deno.env.get("HELLO_NAME")

export function helloWorld(name = HELLO_NAME) {
  return runShellCommand([
    "echo",
    "Hello " + (name === undefined ? "world" : name) + "!"
  ]);
}

register("helloWorld", "Hello world to acclimate with bff sys", () => {
  return helloWorld();
});

register(
//  "",
  "Hello world to acclimate with the bff system",
  () => {
    return helloWorld();
  },
);
