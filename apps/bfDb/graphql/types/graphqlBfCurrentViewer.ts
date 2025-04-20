import {
  arg,
  interfaceType,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { graphqlNode } from "apps/bfDb/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger/logger.ts";
import {
  graphqlJSONStringScalarType,
} from "apps/bfDb/graphql/types/graphqlJSONScalar.ts";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { graphqlBfOrganizationType } from "apps/bfDb/graphql/types/graphqlBfOrganization.ts";
const _logger = getLogger(import.meta);

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

export const graphqlBfCurrentViewerRegisterMutation = mutationField(
  "register",
  {
    type: graphqlBfCurrentViewerLoggedInType,
    args: {
      attResp: nonNull(arg({ type: graphqlJSONStringScalarType })),
      email: nonNull(stringArg()),
    },
    async resolve(_parent, { attResp, email }, ctx) {
      const registrationResponseJSON: RegistrationResponseJSON = JSON.parse(
        attResp,
      );
      const person = await ctx.register(registrationResponseJSON, email);
      return person.cv.toGraphql();
    },
  },
);

export const graphqlBfCurrentViewerLoginDemoUser = mutationField(
  "loginAsDemoPerson",
  {
    type: graphqlBfCurrentViewerLoggedInType,

    async resolve(_parent, _, ctx) {
      const cv = await ctx.loginDemoUser();
      return cv.toGraphql();
    },
  },
);

export const graphqlBfCurrentViewerLoginMutation = mutationField(
  "login",
  {
    type: graphqlBfCurrentViewerType,
    args: {
      email: nonNull(stringArg()),
      authResp: nonNull(arg({ type: graphqlJSONStringScalarType })),
    },
    async resolve(_parent, { email, authResp }, ctx) {
      const optionsJSON = JSON.parse(authResp);
      const cv = await ctx.login(email, optionsJSON);
      const result = cv.toGraphql();
      return {
        ...result,
        // necessary for type error
        __typename: "BfCurrentViewerLoggedIn",
      };
    },
  },
);
