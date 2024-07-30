import { objectType } from "nexus";

export const BfGraphQLIBfCurrentViewerInternalAdminType = objectType({
  name: "IBfCurrentViewerInternalAdmin",
  description: "The person acting on this request using an internal Bf account.",
  definition(t) {
    t.implements("BfCurrentViewer");
  },
});