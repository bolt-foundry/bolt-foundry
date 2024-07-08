/**
 * @generated SignedSource<<255564e2cbad2e310f85a2c9d00e3da6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionEnum = "bottom_center" | "bottom_left" | "bottom_right" | "top_center" | "top_left" | "top_right" | "under_caption" | "%future added value";
export type ProjectSettingsInput = {
  additionalJson?: string | null | undefined;
  captionColor?: string | null | undefined;
  captionHighlightColor?: string | null | undefined;
  captionLines?: number | null | undefined;
  captionWordsPerLine?: number | null | undefined;
  censorShowFirstLetter?: boolean | null | undefined;
  censorSwears?: boolean | null | undefined;
  censorUseAsterisks?: boolean | null | undefined;
  font?: string | null | undefined;
  largeMovementThresholdPct?: number | null | undefined;
  minimumWords?: number | null | undefined;
  ratio?: number | null | undefined;
  showCaptions?: boolean | null | undefined;
  showTrackingDebug?: boolean | null | undefined;
  showWatermark?: boolean | null | undefined;
  template?: string | null | undefined;
  useAutocropping?: boolean | null | undefined;
  useTracking?: boolean | null | undefined;
  watermarkLogo?: string | null | undefined;
  watermarkOpacity?: number | null | undefined;
  watermarkPosition?: PositionEnum | null | undefined;
};
export type SettingsProjectTabMutation$variables = {
  settings: ProjectSettingsInput;
};
export type SettingsProjectTabMutation$data = {
  readonly updatePersonSettings: {
    readonly id: string | null | undefined;
    readonly settings: {
      readonly " $fragmentSpreads": FragmentRefs<"SettingsFormQuery_settings">;
    } | null | undefined;
  } | null | undefined;
};
export type SettingsProjectTabMutation = {
  response: SettingsProjectTabMutation$data;
  variables: SettingsProjectTabMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "settings"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "settings",
    "variableName": "settings"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsProjectTabMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "updatePersonSettings",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Settings",
            "kind": "LinkedField",
            "name": "settings",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SettingsFormQuery_settings"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsProjectTabMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "updatePersonSettings",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9c77580d923b17acbe3fe5ea6540204d",
    "id": null,
    "metadata": {},
    "name": "SettingsProjectTabMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsProjectTabMutation(\n  $settings: ProjectSettingsInput!\n) {\n  updatePersonSettings(settings: $settings) {\n    id\n    settings {\n      ...SettingsFormQuery_settings\n    }\n  }\n}\n\nfragment SettingsFormQuery_settings on Settings {\n  additionalJson\n  captionColor\n  captionHighlightColor\n  captionLines\n  captionWordsPerLine\n  censorShowFirstLetter\n  censorSwears\n  censorUseAsterisks\n  font\n  minimumWords\n  ratio\n  showCaptions\n  showTrackingDebug\n  showWatermark\n  template\n  useAutocropping\n  useTracking\n  watermarkLogo\n  watermarkOpacity\n  watermarkPosition\n  largeMovementThresholdPct\n}\n"
  }
};
})();

(node as any).hash = "80a29d68221bdbcd12ab0811fff09e99";

export default node;
