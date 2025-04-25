import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export type BfPersonProps = {
  /** Primary e‑mail address used for login */
  email: string;
  /** Display name */
  name: string;
};

export class BfPerson extends BfNode<BfPersonProps> {
  /* ---------------------------------------------------------------------- */
  /* GraphQL spec                                                            */
  /* ---------------------------------------------------------------------- */
  static override gqlSpec = this.defineGqlNode((field) => {
    field.string("email");
    field.string("name");
  });
}
