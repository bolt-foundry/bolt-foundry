import { type BfCurrentViewerLoggedOut__DemoButton__output_type } from '../../BfCurrentViewerLoggedOut/DemoButton/output_type.ts';

export type BfCurrentViewer__Home__param = {
  readonly data: {
    readonly __typename: string,
    /**
A client pointer for the BfCurrentViewerLoggedOut type.
    */
    readonly asBfCurrentViewerLoggedOut: ({
      readonly DemoButton: BfCurrentViewerLoggedOut__DemoButton__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
