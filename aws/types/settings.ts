/**
 * This is used on multiple models to store project settings
 */

import { imagePreloads } from "packages/vcs/preloads.js";

export type WatermarkLogoType = keyof typeof imagePreloads;
export type WatermarkPositionType =
  | "under_caption"
  | "top_right"
  | "bottom_right"
  | "bottom_left"
  | "top_left"
  | "bottom_center"
  | "top_center";

export interface RenderSettings {
  additionalJson: string;
  censorShowFirstLetter: boolean;
  censorSwears: boolean;
  censorUseAsterisks: boolean;
  captionColor: string;
  captionHighlightColor: string;
  captionLines: number;
  captionWordsPerLine: number;
  font: string;
  ratio: number;
  showCaptions: boolean;
  showTrackingDebug: boolean;
  showWatermark: boolean;
  template: string;
  useAutocropping?: boolean;
  useTracking: boolean;
  watermarkLogo: WatermarkLogoType;
  watermarkOpacity?: number;
  watermarkPosition: WatermarkPositionType;
  largeMovementThresholdPct: number;
}

export interface Settings extends RenderSettings {
  minimumWords: number;
}

export type Setting = { [key: string]: string | number | boolean | null };

const DEFAULT_ADDITIONAL_JSON = {
  strokeColor: null,
  strokeWidth_px: null,
  useEndCap: false,
  capCta: "Follow for more",
  capName: "@handle",
  useTitle: false,
  titleColor: "rgba(255, 215, 0, 1)",
  titleStrokeColor: "rgba(0, 0, 0, 1)",
  titleStrokeWidth: 6,
  watermarkScale: 0.25,
};

const DEFAULT_RENDER_SETTINGS: RenderSettings = {
  captionColor: "rgb(255, 255, 255)", // white
  captionHighlightColor: "rgb(255, 215, 0)", // BF yellow
  captionLines: 3,
  captionWordsPerLine: 5,
  censorShowFirstLetter: true,
  censorSwears: true,
  censorUseAsterisks: true,
  font: "Roboto",
  ratio: 9 / 16,
  showCaptions: true,
  showTrackingDebug: false,
  showWatermark: true,
  template: "default",
  useAutocropping: false,
  useTracking: false,
  watermarkLogo: "made_with_bf.png" as WatermarkLogoType,
  watermarkOpacity: 0.5,
  watermarkPosition: "under_caption" as WatermarkPositionType,
  largeMovementThresholdPct: 0.1,
  additionalJson: JSON.stringify(DEFAULT_ADDITIONAL_JSON),
};

export const DEFAULT_SETTINGS: Settings = {
  ...DEFAULT_RENDER_SETTINGS,
  minimumWords: 25,
};

// TODO: add this to db
export const settingsPresets: Record<string, Partial<RenderSettings>> = {
  default: DEFAULT_RENDER_SETTINGS,
  "Anthony A": {
    ...DEFAULT_RENDER_SETTINGS,
    captionColor: "rgb(255, 230, 0)",
    captionHighlightColor: "rgb(255, 230, 0)",
    captionLines: 1,
    font: "Bebas Neue",
    showWatermark: false,
    template: "joe",
    useTracking: true,
    additionalJson: JSON.stringify({
      ...DEFAULT_ADDITIONAL_JSON,
      strokeColor: "rgba(0, 0, 0, 1)",
      strokeWidth_px: 16,
    }),
  },
  "Big Laugh": {
    ...DEFAULT_RENDER_SETTINGS,
    captionLines: 2,
    captionWordsPerLine: 5,
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(45, 247, 136)",
    font: "KC Ill Hand",
    template: "joe",
    useTracking: true,
    showWatermark: true,
    watermarkLogo: "big_laugh.png" as WatermarkLogoType,
    watermarkOpacity: 1,
    watermarkPosition: "top_left",
    additionalJson: JSON.stringify({
      ...DEFAULT_ADDITIONAL_JSON,
      strokeColor: "rgba(26, 47, 56, 1)",
      strokeWidth_px: 12,
    }),
  },
  "Comedy Shows Near Me": {
    ...DEFAULT_RENDER_SETTINGS,
    captionLines: 2,
    captionHighlightColor: "rgb(255, 255, 0)",
    font: "Bebas Neue",
    template: "joe",
    useTracking: true,
    showWatermark: true,
    watermarkLogo: "csnm_logo.png" as WatermarkLogoType,
    watermarkOpacity: 1,
    watermarkPosition: "top_left",
    additionalJson: JSON.stringify({
      ...DEFAULT_ADDITIONAL_JSON,
      strokeColor: "rgba(0, 0, 0, 1)",
      strokeWidth_px: 12,
    }),
  },
  "Crystal Su": {
    ...DEFAULT_RENDER_SETTINGS,
    ratio: 9 / 16,
    font: "Lovelo",
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(255, 255, 255)",
    showCaptions: true,
    showWatermark: false,
    template: "joe",
    useTracking: true,
    captionLines: 1,
    captionWordsPerLine: 3,
  },
  "Dougie": {
    ...DEFAULT_RENDER_SETTINGS,
    ratio: 9 / 16,
    font: "Exo",
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(255, 255, 255)",
    showCaptions: true,
    showWatermark: false,
    template: "joe",
    useTracking: true,
    captionLines: 1,
    captionWordsPerLine: 3,
    additionalJson: JSON.stringify({
      ...DEFAULT_ADDITIONAL_JSON,
      useEndCap: true,
      capCta: "Follow for more",
      capName: "@dougiedangerous",
      useTitle: true,
      titleColor: "rgba(255, 215, 0, 1)",
      titleStrokeColor: "rgba(0, 0, 0, 1)",
      titleStrokeWidth: 6,
    }),
  },
  George: {
    ...DEFAULT_RENDER_SETTINGS,
    font: "Exo",
    ratio: 9 / 16,
    showCaptions: true,
    showWatermark: false,
    template: "joe",
    useTracking: true,
  },
  "Off Cabot (JTP)": {
    ...DEFAULT_RENDER_SETTINGS,
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(255, 255, 255)",
    captionLines: 2,
    font: "Bebas Neue",
    showCaptions: true,
    showWatermark: false,
    template: "offcabot",
    useTracking: true,
  },
  "Pattern": {
    ...DEFAULT_RENDER_SETTINGS,
    font: "Bebas Neue",
    showCaptions: true,
    showWatermark: true,
    watermarkLogo: "pattern.png" as WatermarkLogoType,
    watermarkOpacity: 0.5,
    watermarkPosition: "top_left",
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(0, 155, 255)", // #009bff
    template: "joe",
    useTracking: true,
  },
  "Shock Collar Comedy": {
    ...DEFAULT_RENDER_SETTINGS,
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(0, 228, 0)",
    captionLines: 2,
    font: "Bebas Neue",
    showWatermark: false,
    template: "shockcollar",
    useTracking: false,
    additionalJson: JSON.stringify({
      ...DEFAULT_ADDITIONAL_JSON,
      strokeColor: "rgba(0, 0, 0, 1)",
      strokeWidth_px: 8,
    }),
  },
  "Sunflower Arcade": {
    ...DEFAULT_RENDER_SETTINGS,
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(255, 255, 255)",
    font: "Futura",
    showCaptions: true,
    showWatermark: false,
    captionLines: 1,
    captionWordsPerLine: 1,
    template: "sunflower",
    useTracking: true,
  },
  "The Attic": {
    ...DEFAULT_RENDER_SETTINGS,
    captionColor: "rgb(255, 248, 233)",
    captionHighlightColor: "rgb(51, 158, 239)",
    font: "Exo",
    ratio: 9 / 16,
    template: "joe",
    useTracking: true,
    watermarkLogo: "TheAttic.png" as WatermarkLogoType,
    watermarkOpacity: 1,
    watermarkPosition: "bottom_left",
  },
  "Tim Gaither": {
    ...DEFAULT_RENDER_SETTINGS,
    font: "Lovelo",
    captionColor: "rgb(255, 255, 255)",
    captionHighlightColor: "rgb(119, 251, 80)",
    showCaptions: true,
    showWatermark: false,
    template: "joe",
    useTracking: true,
    captionLines: 2,
    captionWordsPerLine: 3,
  },
  "Tiny Cupboard": {
    ...DEFAULT_RENDER_SETTINGS,
    ratio: 9 / 16,
    showCaptions: false,
    showWatermark: false,
    useTracking: true,
  },
};
