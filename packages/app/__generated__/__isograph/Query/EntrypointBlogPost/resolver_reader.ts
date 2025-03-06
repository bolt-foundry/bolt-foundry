import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointBlogPost__param } from './param_type.ts';
import { Query__EntrypointBlogPost__output_type } from './output_type.ts';
import { EntrypointBlogPost as resolver } from '../../../../entrypoints/EntrypointBlogPost.ts';

const readerAst: ReaderAst<Query__EntrypointBlogPost__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointBlogPost__param,
  Query__EntrypointBlogPost__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointBlogPost",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
