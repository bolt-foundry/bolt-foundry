/**
 * @generated SignedSource<<074c559a43476df57b9bf93350f6215e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ClipEditUpdateClipMutation$variables = {
  description: string;
  endIndex: number;
  endTime: number;
  endTimeOverride?: number | null | undefined;
  id: string;
  manualCrop: string;
  manualCropActive: boolean;
  startIndex: number;
  startTime: number;
  text: string;
  title: string;
  transcriptId: string;
  wordsToUpdate: string;
};
export type ClipEditUpdateClipMutation$data = {
  readonly updateClip: {
    readonly description: string | null | undefined;
    readonly endTimeOverride: number | null | undefined;
    readonly end_index: number | null | undefined;
    readonly end_time: number | null | undefined;
    readonly id: string | null | undefined;
    readonly start_index: number | null | undefined;
    readonly start_time: number | null | undefined;
    readonly text: string | null | undefined;
    readonly title: string | null | undefined;
  } | null | undefined;
};
export type ClipEditUpdateClipMutation = {
  response: ClipEditUpdateClipMutation$data;
  variables: ClipEditUpdateClipMutation$variables;
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
  "name": "endIndex"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTime"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTimeOverride"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "manualCrop"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "manualCropActive"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startIndex"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "text"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "transcriptId"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "wordsToUpdate"
},
v13 = [
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
        "name": "endTimeOverride",
        "variableName": "endTimeOverride"
      },
      {
        "kind": "Variable",
        "name": "end_index",
        "variableName": "endIndex"
      },
      {
        "kind": "Variable",
        "name": "end_time",
        "variableName": "endTime"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "manualCrop",
        "variableName": "manualCrop"
      },
      {
        "kind": "Variable",
        "name": "manualCropActive",
        "variableName": "manualCropActive"
      },
      {
        "kind": "Variable",
        "name": "start_index",
        "variableName": "startIndex"
      },
      {
        "kind": "Variable",
        "name": "start_time",
        "variableName": "startTime"
      },
      {
        "kind": "Variable",
        "name": "text",
        "variableName": "text"
      },
      {
        "kind": "Variable",
        "name": "title",
        "variableName": "title"
      },
      {
        "kind": "Variable",
        "name": "transcriptId",
        "variableName": "transcriptId"
      },
      {
        "kind": "Variable",
        "name": "wordsToUpdate",
        "variableName": "wordsToUpdate"
      }
    ],
    "concreteType": "Clip",
    "kind": "LinkedField",
    "name": "updateClip",
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
        "name": "start_index",
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
        "name": "start_time",
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
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipEditUpdateClipMutation",
    "selections": (v13/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v0/*: any*/),
      (v7/*: any*/),
      (v1/*: any*/),
      (v8/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClipEditUpdateClipMutation",
    "selections": (v13/*: any*/)
  },
  "params": {
    "cacheID": "23774ee60b306f2f2e00499ae4066fdf",
    "id": null,
    "metadata": {},
    "name": "ClipEditUpdateClipMutation",
    "operationKind": "mutation",
    "text": "mutation ClipEditUpdateClipMutation(\n  $id: ID!\n  $text: String!\n  $title: String!\n  $description: String!\n  $startIndex: Int!\n  $endIndex: Int!\n  $startTime: Float!\n  $endTime: Float!\n  $endTimeOverride: Float\n  $transcriptId: ID!\n  $wordsToUpdate: String!\n  $manualCrop: String!\n  $manualCropActive: Boolean!\n) {\n  updateClip(id: $id, text: $text, title: $title, description: $description, start_index: $startIndex, end_index: $endIndex, start_time: $startTime, end_time: $endTime, endTimeOverride: $endTimeOverride, transcriptId: $transcriptId, wordsToUpdate: $wordsToUpdate, manualCrop: $manualCrop, manualCropActive: $manualCropActive) {\n    id\n    text\n    title\n    description\n    start_index\n    end_index\n    start_time\n    end_time\n    endTimeOverride\n  }\n}\n"
  }
};
})();

(node as any).hash = "3bad01153038b21ec40494e074597092";

export default node;
