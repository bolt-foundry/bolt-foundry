// adapted from joe.jsx
import * as React from 'react';
import { Box, Text, Video } from '#vcs-react/components';
import { useParams, useVideoTime } from '#vcs-react/hooks';
import { fontBoldWeights, fontRelativeCharacterWidths } from '../fonts.js';
import getLinesOfWordsFromTranscript from '../utils/getLinesOfWordsFromTranscript.js';
import EndCap from '../components/EndCap.js';
import TitleCard from '../components/TitleCard.js';
import Watermark from '../components/Watermark.js';
import { getValueFromJson } from '../utils/jsonUtils.js';

// CHANGED: font size
const FONT_SIZE_VH = 120 / 1920;
const CAPTION_POSITION = 0.6;
const MAX_CHARACTERS_PER_LINE = 16;
// CHANGED: default number of lines
const DEFAULT_NUMBER_OF_LINES = 2;
const EMPTY_LINE_STATE = {
  firstWordIndex: -1,
  actualWordsPerLine: 0,
  lineText: [],
  currentLine: false,
};

export default function OffCabotGraphics({
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
    additionalJson = '{}',
    captionColor,
    captionHighlightColor,
    font: fontFamily,
    showCaptions,
  } = JSON.parse(settings);
  const strokeColor = getValueFromJson(
    additionalJson,
    'strokeColor',
    'rgba(0, 0, 0, 1)'
  );
  const strokeWidth_px = getValueFromJson(additionalJson, 'strokeWidth_px', 6);

  const labelStyle = {
    textColor: captionColor ?? 'white',
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: FONT_SIZE_VH,
    strokeColor,
    strokeWidth_px,
  };
  // CHANGED: shadow style
  const shadowStyle = {
    textColor: 'rgba(0, 0, 0, 1)',
    fontFamily,
    fontWeight: fontBoldWeights[fontFamily],
    fontSize_vh: FONT_SIZE_VH,
    strokeColor: 'rgba(0, 0, 0, 1)',
    strokeWidth_px: 12,
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
        lineState.map((line, index) => {
          const fontSize_vh = labelStyle.fontSize_vh;
          return (
            <Box key={index}>
              {/* // CHANGED: shadow text */}
              <Text
                style={shadowStyle}
                layout={[
                  layoutFuncs.plainSubtitles,
                  {
                    fontSize_vh,
                    index,
                    pad_gu: 0.5,
                    xOffset_gu: -0.25,
                    yOffset_gu: 0.25,
                  },
                ]}
              >
                {line.lineText.join(' ')}
              </Text>
              <Text
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
            </Box>
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
    const {
      fontSize_vh = FONT_SIZE_VH,
      index = 0,
      pad_gu = 0,
      // CHANGED: added offset params
      xOffset_gu = 0,
      yOffset_gu = 0,
    } = params;
    let { x, y, w, h } = parentFrame;

    const textSize = layoutCtx.useIntrinsicSize();

    const vh = layoutCtx.viewport.h;
    const lineOffset = fontSize_vh * vh * index;

    const pad = pad_gu * pxPerGu * index;

    // x = w * 0.15;
    // CHANGED: offset y position
    y = h * CAPTION_POSITION + lineOffset + pad + yOffset_gu * pxPerGu;

    if (textSize.w > 0) {
      // center horizontally
      w = textSize.w;
      // CHANGED: offset x position
      x += (parentFrame.w - w) / 2 + xOffset_gu * pxPerGu;
    }

    return { x, y, w, h };
  },
};
