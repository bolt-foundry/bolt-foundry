import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Mutation__LoginWithGoogleCurrentViewer__param } from './param_type.ts';
import { Mutation__LoginWithGoogleCurrentViewer__output_type } from './output_type.ts';
import { LoginWithGoogleCurrentViewerMutation as resolver } from '../../../../mutations/LoginWithGoogleCurrentViewer.tsx';

const readerAst: ReaderAst<Mutation__LoginWithGoogleCurrentViewer__param> = [
  {
    kind: "Linked",
    fieldName: "loginWithGoogleCurrentViewer",
    alias: null,
    arguments: [
      [
        "idToken",
        { kind: "Variable", name: "idToken" },
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
  Mutation__LoginWithGoogleCurrentViewer__param,
  Mutation__LoginWithGoogleCurrentViewer__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Mutation.LoginWithGoogleCurrentViewer",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
