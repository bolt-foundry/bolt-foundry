/**
 * @generated SignedSource<<bb2fafd6d2d5c8bae2a449eee9323edf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchResultWordInput = {
  endTime: any;
  speaker: string;
  startTime: any;
  text: string;
};
export type ClipEditModal_updateSearchResultMutation$variables = {
  description: string;
  endTime: any;
  id: string;
  startTime: any;
  title: string;
  words?: ReadonlyArray<SearchResultWordInput | null | undefined> | null | undefined;
};
export type ClipEditModal_updateSearchResultMutation$data = {
  readonly updateSearchResult: {
    readonly description: string | null | undefined;
    readonly endTime: any | null | undefined;
    readonly id: string;
    readonly startTime: any | null | undefined;
    readonly title: string | null | undefined;
    readonly words: ReadonlyArray<{
      readonly endTime: any | null | undefined;
      readonly speaker: string | null | undefined;
      readonly startTime: any | null | undefined;
      readonly text: string | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type ClipEditModal_updateSearchResultMutation = {
  response: ClipEditModal_updateSearchResultMutation$data;
  variables: ClipEditModal_updateSearchResultMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTime"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "words"
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startTime",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endTime",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "description",
        "variableName": "description"
      },
      {
        "kind": "Variable",
        "name": "endTime",
        "variableName": "endTime"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "startTime",
        "variableName": "startTime"
      },
      {
        "kind": "Variable",
        "name": "title",
        "variableName": "title"
      },
      {
        "kind": "Variable",
        "name": "words",
        "variableName": "words"
      }
    ],
    "concreteType": "BfSavedSearchResult",
    "kind": "LinkedField",
    "name": "updateSearchResult",
    "plural": false,
    "selections": [
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
      (v6/*: any*/),
      (v7/*: any*/),
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
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "speaker",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipEditModal_updateSearchResultMutation",
    "selections": (v8/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v0/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClipEditModal_updateSearchResultMutation",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "f629d169f11cbb59ac223d223dfed4c0",
    "id": null,
    "metadata": {},
    "name": "ClipEditModal_updateSearchResultMutation",
    "operationKind": "mutation",
    "text": "mutation ClipEditModal_updateSearchResultMutation(\n  $id: String!\n  $startTime: TimecodeInMilliseconds!\n  $endTime: TimecodeInMilliseconds!\n  $title: String!\n  $description: String!\n  $words: [SearchResultWordInput]\n) {\n  updateSearchResult(id: $id, startTime: $startTime, endTime: $endTime, title: $title, description: $description, words: $words) {\n    id\n    title\n    description\n    startTime\n    endTime\n    words {\n      text\n      startTime\n      endTime\n      speaker\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f7d1cf1c40b6c3d1f6df414319754031";

export default node;
