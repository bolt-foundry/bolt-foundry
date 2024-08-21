/**
 * @generated SignedSource<<81431102e3cf4ee94e2441f14f5a52d8>>
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
  title: string;
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
  "name": "title"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "transcriptId"
},
v5 = [
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
        "name": "title",
        "variableName": "title"
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
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v5/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "750096a411987748567dff6cafb2f4ed",
    "id": null,
    "metadata": {},
    "name": "DownloadClipButtonDownloadMutation",
    "operationKind": "mutation",
    "text": "mutation DownloadClipButtonDownloadMutation(\n  $startTime: Float!\n  $endTime: Float!\n  $mediaId: String!\n  $title: String!\n  $transcriptId: String!\n) {\n  downloadClip(startTime: $startTime, endTime: $endTime, mediaId: $mediaId, title: $title, transcriptId: $transcriptId) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "f9f9075bcb9416cd5af96f5bed8a70df";

export default node;
