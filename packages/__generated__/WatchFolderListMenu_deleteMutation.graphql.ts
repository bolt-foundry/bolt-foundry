/**
 * @generated SignedSource<<2f9b13004d56c97058035e7b75bbbc8b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type WatchFolderListMenu_deleteMutation$variables = {
  id?: string | null | undefined;
};
export type WatchFolderListMenu_deleteMutation$data = {
  readonly deleteGoogleDriveResource: {
    readonly id: string;
  } | null | undefined;
};
export type WatchFolderListMenu_deleteMutation = {
  response: WatchFolderListMenu_deleteMutation$data;
  variables: WatchFolderListMenu_deleteMutation$variables;
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
        "name": "resourceId",
        "variableName": "id"
      }
    ],
    "concreteType": "BfGoogleDriveResource",
    "kind": "LinkedField",
    "name": "deleteGoogleDriveResource",
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
    "name": "WatchFolderListMenu_deleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WatchFolderListMenu_deleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4f21907c2f6645ffa6f27e01f5d21ead",
    "id": null,
    "metadata": {},
    "name": "WatchFolderListMenu_deleteMutation",
    "operationKind": "mutation",
    "text": "mutation WatchFolderListMenu_deleteMutation(\n  $id: String\n) {\n  deleteGoogleDriveResource(resourceId: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "b19e1a91fd8fbb93877bbccdca0a6a80";

export default node;
