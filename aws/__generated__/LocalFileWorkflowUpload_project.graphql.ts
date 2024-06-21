/**
 * @generated SignedSource<<9880a9d09e5494ad4a1ff751b641cd30>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LocalFileWorkflowUpload_project$data = {
  readonly " $fragmentSpreads": FragmentRefs<"FileUpload_project">;
  readonly " $fragmentType": "LocalFileWorkflowUpload_project";
};
export type LocalFileWorkflowUpload_project$key = {
  readonly " $data"?: LocalFileWorkflowUpload_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"LocalFileWorkflowUpload_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocalFileWorkflowUpload_project",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FileUpload_project"
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "9db201b1568eb30d230ee770a16f6204";

export default node;
