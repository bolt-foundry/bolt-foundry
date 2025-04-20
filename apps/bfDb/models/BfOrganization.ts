import { getLogger } from "packages/logger/logger.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";

const _logger = getLogger(import.meta);

/**
 * Properties stored on a BfOrganization node.
 * (Kept identical to previous definition so there are no breaking changes.)
 */
type Props = {
  name: string;
  /** JSON object containing the organization's settings */
  settings: JSONValue;
};

export class BfOrganization extends BfNode<Props> {
  /** GraphQL specification for this node */
  static override gqlSpec = defineGqlNode((field, _relation, mutation) => {
    /* -------------------- fields -------------------- */
    field.string("name");
    field.json("settings");
    /* ------------------- mutations ------------------ */
    mutation.update();
  });
}
