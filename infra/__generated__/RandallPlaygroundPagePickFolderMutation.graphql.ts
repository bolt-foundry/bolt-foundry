/**
 * @generated SignedSource<<2c95dddf944feb71ada2a26e094545ce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RandallPlaygroundPagePickFolderMutation$variables = {
  resourceId: string;
};
export type RandallPlaygroundPagePickFolderMutation$data = {
  readonly pickGoogleDriveFolder: {
    readonly __typename: "BfGoogleDriveResource";
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
    "name": "resourceId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "resourceId",
    "variableName": "resourceId"
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
        "concreteType": "BfGoogleDriveResource",
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
        "concreteType": "BfGoogleDriveResource",
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
    "cacheID": "d90606537ea85119ba38b8022940232f",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPagePickFolderMutation",
    "operationKind": "mutation",
    "text": "mutation RandallPlaygroundPagePickFolderMutation(\n  $resourceId: String!\n) {\n  pickGoogleDriveFolder(resourceId: $resourceId) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "94cf853ed910c88bd30956d1d31b867b";

export default node;
