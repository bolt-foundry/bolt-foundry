import * as React from "react";

import { Box, Text, Video } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights, fontRelativeCharacterWidths } from "../params.js";
import getLinesOfWordsFromTranscript from "../utils/getLinesOfWordsFromTranscript.js";
import EndCap from "../components/EndCap.jsx";
import TitleCard from "../components/TitleCard.jsx";
import Watermark from "../components/Watermark.jsx";
import consts from "../const.js";

const {
  FONT_SIZE_VH,
  CAPTION_POSITION,
  MAX_CHARACTERS_PER_LINE,
  DEFAULT_NUMBER_OF_LINES,
  EMPTY_LINE_STATE,
} = consts;

export default function JoeGraphics(
  { captionLines = DEFAULT_NUMBER_OF_LINES, captionWordsPerLine = 5 },
) {
  // 3 lines of captions
  const initialLineState = React.useRef(
    Array(captionLines).fill({ ...EMPTY_LINE_STATE }),
  );
  const time = useVideoTime();
  const { endTimecode, startTimecode, settings, transcriptWords } = useParams();
  const {
    additionalJson: json = "{}",
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    showCaptions,
  } = JSON.parse(settings);
  const additionalJson = JSON.parse(json);
  let strokeColor = "rgba(0, 0, 0, 0.75)";
  if (additionalJson.strokeColor) {
    strokeColor = additionalJson.strokeColor;
  }
  let strokeWidth_px = 6;
  if (additionalJson.strokeWidth_px) {
    strokeWidth_px = additionalJson.strokeWidth_px;
  }

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
    ? getLinesOfWordsFromTranscript(
      initialLineState,
      time,
      options,
    )
    : null;

  return (
    <Box id="videoWithGraphics">
      <Video src={"video1"} />
      {showCaptions && lineState.map((line, index) => {
        const fontSize_vh = labelStyle.fontSize_vh;
        return (
          <Text
            style={line.currentLine ? highlightStyle : labelStyle}
            layout={[layoutFuncs.plainSubtitles, {
              fontSize_vh,
              index,
              pad_gu: 0.5,
            }]}
          >
            {line.lineText.join(" ")}
          </Text>
        );
      })}
      <Watermark />
      <TitleCard />
      <EndCap />
    </Box>
  );
}

// --- layout functions and utils ---

const layoutFuncs = {
  watermark: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const parentH = h;
    const parentW = w;
    const imgSize = layoutCtx.useIntrinsicSize();
    const imgAsp = imgSize.h > 0 ? imgSize.w / imgSize.h : 1;
    const vh = layoutCtx.viewport.h;
    const fontSize = FONT_SIZE_VH * vh;

    const margin = fontSize * 0.4;
    w = parentW * 0.25; // TODO justin: add to params
    h = w / imgAsp;

    // y position, default under captions
    y = parentH * CAPTION_POSITION + (fontSize * DEFAULT_NUMBER_OF_LINES) +
      margin;
    if (params.position.indexOf("top") > -1) {
      y = margin;
    }
    if (params.position.indexOf("bottom") > -1) {
      y = parentH - h - margin;
    }

    // x position, default centered
    x = (parentW - w) / 2;
    if (params.position.indexOf("left") > -1) {
      x = margin;
    }
    if (params.position.indexOf("right") > -1) {
      x = parentW - w - margin;
    }

    return { x, y, w, h };
  },
  plainSubtitles: (parentFrame, params, layoutCtx) => {
    const pxPerGu = layoutCtx.pixelsPerGridUnit;
    const {
      fontSize_vh = FONT_SIZE_VH,
      index = 0,
      pad_gu = 0,
    } = params;
    let { x, y, w, h } = parentFrame;

    const textSize = layoutCtx.useIntrinsicSize();

    const vh = layoutCtx.viewport.h;
    const lineOffset = (fontSize_vh * vh) * index;

    const pad = (pad_gu * pxPerGu) * index;

    // x = w * 0.15;
    y = (h * CAPTION_POSITION) + lineOffset + pad;

    if (textSize.w > 0) {
      // center horizontally
      w = textSize.w;
      x += (parentFrame.w - w) / 2;
    }

    return { x, y, w, h };
  },
};
