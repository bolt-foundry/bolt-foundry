import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointRlhf__param } from './param_type.ts';
import { Query__EntrypointRlhf__output_type } from './output_type.ts';
import { EntrypointRlhf as resolver } from '../../../../entrypoints/EntrypointRlhf.ts';
import Query__RlhfInterface__resolver_reader from '../../Query/RlhfInterface/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointRlhf__param> = [
  {
    kind: "Resolver",
    alias: "RlhfInterface",
    arguments: null,
    readerArtifact: Query__RlhfInterface__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointRlhf__param,
  Query__EntrypointRlhf__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointRlhf",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
