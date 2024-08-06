import * as React from "react";
import { Box, Image } from "#vcs-react/components";
import { useParams } from "#vcs-react/hooks";

export default function Watermark({
  fontSizeVh = 96 / 1920,
  captionPosition = 0.6,
  defaultNumberOfLines = 3,
}) {
  const { settings } = useParams();
  const {
    additionalJson = "{}",
    showWatermark,
    watermarkLogo,
    watermarkOpacity,
    watermarkPosition,
  } = JSON.parse(settings);
  if (!showWatermark) return null;
  const {
    watermarkScale,
  } = JSON.parse(additionalJson);

  return (
    <Box id="watermark">
      <Image
        src={watermarkLogo ?? "made_with_bf.png"}
        blend={{ opacity: watermarkOpacity ?? 0.5 }}
        layout={[layoutFuncs.watermark, {
          position: watermarkPosition,
          scale: watermarkScale,
          fontSizeVh,
          captionPosition,
          defaultNumberOfLines,
        }]}
      />
    </Box>
  );
}

const layoutFuncs = {
  watermark: (parentFrame, params, layoutCtx) => {
    let { x, y, w, h } = parentFrame;
    const {
      position,
      scale,
      fontSizeVh,
      captionPosition,
      defaultNumberOfLines,
    } = params;
    const parentH = h;
    const parentW = w;
    const imgSize = layoutCtx.useIntrinsicSize();
    const imgAsp = imgSize.h > 0 ? imgSize.w / imgSize.h : 1;
    const vh = layoutCtx.viewport.h;
    const fontSize = fontSizeVh * vh;

    const margin = fontSize * 0.4;
    w = parentW * scale ?? 0.25;
    h = w / imgAsp;

    // y position, default under captions
    y = parentH * captionPosition + (fontSize * defaultNumberOfLines) +
      margin;
    if (position.indexOf("top") > -1) {
      y = margin;
    }
    if (position.indexOf("bottom") > -1) {
      y = parentH - h - margin;
    }

    // x position, default centered
    x = (parentW - w) / 2;
    if (position.indexOf("left") > -1) {
      x = margin;
    }
    if (position.indexOf("right") > -1) {
      x = parentW - w - margin;
    }

    return { x, y, w, h };
  },
};
