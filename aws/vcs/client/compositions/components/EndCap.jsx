import * as React from "react";
import { Box, Text } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { easeOut } from "../utils/easing.js";

const FONT_SIZE_VH = 80 / 1920;
const PAD_X = 40; // px
const PAD_Y = 15; // px
const ANIMATION_DURATION = 0.5;

export default function EndCap() {
  const time = useVideoTime();
  const { endTimecode, settings } = useParams();
  const {
    additionalJson: json = "{}",
    font: fontFamily,
  } = JSON.parse(settings);
  const { capCta, capName } = JSON.parse(json);
  if (!capName) return null;
  const labelStyle = {
    textColor: "black",
    fontFamily,
    fontSize_vh: FONT_SIZE_VH,
  };
  return time > endTimecode
    ? (
      <Box id="endCap">
        <Box
          id="background"
          blend={{ opacity: fadeIn(time, endTimecode) }}
          style={{
            fillColor: "rgba(33, 33, 33, 1)",
          }}
        />
        <Box
          transform={{ rotate_deg: -8, skew_x_deg: 8 }}
        >
          <Box
            blend={{
              opacity: fadeIn(time, endTimecode + 0.25),
            }}
            style={{
              fillColor: "rgba(34, 217, 229, 1)",
            }}
            layout={[layoutFuncs.fillBox, {
              position: "top",
              time,
              endTimecode: endTimecode + 0.25,
            }]}
          >
            <Text
              style={labelStyle}
              layout={[layoutFuncs.text]}
            >
              {capCta}
            </Text>
          </Box>
          <Box
            style={{
              fillColor: "rgba(200, 200, 200, 1)",
            }}
            blend={{
              opacity: fadeIn(time, endTimecode + 0.25),
            }}
            layout={[layoutFuncs.fillBox, {
              position: "bottom",
              time,
              endTimecode: endTimecode + 0.25,
            }]}
          >
            <Text
              style={labelStyle}
              layout={[layoutFuncs.text]}
            >
              {capName}
            </Text>
          </Box>
        </Box>
      </Box>
    )
    : null;
}

function slideIn(time, animationStartTime, startPos, endPos) {
  if (time >= animationStartTime) {
    // Calculate the progress of the animation
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

    // Apply easing (e.g., ease-out)
    const easedProgress = easeOut(progress);

    // Compute the current y value
    return startPos + easedProgress * (endPos - startPos);
  } else {
    // Before the animation starts, return the start position
    return startPos;
  }
}

function fadeIn(time, animationStartTime) {
  if (time >= animationStartTime) {
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

    return progress;
  } else {
    return 0;
  }
}

const layoutFuncs = {
  text: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    y += PAD_Y;
    x += PAD_X;

    return { x, y, w, h };
  },
  fillBox: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const contentSize = layoutCtx.useContentSize();
    const { time, endTimecode, position } = params;
    const vh = layoutCtx.viewport.h;

    // if (contentSize.h > 0) {
    //   h = contentSize.h + (2 * PAD_Y);
    // }
    h = (FONT_SIZE_VH * vh) + (2 * PAD_Y);

    let endX = 0;
    if (contentSize.w > 0) {
      // center horizontally
      w = contentSize.w + (2 * PAD_X);
      endX = (parentFrame.w - w) / 2;
    }
    let yOffset = FONT_SIZE_VH * vh;
    let startX = endX + 100;
    if (position === "top") {
      yOffset = -(FONT_SIZE_VH * vh);
      startX = endX - 100;
    }
    y = (parentFrame.h / 2) + yOffset;
    x = slideIn(time, endTimecode, startX, endX);

    return { x, y, w, h };
  },
};
import * as React from "react";
import { Box, Text } from "#vcs-react/components";
import { useParams, useVideoTime } from "#vcs-react/hooks";
import { easeOut } from "../utils/easing.js";
import { fontBoldWeights } from "../params.js";

const FONT_SIZE_VH = 80 / 1920;
const PAD_X = 40; // px
const PAD_Y = 15; // px
const ANIMATION_DURATION = 0.5;

export default function EndCap() {
  const time = useVideoTime();
  const { endTimecode, settings } = useParams();
  const {
    additionalJson: json = "{}",
    font: fontFamily,
  } = JSON.parse(settings);
  const { useEndCap, capCta, capName } = JSON.parse(json);
  if (!useEndCap) return null;
  const labelStyle = {
    textColor: "black",
    fontFamily,
    fontSize_vh: FONT_SIZE_VH,
  };
  const headerLabelStyle = {
    ...labelStyle,
    fontWeight: fontBoldWeights[fontFamily],
  };
  return time > endTimecode
    ? (
      <Box id="endCap">
        <Box
          id="background"
          blend={{ opacity: fadeIn(time, endTimecode) }}
          style={{
            fillColor: "rgba(33, 33, 33, 1)",
          }}
        />
        <Box
          transform={{ rotate_deg: -8, skew_x_deg: 8 }}
        >
          {capCta && (
            <Box
              blend={{
                opacity: fadeIn(time, endTimecode + 0.25),
              }}
              style={{
                fillColor: "rgba(34, 217, 229, 1)",
              }}
              layout={[layoutFuncs.fillBox, {
                position: "top",
                time,
                endTimecode: endTimecode + 0.25,
              }]}
            >
              <Text
                style={headerLabelStyle}
                layout={[layoutFuncs.text]}
              >
                {capCta}
              </Text>
            </Box>
          )}
          {capName && (
            <Box
              style={{
                fillColor: "rgba(200, 200, 200, 1)",
              }}
              blend={{
                opacity: fadeIn(time, endTimecode + 0.25),
              }}
              layout={[layoutFuncs.fillBox, {
                position: "bottom",
                time,
                endTimecode: endTimecode + 0.25,
              }]}
            >
              <Text
                style={labelStyle}
                layout={[layoutFuncs.text]}
              >
                {capName}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    )
    : null;
}

function slideIn(time, animationStartTime, startPos, endPos) {
  if (time >= animationStartTime) {
    // Calculate the progress of the animation
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

    // Apply easing (e.g., ease-out)
    const easedProgress = easeOut(progress);

    // Compute the current y value
    return startPos + easedProgress * (endPos - startPos);
  } else {
    // Before the animation starts, return the start position
    return startPos;
  }
}

function fadeIn(time, animationStartTime) {
  if (time >= animationStartTime) {
    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

    return progress;
  } else {
    return 0;
  }
}

const layoutFuncs = {
  text: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    y += PAD_Y;
    x += PAD_X;

    return { x, y, w, h };
  },
  fillBox: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const contentSize = layoutCtx.useContentSize();
    const { time, endTimecode, position } = params;
    const vh = layoutCtx.viewport.h;

    // if (contentSize.h > 0) {
    //   h = contentSize.h + (2 * PAD_Y);
    // }
    h = (FONT_SIZE_VH * vh) + (2 * PAD_Y);

    let endX = 0;
    if (contentSize.w > 0) {
      // center horizontally
      w = contentSize.w + (2 * PAD_X);
      endX = (parentFrame.w - w) / 2;
    }
    let yOffset = FONT_SIZE_VH * vh;
    let startX = endX + 100;
    if (position === "top") {
      yOffset = -(FONT_SIZE_VH * vh);
      startX = endX - 100;
    }
    y = (parentFrame.h / 2) + yOffset;
    x = slideIn(time, endTimecode, startX, endX);

    return { x, y, w, h };
  },
};
