import { getLogger } from "packages/logger/logger.ts";
import { BfEdge } from "apps/bfDb/coreModels/BfEdge.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { OrganizationRole } from "apps/bfDb/enums/OrganizationRole.ts";
import { BfPerson } from "apps/bfDb/models/BfPerson.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";
import type { BfEdgeBaseProps } from "apps/bfDb/classes/BfEdgeBase.ts";

const _logger = getLogger(import.meta);

export type BfEdgeOrganizationMemberProps = BfEdgeBaseProps & {
  role: OrganizationRole;
  joinedAt: Date;
};

export class BfEdgeOrganizationMember
  extends BfEdge<BfEdgeOrganizationMemberProps> {
  static override gqlSpec = defineGqlNode((field, relation, _mutation) => {
    field.enum("role", OrganizationRole);
    field.date("joinedAt");

    // Graph relations for GraphQL → Relay connections
    relation.one("person", () => BfPerson);
    relation.one("organization", () => BfOrganization);
  });
}
