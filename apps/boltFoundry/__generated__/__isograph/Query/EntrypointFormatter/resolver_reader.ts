import type { EagerReaderArtifact, ReaderAst } from "@isograph/react";
import { Query__EntrypointFormatter__param } from "./param_type.ts";
import { Query__EntrypointFormatter__output_type } from "./output_type.ts";
import { EntrypointFormatter as resolver } from "../../../../entrypoints/EntrypointFormatter.ts";
import Query__Formatter__resolver_reader from "../../Query/Formatter/resolver_reader.ts";

const readerAst: ReaderAst<Query__EntrypointFormatter__param> = [
  {
    kind: "Resolver",
    alias: "Formatter",
    arguments: null,
    readerArtifact: Query__Formatter__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointFormatter__param,
  Query__EntrypointFormatter__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointFormatter",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
