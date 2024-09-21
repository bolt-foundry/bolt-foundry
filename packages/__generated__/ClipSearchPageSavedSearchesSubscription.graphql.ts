/**
 * @generated SignedSource<<8950112e3f6f91e8c9bf1043d6cbc404>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type ClipSearchPageSavedSearchesSubscription$variables = {
  connections: ReadonlyArray<string>;
  organizationId: string;
};
export type ClipSearchPageSavedSearchesSubscription$data = {
  readonly connection: {
    readonly append: {
      readonly node: {
        readonly __typename: "BfSavedSearch";
        readonly id: string;
        readonly query?: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type ClipSearchPageSavedSearchesSubscription = {
  response: ClipSearchPageSavedSearchesSubscription$data;
  variables: ClipSearchPageSavedSearchesSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "organizationId"
  },
  {
    "kind": "Literal",
    "name": "targetClassName",
    "value": "BfSavedSearch"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "query",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipSearchPageSavedSearchesSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BfConnectionSubscriptionPayload",
        "kind": "LinkedField",
        "name": "connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BfConnectionEdge",
            "kind": "LinkedField",
            "name": "append",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ],
                    "type": "BfSavedSearch",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClipSearchPageSavedSearchesSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BfConnectionSubscriptionPayload",
        "kind": "LinkedField",
        "name": "connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BfConnectionEdge",
            "kind": "LinkedField",
            "name": "append",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v3/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v4/*: any*/)
                    ],
                    "type": "BfSavedSearch",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "appendNode",
                "key": "",
                "kind": "LinkedHandle",
                "name": "node",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "connections"
                  },
                  {
                    "kind": "Literal",
                    "name": "edgeTypeName",
                    "value": "BfSavedSearch"
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a9286220eb9b4c5f5ff63a52c53126c3",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageSavedSearchesSubscription",
    "operationKind": "subscription",
    "text": "subscription ClipSearchPageSavedSearchesSubscription(\n  $organizationId: ID!\n) {\n  connection(id: $organizationId, targetClassName: \"BfSavedSearch\") {\n    append {\n      node {\n        __typename\n        id\n        ... on BfSavedSearch {\n          query\n          id\n          __typename\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "72271fb71bde7d31f5cb159b0d699a2a";

export default node;
