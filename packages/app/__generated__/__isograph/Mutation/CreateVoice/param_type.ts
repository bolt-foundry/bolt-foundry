import { type BfOrganization_Identity__EditIdentity__output_type } from '../../BfOrganization_Identity/EditIdentity/output_type.ts';
import type { Mutation__CreateVoice__parameters } from './parameters_type.ts';

export type Mutation__CreateVoice__param = {
  readonly data: {
    readonly createVoice: ({
      readonly identity: ({
        readonly EditIdentity: BfOrganization_Identity__EditIdentity__output_type,
      } | null),
    } | null),
  },
  readonly parameters: Mutation__CreateVoice__parameters,
};
