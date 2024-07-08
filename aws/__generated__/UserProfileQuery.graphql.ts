/**
 * @generated SignedSource<<38cd36da8299467524605d613723ad01>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserProfileQuery$variables = Record<PropertyKey, never>;
export type UserProfileQuery$data = {
  readonly currentViewer: {
    readonly actor: {
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly person: {
      readonly accounts: {
        readonly nodes: ReadonlyArray<{
          readonly displayName: string | null | undefined;
          readonly id: string | null | undefined;
          readonly organizationBfGid: string | null | undefined;
        } | null | undefined> | null | undefined;
        readonly pageInfo: {
          readonly hasNextPage: boolean;
        };
      } | null | undefined;
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type UserProfileQuery = {
  response: UserProfileQuery$data;
  variables: UserProfileQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "BfPerson",
  "kind": "LinkedField",
  "name": "person",
  "plural": false,
  "selections": [
    (v1/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "BfAccountConnection",
      "kind": "LinkedField",
      "name": "accounts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "BfAccount",
          "kind": "LinkedField",
          "name": "nodes",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "displayName",
              "storageKey": null
            },
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "organizationBfGid",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "accounts(first:10)"
    }
  ],
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserProfileQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserProfileQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0842477745c73fc2bb9e9b6eb33d0172",
    "id": null,
    "metadata": {},
    "name": "UserProfileQuery",
    "operationKind": "query",
    "text": "query UserProfileQuery {\n  currentViewer {\n    __typename\n    actor {\n      __typename\n      name\n      id\n    }\n    person {\n      id\n      accounts(first: 10) {\n        pageInfo {\n          hasNextPage\n        }\n        nodes {\n          displayName\n          id\n          organizationBfGid\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "be20d1fd460048a23177afd4392bf72c";

export default node;
