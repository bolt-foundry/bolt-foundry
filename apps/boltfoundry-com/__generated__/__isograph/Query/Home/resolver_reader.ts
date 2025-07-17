import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Home__param } from './param_type.ts';
import { Home as resolver } from '../../../../components/Home.tsx';
import Query__LoginButton__resolver_reader from '../../Query/LoginButton/resolver_reader.ts';

const readerAst: ReaderAst<Query__Home__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
  {
    kind: "Resolver",
    alias: "LoginButton",
    arguments: null,
    readerArtifact: Query__LoginButton__resolver_reader,
    usedRefetchQueries: [],
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
