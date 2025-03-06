import { type BfContentCollection__ContentCollection__output_type } from '../../BfContentCollection/ContentCollection/output_type.ts';

export type Query__EntrypointBlog__param = {
  readonly data: {
    readonly me: ({
      readonly contentCollection: ({
        readonly ContentCollection: BfContentCollection__ContentCollection__output_type,
      } | null),
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
