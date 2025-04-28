import { BfPerson } from "apps/bfDb/models/BfPerson.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";
import { getLogger } from "packages/logger/logger.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
const logger = getLogger(import.meta);

export async function bootstrapTestOrg() {
  const cv = CurrentViewer
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
