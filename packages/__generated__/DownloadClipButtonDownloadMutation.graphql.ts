/**
 * @generated SignedSource<<8ee9d05446a568f2779044baf7686a1e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DownloadClipButtonDownloadMutation$variables = {
  endTime: number;
  startTime: number;
  transcriptId: string;
};
export type DownloadClipButtonDownloadMutation$data = {
  readonly downloadClip: {
    readonly success: boolean;
  } | null | undefined;
};
export type DownloadClipButtonDownloadMutation = {
  response: DownloadClipButtonDownloadMutation$data;
  variables: DownloadClipButtonDownloadMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTime"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "transcriptId"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "endTime",
        "variableName": "endTime"
      },
      {
        "kind": "Variable",
        "name": "startTime",
        "variableName": "startTime"
      },
      {
        "kind": "Variable",
        "name": "transcriptId",
        "variableName": "transcriptId"
      }
    ],
    "concreteType": "DownloadMutationPayload",
    "kind": "LinkedField",
    "name": "downloadClip",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "88ac304b582e150ea0aedbcb2c0127c3",
    "id": null,
    "metadata": {},
    "name": "DownloadClipButtonDownloadMutation",
    "operationKind": "mutation",
    "text": "mutation DownloadClipButtonDownloadMutation(\n  $startTime: Float!\n  $endTime: Float!\n  $transcriptId: String!\n) {\n  downloadClip(startTime: $startTime, endTime: $endTime, transcriptId: $transcriptId) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "7fb5a58475e503b3d86a6102432d2990";

export default node;
