import * as React from "react";
import { Box } from "#vcs-react/components";
import { useParams } from "#vcs-react/hooks";
import { fontFamilies } from "../params.js";
import { imagePreloads } from "../preloads.js";
import DefaultGraphics from "./templates/default.jsx";
import JoeGraphics from "./templates/joe.jsx";
import TinyCupboardGraphics from "./templates/tinycupboard.jsx";
import OffCabotGraphics from "./templates/offcabot.jsx";
import SunflowerGraphics from "./templates/sunflower.jsx";
import ShockCollarGraphics from "./templates/shockcollar.jsx";
import {
  DEFAULT_RENDER_SETTINGS,
  DEFAULT_TRANSCRIPT_SETTINGS,
} from "./paramDefaults.js";

// -- the control interface exposed by this composition --
export const compositionInterface = {
  displayMeta: {
    name: "Bolt Foundry default captions",
    description: "With captions and watermark",
  },
  fontFamilies,
  imagePreloads,
  params: [
    {
      id: "settings",
      type: "text", // json
      defaultValue: JSON.stringify(DEFAULT_RENDER_SETTINGS),
    },
    {
      id: "transcriptWords",
      type: "text", // json
      defaultValue: JSON.stringify(DEFAULT_TRANSCRIPT_SETTINGS.transcript),
    },
    {
      id: "startTimecode",
      type: "number",
      defaultValue: DEFAULT_TRANSCRIPT_SETTINGS.start_time,
    },
    {
      id: "endTimecode",
      type: "number",
      defaultValue: DEFAULT_TRANSCRIPT_SETTINGS.end_time,
    },
    {
      id: "title",
      type: "text",
      defaultValue: "Default title",
    },
  ],
};

// -- the root component of this composition --
export default function RenderVCS() {
  // this comp's params are defined in 'compositionInterface' above.
  // this hook lets us get the current param values.
  const { settings } = useParams();
  const { captionLines, captionWordsPerLine, template } = JSON.parse(settings);

  let renderedTemplate;
  switch (template) {
    case "joe":
      renderedTemplate = (
        <JoeGraphics
          captionLines={captionLines}
          captionWordsPerLine={captionWordsPerLine}
        />
      );
      break;
    case "tinycupboard":
      renderedTemplate = <TinyCupboardGraphics />;
      break;
    case "offcabot":
      renderedTemplate = (
        <OffCabotGraphics
          captionLines={captionLines}
          captionWordsPerLine={captionWordsPerLine}
        />
      );
      break;
    case "sunflower":
      renderedTemplate = (
        <SunflowerGraphics
          captionLines={captionLines}
          captionWordsPerLine={captionWordsPerLine}
        />
      );
      break;
    case "shockcollar":
      renderedTemplate = (
        <ShockCollarGraphics
          captionLines={captionLines}
          captionWordsPerLine={captionWordsPerLine}
        />
      );
      break;
    default:
      renderedTemplate = <DefaultGraphics />;
  }

  return (
    <Box id="main">
      <Box
        id="background"
        style={{
          fillColor: "rgba(90, 0, 0, 1)",
        }}
      />
      {renderedTemplate}
    </Box>
  );
}
