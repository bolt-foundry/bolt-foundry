/**
 * @generated SignedSource<<ca0db9711abe8f769811f3b79566c798>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import * as __WatchFolderListPaginationQuery_graphql from "packages/__generated__/./WatchFolderListPaginationQuery.graphql.ts";
import { FragmentRefs } from "relay-runtime";
export type WatchFolderList_bfOrganization$data = {
  readonly collections: {
    readonly count: number | null | undefined;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly media: {
          readonly __typename: "BfMediaConnection";
          readonly count: number | null | undefined;
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly name: string | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
        readonly name: string | null | undefined;
        readonly watchedFolders: {
          readonly count: number | null | undefined;
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly __typename: "BfGoogleDriveResource";
              readonly id: string;
              readonly name: string | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: string | null | undefined;
    };
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "WatchFolderList_bfOrganization";
};
export type WatchFolderList_bfOrganization$key = {
  readonly " $data"?: WatchFolderList_bfOrganization$data;
  readonly " $fragmentSpreads": FragmentRefs<"WatchFolderList_bfOrganization">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "collections"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "after"
    },
    {
      "defaultValue": 5,
      "kind": "LocalArgument",
      "name": "first"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": __WatchFolderListPaginationQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "WatchFolderList_bfOrganization",
  "selections": [
    {
      "alias": "collections",
      "args": null,
      "concreteType": "BfCollectionConnection",
      "kind": "LinkedField",
      "name": "__WatchFolderList_collections_connection",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "BfCollectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BfCollection",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v2/*: any*/),
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": (v4/*: any*/),
                  "concreteType": "BfGoogleDriveResourceConnection",
                  "kind": "LinkedField",
                  "name": "watchedFolders",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BfGoogleDriveResourceEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BfGoogleDriveResource",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            (v5/*: any*/),
                            (v2/*: any*/),
                            (v3/*: any*/)
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "watchedFolders(first:10)"
                },
                {
                  "alias": null,
                  "args": (v4/*: any*/),
                  "concreteType": "BfMediaConnection",
                  "kind": "LinkedField",
                  "name": "media",
                  "plural": false,
                  "selections": [
                    (v5/*: any*/),
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BfMediaEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BfMedia",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            (v2/*: any*/)
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "media(first:10)"
                },
                (v5/*: any*/)
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
    (v3/*: any*/)
  ],
  "type": "BfOrganization",
  "abstractKey": null
};
})();

(node as any).hash = "ce930a69ff35d96e2487b4f2df5728fb";

export default node;
