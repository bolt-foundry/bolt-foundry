/**
 * @generated SignedSource<<b63909a92017cb196dddeeeee2fa0215>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PillStatusTranscript_bfTranscript$data = {
  readonly id: string;
  readonly status: string | null | undefined;
  readonly " $fragmentType": "PillStatusTranscript_bfTranscript";
};
export type PillStatusTranscript_bfTranscript$key = {
  readonly " $data"?: PillStatusTranscript_bfTranscript$data;
  readonly " $fragmentSpreads": FragmentRefs<"PillStatusTranscript_bfTranscript">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PillStatusTranscript_bfTranscript",
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
      "name": "status",
      "storageKey": null
    }
  ],
  "type": "BfMediaNodeTranscript",
  "abstractKey": null
};

(node as any).hash = "00ff2458251a64f7013ac6341241e53e";

export default node;
