import { extendType, mutationField, nonNull, stringArg } from "nexus";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { exchangeCodeForToken } from "lib/googleOauth.ts";
import { BfGoogleAuth } from "packages/bfDb/models/BfGoogleAuth.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const LinkGoogleAccountMutation = mutationField(
  "linkAdvancedGoogleAuth",
  {
    type: "BfCurrentViewer",
    args: {
      code: nonNull(stringArg())
    },
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
      const _googleAuth = await BfGoogleAuth.create(bfCurrentViewer, {
        refreshToken,
      });
      return bfCurrentViewer;
    },
  },
);

export const BfGraphQLGoogleAuthType = extendType({
  type: "BfPerson",
  definition: (t) => {
    t.nullable.string("googleAuthAccessToken", {
      resolve: async (parent, _args, { bfCurrentViewer }) => {
        const currentViewerPerson = await BfPerson.find(
          bfCurrentViewer,
          // @ts-expect-error typing is bad on BfNode b/c it doesn't include the id type for some reason.
          parent.id,
        );
        const bfGoogleAuth = await currentViewerPerson?.getGoogleAuth();
        return bfGoogleAuth?.getAccessToken() ?? null;
      },
    });
  },
});
