/**
 * @generated SignedSource<<b585820664bb8d0e0e9cbdb0ed13ecf9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GoogleFilePickerPickFolderMutation$variables = {
  name: string;
  resourceId: string;
};
export type GoogleFilePickerPickFolderMutation$data = {
  readonly addFolderToCollection: {
    readonly __typename: "BfCollection";
  } | null | undefined;
};
export type GoogleFilePickerPickFolderMutation = {
  response: GoogleFilePickerPickFolderMutation$data;
  variables: GoogleFilePickerPickFolderMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resourceId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "googleDriveResourceId",
    "variableName": "resourceId"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleFilePickerPickFolderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BfCollection",
        "kind": "LinkedField",
        "name": "addFolderToCollection",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "GoogleFilePickerPickFolderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BfCollection",
        "kind": "LinkedField",
        "name": "addFolderToCollection",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "ff5f383e30529ac0173a7b6765f1e1ef",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerPickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleFilePickerPickFolderMutation(\n  $resourceId: String!\n  $name: String!\n) {\n  addFolderToCollection(googleDriveResourceId: $resourceId, name: $name) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1534db34aff3db05d9f9065312442df8";

export default node;
