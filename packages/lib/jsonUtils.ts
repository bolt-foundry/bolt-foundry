import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (_e) {
    logger.error("Invalid JSON", jsonString);
    return false;
  }
}
