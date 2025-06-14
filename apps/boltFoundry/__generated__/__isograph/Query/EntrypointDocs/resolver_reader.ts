import type { EagerReaderArtifact, ReaderAst } from "@isograph/react";
import { Query__EntrypointDocs__param } from "./param_type.ts";
import { Query__EntrypointDocs__output_type } from "./output_type.ts";
import { EntrypointDocs as resolver } from "../../../../entrypoints/EntrypointDocs.ts";
import Query__Docs__resolver_reader from "../../Query/Docs/resolver_reader.ts";

const readerAst: ReaderAst<Query__EntrypointDocs__param> = [
  {
    kind: "Resolver",
    alias: "Docs",
    arguments: [
      [
        "slug",
        { kind: "Variable", name: "slug" },
      ],
    ],
    readerArtifact: Query__Docs__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointDocs__param,
  Query__EntrypointDocs__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointDocs",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
