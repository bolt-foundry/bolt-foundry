/**
 * @generated SignedSource<<503ecb294fa93c778a3168124914e22e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type LoginPageQuery$variables = Record<PropertyKey, never>;
export type LoginPageQuery$data = {
  readonly me: {
    readonly id: string | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type LoginPageQuery = {
  response: LoginPageQuery$data;
  variables: LoginPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Person",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginPageQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LoginPageQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2feedd70871f3fddb143e385c41bc744",
    "id": null,
    "metadata": {},
    "name": "LoginPageQuery",
    "operationKind": "query",
    "text": "query LoginPageQuery {\n  me {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f45aaf54651597a6895a8e870adee155";

export default node;
