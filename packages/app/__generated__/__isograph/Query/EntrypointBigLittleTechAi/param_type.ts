import { type BfContentItem__ContentItem__output_type } from '../../BfContentItem/ContentItem/output_type.ts';

export type Query__EntrypointBigLittleTechAi__param = {
  readonly data: {
    readonly me: ({
      readonly contentCollection: ({
        readonly item: ({
          readonly ContentItem: BfContentItem__ContentItem__output_type,
        } | null),
      } | null),
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
