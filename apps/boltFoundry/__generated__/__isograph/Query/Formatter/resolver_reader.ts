import type {
  ComponentReaderArtifact,
  ExtractSecondParam,
  ReaderAst,
} from "@isograph/react";
import { Query__Formatter__param } from "./param_type.ts";
import { Formatter as resolver } from "../../../../components/Formatter.tsx";

const readerAst: ReaderAst<Query__Formatter__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__Formatter__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Formatter",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
