import { register } from "infra/bff/mod.ts";

register(
  "boot",
  "initializes the repl with applicable options when the repl boots up",
  () => {
    return 0;
  },
);
