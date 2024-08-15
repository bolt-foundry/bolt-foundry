import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

export function getTimecodesForClips(response, documents) {
  logger.setLevel(logger.levels.DEBUG);
  if (!response || !Array.isArray(response.anecdotes)) {
    logger.error("No response");
    return [];
  }
  const anecdotes: Array<unknown> = [];
  response.anecdotes.forEach((clip) => {
    logger.debug("CLIP", clip);
    const currentDocument = documents.find((doc) =>
      doc.transcriptId === clip.transcriptId
    );
    const wordsWithTimecode = currentDocument?.words;
    const text = clip.text;
    const timecode = getStartAndEnd(wordsWithTimecode, text);

    anecdotes.push({
      ...clip,
      ...timecode,
    });
  });
  return { anecdotes };
}

function getStartAndEnd(wordsWithTimecode: string, text: string) {
  const words = JSON.parse(wordsWithTimecode);
  const transcript = words.map((word) => word.word).join(" ")
    .toLocaleLowerCase();
  const startIndexPosition = transcript?.indexOf(text.toLocaleLowerCase());
  if (startIndexPosition === -1) {
    logger.debug("No start index");
    return {
      startIndex: 0,
      endIndex: 0,
      startTime: 0,
      endTime: 0,
    };
  }
  logger.debug("START INDEX POSITION", startIndexPosition);

  // copy the transcript but delete everything after startIndexCharacter
  const transcriptBeforeStartIndex = transcript.slice(0, startIndexPosition);

  // get first word index based on number of words in transcriptBeforeStartIndex
  const firstWordIndex = transcriptBeforeStartIndex.split(" ").length - 1;

  const firstWord = words[firstWordIndex];
  const numberOfIndexes = text.split(" ").length - 1;
  const lastWordIndex = firstWordIndex + numberOfIndexes;
  const lastWord = words[lastWordIndex];

  const firstWordStartTime = Number(firstWord.start);
  const lastWordEndTime = Number(lastWord.end);

  logger.debug("Timecode", {
    startIndex: firstWordIndex,
    endIndex: lastWordIndex,
    startTime: firstWordStartTime,
    endTime: lastWordEndTime,
  });

  return {
    startIndex: firstWordIndex,
    endIndex: lastWordIndex,
    startTime: firstWordStartTime,
    endTime: lastWordEndTime,
  };
}
