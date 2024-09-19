/**
 * @generated SignedSource<<a17b36048b70b5975c7bd55a9aa786a9>>
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
    "kind": "Variable",
    "name": "resourceId",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WatchFolderListMenu_deleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfGoogleDriveResource",
        "kind": "LinkedField",
        "name": "deleteGoogleDriveResource",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WatchFolderListMenu_deleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfGoogleDriveResource",
        "kind": "LinkedField",
        "name": "deleteGoogleDriveResource",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "id"
          }
        ],
        "storageKey": null
      }
    ]
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

(node as any).hash = "380249d2bdfddd2677ab104135ccdc60";

export default node;
