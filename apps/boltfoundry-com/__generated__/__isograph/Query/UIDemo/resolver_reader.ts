import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__UIDemo__param } from './param_type.ts';
import { UIDemo as resolver } from '../../../../components/UIDemo.tsx';

const readerAst: ReaderAst<Query__UIDemo__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__UIDemo__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.UIDemo",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
