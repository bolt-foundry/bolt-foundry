import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointGrader__param } from './param_type.ts';
import { Query__EntrypointGrader__output_type } from './output_type.ts';
import { EntrypointGrader as resolver } from '../../../../entrypoints/EntrypointGrader.ts';
import Query__Grader__resolver_reader from '../../Query/Grader/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointGrader__param> = [
  {
    kind: "Resolver",
    alias: "Grader",
    arguments: null,
    readerArtifact: Query__Grader__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointGrader__param,
  Query__EntrypointGrader__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointGrader",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
