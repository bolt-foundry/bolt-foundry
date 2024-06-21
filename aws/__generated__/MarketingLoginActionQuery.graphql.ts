/**
 * @generated SignedSource<<ad0dae3dc400657db2633f7feb209a3a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type MarketingLoginActionQuery$variables = Record<PropertyKey, never>;
export type MarketingLoginActionQuery$data = {
  readonly me: {
    readonly id: string | null | undefined;
  } | null | undefined;
};
export type MarketingLoginActionQuery = {
  response: MarketingLoginActionQuery$data;
  variables: MarketingLoginActionQuery$variables;
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
    "name": "MarketingLoginActionQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MarketingLoginActionQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "360d3f01e12ac862386abc4011ae35d9",
    "id": null,
    "metadata": {},
    "name": "MarketingLoginActionQuery",
    "operationKind": "query",
    "text": "query MarketingLoginActionQuery {\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "399f55966c03f294ba32a8b8ee57a4c8";

export default node;
