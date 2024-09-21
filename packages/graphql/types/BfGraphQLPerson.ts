import {
  type ConnectionArguments,
  connectionFromArray,
  objectType,
} from "packages/graphql/deps.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { getLogger } from "deps.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfSavedSearch } from "packages/bfDb/models/BfSavedSearch.ts";
import { bfSavedSearchType } from "packages/graphql/types/BfGraphQLSavedSearch.ts";

const logger = getLogger(import.meta);

export const BfGraphQLPerson = objectType({
  name: "BfPerson",
  description: "A real human who uses our system",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
    t.string("email");
    
    t.string("googleAuthAccessToken", {
      async resolve(parent, _, { bfCurrentViewer }) {
        // @ts-expect-error #techdebt
        const person = await BfPerson.findX(bfCurrentViewer, parent.id);
        const auth = await person.getGoogleAuth();
        logger.debug(`${person} - ${auth}`);
        return await auth?.getAccessToken() ?? null;
      },
    });
    t.connectionField("accounts", {
      type: "BfAccount",
      async resolve(
        { id },
        args,
        { bfCurrentViewer }: GraphQLContext,
      ) {
        const person = await BfPerson.findX(
          bfCurrentViewer,
          toBfGid(id),
        )
        return person.queryTargetInstances(BfAccount, args)
      },
    });
  },
});
