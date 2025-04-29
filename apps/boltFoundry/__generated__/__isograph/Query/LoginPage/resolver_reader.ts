import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__LoginPage__param } from './param_type.ts';
import { LoginPage as resolver } from '../../../../components/LoginPage.tsx';

const readerAst: ReaderAst<Query__LoginPage__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__LoginPage__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.LoginPage",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
