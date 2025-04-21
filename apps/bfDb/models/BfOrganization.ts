import { getLogger } from "packages/logger/logger.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";

const _logger = getLogger(import.meta);

export type BfOrganizationProps = {
  /** Human‑readable organization name */
  name: string;
  /** Primary GoogleWorkspace domain (e.g. "acme.com") */
  domain: string;
  /** Misc settings blob (feature flags, billing, etc.) */
  settings?: JSONValue;
};

export class BfOrganization extends BfNode<BfOrganizationProps> {
  static override gqlSpec = defineGqlNode((field, _relation, mutation) => {
    field.string("name");
    field.string("domain");
    field.json("settings");

    mutation.update();
  });
}
