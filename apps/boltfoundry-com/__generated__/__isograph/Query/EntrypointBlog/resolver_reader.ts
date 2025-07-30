import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointBlog__param } from './param_type.ts';
import { Query__EntrypointBlog__output_type } from './output_type.ts';
import { EntrypointBlog as resolver } from '../../../../entrypoints/EntrypointBlog.ts';
import Query__Blog__resolver_reader from '../../Query/Blog/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointBlog__param> = [
  {
    kind: "Resolver",
    alias: "Blog",
    arguments: null,
    readerArtifact: Query__Blog__resolver_reader,
    usedRefetchQueries: [],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointBlog__param,
  Query__EntrypointBlog__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointBlog",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
