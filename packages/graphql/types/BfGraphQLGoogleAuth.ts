import { mutationField, extendType } from "nexus";
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
      code: "String",
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
    t.string("googleAuthAccessToken", {resolve: async (gqlPerson, _args, {bfCurrentViewer}) => {
      const edges = await BfEdge.query(bfCurrentViewer, {bfSid: gqlPerson.id, bfTClassName: "BfGoogleAuth"});
      const edge = edges[0];
      const bfTid = edge?.metadata.bfTid;
      if (!bfTid) {
        logger.debug(`edges`, edges)
        return null;
      }
      const bfGoogleAuth = await BfGoogleAuth.find(bfCurrentViewer, bfTid);
      return bfGoogleAuth?.getAccessToken();
    }})
  }
})

