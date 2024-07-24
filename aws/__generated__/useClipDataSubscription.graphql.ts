/**
 * @generated SignedSource<<6f0d89834c73a940c5fe6b591662b9f0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useClipDataSubscription$variables = {
  id: string;
};
export type useClipDataSubscription$data = {
  readonly clip: {
    readonly " $fragmentSpreads": FragmentRefs<"useClipData_clip">;
  } | null | undefined;
};
export type useClipDataSubscription = {
  response: useClipDataSubscription$data;
  variables: useClipDataSubscription$variables;
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
    "name": "useClipDataSubscription",
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
            "name": "useClipData_clip"
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
    "name": "useClipDataSubscription",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ba9f294dd24585590eddd2fe6c2b85cb",
    "id": null,
    "metadata": {},
    "name": "useClipDataSubscription",
    "operationKind": "subscription",
    "text": "subscription useClipDataSubscription(\n  $id: ID!\n) {\n  clip(id: $id) {\n    ...useClipData_clip\n    id\n  }\n}\n\nfragment ChangeRequestButton_clip on Clip {\n  id\n  changeRequested\n}\n\nfragment DownloadClip_clip on Clip {\n  id\n  start_time\n  end_time\n  manualCrop\n  manualCropActive\n  title\n}\n\nfragment ManualCropMenu_clip on Clip {\n  id\n  manualCrop\n  manualCropActive\n}\n\nfragment StarClipButton_clip on Clip {\n  id\n  isStarred\n}\n\nfragment useClipData_clip on Clip {\n  ...StarClipButton_clip\n  ...ChangeRequestButton_clip\n  ...ManualCropMenu_clip\n  id\n  description\n  downloadUrl\n  encodingStatus\n  end_index\n  end_time\n  endTimeOverride\n  start_index\n  start_time\n  text\n  title\n  manualCrop\n  manualCropActive\n  ...DownloadClip_clip\n}\n"
  }
};
})();

(node as any).hash = "5b67e16d838a0bcd3d2f80215f304165";

export default node;
