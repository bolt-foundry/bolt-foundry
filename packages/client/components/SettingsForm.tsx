import { React, ReactRelay } from "deps.ts";
import {
  DEFAULT_SETTINGS,
  Settings,
  settingsPresets,
  type WatermarkPositionType,
  type WatermarkLogoType,
} from "packages/types/settings.ts";
import { Input } from "packages/bfDs/Input.tsx";
import { RatioSelector } from "packages/client/components/RatioSelector.tsx";
import { Toggle } from "packages/bfDs/Toggle.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { fontFamilies } from "packages/vcs/client/compositions/params.js";
import {
  useFeatureFlag,
  useFeatureVariant,
} from "packages/client/hooks/featureFlagHooks.ts";
// import { SettingsFormQuery_settings$key } from "packages/__generated__/SettingsFormQuery_settings.graphql.ts";
import { hexToRgb, rgbToHex } from "lib/color.ts";
import { imagePreloads } from "packages/vcs/client/compositions/preloads.js";
import { classnames } from "lib/classnames.ts";
import { Button } from "packages/bfDs/Button.tsx";

const { useFragment } = ReactRelay;
export type SettingRowProps = {
  changed: boolean;
  description: string;
  disabled?: boolean;
  name?: string;
  settingElement: React.ReactNode;
};

// const settingsFragment = await graphql`
//   fragment SettingsFormQuery_settings on Settings {
//       captionColor
//       captionHighlightColor
//       captionLines
//       captionWordsPerLine
//       censorShowFirstLetter
//       censorSwears
//       censorUseAsterisks
//       font
//       minimumWords
//       ratio
//       showCaptions
//       showTrackingDebug
//       showWatermark
//       template
//       useAutocropping
//       useTracking
//       watermarkLogo
//       watermarkOpacity
//       watermarkPosition
//       largeMovementThresholdPct
//     }
// `;

type SectionProps = {
  isChanged?: boolean;
  isCollapsible?: boolean;
  title?: string;
  showSeparator?: boolean;
};

type Props = {
  isCollapsible?: boolean;
  RowTemplate: React.ComponentType<SettingRowProps>;
  draftSettings: Partial<Settings>;
  setDraftSettings: (settings: Partial<Settings>) => void;
  changedSettings?: Array<keyof Settings>;
  settings$key: SettingsFormQuery_settings$key | null | undefined;
  setInitialSettings?: (settings: Partial<Settings>) => void;
};

const Section = (
  { children, isChanged, isCollapsible, title, showSeparator }:
    React.PropsWithChildren<
      SectionProps
    >,
) => {
  const [collapsed, setCollapsed] = React.useState(isCollapsible);
  const classes = classnames([
    "separatorSection",
    { separator: showSeparator },
  ]);
  const titleClasses = classnames([
    "separatorTitle",
    { changed: isChanged },
  ]);
  return (
    <div className={classes}>
      <div className="flexRow">
        {title && <div className={titleClasses}>{title}</div>}
        {isCollapsible && (collapsed
          ? (
            <Button
              iconLeft="down-arrow"
              kind="outline"
              onClick={() => setCollapsed(false)}
              size="small"
            />
          )
          : (
            <Button
              iconLeft="down-arrow"
              kind="filledSuccess"
              onClick={() => setCollapsed(true)}
              size="small"
            />
          ))}
      </div>
      {!collapsed && (
        <div className="sectionContent">
          {children}
        </div>
      )}
    </div>
  );
};

export function SettingsForm(
  {
    isCollapsible = false,
    RowTemplate,
    draftSettings,
    setDraftSettings,
    changedSettings,
    settings$key,
    setInitialSettings,
  }: Props,
) {
  // const settings = useFragment(settingsFragment, settings$key);
  const settings = draftSettings;
  const initialSettings = settings ?? DEFAULT_SETTINGS;
  const enableToggleWatermark = useFeatureFlag("toggle_watermark");
  const enableCaptionFonts = useFeatureFlag("enable_caption_fonts");
  const enableFraming = useFeatureFlag("enable_face_tracking");
  const enableCaptionTemplates = useFeatureFlag("enable_caption_templates");
  const enableSettingsPresets = useFeatureFlag("enable_settings_presets");
  const enableWatermarkLogoPicker = useFeatureFlag("enable_watermark_picker");

  React.useEffect(() => {
    if (setInitialSettings != null) {
      setInitialSettings(initialSettings as Partial<Settings>);
    }
  }, [initialSettings]);

  const captionColorValue = rgbToHex(
    draftSettings.captionColor ?? initialSettings.captionColor ??
      "rgb(255, 255, 255)",
  );
  const captionHighlightColorValue = rgbToHex(
    draftSettings.captionHighlightColor ??
      initialSettings.captionHighlightColor ?? "rgb(255, 215, 0)",
  );
  const showCaptionsValue = draftSettings.showCaptions ??
    initialSettings.showCaptions ?? false;
  const showCensorSwearsValue = draftSettings.censorSwears ??
    initialSettings.censorSwears ?? true;
  const showWatermarkValue = draftSettings.showWatermark ??
    initialSettings.showWatermark ?? false;
  const trackingToggleValue = draftSettings.useTracking ??
    initialSettings.useTracking ?? false;

  const settingsPresetsOptions = {} as Record<string, string>;
  Object.keys(settingsPresets).forEach((preset) => {
    settingsPresetsOptions[preset] = preset;
  });

  const watermarkLogoOptions = {} as Record<string, string>;
  imagePreloads.forEach((image: string) => {
    const key = image.replace(".png", "").replace(".jpg", "");
    watermarkLogoOptions[key] = image;
  });

  return (
    <div className="settings flexColumn">
      <RowTemplate
        changed={changedSettings != null &&
          changedSettings.indexOf("minimumWords") > -1}
        description="Only show clips with at least this many words"
        name="Minimum words"
        settingElement={
          <Input
            type="number"
            name="minimumWords"
            onChange={(e) =>
              setDraftSettings({
                ...draftSettings,
                minimumWords: parseInt(e.target.value),
              })}
            required
            value={draftSettings.minimumWords ??
              initialSettings.minimumWords ?? 25}
            testId="minimumWordsInput"
          />
        }
      />
      <div className="separator" />
      {enableSettingsPresets && (
        <>
          <RowTemplate
            changed={false}
            description="Load a preset for your settings"
            // name="Preset"
            settingElement={
              <DropdownSelector
                options={settingsPresetsOptions}
                onChange={(preset) => {
                  const newSettings = {
                    ...draftSettings,
                    ...settingsPresets[preset],
                  };
                  setDraftSettings(newSettings);
                }}
                value=""
                placeholder="Load a preset..."
                testId="presetSelector"
              />
            }
          />
          <div className="separator" />
        </>
      )}
      <RowTemplate
        changed={changedSettings != null &&
          changedSettings.indexOf("ratio") > -1}
        description="Ratio of rendered video"
        name="Ratio"
        settingElement={
          <RatioSelector
            onChange={(ratio) => setDraftSettings({ ...draftSettings, ratio })}
            value={draftSettings.ratio ?? initialSettings.ratio ?? 16 / 9}
          />
        }
      />
      <Section
        isCollapsible={isCollapsible}
        isChanged={changedSettings != null &&
          (changedSettings.indexOf("censorSwears") > -1 ||
            changedSettings.indexOf("censorShowFirstLetter") > -1 ||
            changedSettings.indexOf("censorUseAsterisks") > -1)}
        title="Censoring"
        showSeparator={true}
      >
        <RowTemplate
          changed={changedSettings != null &&
            changedSettings.indexOf("censorSwears") > -1}
          description="Censor swear words in captions"
          name="Censor swears"
          settingElement={
            <Toggle
              value={draftSettings.censorSwears ??
                initialSettings.censorSwears ?? true}
              onChange={(censorSwears) =>
                setDraftSettings({ ...draftSettings, censorSwears })}
              testId="censorSwearsToggle"
            />
          }
        />
        <RowTemplate
          changed={changedSettings != null &&
            changedSettings.indexOf("censorShowFirstLetter") > -1}
          description="Show first letter of swear words"
          disabled={!showCensorSwearsValue}
          name="Show first letter"
          settingElement={
            <Toggle
              value={draftSettings.censorShowFirstLetter ??
                initialSettings.censorShowFirstLetter ?? true}
              onChange={(censorShowFirstLetter) =>
                setDraftSettings({
                  ...draftSettings,
                  censorShowFirstLetter,
                })}
              testId="censorShowFirstLetterToggle"
            />
          }
        />
        <RowTemplate
          changed={changedSettings != null &&
            changedSettings.indexOf("censorUseAsterisks") > -1}
          description="Use asterisks to censor swear words"
          disabled={!showCensorSwearsValue}
          name="Use asterisks"
          settingElement={
            <Toggle
              value={draftSettings.censorUseAsterisks ??
                initialSettings.censorUseAsterisks ?? true}
              onChange={(censorUseAsterisks) =>
                setDraftSettings({
                  ...draftSettings,
                  censorUseAsterisks,
                })}
              testId="censorUseAsterisksToggle"
            />
          }
        />
      </Section>
      <Section
        isChanged={changedSettings != null && (
          changedSettings.indexOf("showCaptions") > -1 ||
          changedSettings.indexOf("font") > -1 ||
          changedSettings.indexOf("template") > -1 ||
          changedSettings.indexOf("captionColor") > -1 ||
          changedSettings.indexOf("captionHighlightColor") > -1 ||
          changedSettings.indexOf("captionLines") > -1 ||
          changedSettings.indexOf("captionWordsPerLine") > -1
        )}
        isCollapsible={isCollapsible}
        title="Captions"
        showSeparator={true}
      >
        <RowTemplate
          changed={changedSettings != null &&
            changedSettings.indexOf("showCaptions") > -1}
          description="Show captions on rendered video"
          name="Show captions"
          settingElement={
            <Toggle
              value={showCaptionsValue}
              onChange={(showCaptions) =>
                setDraftSettings({ ...draftSettings, showCaptions })}
              testId="showCaptionsToggle"
            />
          }
        />
        {enableCaptionFonts && (
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("font") > -1}
            description="Font to use for captions"
            disabled={!showCaptionsValue}
            name="Font"
            settingElement={
              <DropdownSelector
                disabled={!showCaptionsValue}
                options={fontFamilies.reduce<Record<string, string>>(
                  (acc, fontFamily) => {
                    acc[fontFamily] = fontFamily;
                    return acc;
                  },
                  {},
                )}
                onChange={(font) =>
                  setDraftSettings({ ...draftSettings, font })}
                value={draftSettings.font ?? initialSettings.font ?? "Roboto"}
                placeholder="Choose a font..."
                testId="fontSelector"
              />
            }
          />
        )}
        {enableCaptionTemplates && (
          <>
            <RowTemplate
              changed={changedSettings != null &&
                changedSettings.indexOf("template") > -1}
              description="Template to use for rendered captions"
              disabled={!showCaptionsValue}
              name="Template"
              settingElement={
                <DropdownSelector
                  disabled={!showCaptionsValue}
                  options={{
                    "Default": "default",
                    "Joe": "joe",
                    "Tiny Cupboard": "tinycupboard",
                    "Off Cabot": "offcabot",
                    "Sunflower": "sunflower",
                  }}
                  onChange={(template) =>
                    setDraftSettings({ ...draftSettings, template })}
                  value={draftSettings.template ?? initialSettings.template ??
                    "default"}
                  placeholder="Choose a template..."
                  testId="templateSelector"
                />
              }
            />
            <RowTemplate
              changed={changedSettings != null &&
                changedSettings.indexOf("captionColor") > -1}
              description="Color of captions"
              disabled={!showCaptionsValue}
              name="Caption color"
              settingElement={
                <Input
                  disabled={!showCaptionsValue}
                  type="color"
                  name="captionColor"
                  onChange={(e) => {
                    const colorValue = hexToRgb(e.target.value);
                    setDraftSettings({
                      ...draftSettings,
                      captionColor: colorValue,
                    });
                  }}
                  required
                  value={captionColorValue}
                  xstyle={{ minWidth: 50, padding: "0 2px" }}
                  testId="captionColor"
                />
              }
            />
            <RowTemplate
              changed={changedSettings != null &&
                changedSettings.indexOf("captionHighlightColor") > -1}
              description="Color used in templates that support highlighting"
              disabled={!showCaptionsValue}
              name="Highlight color"
              settingElement={
                <Input
                  disabled={!showCaptionsValue}
                  type="color"
                  name="captionHighlightColor"
                  onChange={(e) => {
                    const colorValue = hexToRgb(e.target.value);
                    setDraftSettings({
                      ...draftSettings,
                      captionHighlightColor: colorValue,
                    });
                  }}
                  required
                  value={captionHighlightColorValue}
                  xstyle={{ minWidth: 50, padding: "0 2px" }}
                  testId="captionHighlightColor"
                />
              }
            />
            <RowTemplate
              changed={changedSettings != null &&
                changedSettings.indexOf("captionLines") > -1}
              description="Number of lines in captions"
              disabled={!showCaptionsValue}
              name="Caption lines"
              settingElement={
                <Input
                  type="number"
                  name="captionLines"
                  numberAttributes={{ min: 1, max: 3 }}
                  onChange={(e) =>
                    setDraftSettings({
                      ...draftSettings,
                      captionLines: parseInt(e.target.value),
                    })}
                  required
                  value={draftSettings.captionLines ??
                    initialSettings.captionLines ?? 1}
                  testId="captionLines"
                />
              }
            />
            <RowTemplate
              changed={changedSettings != null &&
                changedSettings.indexOf("captionWordsPerLine") > -1}
              description="Number of words per line in captions"
              disabled={!showCaptionsValue}
              name="Words per line"
              settingElement={
                <Input
                  type="number"
                  name="captionWordsPerLine"
                  numberAttributes={{ min: 1, max: 10 }}
                  onChange={(e) =>
                    setDraftSettings({
                      ...draftSettings,
                      captionWordsPerLine: parseInt(e.target.value),
                    })}
                  required
                  value={draftSettings.captionWordsPerLine ??
                    initialSettings.captionWordsPerLine ?? 5}
                  testId="captionWordsPerLine"
                />
              }
            />
          </>
        )}
      </Section>
      {enableToggleWatermark && (
        <Section
          isChanged={changedSettings != null && (
            changedSettings.indexOf("showWatermark") > -1 ||
            changedSettings.indexOf("watermarkLogo") > -1 ||
            changedSettings.indexOf("watermarkOpacity") > -1 ||
            changedSettings.indexOf("watermarkPosition") > -1
          )}
          isCollapsible={isCollapsible}
          title="Watermark"
          showSeparator={true}
        >
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("showWatermark") > -1}
            description="Show watermark on rendered video"
            name="Show watermark"
            settingElement={
              <Toggle
                value={showWatermarkValue}
                onChange={(showWatermark) =>
                  setDraftSettings({ ...draftSettings, showWatermark })}
                testId="showWatermarkToggle"
              />
            }
          />
          {enableWatermarkLogoPicker && (
            <RowTemplate
              changed={changedSettings != null &&
                changedSettings.indexOf("watermarkLogo") > -1}
              description="Logo to use for watermark"
              disabled={!showWatermarkValue}
              name="Watermark logo"
              settingElement={
                <DropdownSelector
                  disabled={!showWatermarkValue}
                  options={watermarkLogoOptions}
                  onChange={(watermarkLogo) =>
                    setDraftSettings({
                      ...draftSettings,
                      watermarkLogo: watermarkLogo as WatermarkLogoType,
                    })}
                  value={(draftSettings.watermarkLogo ??
                    initialSettings.watermarkLogo ??
                    "made_with_bf.png") as string}
                  placeholder="Choose a logo..."
                  testId="watermarkLogo"
                />
              }
            />
          )}
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("watermarkOpacity") > -1}
            description="Opacity of watermark on rendered video"
            disabled={!showWatermarkValue}
            name="Watermark opacity"
            settingElement={
              <Input
                type="number"
                name="watermarkOpacity"
                numberAttributes={{ min: 0, max: 1, step: 0.1 }}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    watermarkOpacity: parseFloat(e.target.value),
                  })}
                required
                value={draftSettings.watermarkOpacity ??
                  initialSettings.watermarkOpacity ?? 0.5}
                testId="watermarkOpacity"
              />
            }
          />
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("watermarkPosition") > -1}
            description="Position of watermark on rendered video"
            disabled={!showWatermarkValue}
            name="Watermark position"
            settingElement={
              <DropdownSelector
                disabled={!showWatermarkValue}
                options={{
                  "Under caption": "under_caption",
                  "Bottom right": "bottom_right",
                  "Bottom left": "bottom_left",
                  "Top right": "top_right",
                  "Top left": "top_left",
                  "Bottom center": "bottom_center",
                  "Top center": "top_center",
                }}
                onChange={(watermarkPosition) =>
                  // @ts-expect-error fix watermarkPosition type
                  setDraftSettings({ ...draftSettings, watermarkPosition })}
                value={draftSettings.watermarkPosition ??
                  initialSettings.watermarkPosition ??
                  "under_caption"}
                placeholder="Choose a position..."
                testId="watermarkPosition"
              />
            }
          />
        </Section>
      )}
      {enableFraming && (
        <Section
          isChanged={changedSettings != null && (
            changedSettings.indexOf("useTracking") > -1 ||
            changedSettings.indexOf("largeMovementThresholdPct") > -1 ||
            changedSettings.indexOf("useAutocropping") > -1 ||
            changedSettings.indexOf("showTrackingDebug") > -1
          )}
          isCollapsible={isCollapsible}
          title="Framing"
          showSeparator={true}
        >
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("useTracking") > -1}
            description="Camera tracks the face to keep it in frame"
            name="Use tracking"
            settingElement={
              <Toggle
                value={trackingToggleValue}
                onChange={(useTracking) =>
                  setDraftSettings({ ...draftSettings, useTracking })}
                testId="useTrackingToggle"
              />
            }
          />
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("largeMovementThresholdPct") > -1}
            description="Threshold for large movements in face tracking"
            disabled={!trackingToggleValue}
            name="Large movement threshold"
            settingElement={
              <Input
                type="number"
                name="largeMovementThresholdPct"
                numberAttributes={{ min: 0, max: 1, step: 0.01 }}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    largeMovementThresholdPct: parseFloat(e.target.value),
                  })}
                required
                value={draftSettings.largeMovementThresholdPct ??
                  initialSettings.largeMovementThresholdPct ?? 0.1}
                testId="largeMovementThresholdPct"
              />
            }
          />
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("useAutocropping") > -1}
            description="Automatically crop the video to the face"
            disabled={!trackingToggleValue}
            name="Use autocropping"
            settingElement={
              <Toggle
                disabled={!trackingToggleValue}
                value={draftSettings.useAutocropping ??
                  initialSettings.useAutocropping ?? false}
                onChange={(useAutocropping) =>
                  setDraftSettings({ ...draftSettings, useAutocropping })}
                testId="useAutocroppingToggle"
              />
            }
          />
          <RowTemplate
            changed={changedSettings != null &&
              changedSettings.indexOf("showTrackingDebug") > -1}
            description="Tracking points are shown on the rendered video and shows video previews"
            disabled={!trackingToggleValue}
            name="Show tracking debug"
            settingElement={
              <Toggle
                disabled={!trackingToggleValue}
                value={draftSettings.showTrackingDebug ??
                  initialSettings.showTrackingDebug ?? false}
                onChange={(showTrackingDebug) =>
                  setDraftSettings({ ...draftSettings, showTrackingDebug })}
                testId="showTrackingDebugToggle"
              />
            }
          />
        </Section>
      )}
    </div>
  );
}

