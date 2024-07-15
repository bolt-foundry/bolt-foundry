import { scalarType } from "packages/graphql/deps.ts";

export const UrlScalarType = scalarType({
  name: "Url",
  asNexusMethod: "url",
  description: "a fully qualified URL",
  sourceType: "string",
});
