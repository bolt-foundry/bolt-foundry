import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { CurrentViewer__Home__param } from './param_type.ts';
import { Home as resolver } from '../../../../components/BfCurrentViewer/Home.tsx';

const readerAst: ReaderAst<CurrentViewer__Home__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  CurrentViewer__Home__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "CurrentViewer.Home",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
