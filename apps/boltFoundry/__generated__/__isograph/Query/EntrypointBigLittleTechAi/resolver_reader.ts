import type { EagerReaderArtifact, ReaderAst } from '@isograph/react';
import { Query__EntrypointBigLittleTechAi__param } from './param_type.ts';
import { Query__EntrypointBigLittleTechAi__output_type } from './output_type.ts';
import { EntrypointHome as resolver } from '../../../../entrypoints/EntrypointBigLittleTechAi.tsx';
import BfContentItem__ContentItem__resolver_reader from '../../BfContentItem/ContentItem/resolver_reader.ts';

const readerAst: ReaderAst<Query__EntrypointBigLittleTechAi__param> = [
  {
    kind: "Linked",
    fieldName: "me",
    alias: null,
    arguments: null,
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Linked",
        fieldName: "contentCollection",
        alias: null,
        arguments: [
          [
            "slug",
            { kind: "String", value: "bf:///content/marketing" },
          ],
        ],
        condition: null,
        isUpdatable: false,
        selections: [
          {
            kind: "Linked",
            fieldName: "item",
            alias: null,
            arguments: [
              [
                "id",
                { kind: "String", value: "bf:///content/biglittletech.ai/page.md" },
              ],
            ],
            condition: null,
            isUpdatable: false,
            selections: [
              {
                kind: "Resolver",
                alias: "ContentItem",
                arguments: null,
                readerArtifact: BfContentItem__ContentItem__resolver_reader,
                usedRefetchQueries: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const artifact: EagerReaderArtifact<
  Query__EntrypointBigLittleTechAi__param,
  Query__EntrypointBigLittleTechAi__output_type
> = {
  kind: "EagerReaderArtifact",
  fieldName: "Query.EntrypointBigLittleTechAi",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
