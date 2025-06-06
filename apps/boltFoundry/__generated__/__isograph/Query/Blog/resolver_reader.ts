import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Blog__param } from './param_type.ts';
import { Blog as resolver } from '../../../../components/Blog.tsx';

const readerAst: ReaderAst<Query__Blog__param> = [
  {
    kind: "Linked",
    fieldName: "blogPost",
    alias: null,
    arguments: [
      [
        "slug",
        { kind: "Variable", name: "slug" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Scalar",
        fieldName: "id",
        alias: null,
        arguments: null,
        isUpdatable: false,
      },
      {
        kind: "Scalar",
        fieldName: "content",
        alias: null,
        arguments: null,
        isUpdatable: false,
      },
    ],
  },
];

const artifact: ComponentReaderArtifact<
  Query__Blog__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Blog",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
