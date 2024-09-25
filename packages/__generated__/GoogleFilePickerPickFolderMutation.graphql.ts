/**
 * @generated SignedSource<<51a52aea780b049c726ad99ea609c9e3>>
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
  readonly createCollection: {
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
    "name": "createCollection",
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
    "cacheID": "5a7c3d3757550c50d9301ea3fcc643a6",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerPickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleFilePickerPickFolderMutation(\n  $resourceId: String!\n  $name: String!\n) {\n  createCollection(googleDriveResourceId: $resourceId, name: $name) {\n    __typename\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "e59221c1ebfabadbf5b6c865ff61b601";

export default node;
