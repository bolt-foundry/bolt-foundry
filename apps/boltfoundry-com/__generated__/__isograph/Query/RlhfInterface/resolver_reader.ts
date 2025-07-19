import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__RlhfInterface__param } from './param_type.ts';
import { RlhfInterface as resolver } from '../../../../components/RlhfInterface.tsx';

const readerAst: ReaderAst<Query__RlhfInterface__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__RlhfInterface__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.RlhfInterface",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
