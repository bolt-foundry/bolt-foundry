import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Mutation__ReviseBlog__param } from './param_type.ts';
import { Mutation__ReviseBlog__output_type } from './output_type.ts';
import { ReviseBlogMutation as resolver } from '../../../../mutations/ReviseBlog.ts';
import BfOrganization__BlogRevisionsSidebar__resolver_reader from '../../BfOrganization/BlogRevisionsSidebar/resolver_reader.ts';

const readerAst: ReaderAst<Mutation__ReviseBlog__param> = [
  {
    kind: "Linked",
    fieldName: "reviseBlog",
    alias: null,
    arguments: [
      [
        "blogPost",
        { kind: "Variable", name: "blogPost" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "BlogRevisionsSidebar",
        arguments: null,
        readerArtifact: BfOrganization__BlogRevisionsSidebar__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
  },
];

const artifact: EagerReaderArtifact<
  Mutation__ReviseBlog__param,
  Mutation__ReviseBlog__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Mutation.ReviseBlog",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
