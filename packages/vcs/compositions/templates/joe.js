import * as React from "react";
import { Box, Text, Video } from "#vcs-react/components";
import { useActiveVideo, useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights, fontRelativeCharacterWidths } from "../fonts.js";
import getLinesOfWordsFromTranscript from "../utils/getLinesOfWordsFromTranscript.js";
import EndCap from "../components/EndCap.js";
import TitleCard from "../components/TitleCard.js";
import Watermark from "../components/Watermark.js";

const CAPTION_POSITION = 0.6;
const MAX_CHARACTERS_PER_LINE = 16;
const DEFAULT_NUMBER_OF_LINES = 3;
const EMPTY_LINE_STATE = {
  firstWordIndex: -1,
  actualWordsPerLine: 0,
  lineText: [],
  currentLine: false,
};

export default function JoeGraphics({
  captionLines = DEFAULT_NUMBER_OF_LINES,
  captionWordsPerLine = 5,
}) {
  // 3 lines of captions
  const initialLineState = React.useRef(
    Array(captionLines).fill({ ...EMPTY_LINE_STATE }),
  );
  const time = useVideoTime();

  const { activeIds } = useActiveVideo();
  let video;
  if (activeIds.length > 0) {
    video = <Video src={activeIds[0]} />;
  }

  const { endTimecode, startTimecode, settings, transcriptWords } = useParams();
  const {
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    fontSize = 96,
    showCaptions,
    strokeColor = "rgba(0, 0, 0, 0.75)",
    strokeWidth_px = 6,
  } = JSON.parse(settings);
  const fontSize_vh = fontSize / 1920;

  const labelStyle = {
    textColor: captionColor ?? "white",
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: fontSize_vh,
    strokeColor,
    strokeWidth_px,
  };
  const highlightStyle = {
    ...labelStyle,
    textColor: captionHighlightColor ?? "rgb(255, 215, 0)",
  };

  const charactersPerLineByFont = MAX_CHARACTERS_PER_LINE *
    fontRelativeCharacterWidths[fontFamily];

  const options = {
    maxCharactersPerLine: charactersPerLineByFont,
    maxWordsPerLine: captionWordsPerLine,
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
        lineState &&
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
        fontSizeVh={fontSize_vh}
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
    const { fontSize_vh, index = 0, pad_gu = 0 } = params;
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
