import * as React from "react";

import { Box, Image, Text, Video } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights, fontRelativeCharacterWidths } from "../fonts.js";
import getLinesOfWordsFromTranscript from "../utils/getLinesOfWordsFromTranscript.js";
import EndCap from "../components/EndCap.js";
import TitleCard from "../components/TitleCard.js";
import { getValueFromJson } from "../utils/jsonUtils.js";

const HIGHLIGHT_COLOR = "rgb(8, 249, 255)";
const FONT_SIZE_VH = 96 / 1920;
const CAPTION_POSITION = 0.6;
const MAX_CHARACTERS_PER_LINE = 16;
const NUMBER_OF_LINES = 3;
const EMPTY_LINE_STATE = {
  firstWordIndex: -1,
  actualWordsPerLine: 0,
  lineText: [],
  currentLine: false,
};

export default function TinyCupboardGraphics() {
  // 3 lines of captions
  const initialLineState = React.useRef(
    Array(NUMBER_OF_LINES).fill({ ...EMPTY_LINE_STATE }),
  );
  const time = useVideoTime();
  const { endTimecode, startTimecode, settings, transcriptWords } = useParams();
  const {
    additionalJson = "{}",
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    showCaptions,
  } = JSON.parse(settings);
  const strokeColor = getValueFromJson(
    additionalJson,
    "strokeColor",
    "rgba(0, 0, 0, 0.75)",
  );
  const strokeWidth_px = getValueFromJson(additionalJson, "strokeWidth_px", 6);

  const labelStyle = {
    textColor: captionColor ?? "white",
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: FONT_SIZE_VH,
    strokeColor,
    strokeWidth_px,
  };
  const highlightStyle = {
    ...labelStyle,
    textColor: captionHighlightColor ?? HIGHLIGHT_COLOR,
  };

  const charactersPerLineByFont = MAX_CHARACTERS_PER_LINE *
    fontRelativeCharacterWidths[fontFamily];

  const options = {
    maxCharactersPerLine: charactersPerLineByFont,
    maxWordsPerLine: 5,
    maxPauseForBreak: 0.5,
    endTimecode: endTimecode,
    startTimecode: startTimecode,
    transcriptWords: transcriptWords,
    alignBottom: true,
  };

  const lineState = showCaptions
    ? getLinesOfWordsFromTranscript(initialLineState, time, options)
    : null;

  return (
    <Box id="videoWithGraphics">
      <Video src={"video1"} />
      {showCaptions &&
        lineState.map((line, index) => {
          const fontSize_vh = labelStyle.fontSize_vh;
          return (
            <Text
              style={line.currentLine ? highlightStyle : labelStyle}
              layout={[
                layoutFuncs.plainSubtitles,
                {
                  pad_gu: 0.5,
                  fontSize_vh,
                  index,
                },
              ]}
            >
              {line.lineText.join(" ")}
            </Text>
          );
        })}
      <Watermark
        fontSizeVh={FONT_SIZE_VH}
        captionPosition={CAPTION_POSITION}
        defaultNumberOfLines={2}
      />
      <TitleCard />
      <EndCap />
    </Box>
  );
}

// --- layout functions and utils ---

const layoutFuncs = {
  plainSubtitles: (parentFrame, params, layoutCtx) => {
    const pxPerGu = layoutCtx.pixelsPerGridUnit;
    const { pad_gu = 0, fontSize_vh = FONT_SIZE_VH, index = 0 } = params;
    let { x, y, w, h } = parentFrame;

    const textSize = layoutCtx.useIntrinsicSize();

    const vh = layoutCtx.viewport.h;
    const lineOffset = fontSize_vh * vh * index;

    const pad = pad_gu * pxPerGu * index;

    // x = w * 0.15;
    y = h * CAPTION_POSITION + lineOffset + pad;

    if (textSize.w > 0) {
      // center horizontally
      w = textSize.w;
      x += (parentFrame.w - w) / 2;
    }

    return { x, y, w, h };
  },
};
