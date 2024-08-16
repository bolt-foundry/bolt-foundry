/**
 * @generated SignedSource<<eece85df4da1d66471e0b1a9af53c469>>
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
    readonly success: boolean;
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
    "concreteType": "DeleteMutationPayload",
    "kind": "LinkedField",
    "name": "deleteGoogleDriveResource",
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
    "cacheID": "9c61c749dfe40393e5b8060717fd8a95",
    "id": null,
    "metadata": {},
    "name": "WatchFolderListMenu_deleteMutation",
    "operationKind": "mutation",
    "text": "mutation WatchFolderListMenu_deleteMutation(\n  $id: String\n) {\n  deleteGoogleDriveResource(resourceId: $id) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "31e61eb2b75babc625586a51f4fde386";

export default node;
