import { mutationField, nonNull, queryField, stringArg } from "nexus";
import { IBfCurrentViewerInternalAdmin } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfError } from "lib/BfError.ts";

export const IBfGraphQLOrganizationQuery = queryField((t) => {
  t.connectionField("organizations", {
    type: "BfOrganization",
    resolve: async (_, args, { bfCurrentViewer }) => {
      if (bfCurrentViewer instanceof IBfCurrentViewerInternalAdmin) {
        return await BfOrganization.queryConnectionForGraphQL(
          bfCurrentViewer,
          {
            bfOid: undefined,
          },
          {},
          args,
        );
      }
      throw new BfError("Not authorized");
    },
  });
});

export const IBfGraphQLCreateOrganizationMutation = mutationField("createOrg", {
  type: "BfOrganization",
  args: {
    name: nonNull(stringArg()),
    domainName: nonNull(stringArg()),
    youtubePlaylistUrl: stringArg(),
  },
  resolve: async (_, args, { bfCurrentViewer }) => {
    return await BfOrganization.createFromGraphQL(bfCurrentViewer, args);
  }
});
