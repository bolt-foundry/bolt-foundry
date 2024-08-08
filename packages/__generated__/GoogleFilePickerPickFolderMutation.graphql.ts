/**
 * @generated SignedSource<<460beb97f2f4d017f686bd0962e19fbf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GoogleFilePickerPickFolderMutation$variables = {
  folderId: string;
};
export type GoogleFilePickerPickFolderMutation$data = {
  readonly pickGoogleDriveFolder: {
    readonly __typename: "BfGoogleDriveFolder";
  } | null | undefined;
};
export type GoogleFilePickerPickFolderMutation = {
  response: GoogleFilePickerPickFolderMutation$data;
  variables: GoogleFilePickerPickFolderMutation$variables;
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
    "name": "GoogleFilePickerPickFolderMutation",
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
    "name": "GoogleFilePickerPickFolderMutation",
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
    "cacheID": "db422253bc0802fc4dfa63dacfb8a4c1",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerPickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleFilePickerPickFolderMutation(\n  $folderId: String!\n) {\n  pickGoogleDriveFolder(folderId: $folderId) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f955ea65cbe06461e5e6b4ab58307f0a";

export default node;
