/**
 * @generated SignedSource<<1af052eac5e5e11614f5eca1dea39877>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ProjectPageCreateGoogleDriveFileMutation$variables = {
  googleFileId: string;
};
export type ProjectPageCreateGoogleDriveFileMutation$data = {
  readonly createBfMediaGoogleDrive: {
    readonly googleFileId: string | null | undefined;
  } | null | undefined;
};
export type ProjectPageCreateGoogleDriveFileMutation = {
  response: ProjectPageCreateGoogleDriveFileMutation$data;
  variables: ProjectPageCreateGoogleDriveFileMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "googleFileId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "googleFileId",
    "variableName": "googleFileId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "googleFileId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectPageCreateGoogleDriveFileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfMediaGoogleDrive",
        "kind": "LinkedField",
        "name": "createBfMediaGoogleDrive",
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
    "name": "ProjectPageCreateGoogleDriveFileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfMediaGoogleDrive",
        "kind": "LinkedField",
        "name": "createBfMediaGoogleDrive",
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
    "cacheID": "f420bd64ad938a60fddad85693e37b58",
    "id": null,
    "metadata": {},
    "name": "ProjectPageCreateGoogleDriveFileMutation",
    "operationKind": "mutation",
    "text": "mutation ProjectPageCreateGoogleDriveFileMutation(\n  $googleFileId: String!\n) {\n  createBfMediaGoogleDrive(googleFileId: $googleFileId) {\n    googleFileId\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "3079595a7a506f67f56852dd8414aaa2";

export default node;
