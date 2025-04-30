
export type Query__LoginPage__param = {
  readonly data: {
    readonly __typename: string,
    readonly currentViewer: {
      readonly __typename: string,
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
