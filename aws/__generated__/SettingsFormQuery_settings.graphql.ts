/**
 * @generated SignedSource<<1ddf1278df91356b055e8fb22894b2ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type PositionEnum = "bottom_center" | "bottom_left" | "bottom_right" | "top_center" | "top_left" | "top_right" | "under_caption" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type SettingsFormQuery_settings$data = {
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
  readonly " $fragmentType": "SettingsFormQuery_settings";
};
export type SettingsFormQuery_settings$key = {
  readonly " $data"?: SettingsFormQuery_settings$data;
  readonly " $fragmentSpreads": FragmentRefs<"SettingsFormQuery_settings">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SettingsFormQuery_settings",
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
  "type": "Settings",
  "abstractKey": null
};

(node as any).hash = "979ef0743efe5e3964a362ea249d268b";

export default node;
