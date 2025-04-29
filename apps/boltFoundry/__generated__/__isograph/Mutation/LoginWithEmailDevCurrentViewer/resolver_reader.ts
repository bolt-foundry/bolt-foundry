import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Mutation__LoginWithEmailDevCurrentViewer__param } from './param_type.ts';
import { Mutation__LoginWithEmailDevCurrentViewer__output_type } from './output_type.ts';
import { LoginWithEmailDevCurrentViewerMutation as resolver } from '../../../../mutations/LoginWithEmailDevCurrentViewer.tsx';

const readerAst: ReaderAst<Mutation__LoginWithEmailDevCurrentViewer__param> = [
  {
    kind: "Linked",
    fieldName: "loginWithEmailDevCurrentViewer",
    alias: null,
    arguments: [
      [
        "email",
        { kind: "Variable", name: "email" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Linked",
        fieldName: "currentViewer",
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
    ],
  },
];

const artifact: EagerReaderArtifact<
  Mutation__LoginWithEmailDevCurrentViewer__param,
  Mutation__LoginWithEmailDevCurrentViewer__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Mutation.LoginWithEmailDevCurrentViewer",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
