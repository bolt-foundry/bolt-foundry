/**
 * @generated SignedSource<<3d0bb14e5c343b29eb5bd467ef4ace05>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import * as _____client_relay_localResolvers_ProjectResolver from "aws/client/relay/localResolvers/ProjectResolver.ts";
import { FragmentRefs } from "relay-runtime";
import { opurl as projectOpurlResolverType } from "../client/relay/localResolvers/ProjectResolver.ts";
export type ProjectView_project$data = {
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
  readonly id: string | null | undefined;
  readonly name: string | null | undefined;
  readonly opurl: string | null | undefined;
  readonly ratio: number | null | undefined;
  readonly videoUrl: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ClipList_project" | "Playbar_project" | "ProjectTitle_project" | "SettingsProjectSidebarQuery_project">;
  readonly " $fragmentType": "ProjectView_project";
};
export type ProjectView_project$key = {
  readonly " $data"?: ProjectView_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectView_project">;
};

const node: ReaderFragment = {
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
        "path": [
          "clips"
        ]
      }
    ]
  },
  "name": "ProjectView_project",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClipList_project"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Playbar_project"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ProjectTitle_project"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SettingsProjectSidebarQuery_project"
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
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
      "name": "ratio",
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
      "name": "videoUrl",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "b458742f5aacb5f86d3e7ebb8c109c8b";

export default node;
