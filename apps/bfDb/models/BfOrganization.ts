import { getLogger } from "packages/logger/logger.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";

const _logger = getLogger(import.meta);

type Props = {
  name: string;
  settings: JSONValue;
};

export class BfOrganization extends BfNode<Props> {
  static gqlSpec = defineGqlNode((field, _relation, mutation) => {
    field.string("name");
    field.json("settings");

    mutation.update();
  });
}
