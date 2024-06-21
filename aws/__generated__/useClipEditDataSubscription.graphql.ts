/**
 * @generated SignedSource<<d422924564d867875d9248dea564a723>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useClipEditDataSubscription$variables = {
  id: string;
};
export type useClipEditDataSubscription$data = {
  readonly clip: {
    readonly " $fragmentSpreads": FragmentRefs<"useClipEditData_clip">;
  } | null | undefined;
};
export type useClipEditDataSubscription = {
  response: useClipEditDataSubscription$data;
  variables: useClipEditDataSubscription$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useClipEditDataSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "clip",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "useClipEditData_clip"
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
    "name": "useClipEditDataSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "clip",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d1718db7858296571aeb00c4dcf188de",
    "id": null,
    "metadata": {},
    "name": "useClipEditDataSubscription",
    "operationKind": "subscription",
    "text": "subscription useClipEditDataSubscription(\n  $id: ID!\n) {\n  clip(id: $id) {\n    ...useClipEditData_clip\n    id\n  }\n}\n\nfragment DownloadClip_clip on Clip {\n  id\n  start_time\n  end_time\n  manualCrop\n  manualCropActive\n  title\n}\n\nfragment ManualCropMenu_clip on Clip {\n  id\n  manualCrop\n  manualCropActive\n}\n\nfragment StarClipButton_clip on Clip {\n  id\n  isStarred\n}\n\nfragment useClipEditData_clip on Clip {\n  ...StarClipButton_clip\n  ...ManualCropMenu_clip\n  id\n  description\n  downloadUrl\n  encodingStatus\n  end_index\n  end_time\n  endTimeOverride\n  start_index\n  start_time\n  text\n  title\n  manualCrop\n  manualCropActive\n  ...DownloadClip_clip\n}\n"
  }
};
})();

(node as any).hash = "d5df1cb8538159b9313fca9f8943d6a9";

export default node;
