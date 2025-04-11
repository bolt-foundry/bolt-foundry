import {
  arg,
  interfaceType,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { graphqlNode } from "apps/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BfPerson } from "apps/bfDb/models/BfPerson.ts";
import {
  graphqlJSONStringScalarType,
} from "apps/graphql/types/graphqlJSONScalar.ts";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { graphqlBfOrganizationType } from "apps/graphql/types/graphqlBfOrganization.ts";
const logger = getLogger(import.meta);

export const graphqlBfCurrentViewerType = interfaceType({
  name: "BfCurrentViewer",
  definition(t) {
    t.implements(graphqlNode);

    t.field("organization", {
      type: graphqlBfOrganizationType,
      resolve: async (_parent, _args, ctx) => {
        const org = await ctx.findOrganizationForCurrentViewer();
        if (!org) {
          throw new Error("No organization found for current viewer");
        }
        return org.toGraphql();
      },
    });
  },
});

export const graphqlBfCurrentViewerLoggedInType = objectType({
  name: "BfCurrentViewerLoggedIn",
  definition(t) {
    t.implements(graphqlBfCurrentViewerType);
  },
});

export const graphqlBfCurrentViewerLoggedOutType = objectType({
  name: "BfCurrentViewerLoggedOut",
  definition(t) {
    t.implements(graphqlBfCurrentViewerType);
  },
});

export const graphqlBfCurrentViewerQueryType = queryField("me", {
  type: graphqlBfCurrentViewerType,
  resolve(_root, _args, ctx) {
    return ctx.getCvForGraphql();
  },
});
