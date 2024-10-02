/**
 * @generated SignedSource<<f73e9e9ed5808dcedc5f32f12512c32c>>
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
    readonly id: string;
    readonly name: string | null | undefined;
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
    "alias": null,
    "args": [
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
    "concreteType": "BfCollection",
    "kind": "LinkedField",
    "name": "addFolderToCollection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
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
        "name": "name",
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleFilePickerPickFolderMutation",
    "selections": (v2/*: any*/),
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
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d4c91a77b6a4beb73f157a64d2e5a976",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerPickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleFilePickerPickFolderMutation(\n  $resourceId: String!\n  $name: String!\n) {\n  addFolderToCollection(googleDriveResourceId: $resourceId, name: $name) {\n    __typename\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "37c7a6e7d49e4e92be9739eac59500dc";

export default node;
