/**
 * @generated SignedSource<<89bcbcc06e6e3844229806cc365620cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateNewProject_project$data = {
  readonly videoUrl: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"FileUpload_project" | "LocalFileWorkflowUpload_project" | "WorkflowClipStep_project" | "WorkflowTranscribeStep_project">;
  readonly " $fragmentType": "CreateNewProject_project";
};
export type CreateNewProject_project$key = {
  readonly " $data"?: CreateNewProject_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"CreateNewProject_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateNewProject_project",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "videoUrl",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FileUpload_project"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkflowClipStep_project"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkflowTranscribeStep_project"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LocalFileWorkflowUpload_project"
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "faab56f269fa248f45ef526693a3f325";

export default node;
