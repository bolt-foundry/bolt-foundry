/**
 * @generated SignedSource<<5e1914222f6a879a91c3d7aa4f64d68b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type InternalBfPageCreateIngestionJobMutation$variables = {
  googleDriveFileId: string;
};
export type InternalBfPageCreateIngestionJobMutation$data = {
  readonly createBfNodeGoogleDriveFile: {
    readonly __typename: "BfNodeGoogleDriveFile";
    readonly id: string;
  } | null | undefined;
};
export type InternalBfPageCreateIngestionJobMutation = {
  response: InternalBfPageCreateIngestionJobMutation$data;
  variables: InternalBfPageCreateIngestionJobMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "googleDriveFileId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "googleDriveFileId",
        "variableName": "googleDriveFileId"
      }
    ],
    "concreteType": "BfNodeGoogleDriveFile",
    "kind": "LinkedField",
    "name": "createBfNodeGoogleDriveFile",
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
    "name": "InternalBfPageCreateIngestionJobMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "InternalBfPageCreateIngestionJobMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b8d2cf398f6369175ca5809bfbb0e35d",
    "id": null,
    "metadata": {},
    "name": "InternalBfPageCreateIngestionJobMutation",
    "operationKind": "mutation",
    "text": "mutation InternalBfPageCreateIngestionJobMutation(\n  $googleDriveFileId: String!\n) {\n  createBfNodeGoogleDriveFile(googleDriveFileId: $googleDriveFileId) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "817bbe9163eb10a0c5d3aea71ddc0bca";

export default node;
