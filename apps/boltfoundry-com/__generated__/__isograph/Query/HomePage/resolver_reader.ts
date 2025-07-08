import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__HomePage__param } from './param_type.ts';
import { Query__HomePage__output_type } from './output_type.ts';
import { QueryHomePage as resolver } from '../../../../fields/QueryHomePage.ts';
import CurrentViewer__Home__resolver_reader from '../../CurrentViewer/Home/resolver_reader.ts';

const readerAst: ReaderAst<Query__HomePage__param> = [
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
        alias: "Home",
        arguments: null,
        readerArtifact: CurrentViewer__Home__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
  },
];

const artifact: EagerReaderArtifact<
  Query__HomePage__param,
  Query__HomePage__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.HomePage",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
