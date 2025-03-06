import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointBlog__param } from './param_type.ts';
import { Query__EntrypointBlog__output_type } from './output_type.ts';
import { EntrypointBlog as resolver } from '../../../../entrypoints/EntrypointBlog.tsx';
import BfContentCollection__ContentCollection__resolver_reader from '../../BfContentCollection/ContentCollection/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointBlog__param> = [
  {
    kind: "Linked",
    fieldName: "me",
    alias: null,
    arguments: null,
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Linked",
        fieldName: "contentCollection",
        alias: null,
        arguments: [
          [
            "slug",
            { kind: "String", value: "blog" },
          ],
        ],
        condition: null,
        isUpdatable: false,
        selections: [
          {
            kind: "Resolver",
            alias: "ContentCollection",
            arguments: null,
            readerArtifact: BfContentCollection__ContentCollection__resolver_reader,
            usedRefetchQueries: [],
          },
        ],
      },
    ],
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
