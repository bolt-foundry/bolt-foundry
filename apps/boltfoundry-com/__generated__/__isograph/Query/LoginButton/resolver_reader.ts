import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__LoginButton__param } from './param_type.ts';
import { LoginButton as resolver } from '../../../../components/LoginButton.tsx';

const readerAst: ReaderAst<Query__LoginButton__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  Query__LoginButton__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.LoginButton",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
