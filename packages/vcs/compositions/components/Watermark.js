import * as React from "react";
import { Box, Image } from "#vcs-react/components";
import { useParams } from "#vcs-react/hooks";

export default function Watermark({
  captionPosition = 0.6,
  defaultNumberOfLines = 3,
}) {
  const { settings } = useParams();
  const {
    fontSize,
    showWatermark,
    watermarkLogo,
    watermarkOpacity,
    watermarkPosition,
    watermarkScale,
  } = JSON.parse(settings);
  const fontSize_vh = (fontSize ?? 96) / 1920;
  if (!showWatermark) return null;

  return (
    <Box id="watermark">
      <Image
        src={watermarkLogo ?? "made_with_bf.png"}
        blend={{ opacity: watermarkOpacity ?? 0.5 }}
        layout={[layoutFuncs.watermark, {
          position: watermarkPosition,
          scale: watermarkScale,
          fontSize_vh,
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
      fontSize_vh,
      captionPosition,
      defaultNumberOfLines,
    } = params;
    const parentH = h;
    const parentW = w;
    const imgSize = layoutCtx.useIntrinsicSize();
    const imgAsp = imgSize.h > 0 ? imgSize.w / imgSize.h : 1;
    const vh = layoutCtx.viewport.h;
    const fontSize = fontSize_vh * vh;

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
