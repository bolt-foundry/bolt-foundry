/**
 * @generated SignedSource<<4ba36a8f245e8062e4f1ca145d96649f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type TopNavLogoutMutation$variables = Record<PropertyKey, never>;
export type TopNavLogoutMutation$data = {
  readonly logout: {
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type TopNavLogoutMutation = {
  response: TopNavLogoutMutation$data;
  variables: TopNavLogoutMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TopNavLogoutMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "logout",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TopNavLogoutMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "logout",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    "cacheID": "8f9d240b553a7798330dbd9d8fc005c1",
    "id": null,
    "metadata": {},
    "name": "TopNavLogoutMutation",
    "operationKind": "mutation",
    "text": "mutation TopNavLogoutMutation {\n  logout {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "836a17543d6802c1dce0f51eeab65e79";

export default node;
