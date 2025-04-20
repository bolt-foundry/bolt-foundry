import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger/logger.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";

const _logger = getLogger(import.meta);

export type BfPersonProps = {
  name: string;
};

export class BfPerson extends BfNode<BfPersonProps> {
  static gqlSpec = defineGqlNode((field, _relation, mutation) => {
    field.string("name");

    mutation.update();
  });
}
