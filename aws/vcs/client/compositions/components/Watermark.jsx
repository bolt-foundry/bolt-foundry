import * as React from "react";
import { Box, Image } from "#vcs-react/components";
import { useParams } from "#vcs-react/hooks";
import consts from "../const.js";

const {
  FONT_SIZE_VH,
  CAPTION_POSITION,
  DEFAULT_NUMBER_OF_LINES,
} = consts;

export default function Watermark() {
  const { settings } = useParams();
  const {
    showWatermark,
    watermarkLogo,
    watermarkOpacity,
    watermarkPosition,
  } = JSON.parse(settings);
  const {
    watermarkScale,
  } = JSON.parse(additionalJson);
  console.log('WatermarkScale', watermarkScale);
  <Box id="watermark">
    {showWatermark && (
      <Image
        src={watermarkLogo ?? "made_with_bf.png"}
        blend={{ opacity: watermarkOpacity ?? 0.5 }}
        layout={[layoutFuncs.watermark, {
          position: watermarkPosition,
          scale: watermarkScale,
        }]}
      />
    )}
  </Box>
}

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
    w = parentW * params.scale ?? 0.25;
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
};
