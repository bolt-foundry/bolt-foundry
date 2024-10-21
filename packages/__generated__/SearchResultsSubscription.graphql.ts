/**
 * @generated SignedSource<<16ff032ec287dd5b7a03b1206aed2433>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResultsSubscription$variables = {
  id: string;
};
export type SearchResultsSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"SearchResults_bfSavedSearch">;
  } | null | undefined;
};
export type SearchResultsSubscription = {
  response: SearchResultsSubscription$data;
  variables: SearchResultsSubscription$variables;
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
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startTime",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endTime",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "percentageRendered",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchResultsSubscription",
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
            "name": "SearchResults_bfSavedSearch"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SearchResultsSubscription",
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
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "query",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10
                  }
                ],
                "concreteType": "BfSavedSearchResultConnection",
                "kind": "LinkedField",
                "name": "searchResults",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "count",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BfSavedSearchResultEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BfSavedSearchResult",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "body",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "description",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "rationale",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "topics",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "confidence",
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Word",
                            "kind": "LinkedField",
                            "name": "words",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "text",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "speaker",
                                "storageKey": null
                              },
                              (v3/*: any*/),
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "VideoDownloadable",
                            "kind": "LinkedField",
                            "name": "downloadable",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": null
                              },
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "ready",
                                "storageKey": null
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
                "storageKey": "searchResults(first:10)"
              }
            ],
            "type": "BfSavedSearch",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6c49a16574a904af3a4b568fbd00b1a3",
    "id": null,
    "metadata": {},
    "name": "SearchResultsSubscription",
    "operationKind": "subscription",
    "text": "subscription SearchResultsSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...SearchResults_bfSavedSearch\n    id\n  }\n}\n\nfragment ClipEditButton_bfSavedSearchResult on BfSavedSearchResult {\n  id\n  title\n  startTime\n  endTime\n  description\n  words {\n    text\n    speaker\n    startTime\n    endTime\n  }\n  ...ClipEditModal_bfSavedSearchResult\n}\n\nfragment ClipEditModal_bfSavedSearchResult on BfSavedSearchResult {\n  id\n  title\n  description\n  startTime\n  endTime\n  words {\n    text\n    startTime\n    endTime\n    speaker\n  }\n}\n\nfragment DownloadClipButton_bfSavedSearchResult on BfSavedSearchResult {\n  id\n  startTime\n  endTime\n  title\n  percentageRendered\n  downloadable {\n    url\n    percentageRendered\n    ready\n  }\n  words {\n    text\n    startTime\n    endTime\n  }\n}\n\nfragment SearchResult_bfSavedSearchResult on BfSavedSearchResult {\n  id\n  title\n  body\n  description\n  rationale\n  topics\n  confidence\n  startTime\n  endTime\n  ...ClipEditButton_bfSavedSearchResult\n  ...DownloadClipButton_bfSavedSearchResult\n}\n\nfragment SearchResults_bfSavedSearch on BfSavedSearch {\n  query\n  id\n  searchResults(first: 10) {\n    count\n    edges {\n      node {\n        id\n        body\n        ...SearchResult_bfSavedSearchResult\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "86c0fbe30e00b2f4aaf52e55d4ede2d3";

export default node;
