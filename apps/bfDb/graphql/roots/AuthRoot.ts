import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";

export const AuthRoot = defineGqlNode((field, _relation, mutation) => {
  field.string("ok", () => "ok");
  mutation.custom(
    "loginWithGoogle",
    { token: "string" },
    (_src, _args, _ctx) => {
      // Phase B: verify token, create/fetch person & org …
      return {
        viewer: BfCurrentViewer.createLoggedOut(import.meta),
        success: false,
        errors: [],
      };
    },
  );
});
