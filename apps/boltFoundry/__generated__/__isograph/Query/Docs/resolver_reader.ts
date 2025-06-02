import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Docs__param } from './param_type.ts';
import { Docs as resolver } from '../../../../components/Docs.tsx';

const readerAst: ReaderAst<Query__Docs__param> = [
  {
    kind: "Scalar",
    fieldName: "documentsBySlug",
    alias: null,
    arguments: [
      [
        "slug",
        { kind: "Variable", name: "slug" },
      ],
    ],
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__Docs__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Docs",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
