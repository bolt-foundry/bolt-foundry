/**
 * @generated SignedSource<<fd44188f3ab421ce9bebd496507e9fcf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PageFrameQuery$variables = Record<PropertyKey, never>;
export type PageFrameQuery$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"LeftNav_me" | "ProjectListMobile_me" | "SettingsQuery_me">;
  } | null | undefined;
};
export type PageFrameQuery = {
  response: PageFrameQuery$data;
  variables: PageFrameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  }
],
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
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PageFrameQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LeftNav_me"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ProjectListMobile_me"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SettingsQuery_me"
          }
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
    "name": "PageFrameQuery",
    "selections": [
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
            "args": (v0/*: any*/),
            "concreteType": "ProjectConnection",
            "kind": "LinkedField",
            "name": "projects",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ProjectEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Project",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
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
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "projects(first:30)"
          },
          {
            "alias": null,
            "args": (v0/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "ProjectList_projects",
            "kind": "LinkedHandle",
            "name": "projects"
          },
          {
            "alias": null,
            "args": (v0/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "ProjectListMobile_projects",
            "kind": "LinkedHandle",
            "name": "projects"
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Settings",
            "kind": "LinkedField",
            "name": "settings",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "additionalJson",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "captionColor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "captionHighlightColor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "captionLines",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "captionWordsPerLine",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "censorShowFirstLetter",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "censorSwears",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "censorUseAsterisks",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "font",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "minimumWords",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "ratio",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "showCaptions",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "showTrackingDebug",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "showWatermark",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "template",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "useAutocropping",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "useTracking",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "watermarkLogo",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "watermarkOpacity",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "watermarkPosition",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "largeMovementThresholdPct",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "46c86a1bb56e1cd5aa3b19f5c5a2c0c0",
    "id": null,
    "metadata": {},
    "name": "PageFrameQuery",
    "operationKind": "query",
    "text": "query PageFrameQuery {\n  me {\n    ...LeftNav_me\n    ...ProjectListMobile_me\n    ...SettingsQuery_me\n    id\n  }\n}\n\nfragment LeftNav_me on Person {\n  ...ProjectList_me\n}\n\nfragment ProjectListItem_Project on Project {\n  id\n  name\n}\n\nfragment ProjectListMobile_me on Person {\n  projects(first: 30) {\n    edges {\n      node {\n        id\n        name\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ProjectList_me on Person {\n  projects(first: 30) {\n    edges {\n      node {\n        id\n        ...ProjectListItem_Project\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment SettingsFormQuery_settings on Settings {\n  additionalJson\n  captionColor\n  captionHighlightColor\n  captionLines\n  captionWordsPerLine\n  censorShowFirstLetter\n  censorSwears\n  censorUseAsterisks\n  font\n  minimumWords\n  ratio\n  showCaptions\n  showTrackingDebug\n  showWatermark\n  template\n  useAutocropping\n  useTracking\n  watermarkLogo\n  watermarkOpacity\n  watermarkPosition\n  largeMovementThresholdPct\n}\n\nfragment SettingsProjectTabQuery_me on Person {\n  id\n  settings {\n    ...SettingsFormQuery_settings\n  }\n}\n\nfragment SettingsQuery_me on Person {\n  ...SettingsProjectTabQuery_me\n  name\n  email\n}\n"
  }
};
})();

(node as any).hash = "af319b635a2cdce1907778804e582a69";

export default node;
