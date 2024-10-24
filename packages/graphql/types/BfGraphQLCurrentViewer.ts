import {
  enumType,
  extendType,
  GraphQLError,
  idArg,
  interfaceType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import {
  ACCOUNT_ROLE,
  toBfGid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import {
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { getLogger } from "packages/logger/logger.ts";
import { exchangeCodeForToken } from "lib/googleOauth.ts";
import { BfGoogleAuth } from "packages/bfDb/models/BfGoogleAuth.ts";
const logger = getLogger(import.meta);

export const AccountRole = enumType({
  name: "AccountRole",
  members: ACCOUNT_ROLE,
});

export const BfGraphQLCurrentViewerType = interfaceType({
  name: "BfCurrentViewer",
  description:
    "The person acting on this request. The person is the person who is acting, the organization is the org on which they're acting",
  definition(t) {
    t.field("role", {
      type: "AccountRole",
    });
    t.field("organization", {
      type: "BfOrganization",
      resolve: async (_parent, _args, { bfCurrentViewer }: GraphQLContext) => {
        const orgId = bfCurrentViewer.organizationBfGid;
        if (orgId) {
          const org = await BfOrganization.find(bfCurrentViewer, orgId);
          return org?.toGraphql() ?? null;
        }
        return null;
      },
    });
    t.field("person", {
      type: "BfPerson",
      resolve: async (_parent, _args, { bfCurrentViewer }: GraphQLContext) => {
        const personId = bfCurrentViewer.personBfGid;
        const person = await BfPerson.find(bfCurrentViewer, personId);
        return person?.toGraphql() ?? null;
      },
    });
    t.field("blog", {
      type: "Blog",
      resolve: () => {
        return { title: "Bolt foundry af" };
      },
    });
  },
});

export const BfGraphQLCurrentViewerAnon = objectType({
  name: "BfCurrentViewerAnon",
  description: "The anonymous person acting on this request.",
  definition(t) {
    t.implements("BfCurrentViewer");
  },
});

export const BfGraphQLBfCurrentViewerAccessToken = objectType({
  name: "BfCurrentViewerAccessToken",
  description: "The person acting on this request using a Bf access token.",
  definition(t) {
    t.implements("BfCurrentViewer");
  },
});

export const BfCurrentViewerQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("currentViewer", {
      type: "BfCurrentViewer",
      resolve: (_parent, _args, { bfCurrentViewer }: GraphQLContext) => {
        return bfCurrentViewer;
      },
    });
  },
});

export const BfLoginMutation = mutationField((t) => {
  t.field("loginWithGoogle", {
    type: "BfCurrentViewerAccessToken",
    args: {
      credential: nonNull(stringArg()),
    },
    resolve: async (
      _parent,
      { credential },
      gqlContext: GraphQLContext,
    ) => {
      try {
        logger.debug("BfLoginMutation.loginWithGoogle", gqlContext);
        const responseHeaders = gqlContext.responseHeaders;
        const person = await BfPerson.clientLoginWithGoogle(credential);
        const defaultAccount = await BfAccount.findDefaultForCurrentViewer(
          person.currentViewer,
        );
        const accessToken = await defaultAccount.generateAccessToken(
          import.meta,
        );
        const refreshToken = await defaultAccount.generateRefreshToken(
          import.meta,
        );
        const newCurrentViewer = await BfCurrentViewerAccessToken.create(
          import.meta,
          refreshToken,
        );
        responseHeaders.append(
          "Set-Cookie",
          `BF_AT=${accessToken}; HttpOnly; Path=/; SameSite=Strict`,
        );
        responseHeaders.append(
          "Set-Cookie",
          `BF_RT=${refreshToken}; HttpOnly; Path=/; SameSite=Strict`,
        );
        gqlContext.bfCurrentViewer = newCurrentViewer;
        return newCurrentViewer;
      } catch (e) {
        throw e;
      }
    },
  });
});

export const BfGraphQLSwitchAccountMutation = mutationField((t) => {
  t.field("switchAccount", {
    type: "BfCurrentViewerAccessToken",
    args: {
      accountId: nonNull(idArg()),
    },
    resolve: async (
      _root,
      { accountId },
      ctx: GraphQLContext,
    ) => {
      const { bfCurrentViewer } = ctx;
      const response: Response = ctx.response;
      const account = await BfAccount.findX(
        bfCurrentViewer,
        toBfGid(accountId),
      );
      const accessToken = await account.generateAccessToken(import.meta);
      const refreshToken = await account.generateRefreshToken(import.meta);
      response.headers.append(
        "Set-Cookie",
        `BF_AT=${accessToken}; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
      response.headers.append(
        "Set-Cookie",
        `BF_RT=${refreshToken}; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
      ctx.bfCurrentViewer = await BfCurrentViewerAccessToken.create(
        import.meta,
        accessToken,
      );

      return ctx.bfCurrentViewer;
    },
  });
});

export const LogoutMutation = mutationField((t) => {
  t.field("logout", {
    type: "BfCurrentViewer",
    resolve: (_src, _args, context) => {
      try {
        const headers: Headers = context.responseHeaders;
        headers.append("Set-Cookie", "BF_AT=; Path=/; Max-Age=0");
        headers.append("Set-Cookie", "BF_RT=; Path=/; Max-Age=0");
      } catch {
        throw new GraphQLError(
          "Logout failed... sorry about that. We've logged it and will look into it.",
        );
      }
      return context.bfCurrentViewer;
    },
  });
});

export const LinkGoogleAccountMutation = mutationField(
  "linkAdvancedGoogleAuth",
  {
    type: "BfCurrentViewer",
    args: {
      code: nonNull(stringArg()),
    },
    // @ts-expect-error #techdebt
    resolve: async (_root, { code }, { bfCurrentViewer }: GraphQLContext) => {
      const person = await BfPerson.findCurrentViewer(bfCurrentViewer);
      const tokenResponse = await exchangeCodeForToken(code);
      const refreshToken = tokenResponse.refresh_token;
      if (!person) {
        throw new Error("No person found");
      }
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      await person.createTargetNode(BfGoogleAuth, { refreshToken });
      return bfCurrentViewer;
    },
  },
);
