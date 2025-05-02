import { type CurrentViewer__LoginWithGoogleButton__output_type } from '../../CurrentViewer/LoginWithGoogleButton/output_type.ts';

export type Query__LoginPage__param = {
  readonly data: {
    readonly currentViewer: {
      readonly __typename: string,
      readonly LoginWithGoogleButton: CurrentViewer__LoginWithGoogleButton__output_type,
      /**
A client pointer for the CurrentViewerLoggedIn type.
      */
      readonly asCurrentViewerLoggedIn: ({
        readonly __typename: string,
      } | null),
    },
  },
  readonly parameters: Record<PropertyKey, never>,
};
