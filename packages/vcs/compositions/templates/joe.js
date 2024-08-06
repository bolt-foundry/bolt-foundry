import * as React from 'react';
import { Box, Text, Video } from '#vcs-react/components';
import { useParams, useVideoTime } from '#vcs-react/hooks';
import { fontBoldWeights, fontRelativeCharacterWidths } from '../fonts.js';
import getLinesOfWordsFromTranscript from '../utils/getLinesOfWordsFromTranscript.js';
import EndCap from '../components/EndCap.js';
import TitleCard from '../components/TitleCard.js';
import Watermark from '../components/Watermark.js';

const FONT_SIZE_VH = 96 / 1920;
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
    Array(captionLines).fill({ ...EMPTY_LINE_STATE })
  );
  const time = useVideoTime();
  const { endTimecode, startTimecode, settings, transcriptWords } = useParams();
  const {
    additionalJson: json = '{}',
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    showCaptions,
  } = JSON.parse(settings);
  const additionalJson = JSON.parse(json);
  let strokeColor = 'rgba(0, 0, 0, 0.75)';
  if (additionalJson.strokeColor) {
    strokeColor = additionalJson.strokeColor;
  }
  let strokeWidth_px = 6;
  if (additionalJson.strokeWidth_px) {
    strokeWidth_px = additionalJson.strokeWidth_px;
  }

  const labelStyle = {
    textColor: captionColor ?? 'white',
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: FONT_SIZE_VH,
    strokeColor,
    strokeWidth_px,
  };
  const highlightStyle = {
    ...labelStyle,
    textColor: captionHighlightColor ?? 'rgb(255, 215, 0)',
  };

  const charactersPerLineByFont =
    MAX_CHARACTERS_PER_LINE * fontRelativeCharacterWidths[fontFamily];

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
      <Video src={'video1'} />
      {showCaptions &&
        lineState &&
        lineState.map((line, index) => {
          const fontSize_vh = labelStyle.fontSize_vh;
          return (
            <Text
              key={index}
              style={line.currentLine ? highlightStyle : labelStyle}
              layout={[
                layoutFuncs.plainSubtitles,
                {
                  fontSize_vh,
                  index,
                  pad_gu: 0.5,
                },
              ]}
            >
              {line.lineText.join(' ')}
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
    const { fontSize_vh = FONT_SIZE_VH, index = 0, pad_gu = 0 } = params;
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
