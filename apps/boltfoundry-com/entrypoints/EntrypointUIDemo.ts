import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const EntrypointUIDemo = iso(`
  field Query.EntrypointUIDemo {
    UIDemo
  }
`)(function EntrypointUIDemo({ data }) {
  const Body = data.UIDemo;
  logger.debug("UIDemo data", data);
  const title = "UI Demo - Bolt Foundry Design System";
  return { Body, title };
});
