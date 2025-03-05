import { type BfOrganization__BlogRevisionsSidebar__output_type } from '../../BfOrganization/BlogRevisionsSidebar/output_type.ts';
import type { Mutation__ReviseBlog__parameters } from './parameters_type.ts';

export type Mutation__ReviseBlog__param = {
  readonly data: {
    readonly reviseBlog: ({
      readonly BlogRevisionsSidebar: BfOrganization__BlogRevisionsSidebar__output_type,
    } | null),
  },
  readonly parameters: Mutation__ReviseBlog__parameters,
};
