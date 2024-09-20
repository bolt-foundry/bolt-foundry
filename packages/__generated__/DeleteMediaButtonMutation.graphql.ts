/**
 * @generated SignedSource<<44ee0eaa7b2d7d6ccf5cd2ff3b5c9a67>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteMediaButtonMutation$variables = {
  id: string;
};
export type DeleteMediaButtonMutation$data = {
  readonly deleteMedia: {
    readonly id: string;
  } | null | undefined;
};
export type DeleteMediaButtonMutation = {
  response: DeleteMediaButtonMutation$data;
  variables: DeleteMediaButtonMutation$variables;
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
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteMediaButtonMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfMedia",
        "kind": "LinkedField",
        "name": "deleteMedia",
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
    "name": "DeleteMediaButtonMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfMedia",
        "kind": "LinkedField",
        "name": "deleteMedia",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "id"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ee3c19c2f32c954bb5409973daa5d6e8",
    "id": null,
    "metadata": {},
    "name": "DeleteMediaButtonMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteMediaButtonMutation(\n  $id: String!\n) {\n  deleteMedia(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2aa205ec82f93467f080168a668ec157";

export default node;
