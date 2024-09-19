/**
 * @generated SignedSource<<fac464e7be7cff9f4a3f67314049a9ac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchResultListItemSubscription$variables = {
  id: string;
};
export type ClipSearchResultListItemSubscription$data = {
  readonly node: {
    readonly query?: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ClipSearchResultListItem_bfSearchResult">;
  } | null | undefined;
};
export type ClipSearchResultListItemSubscription = {
  response: ClipSearchResultListItemSubscription$data;
  variables: ClipSearchResultListItemSubscription$variables;
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "query",
      "storageKey": null
    }
  ],
  "type": "BfSearchResult",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipSearchResultListItemSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ClipSearchResultListItem_bfSearchResult"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ClipSearchResultListItemSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
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
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "49c546e606faa643851a19463eedc5d6",
    "id": null,
    "metadata": {},
    "name": "ClipSearchResultListItemSubscription",
    "operationKind": "subscription",
    "text": "subscription ClipSearchResultListItemSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...ClipSearchResultListItem_bfSearchResult\n    ... on BfSearchResult {\n      query\n    }\n    id\n  }\n}\n\nfragment ClipSearchResultListItem_bfSearchResult on BfSearchResult {\n  query\n  id\n}\n"
  }
};
})();

(node as any).hash = "4395b77ae502e09b08e56e7865dd5108";

export default node;
