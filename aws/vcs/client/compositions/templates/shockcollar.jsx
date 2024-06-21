import * as React from "react";

import { Box, Image, Text, Video } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights, fontRelativeCharacterWidths } from "../params.js";
import getLinesOfWordsFromTranscript from "../utils/getLinesOfWordsFromTranscript.js";
import { easeInOutCubic } from "../utils/easing.js";
import EndCap from "../components/EndCap.jsx";

const FONT_SIZE_VH = 96 / 1920;
const CAPTION_POSITION = 0.60;
const MAX_CHARACTERS_PER_LINE = 16;
const DEFAULT_NUMBER_OF_LINES = 3;
const EMPTY_LINE_STATE = {
  firstWordIndex: -1,
  actualWordsPerLine: 0,
  lineText: [],
  currentLine: false,
};

export default function ShockCollarGraphics(
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
    showWatermark,
    watermarkLogo,
    watermarkOpacity,
    watermarkPosition,
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
      <Video src={"video1"} layout={[layoutFuncs.video, { time }]} />
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
      <Image
        src="scc-banner.png"
        layout={[layoutFuncs.banner, { time }]}
      />
      {showWatermark && (
        <Image
          src={watermarkLogo ?? "made_with_bf.png"}
          blend={{ opacity: watermarkOpacity ?? 0.5 }}
          layout={[layoutFuncs.watermark, {
            position: watermarkPosition,
          }]}
        />
      )}
      <EndCap />
    </Box>
  );
}

// --- layout functions and utils ---

function moveDown(time, startPos, endPos) {
  const animationStartTime = 5; // 5 seconds
  const animationDuration = 0.5; // 500ms

  if (time >= animationStartTime) {
    // Calculate the progress of the animation
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / animationDuration, 1);

    // Apply easing (e.g., ease-out)
    const easedProgress = easeInOutCubic(progress);

    // Compute the current y value
    return startPos + easedProgress * (endPos - startPos);
  } else {
    // Before the animation starts, return the start position
    return startPos;
  }
}

const layoutFuncs = {
  banner: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const time = params.time;
    h = w * 351 / 1080; // original size
    x = 0;
    // move y down over 500ms with easing after time gets to 5s
    y = moveDown(time, -h, 0);

    return { x, y, w, h };
  },
  video: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const time = params.time;
    const bannerHeight = w * 351 / 1080;
    const endY = bannerHeight * 0.8; // don't move video as much as banner
    y = moveDown(time, 0, endY);

    return { x, y, w, h };
  },
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
import * as React from "react";

import { Box, Image, Text, Video } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights, fontRelativeCharacterWidths } from "../params.js";
import getLinesOfWordsFromTranscript from "../utils/getLinesOfWordsFromTranscript.js";
import { easeInOutCubic } from "../utils/easing.js";
import EndCap from "../components/EndCap.jsx";
import TitleCard from "../components/TitleCard.jsx";
import { getValueFromJson } from "../utils/jsonUtils.js";

const FONT_SIZE_VH = 96 / 1920;
const CAPTION_POSITION = 0.60;
const MAX_CHARACTERS_PER_LINE = 16;
const DEFAULT_NUMBER_OF_LINES = 3;
const EMPTY_LINE_STATE = {
  firstWordIndex: -1,
  actualWordsPerLine: 0,
  lineText: [],
  currentLine: false,
};

export default function ShockCollarGraphics(
  { captionLines = DEFAULT_NUMBER_OF_LINES, captionWordsPerLine = 5 },
) {
  // 3 lines of captions
  const initialLineState = React.useRef(
    Array(captionLines).fill({ ...EMPTY_LINE_STATE }),
  );
  const time = useVideoTime();
  const { endTimecode, startTimecode, settings, transcriptWords } = useParams();
  const {
    additionalJson,
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    showCaptions,
    showWatermark,
    watermarkLogo,
    watermarkOpacity,
    watermarkPosition,
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
      <Video src={"video1"} layout={[layoutFuncs.video, { time }]} />
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
      <Image
        src="scc-banner.png"
        layout={[layoutFuncs.banner, { time }]}
      />
      {showWatermark && (
        <Image
          src={watermarkLogo ?? "made_with_bf.png"}
          blend={{ opacity: watermarkOpacity ?? 0.5 }}
          layout={[layoutFuncs.watermark, {
            position: watermarkPosition,
          }]}
        />
      )}
      <TitleCard />
      <EndCap />
    </Box>
  );
}

// --- layout functions and utils ---

function moveDown(time, startPos, endPos) {
  const animationStartTime = 5; // 5 seconds
  const animationDuration = 0.5; // 500ms

  if (time >= animationStartTime) {
    // Calculate the progress of the animation
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / animationDuration, 1);

    // Apply easing (e.g., ease-out)
    const easedProgress = easeInOutCubic(progress);

    // Compute the current y value
    return startPos + easedProgress * (endPos - startPos);
  } else {
    // Before the animation starts, return the start position
    return startPos;
  }
}

const layoutFuncs = {
  banner: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const time = params.time;
    h = w * 351 / 1080; // original size
    x = 0;
    // move y down over 500ms with easing after time gets to 5s
    y = moveDown(time, -h, 0);

    return { x, y, w, h };
  },
  video: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const time = params.time;
    const bannerHeight = w * 351 / 1080;
    const endY = bannerHeight * 0.8; // don't move video as much as banner
    y = moveDown(time, 0, endY);

    return { x, y, w, h };
  },
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