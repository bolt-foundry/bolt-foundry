import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { CurrentViewer__LogInOrOutButton__param } from './param_type.ts';
import { LogInOrOutButton as resolver } from '../../../../components/LogInOrOutButton.tsx';

const readerAst: ReaderAst<CurrentViewer__LogInOrOutButton__param> = [
  {
    kind: "Scalar",
    fieldName: "__typename",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
  {
    kind: "Scalar",
    fieldName: "id",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
  {
    kind: "Scalar",
    fieldName: "orgBfOid",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
  {
    kind: "Scalar",
    fieldName: "personBfGid",
    alias: null,
    arguments: null,
    isUpdatable: false,
  },
];

const artifact: ComponentReaderArtifact<
  CurrentViewer__LogInOrOutButton__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "CurrentViewer.LogInOrOutButton",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
