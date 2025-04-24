import { getLogger } from "packages/logger/logger.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";
import { BfPerson } from "apps/bfDb/models/BfPerson.ts";

const _logger = getLogger(import.meta);

type Props = {
  name: string;
  settings: Record<string, JSONValue>;
};

export class BfOrganization extends BfNode<Props> {
  static override gqlSpec = this.defineGqlNode((field, relation) => {
    field.string("name");
    field.json("settings");

    relation.many("person", () => BfPerson);
  });
}
