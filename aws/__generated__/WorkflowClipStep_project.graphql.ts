/**
 * @generated SignedSource<<85e01778fa10bb64ca28a0b6598c2f83>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WorkflowClipStep_project$data = {
  readonly clipsLength: number | null | undefined;
  readonly clipsStatus: {
    readonly progress: number | null | undefined;
    readonly status: string | null | undefined;
  } | null | undefined;
  readonly id: string | null | undefined;
  readonly transcriptLength: number | null | undefined;
  readonly " $fragmentType": "WorkflowClipStep_project";
};
export type WorkflowClipStep_project$key = {
  readonly " $data"?: WorkflowClipStep_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"WorkflowClipStep_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkflowClipStep_project",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "transcriptLength",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ClipsStatus",
      "kind": "LinkedField",
      "name": "clipsStatus",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "progress",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "clipsLength",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "be42b50663a8bbf00defa134f8d40a0d";

export default node;
