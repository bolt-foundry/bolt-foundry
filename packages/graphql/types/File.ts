import {
  arg,
  mutationField,
  nonNull,
  scalarType,
} from "packages/graphql/deps.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const FileScalar = scalarType({
  name: "File",
  asNexusMethod: "file",
  description: "The `File` scalar type represents a file upload.",
  sourceType: "File",
});

export const ReadFileMutation = mutationField("readTextFile", {
  type: "String",
  args: { file: nonNull(arg({ type: "File" })) },
  resolve: async (one, two, ctx, four) => {
    const file: File = ctx.params.variables.file;
    let returnable = "not able to read b/c probably not text.";
    if (file.type === "text/plain") {
      returnable = await file.text();
    } else {
      logger.info(file)
    }
    logger.info("readTextFile: " + returnable);
    return returnable;
  },
});
