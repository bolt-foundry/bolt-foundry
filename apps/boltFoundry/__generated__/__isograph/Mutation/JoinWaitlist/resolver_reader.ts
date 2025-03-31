import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Mutation__JoinWaitlist__param } from './param_type.ts';
import { Mutation__JoinWaitlist__output_type } from './output_type.ts';
import { JoinWaitlistMutation as resolver } from '../../../../mutations/JoinWaitlist.tsx';

const readerAst: ReaderAst<Mutation__JoinWaitlist__param> = [
  {
    kind: "Linked",
    fieldName: "joinWaitlist",
    alias: null,
    arguments: [
      [
        "name",
        { kind: "Variable", name: "name" },
      ],

      [
        "email",
        { kind: "Variable", name: "email" },
      ],

      [
        "company",
        { kind: "Variable", name: "company" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Scalar",
        fieldName: "success",
        alias: null,
        arguments: null,
        isUpdatable: false,
      },
      {
        kind: "Scalar",
        fieldName: "message",
        alias: null,
        arguments: null,
        isUpdatable: false,
      },
    ],
  },
];

const artifact: EagerReaderArtifact<
  Mutation__JoinWaitlist__param,
  Mutation__JoinWaitlist__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Mutation.JoinWaitlist",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
