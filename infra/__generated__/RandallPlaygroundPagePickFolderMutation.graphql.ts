/**
 * @generated SignedSource<<e6e46a8eb6878f84b39c5c47bddc680d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RandallPlaygroundPagePickFolderMutation$variables = {
  folderId: string;
};
export type RandallPlaygroundPagePickFolderMutation$data = {
  readonly pickGoogleDriveFolder: {
    readonly __typename: "BfGoogleDriveFolder";
  } | null | undefined;
};
export type RandallPlaygroundPagePickFolderMutation = {
  response: RandallPlaygroundPagePickFolderMutation$data;
  variables: RandallPlaygroundPagePickFolderMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "folderId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "folderId",
    "variableName": "folderId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RandallPlaygroundPagePickFolderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfGoogleDriveFolder",
        "kind": "LinkedField",
        "name": "pickGoogleDriveFolder",
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
    "name": "RandallPlaygroundPagePickFolderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfGoogleDriveFolder",
        "kind": "LinkedField",
        "name": "pickGoogleDriveFolder",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "cacheID": "44c5b63c014ae5caafe1d370a479550c",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPagePickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation RandallPlaygroundPagePickFolderMutation(\n  $folderId: String!\n) {\n  pickGoogleDriveFolder(folderId: $folderId) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "53929d8e2861e2e01407ae8feffbcec5";

export default node;
