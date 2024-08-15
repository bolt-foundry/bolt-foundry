/**
 * @generated SignedSource<<91d54a98f0a7b647b0a023130dc4077e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DownloadClipButtonDownloadMutation$variables = {
  endTime: number;
  mediaId: string;
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
  "name": "mediaId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "transcriptId"
},
v4 = [
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
        "name": "mediaId",
        "variableName": "mediaId"
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "33f11e38002e31623637200d1c3cc280",
    "id": null,
    "metadata": {},
    "name": "DownloadClipButtonDownloadMutation",
    "operationKind": "mutation",
    "text": "mutation DownloadClipButtonDownloadMutation(\n  $startTime: Float!\n  $endTime: Float!\n  $mediaId: String!\n  $transcriptId: String!\n) {\n  downloadClip(startTime: $startTime, endTime: $endTime, mediaId: $mediaId, transcriptId: $transcriptId) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "51dcf4c41b390dc46681dffcf8c887e3";

export default node;
