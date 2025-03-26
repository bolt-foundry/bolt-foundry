import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

export async function bootstrapTestOrg() {
  const cv = BfCurrentViewer
    .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
      "test",
      "test",
    );
  logger.debug(cv);
  const person = await BfPerson.__DANGEROUS__createUnattached(cv, {});
  logger.debug(person);
  const org = await person.createTargetNode(BfOrganization, {});
  logger.debug(org);

  return { person, org, cv };
}
