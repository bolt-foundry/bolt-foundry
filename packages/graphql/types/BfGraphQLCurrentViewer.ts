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
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import {
  BfCurrentViewerAccessToken,
  BfCurrentViewerAnon,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

export const AccountRole = enumType({
  name: "AccountRole",
  members: ACCOUNT_ROLE,
});

export const Actor = interfaceType({
  name: "Actor",
  description:
    "The actor acting on this request. The actor can be an organiazation or person.",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
  },
});

export const BfGraphQLCurrentViewer = interfaceType({
  name: "BfCurrentViewer",
  description:
    "The person acting on this request. The actor can be an organiazation or person. The role is the role of the actor in the organization. The person is the person who is acting.",
  definition(t) {
    t.field("actor", {
      type: "Actor",
      resolve: async (_parent, _args, { bfCurrentViewer }: GraphQLContext) => {
        let actor = null;
        if (
          toBfGid(bfCurrentViewer.organizationBfGid) ==
            bfCurrentViewer.personBfGid
        ) {
          actor = await BfPerson.find(
            bfCurrentViewer,
            toBfGid(bfCurrentViewer.organizationBfGid),
          );
        } else {
          actor = await BfOrganization.find(
            bfCurrentViewer,
            toBfGid(bfCurrentViewer.organizationBfGid),
          );
        }
        return actor?.toGraphql() ?? null;
      },
    });
    t.field("role", {
      type: "AccountRole",
    });
    t.field("person", {
      type: "BfPerson",
      resolve: async (_parent, _args, { bfCurrentViewer }: GraphQLContext) => {
        const personId = bfCurrentViewer.personBfGid;
        const person = await BfPerson.find(bfCurrentViewer, personId);
        return person?.toGraphql() ?? null;
      },
    });
    t.string("googleAccessToken", {
      resolve: async (_, _args, ctx: GraphQLContext) => {
        const { bfCurrentViewer } = ctx;
        const googleApiToken = await BfPerson
          .findGoogleApiTokenForCurrentViewer(bfCurrentViewer);
        return googleApiToken?.getCurrentAccessToken() ?? null;
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

export const BfGraphQLLinkGoogleAccountMutation = mutationField((t) => {
  t.field("linkGoogleAccount", {
    type: "BfCurrentViewer",
    args: {
      code: nonNull(stringArg()),
    },
    resolve: async (
      _root,
      { code },
      { bfCurrentViewer }: GraphQLContext,
    ) => {
      const person = await BfPerson.findX(
        bfCurrentViewer,
        bfCurrentViewer.personBfGid,
      );

      try {
        await person.linkEnhancedGoogleAccount(code);
      } catch {
        throw new GraphQLError(
          "Couldn't link Google Account. Try again, or email support@boltfoundry.com",
        );
      }
      return bfCurrentViewer;
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
      } catch (e) {
        throw new GraphQLError(
          "Logout failed... sorry about that. We've logged it and will look into it.",
        );
      }
    },
  });
});
