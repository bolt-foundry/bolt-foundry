import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointUIDemo__param } from './param_type.ts';
import { Query__EntrypointUIDemo__output_type } from './output_type.ts';
import { EntrypointUIDemo as resolver } from '../../../../entrypoints/EntrypointUIDemo.ts';
import Query__UIDemo__resolver_reader from '../../Query/UIDemo/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointUIDemo__param> = [
  {
    kind: "Resolver",
    alias: "UIDemo",
    arguments: null,
    readerArtifact: Query__UIDemo__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointUIDemo__param,
  Query__EntrypointUIDemo__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointUIDemo",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
