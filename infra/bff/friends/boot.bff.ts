import { register } from "infra/bff/mod.ts";

register(
  "boot",
  "initializes the repl with applicable options when the repl boots up",
  async () => {
    await Deno.remove(`${Deno.env.get("BF_PATH")!}/node_modules`, {
      recursive: true,
    });
    return 0;
  },
);
