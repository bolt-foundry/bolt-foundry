/**
 * @generated SignedSource<<99f40f63940478eb923719bfbc68cdc3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchPageQuery$variables = Record<PropertyKey, never>;
export type ClipSearchPageQuery$data = {
  readonly currentViewer: {
    readonly organization: {
      readonly id: string;
      readonly media: {
        readonly count: number | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly person: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"ClipsView_bfPerson">;
    } | null | undefined;
  } | null | undefined;
};
export type ClipSearchPageQuery = {
  response: ClipSearchPageQuery$data;
  variables: ClipSearchPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "BfOrganization",
  "kind": "LinkedField",
  "name": "organization",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "BfMediaConnection",
      "kind": "LinkedField",
      "name": "media",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "count",
          "storageKey": null
        }
      ],
      "storageKey": "media(first:100)"
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipSearchPageQuery",
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
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ClipsView_bfPerson"
              }
            ],
            "storageKey": null
          },
          (v1/*: any*/)
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
    "name": "ClipSearchPageQuery",
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
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "googleAuthAccessToken",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "43bf5c1dce8c9ccfdae54549b0addd77",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageQuery",
    "operationKind": "query",
    "text": "query ClipSearchPageQuery {\n  currentViewer {\n    __typename\n    person {\n      id\n      ...ClipsView_bfPerson\n    }\n    organization {\n      id\n      media(first: 100) {\n        count\n      }\n    }\n  }\n}\n\nfragment ClipsView_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n"
  }
};
})();

(node as any).hash = "ec26f9dcc0e0f543d97da3ecc937f9f9";

export default node;
