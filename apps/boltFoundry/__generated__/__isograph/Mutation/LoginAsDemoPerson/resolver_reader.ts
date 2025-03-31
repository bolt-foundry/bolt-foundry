import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Mutation__LoginAsDemoPerson__param } from './param_type.ts';
import { LoginAsDemoPersonMutation as resolver } from '../../../../mutations/LoginAsDemoPerson.tsx';

const readerAst: ReaderAst<Mutation__LoginAsDemoPerson__param> = [
  {
    kind: "Linked",
    fieldName: "loginAsDemoPerson",
    alias: null,
    arguments: null,
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Scalar",
        fieldName: "__typename",
        alias: null,
        arguments: null,
        isUpdatable: false,
      },
    ],
  },
];

const artifact: ComponentReaderArtifact<
  Mutation__LoginAsDemoPerson__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Mutation.LoginAsDemoPerson",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
