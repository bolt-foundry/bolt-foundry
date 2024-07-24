/**
 * @generated SignedSource<<7e7c1fc7e9bb21c3dc0d580e66ce253a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import * as _____client_relay_localResolvers_ProjectResolver from "aws/client/relay/localResolvers/ProjectResolver.ts";
import * as __ClipListPaginationQuery_graphql from "aws/__generated__/./ClipListPaginationQuery.graphql.ts";
export type PositionEnum = "bottom_center" | "bottom_left" | "bottom_right" | "top_center" | "top_left" | "top_right" | "under_caption" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { opurl as projectOpurlResolverType } from "../client/relay/localResolvers/ProjectResolver.ts";
export type ClipList_project$data = {
  readonly clips: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly changeRequested: boolean | null | undefined;
        readonly downloadUrl: string | null | undefined;
        readonly end_index: number | null | undefined;
        readonly id: string | null | undefined;
        readonly isStarred: boolean | null | undefined;
        readonly start_index: number | null | undefined;
        readonly text: string | null | undefined;
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
  readonly clipsLength: number | null | undefined;
  readonly effectiveSettings: {
    readonly additionalJson: string | null | undefined;
    readonly captionColor: string | null | undefined;
    readonly captionHighlightColor: string | null | undefined;
    readonly captionLines: number | null | undefined;
    readonly captionWordsPerLine: number | null | undefined;
    readonly censorShowFirstLetter: boolean | null | undefined;
    readonly censorSwears: boolean | null | undefined;
    readonly censorUseAsterisks: boolean | null | undefined;
    readonly font: string | null | undefined;
    readonly largeMovementThresholdPct: number | null | undefined;
    readonly minimumWords: number | null | undefined;
    readonly ratio: number | null | undefined;
    readonly showCaptions: boolean | null | undefined;
    readonly showTrackingDebug: boolean | null | undefined;
    readonly showWatermark: boolean | null | undefined;
    readonly template: string | null | undefined;
    readonly useAutocropping: boolean | null | undefined;
    readonly useTracking: boolean | null | undefined;
    readonly watermarkLogo: string | null | undefined;
    readonly watermarkOpacity: number | null | undefined;
    readonly watermarkPosition: PositionEnum | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"SettingsFormQuery_settings">;
  } | null | undefined;
  readonly id: string | null | undefined;
  readonly opurl: string | null | undefined;
  readonly transcripts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string | null | undefined;
        readonly transcriptLength: number | null | undefined;
        readonly words: string | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly videoUrl: string | null | undefined;
  readonly " $fragmentType": "ClipList_project";
};
export type ClipList_project$key = {
  readonly " $data"?: ClipList_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipList_project">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "clips"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "count"
    },
    {
      "kind": "RootArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": __ClipListPaginationQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "ClipList_project",
  "selections": [
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Settings",
      "kind": "LinkedField",
      "name": "effectiveSettings",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SettingsFormQuery_settings"
        },
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
          "name": "ratio",
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
          "name": "showCaptions",
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
          "name": "showWatermark",
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
                (v1/*: any*/),
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
                  "name": "end_index",
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
                  "name": "text",
                  "storageKey": null
                },
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
        }
      ],
      "storageKey": null
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
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "transcriptLength",
                  "storageKey": null
                },
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
      "alias": null,
      "args": null,
      "fragment": {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ProjectResolverOpurlResolver"
      },
      "kind": "RelayResolver",
      "name": "opurl",
      "resolverModule": _____client_relay_localResolvers_ProjectResolver.opurl,
      "path": "opurl"
    }
  ],
  "type": "Project",
  "abstractKey": null
};
})();

(node as any).hash = "1a3708d6ef8633280db2a134bd3a5055";

export default node;
