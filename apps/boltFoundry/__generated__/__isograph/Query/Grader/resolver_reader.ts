import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Grader__param } from './param_type.ts';
import { Grader as resolver } from '../../../../components/Grader.tsx';

const readerAst: ReaderAst<Query__Grader__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__Grader__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Grader",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
