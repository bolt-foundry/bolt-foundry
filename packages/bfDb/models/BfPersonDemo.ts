import { getLogger } from "packages/logger.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfErrorDb } from "packages/bfDb/classes/BfErrorDb.ts";
import { generateUUID } from "lib/generateUUID.ts";

const logger = getLogger(import.meta);

export class BfPersonDemo extends BfPerson {
  /**
   * Creates or finds a demo person for the given current viewer
   * Each demo person has a unique identity with a dedicated organization
   */
  static async registerDemoPerson(cv: BfCurrentViewer): Promise<BfPersonDemo> {
    try {
      logger.debug("Creating demo person");

      // Generate a unique email for this demo user
      const uniqueId = generateUUID().substring(0, 8);
      const demoEmail = `${uniqueId}@contentfoundry.demo`;

      // Create the demo person
      const demoPerson = await BfPersonDemo.__DANGEROUS__createUnattached(cv, {
        name: demoEmail,
      });

      logger.debug(`Created demo person with ID: ${demoPerson.metadata.bfGid}`);

      return demoPerson;
    } catch (error) {
      logger.error("Error creating demo person:", error);
      throw new BfErrorDb("Failed to create demo person");
    }
  }
}
