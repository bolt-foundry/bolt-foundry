import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { BfCurrentViewer__DemoButton__param } from './param_type.ts';
import { DemoButton as resolver } from '../../../../components/BfCurrentViewer/DemoButton.tsx';

const readerAst: ReaderAst<BfCurrentViewer__DemoButton__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  BfCurrentViewer__DemoButton__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "BfCurrentViewer.DemoButton",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
