/**
 * @generated SignedSource<<e7d56cab3466a5d71c0c8be8380f5183>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UserProfileLogoutMutation$variables = Record<PropertyKey, never>;
export type UserProfileLogoutMutation$data = {
  readonly logout: {
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type UserProfileLogoutMutation = {
  response: UserProfileLogoutMutation$data;
  variables: UserProfileLogoutMutation$variables;
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
    "name": "UserProfileLogoutMutation",
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
    "name": "UserProfileLogoutMutation",
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
    "cacheID": "91a2914ee4f6b2abfae3f99fe45936f6",
    "id": null,
    "metadata": {},
    "name": "UserProfileLogoutMutation",
    "operationKind": "mutation",
    "text": "mutation UserProfileLogoutMutation {\n  logout {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9f7b57c3f55358825927b7ced90f80e3";

export default node;
