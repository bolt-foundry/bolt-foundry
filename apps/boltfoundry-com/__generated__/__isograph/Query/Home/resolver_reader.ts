import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Home__param } from './param_type.ts';
import { Home as resolver } from '../../../../components/Home.tsx';
import CurrentViewer__LogInOrOutButton__resolver_reader from '../../CurrentViewer/LogInOrOutButton/resolver_reader.ts';

const readerAst: ReaderAst<Query__Home__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
  {
    kind: "Linked",
    fieldName: "currentViewer",
    alias: null,
    arguments: null,
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "LogInOrOutButton",
        arguments: null,
        readerArtifact: CurrentViewer__LogInOrOutButton__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
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
