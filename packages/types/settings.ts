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
};

export const DEFAULT_SETTINGS: Settings = {
  ...DEFAULT_RENDER_SETTINGS,
  minimumWords: 25,
};

// TODO: add this to db
export const settingsPresets: Record<string, Partial<RenderSettings>> = {
  default: DEFAULT_RENDER_SETTINGS,
  George: {
    ...DEFAULT_RENDER_SETTINGS,
    font: "Exo",
    ratio: 9 / 16,
    showCaptions: true,
    showWatermark: false,
    template: "joe",
    useTracking: true,
  },
  "Tiny Cupboard": {
    ...DEFAULT_RENDER_SETTINGS,
    ratio: 9 / 16,
    showCaptions: false,
    showWatermark: false,
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
};
