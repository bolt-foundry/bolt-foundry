/**
 * @generated SignedSource<<9a9ee67e9fe9c9cce07df8f52335c692>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectPageOldQuery$variables = {
  count: number;
  cursor?: string | null | undefined;
  includeProject: boolean;
  projectId: string;
};
export type ProjectPageOldQuery$data = {
  readonly project?: {
    readonly clips: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly __typename: "Clip";
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
    readonly " $fragmentSpreads": FragmentRefs<"CreateNewProject_project" | "ProjectView_project">;
  } | null | undefined;
};
export type ProjectPageOldQuery = {
  response: ProjectPageOldQuery$data;
  variables: ProjectPageOldQuery$variables;
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
  "name": "includeProject"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "projectId"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isReadyToView",
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
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ratio",
  "storageKey": null
},
v11 = [
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
],
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "transcriptLength",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectPageOldQuery",
    "selections": [
      {
        "condition": "includeProject",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "Project",
            "kind": "LinkedField",
            "name": "project",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ProjectView_project"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "CreateNewProject_project"
              },
              (v5/*: any*/),
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
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProjectPageOldQuery",
    "selections": [
      {
        "condition": "includeProject",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "Project",
            "kind": "LinkedField",
            "name": "project",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Settings",
                "kind": "LinkedField",
                "name": "effectiveSettings",
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
                  (v10/*: any*/),
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
              {
                "alias": null,
                "args": (v11/*: any*/),
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
                          (v9/*: any*/),
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
                            "name": "changeRequested",
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
                "args": (v11/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ClipList_project_clips",
                "kind": "LinkedHandle",
                "name": "clips"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "clipsLength",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1
                  }
                ],
                "concreteType": "TranscriptConnection",
                "kind": "LinkedField",
                "name": "transcripts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TranscriptEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Transcript",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          (v12/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "words",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "transcripts(first:1)"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "videoUrl",
                "storageKey": null
              },
              {
                "name": "opurl",
                "args": null,
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    (v9/*: any*/)
                  ],
                  "type": "Project",
                  "abstractKey": null
                },
                "kind": "RelayResolver",
                "storageKey": null,
                "isOutputType": true
              },
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
                "name": "overriddenSettingsKeys",
                "storageKey": null
              },
              (v10/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ClipsStatus",
                "kind": "LinkedField",
                "name": "clipsStatus",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progress",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "1da98a94e402cfcb3b713372b06869e6",
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
    "name": "ProjectPageOldQuery",
    "operationKind": "query",
    "text": "query ProjectPageOldQuery(\n  $projectId: ID!\n  $includeProject: Boolean!\n  $count: Int!\n  $cursor: String\n) {\n  project(id: $projectId) @include(if: $includeProject) {\n    ...ProjectView_project\n    ...CreateNewProject_project\n    isReadyToView\n    clips(first: $count, after: $cursor) {\n      edges {\n        node {\n          __typename\n          id\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n    id\n  }\n}\n\nfragment ChangeRequestButton_clip on Clip {\n  id\n  changeRequested\n}\n\nfragment ClipList_project on Project {\n  id\n  effectiveSettings {\n    ...SettingsFormQuery_settings\n    additionalJson\n    censorShowFirstLetter\n    censorSwears\n    censorUseAsterisks\n    captionColor\n    captionHighlightColor\n    captionLines\n    captionWordsPerLine\n    ratio\n    minimumWords\n    showCaptions\n    font\n    showWatermark\n    showTrackingDebug\n    template\n    useAutocropping\n    useTracking\n    watermarkLogo\n    watermarkOpacity\n    watermarkPosition\n    largeMovementThresholdPct\n  }\n  clips(first: $count, after: $cursor) {\n    edges {\n      node {\n        ...useClipData_clip\n        ...useClipEditData_clip\n        id\n        downloadUrl\n        end_index\n        start_index\n        text\n        isStarred\n        changeRequested\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  clipsLength\n  transcripts(first: 1) {\n    edges {\n      node {\n        id\n        transcriptLength\n        words\n      }\n    }\n  }\n  videoUrl\n  ...ProjectResolverOpurlResolver\n}\n\nfragment CreateNewProject_project on Project {\n  videoUrl\n  ...FileUpload_project\n  ...WorkflowClipStep_project\n  ...WorkflowTranscribeStep_project\n  ...LocalFileWorkflowUpload_project\n}\n\nfragment DownloadClip_clip on Clip {\n  id\n  start_time\n  end_time\n  manualCrop\n  manualCropActive\n  title\n}\n\nfragment FileUpload_project on Project {\n  id\n  ...ProjectResolverOpurlResolver\n}\n\nfragment LocalFileWorkflowUpload_project on Project {\n  ...FileUpload_project\n}\n\nfragment ManualCropMenu_clip on Clip {\n  id\n  manualCrop\n  manualCropActive\n}\n\nfragment Playbar_project on Project {\n  id\n  clips(first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n        start_time\n        end_time\n        title\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ProjectResolverOpurlResolver on Project {\n  id\n}\n\nfragment ProjectTitle_project on Project {\n  id\n  name\n}\n\nfragment ProjectView_project on Project {\n  ...ClipList_project\n  ...Playbar_project\n  ...ProjectTitle_project\n  ...SettingsProjectSidebarQuery_project\n  id\n  name\n  ratio\n  ...ProjectResolverOpurlResolver\n  clips(first: $count, after: $cursor) {\n    edges {\n      node {\n        __typename\n        id\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  videoUrl\n}\n\nfragment SettingsFormQuery_settings on Settings {\n  additionalJson\n  captionColor\n  captionHighlightColor\n  captionLines\n  captionWordsPerLine\n  censorShowFirstLetter\n  censorSwears\n  censorUseAsterisks\n  font\n  minimumWords\n  ratio\n  showCaptions\n  showTrackingDebug\n  showWatermark\n  template\n  useAutocropping\n  useTracking\n  watermarkLogo\n  watermarkOpacity\n  watermarkPosition\n  largeMovementThresholdPct\n}\n\nfragment SettingsProjectSidebarQuery_project on Project {\n  id\n  effectiveSettings {\n    ...SettingsFormQuery_settings\n  }\n  overriddenSettingsKeys\n}\n\nfragment StarClipButton_clip on Clip {\n  id\n  isStarred\n}\n\nfragment WorkflowClipStep_project on Project {\n  id\n  transcriptLength\n  clipsStatus {\n    progress\n    status\n  }\n  clipsLength\n}\n\nfragment WorkflowTranscribeStep_project on Project {\n  id\n  transcripts(first: 1) {\n    edges {\n      node {\n        transcriptLength\n        id\n      }\n    }\n  }\n  videoUrl\n  ...ProjectResolverOpurlResolver\n}\n\nfragment useClipData_clip on Clip {\n  ...StarClipButton_clip\n  ...ChangeRequestButton_clip\n  ...ManualCropMenu_clip\n  id\n  description\n  downloadUrl\n  encodingStatus\n  end_index\n  end_time\n  endTimeOverride\n  start_index\n  start_time\n  text\n  title\n  manualCrop\n  manualCropActive\n  ...DownloadClip_clip\n}\n\nfragment useClipEditData_clip on Clip {\n  ...StarClipButton_clip\n  ...ChangeRequestButton_clip\n  ...ManualCropMenu_clip\n  id\n  description\n  downloadUrl\n  encodingStatus\n  end_index\n  end_time\n  endTimeOverride\n  start_index\n  start_time\n  text\n  title\n  manualCrop\n  manualCropActive\n  ...DownloadClip_clip\n}\n"
  }
};
})();

(node as any).hash = "aeea0e0de7e32720ef6992a5cec52123";

export default node;
