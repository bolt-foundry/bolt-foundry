import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Home__param } from './param_type.ts';
import { Home as resolver } from '../../../../components/Home.tsx';

const readerAst: ReaderAst<Query__Home__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__Home__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Home",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
