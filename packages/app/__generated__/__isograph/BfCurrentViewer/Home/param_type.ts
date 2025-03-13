import { type BfCurrentViewer__DemoButton__output_type } from '../../BfCurrentViewer/DemoButton/output_type.ts';

export type BfCurrentViewer__Home__param = {
  readonly data: {
    readonly __typename: string,
    /**
A client pointer for the BfCurrentViewerLoggedOut type.
    */
    readonly asBfCurrentViewerLoggedOut: ({
      readonly DemoButton: BfCurrentViewer__DemoButton__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
