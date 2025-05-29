import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointDocsPage__param } from './param_type.ts';
import { Query__EntrypointDocsPage__output_type } from './output_type.ts';
import { EntrypointDocsPage as resolver } from '../../../../entrypoints/EntrypointDocsPage.ts';
import Query__Docs__resolver_reader from '../../Query/Docs/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointDocsPage__param> = [
  {
    kind: "Resolver",
    alias: "Docs",
    arguments: null,
    readerArtifact: Query__Docs__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointDocsPage__param,
  Query__EntrypointDocsPage__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointDocsPage",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
