import * as React from "react";
import { Box, Text, Video } from "#vcs-react/components";
import { useActiveVideo, useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights, fontRelativeCharacterWidths } from "../fonts.js";
import getLinesOfWordsFromTranscript from "../utils/getLinesOfWordsFromTranscript.js";
import EndCap from "../components/EndCap.js";
import TitleCard from "../components/TitleCard.js";
import Watermark from "../components/Watermark.js";
import { getValueFromJson } from "../utils/jsonUtils.js";

const MAX_CHARACTERS_PER_LINE = 16;
const FONT_SIZE_VH = 96 / 1920;
const CAPTION_POSITION = 0.6;
const EMPTY_LINE_STATE = {
  firstWordIndex: -1,
  actualWordsPerLine: 0,
  lineText: [],
  currentLine: false,
};

export default function DefaultGraphics({
  captionLines = 2,
}) {
  // 2 lines of captions
  const initialLineState = React.useRef(
    Array(captionLines).fill({ ...EMPTY_LINE_STATE }),
  );
  let time = useVideoTime();

  const { activeIds } = useActiveVideo();
  let video;
  if (activeIds.length > 0) {
    video = <Video src={activeIds[0]} />;
  }

  const {
    endTimecode = 0,
    startTimecode = 0,
    settings,
    transcriptWords,
  } = useParams();
  const {
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    fontSize,
    showCaptions,
    strokeColor = "rgba(0, 0, 0, 0.75)",
    strokeWidth_px = 6,
  } = JSON.parse(settings);
  const fontSize_vh = fontSize / 1920;

  const labelStyle = {
    textColor: captionColor ?? "white",
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh,
    strokeColor,
    strokeWidth_px,
  };
  const highlightStyle = {
    ...labelStyle,
    fontSize_vh: fontSize_vh * 1,
    strokeColor: "rgba(0,0,0,0.25)",
    textColor: "rgb(255, 255, 70)",
    // textColor: captionHighlightColor ?? "rgb(255, 215, 0)",
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
  };

  const lineState = showCaptions
    ? getLinesOfWordsFromTranscript(initialLineState, time, options)
    : null;

  return (
    <Box id="videoWithGraphics">
      {video}
      {showCaptions &&
        lineState.map((line, index) => {
          const fontSize_vh = labelStyle.fontSize_vh;
          return (
            <Text
              key={index}
              style={labelStyle}
              layout={[
                layoutFuncs.plainSubtitles,
                {
                  pad_gu: 0.5,
                  fontSize_vh,
                  index,
                },
              ]}
            >
              {line.lineText.map((word, wordIndex) => {
                const isHighlighted = line.currentLineIndex > index
                  ? true
                  : wordIndex <= line.highlightedWordIndexWithinLine;
                return [
                  word + (
                    wordIndex < line.lineText.length - 1 ? " " : ""
                  ),
                  {
                    ...(
                      isHighlighted ? highlightStyle : labelStyle
                    ),
                  },
                ];
              })}
            </Text>
          );
        })}
      <Watermark
        fontSizeVh={FONT_SIZE_VH}
        captionPosition={CAPTION_POSITION}
        defaultNumberOfLines={captionLines}
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
    const {
      minH_gu = 1,
      minW_gu = 1,
      pad_gu = 0,
      fontSize_vh = FONT_SIZE_VH,
      index = 0,
    } = params;
    let { x, y, w, h } = parentFrame;

    const textSize = layoutCtx.useIntrinsicSize();

    const vh = layoutCtx.viewport.h;
    const lineOffset = fontSize_vh * vh * index;

    const pad = pad_gu * pxPerGu * index;

    // x = w * 0.15;
    y = h * CAPTION_POSITION + lineOffset + pad;

    // const minH = minH_gu * pxPerGu;
    const minW = minW_gu * pxPerGu;

    if (textSize.w > 0) {
      // center horizontally
      w = textSize.w;
      x += (parentFrame.w - w) / 2;
    }

    return { x, y, w, h };
  },
};
