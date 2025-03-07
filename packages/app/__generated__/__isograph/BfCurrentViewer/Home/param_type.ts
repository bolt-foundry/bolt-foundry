import { type BfContentCollection__ContentCollection__output_type } from '../../BfContentCollection/ContentCollection/output_type.ts';
import { type BfCurrentViewer__DemoButton__output_type } from '../../BfCurrentViewer/DemoButton/output_type.ts';

export type BfCurrentViewer__Home__param = {
  readonly data: {
    readonly __typename: string,
    readonly contentCollection: ({
      readonly item: ({
        readonly ContentItem: BfContentItem__ContentItem__output_type,
      } | null),
    } | null),
    /**
A client pointer for the BfCurrentViewerLoggedOut type.
    */
    readonly asBfCurrentViewerLoggedOut: ({
      readonly DemoButton: BfCurrentViewer__DemoButton__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
