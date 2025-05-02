import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { CurrentViewer__LoginWithGoogleButton__param } from './param_type.ts';
import { LoginWithGoogleButton as resolver } from '../../../../components/CurrentViewer/LoginWithGoogleButton.tsx';
import CurrentViewerLoggedIn__asCurrentViewerLoggedIn__resolver_reader from '../../CurrentViewerLoggedIn/asCurrentViewerLoggedIn/resolver_reader.ts';
import CurrentViewerLoggedOut__asCurrentViewerLoggedOut__resolver_reader from '../../CurrentViewerLoggedOut/asCurrentViewerLoggedOut/resolver_reader.ts';

const readerAst: ReaderAst<CurrentViewer__LoginWithGoogleButton__param> = [
  {
    kind: "Linked",
    fieldName: "asCurrentViewerLoggedIn",
    alias: null,
    arguments: null,
    condition: CurrentViewerLoggedIn__asCurrentViewerLoggedIn__resolver_reader,
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
  {
    kind: "Linked",
    fieldName: "asCurrentViewerLoggedOut",
    alias: null,
    arguments: null,
    condition: CurrentViewerLoggedOut__asCurrentViewerLoggedOut__resolver_reader,
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
  CurrentViewer__LoginWithGoogleButton__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "CurrentViewer.LoginWithGoogleButton",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
