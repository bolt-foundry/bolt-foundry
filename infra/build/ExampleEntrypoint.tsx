import * as React from "react";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export function ExampleEntrypoint() {
  logger.info("Hello world!");
  return <div>yo</div>;
}
