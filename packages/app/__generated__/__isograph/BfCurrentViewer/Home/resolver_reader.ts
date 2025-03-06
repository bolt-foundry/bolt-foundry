import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { BfCurrentViewer__Home__param } from './param_type.ts';
import { Home as resolver } from '../../../../components/BfCurrentViewer/Home.tsx';
import BfContentCollection__ContentCollection__resolver_reader from '../../BfContentCollection/ContentCollection/resolver_reader.ts';
import BfCurrentViewerLoggedOut__DemoButton__resolver_reader from '../../BfCurrentViewerLoggedOut/DemoButton/resolver_reader.ts';
import BfCurrentViewerLoggedOut__asBfCurrentViewerLoggedOut__resolver_reader from '../../BfCurrentViewerLoggedOut/asBfCurrentViewerLoggedOut/resolver_reader.ts';

const readerAst: ReaderAst<BfCurrentViewer__Home__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
  {
    kind: "Linked",
    fieldName: "contentCollection",
    alias: null,
    arguments: [
      [
        "slug",
        { kind: "String", value: "marketing" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "ContentCollection",
        arguments: null,
        readerArtifact: BfContentCollection__ContentCollection__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
  },
  {
    kind: "Linked",
    fieldName: "asBfCurrentViewerLoggedOut",
    alias: null,
    arguments: null,
    condition: BfCurrentViewerLoggedOut__asBfCurrentViewerLoggedOut__resolver_reader,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "DemoButton",
        arguments: null,
        readerArtifact: BfCurrentViewerLoggedOut__DemoButton__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
  },
];

const artifact: ComponentReaderArtifact<
  BfCurrentViewer__Home__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "BfCurrentViewer.Home",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
