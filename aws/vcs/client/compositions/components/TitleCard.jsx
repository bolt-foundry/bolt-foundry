import * as React from "react";
import { Box, Text } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights } from "../params.js";

const FONT_SIZE_VH = 160 / 1920;
const ANIMATION_DURATION = 0.5;
const DURATION = 2; // 2 seconds

export default function TitleCard() {
  const time = useVideoTime();
  const { startTimecode, settings, title } = useParams();
  const {
    additionalJson: json = "{}",
    font: fontFamily,
  } = JSON.parse(settings);
  const { useTitle } = JSON.parse(json);
  if (!useTitle) return null;
  const labelStyle = {
    textColor: "red",
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: FONT_SIZE_VH,
    textAlign: "center",
    strokeColor: "rgba(255,255,255,1)",
    strokeWidth_px: 8,
  };
  const startFade = startTimecode + DURATION;
  return (
    <Box id="titleCard" blend={{ opacity: fadeOut(time, startFade) }}>
      <Text
        style={labelStyle}
        layout={[layoutFuncs.text]}
        transform={{ scale: 0.8 }}
      >
        {title}
      </Text>
    </Box>
  );
}

function fadeOut(time, animationStartTime) {
  if (time >= animationStartTime) {
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

    return 1 - progress;
  } else {
    return 1;
  }
}

const layoutFuncs = {
  text: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const textSize = layoutCtx.useIntrinsicSize();
    w = textSize.w > 0 ? textSize.w : parentFrame.w;
    h = textSize.h;
    x += (parentFrame.w - w) / 2;
    y = ((parentFrame.h / 2) - h) / 2;
    if (y < 50) {
      y = 50;
    }

    return { x, y, w, h };
  },
};
import * as React from "react";
import { Box, Text } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { fontBoldWeights } from "../params.js";

const FONT_SIZE_VH = 160 / 1920;
const ANIMATION_DURATION = 0.5;
const DURATION = 2; // 2 seconds

export default function TitleCard() {
  const time = useVideoTime();
  const { startTimecode, settings, title } = useParams();
  const {
    additionalJson: json = "{}",
    font: fontFamily,
  } = JSON.parse(settings);
  const { useTitle, titleColor, titleStrokeColor, titleStrokeWidth } = JSON
    .parse(json);
  if (!useTitle) return null;
  const labelStyle = {
    textColor: titleColor ?? "rgba(255, 215, 0, 1)",
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: FONT_SIZE_VH,
    textAlign: "center",
    strokeColor: titleStrokeColor ?? "rgba(255,255,255,1)",
    strokeWidth_px: titleStrokeWidth ?? 8,
  };
  const startFade = startTimecode + DURATION;
  return (
    <Box id="titleCard" blend={{ opacity: fadeOut(time, startFade) }}>
      <Text
        style={labelStyle}
        layout={[layoutFuncs.text]}
        transform={{ scale: 0.8 }}
      >
        {title}
      </Text>
    </Box>
  );
}

function fadeOut(time, animationStartTime) {
  if (time >= animationStartTime) {
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

    return 1 - progress;
  } else {
    return 1;
  }
}

const layoutFuncs = {
  text: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const textSize = layoutCtx.useIntrinsicSize();
    w = textSize.w > 0 ? textSize.w : parentFrame.w;
    h = textSize.h > 0 ? textSize.h : parentFrame.h;
    x += (parentFrame.w - w) / 2;
    // y = ((parentFrame.h / 2) - h) / 2; // center in the top half
    y = (parentFrame.h / 2) - h; // bottom aligned to top half
    if (y < 50) {
      y = 50;
    }

    return { x, y, w, h };
  },
};
