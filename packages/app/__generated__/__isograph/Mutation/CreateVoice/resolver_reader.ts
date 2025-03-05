import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Mutation__CreateVoice__param } from './param_type.ts';
import { Mutation__CreateVoice__output_type } from './output_type.ts';
import { CreateVoiceMutation as resolver } from '../../../../mutations/CreateVoice.tsx';
import BfOrganization_Identity__EditIdentity__resolver_reader from '../../BfOrganization_Identity/EditIdentity/resolver_reader.ts';

const readerAst: ReaderAst<Mutation__CreateVoice__param> = [
  {
    kind: "Linked",
    fieldName: "createVoice",
    alias: null,
    arguments: [
      [
        "handle",
        { kind: "Variable", name: "handle" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Linked",
        fieldName: "identity",
        alias: null,
        arguments: null,
        condition: null,
        isUpdatable: false,
        selections: [
          {
            kind: "Resolver",
            alias: "EditIdentity",
            arguments: null,
            readerArtifact: BfOrganization_Identity__EditIdentity__resolver_reader,
            usedRefetchQueries: [],
          },
        ],
      },
    ],
  },
];

const artifact: EagerReaderArtifact<
  Mutation__CreateVoice__param,
  Mutation__CreateVoice__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Mutation.CreateVoice",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
