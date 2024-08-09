/**
 * @generated SignedSource<<a6f5c2e927ee2e6028f3be3e94de068b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GoogleFilePickerPickFolderMutation$variables = {
  folderId: string;
  name: string;
};
export type GoogleFilePickerPickFolderMutation$data = {
  readonly pickGoogleDriveFolder: {
    readonly __typename: "BfGoogleDriveFolder";
    readonly id: string;
    readonly name: string | null | undefined;
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "folderId",
        "variableName": "folderId"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "BfGoogleDriveFolder",
    "kind": "LinkedField",
    "name": "pickGoogleDriveFolder",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleFilePickerPickFolderMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GoogleFilePickerPickFolderMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d9e5fcbd77562d0001d1edf62ce9538c",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerPickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleFilePickerPickFolderMutation(\n  $folderId: String!\n  $name: String!\n) {\n  pickGoogleDriveFolder(folderId: $folderId, name: $name) {\n    __typename\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "d56965aa3857e29ba3bee5a1efc990ee";

export default node;
