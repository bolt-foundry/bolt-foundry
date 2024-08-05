const MINIMUM_PAUSE_AFTER_LAST_WORD = 2; // if the pause is more than this many seconds...
const TIME_AFTER_LAST_WORD = 1; // clear the screen after this many seconds

function estimateCharacterCount(textArray) {
  const text = textArray.join(' ');
  const smallCharacters = 'iljtf,.:;|()[]{}!\'"';
  const wideCharacters = 'mwMW';

  let smallCharacterCount = 0;
  let wideCharacterCount = 0;
  const spaceCount = text.split(' ').length - 1;

  for (let i = 0; i < text.length; i++) {
    if (smallCharacters.includes(text[i])) {
      smallCharacterCount++;
    } else if (wideCharacters.includes(text[i])) {
      wideCharacterCount++;
    }
  }

  const regularCharacterCount =
    text.length - smallCharacterCount - wideCharacterCount - spaceCount;
  const estimatedCharacterCount =
    regularCharacterCount * 1 +
    smallCharacterCount * 0.5 +
    wideCharacterCount * 1.5 +
    spaceCount * 0.5;
  return estimatedCharacterCount;
}

function moveEmptyLinesToTop(lineState) {
  if (!lineState) {
    return null;
  }
  // Separate the lines with empty text from those with text
  const emptyLines = lineState.filter((line) => line.lineText.length === 0);
  const nonEmptyLines = lineState.filter((line) => line.lineText.length > 0);

  // Combine the arrays, placing the empty lines at the beginning
  return emptyLines.concat(nonEmptyLines);
}

let lastKnownWordIndex = -1;

export default function getLinesOfWordsFromTranscript(
  lineState,
  time,
  options
) {
  const {
    maxCharactersPerLine,
    maxWordsPerLine,
    maxPauseForBreak,
    endTimecode,
    startTimecode,
    transcriptWords,
    alignBottom,
  } = options;
  let characterCount = 0;
  let actualWordsPerScreen = 0;
  const words = JSON.parse(transcriptWords);
  const currentWordIndex = words.findIndex((word) => {
    return (
      word.start <= time && word.end >= time && word.start >= startTimecode
    );
  });
  if (currentWordIndex === -1) {
    let lineStateFinal = lineState.current;
    if (alignBottom) {
      lineStateFinal = moveEmptyLinesToTop(lineStateFinal);
    }
    // Calculate the pause after the last word displayed
    if (lastKnownWordIndex > -1) {
      const lastWordEndTime = words[lastKnownWordIndex]?.end;
      let nextWordStartTime = Infinity;
      if (lastKnownWordIndex + 1 < words.length) {
        nextWordStartTime = words[lastKnownWordIndex + 1].start;
      }

      // Check if the pause is predicted to be more than MINIMUM_PAUSE_AFTER_LAST_WORD seconds
      if (nextWordStartTime - lastWordEndTime > MINIMUM_PAUSE_AFTER_LAST_WORD) {
        // We need to check if TIME_AFTER_LAST_WORD seconds have passed since the last word ended
        const pauseDuration = time - lastWordEndTime;
        if (pauseDuration > TIME_AFTER_LAST_WORD) {
          // Then clear the screen
          lineState.current = lineState.current.map((line) => ({
            ...line,
            lineText: [],
            actualWordsPerLine: 0,
            currentLine: false,
          }));
          lineStateFinal = lineState.current;
        }
      }
    }

    return lineStateFinal;
  }

  lineState.current.forEach((line, index) => {
    let { firstWordIndex, currentLine } = line;
    let lastWordIndex = -1;
    let actualWordsPerLine = 0;
    const lineText = [];

    function resetScreen() {
      // make sure to wait for last word
      if (
        currentWordIndex >
        lineState.current[0].firstWordIndex + actualWordsPerScreen - 1
      ) {
        lineState.current.forEach((line) => {
          line.firstWordIndex = -1;
        });
        firstWordIndex = -1;
      }
    }

    // if the current word doesn't exist, don't change anything
    if (currentWordIndex === -1 && firstWordIndex === -1) {
      let lineStateFinal = lineState.current;
      if (alignBottom) {
        lineStateFinal = moveEmptyLinesToTop(lineStateFinal);
      }
      return lineStateFinal;
    }
    // set the first word index
    if (currentWordIndex > -1 && firstWordIndex === -1) {
      const totalPreviousWords = lineState.current
        .slice(0, index)
        .reduce((acc, line) => {
          return acc + line.actualWordsPerLine;
        }, 0);
      firstWordIndex = currentWordIndex + totalPreviousWords;
    }

    let renderLine = true;

    // don't check the first line for theses conditions
    if (index > 0) {
      // if the previous line has no words, don't render this line
      if (lineState.current[index - 1].actualWordsPerLine === 0) {
        renderLine = false;
      } else {
        const previousLastWordIndex = firstWordIndex - 1;
        // if there is a pause between the last word of the previous
        // line and the first word of this line, don't render this line
        if (
          words[firstWordIndex] != null &&
          words[firstWordIndex]?.end <= endTimecode &&
          words[firstWordIndex]?.start != null &&
          words[firstWordIndex].start - words[previousLastWordIndex].end >
            maxPauseForBreak
        ) {
          renderLine = false;
        }
      }
    }

    let highlightedWordIndexWithinLine = -1;
    if (renderLine === true) {
      for (let i = 0; i < maxWordsPerLine; i++) {
        if (firstWordIndex + i === currentWordIndex) {
          // highlight current word
          highlightedWordIndexWithinLine = i;
        }
        if (
          words[firstWordIndex + i] != null &&
          words[firstWordIndex + i].end <= endTimecode
        ) {
          // test if the next word would put the line over the
          // character limit
          characterCount = estimateCharacterCount([
            ...lineText,
            words[firstWordIndex + i].punctuated_word,
          ]);
          // if the next word would put the line over the
          //  character limit, break the line
          if (characterCount > maxCharactersPerLine) {
            lastWordIndex = firstWordIndex + i - 1;
            break;
          }
          const wordText = words[firstWordIndex + i].punctuated_word;
          // if the word is not empty, add it to the line
          if (wordText !== '') {
            lineText.push(wordText);
          }
          // even though we skip the word, we still want to count the words
          // that would have been on the line so the indexes are correct
          actualWordsPerLine++;
          lastWordIndex = firstWordIndex + i;
          // if there is a pause in the audio, break the line
          if (
            words[firstWordIndex + i + 1] != null &&
            words[firstWordIndex + i + 1].end <= endTimecode &&
            words[firstWordIndex + i + 1].start -
              words[firstWordIndex + i].end >
              maxPauseForBreak
          ) {
            break;
          }
        }
      }
    }

    actualWordsPerScreen += actualWordsPerLine;
    currentLine =
      firstWordIndex <= currentWordIndex && currentWordIndex <= lastWordIndex;

    lineState.current[index] = {
      firstWordIndex,
      actualWordsPerLine,
      lineText,
      currentLine,
      highlightedWordIndexWithinLine,
    };

    // this is the last line, so reset the screen
    if (index === lineState.current.length - 1) {
      resetScreen();
    }
  });

  let lineStateFinal = lineState.current;
  if (alignBottom) {
    lineStateFinal = moveEmptyLinesToTop(lineStateFinal);
  }

  // setting the last known word index to the current word index
  // so we can check for pauses in the audio
  lastKnownWordIndex = currentWordIndex;

  // clear screen between text changes
  // TODO figure out why firstWordIndex is -1 and fix it, then remove this
  lineStateFinal.forEach((line) => {
    if (line.firstWordIndex === -1) {
      line.lineText = [];
    }
  });

  return lineStateFinal;
}
