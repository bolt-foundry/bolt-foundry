/**
 * @generated SignedSource<<a9cbaf81ab2a3f5225c5cf42044df170>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectPageOldSubscription$variables = {
  count: number;
  cursor?: string | null | undefined;
  id: string;
};
export type ProjectPageOldSubscription$data = {
  readonly project: {
    readonly clips: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"useClipData_clip" | "useClipEditData_clip">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
      };
    } | null | undefined;
    readonly isReadyToView: boolean | null | undefined;
  } | null | undefined;
};
export type ProjectPageOldSubscription = {
  response: ProjectPageOldSubscription$data;
  variables: ProjectPageOldSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isReadyToView",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v8 = {
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasPreviousPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v9 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectPageOldSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": "clips",
            "args": null,
            "concreteType": "ClipConnection",
            "kind": "LinkedField",
            "name": "__ClipList_project_clips_connection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ClipEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Clip",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "useClipData_clip"
                      },
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "useClipEditData_clip"
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/)
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProjectPageOldSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "ClipConnection",
            "kind": "LinkedField",
            "name": "clips",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ClipEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Clip",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isStarred",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "manualCrop",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "manualCropActive",
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
                        "name": "downloadUrl",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "encodingStatus",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "end_index",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "end_time",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endTimeOverride",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "start_index",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "start_time",
                        "storageKey": null
                      },
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
                        "name": "title",
                        "storageKey": null
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "ClipList_project_clips",
            "kind": "LinkedHandle",
            "name": "clips"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1bef8e15761ccd8619841e8df31072d0",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": "count",
          "cursor": "cursor",
          "direction": "forward",
          "path": [
            "project",
            "clips"
          ]
        }
      ]
    },
    "name": "ProjectPageOldSubscription",
    "operationKind": "subscription",
    "text": "subscription ProjectPageOldSubscription(\n  $id: ID!\n  $count: Int!\n  $cursor: String\n) {\n  project(id: $id) {\n    isReadyToView\n    clips(first: $count, after: $cursor) {\n      edges {\n        node {\n          id\n          ...useClipData_clip\n          ...useClipEditData_clip\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n    id\n  }\n}\n\nfragment DownloadClip_clip on Clip {\n  id\n  start_time\n  end_time\n  manualCrop\n  manualCropActive\n  title\n}\n\nfragment ManualCropMenu_clip on Clip {\n  id\n  manualCrop\n  manualCropActive\n}\n\nfragment StarClipButton_clip on Clip {\n  id\n  isStarred\n}\n\nfragment useClipData_clip on Clip {\n  ...StarClipButton_clip\n  ...ManualCropMenu_clip\n  id\n  description\n  downloadUrl\n  encodingStatus\n  end_index\n  end_time\n  endTimeOverride\n  start_index\n  start_time\n  text\n  title\n  manualCrop\n  manualCropActive\n  ...DownloadClip_clip\n}\n\nfragment useClipEditData_clip on Clip {\n  ...StarClipButton_clip\n  ...ManualCropMenu_clip\n  id\n  description\n  downloadUrl\n  encodingStatus\n  end_index\n  end_time\n  endTimeOverride\n  start_index\n  start_time\n  text\n  title\n  manualCrop\n  manualCropActive\n  ...DownloadClip_clip\n}\n"
  }
};
})();

(node as any).hash = "9b7060188f2377549b1e5ce459106cb2";

export default node;
