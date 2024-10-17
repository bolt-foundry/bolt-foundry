/**
 * @generated SignedSource<<4afe777f35adb937130ec41a283708df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DownloadClipButtonDownloadMutation$variables = {
  id: string;
};
export type DownloadClipButtonDownloadMutation$data = {
  readonly downloadClip: {
    readonly id: string | null | undefined;
  } | null | undefined;
};
export type DownloadClipButtonDownloadMutation = {
  response: DownloadClipButtonDownloadMutation$data;
  variables: DownloadClipButtonDownloadMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "DownloadMutationType",
    "kind": "LinkedField",
    "name": "downloadClip",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DownloadClipButtonDownloadMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6efaeebf63871a55f402336e94daab6c",
    "id": null,
    "metadata": {},
    "name": "DownloadClipButtonDownloadMutation",
    "operationKind": "mutation",
    "text": "mutation DownloadClipButtonDownloadMutation(\n  $id: ID!\n) {\n  downloadClip(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "00fa7019f1f5ed4c0485f9c8d3afc44e";

export default node;
