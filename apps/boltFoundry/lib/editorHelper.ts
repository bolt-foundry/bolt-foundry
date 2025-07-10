import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export function findIndexRange(content: string, textToHighlight: string) {
  // First try exact match
  const exactIndex = content.indexOf(textToHighlight);
  const exactEndIndex = exactIndex + textToHighlight.length;

  if (exactIndex !== -1) {
    // Exact match found, use it directly
    logger.debug("Found exact match at index:", exactIndex);

    return [exactIndex, exactEndIndex];
  } else {
    // Finding best partial match
    // Find all the pairs of first word and last word
    // in the text without punctuation and all lower case
    // then use the closest matching pair based on the length
    // of the text
    const findBestPartialMatch = (
      content: string,
      textToHighlight: string,
    ) => {
      // Normalize the content and search text
      const normalizeText = (text: string) =>
        text.toLowerCase().replace(/[^\w\s]/g, "");

      const normalizedContent = normalizeText(content);
      const normalizedSearchText = normalizeText(textToHighlight);

      // Get first and last words from the search text
      const searchWords = normalizedSearchText.split(/\s+/).filter((w) =>
        w.length > 0
      );
      if (searchWords.length < 2) {
        // If only one word, try to find it directly
        const wordIndex = normalizedContent.indexOf(searchWords[0]);
        if (wordIndex !== -1) {
          return {
            startIndex: wordIndex,
            endIndex: wordIndex + searchWords[0].length,
          };
        }
        return null;
      }

      const firstWord = searchWords[0];
      const lastWord = searchWords[searchWords.length - 1];

      // Find all occurrences of first word
      const firstWordIndexes: Array<number> = [];
      let idx = normalizedContent.indexOf(firstWord);
      while (idx !== -1) {
        firstWordIndexes.push(idx);
        idx = normalizedContent.indexOf(firstWord, idx + 1);
      }

      // Find all occurrences of last word
      const lastWordIndexes: Array<number> = [];
      idx = normalizedContent.indexOf(lastWord);
      while (idx !== -1) {
        lastWordIndexes.push(idx);
        idx = normalizedContent.indexOf(lastWord, idx + 1);
      }

      // Find pairs where first word comes before last word
      const validPairs: Array<
        { startIndex: number; endIndex: number; length: number }
      > = [];
      for (const startIdx of firstWordIndexes) {
        for (const endIdx of lastWordIndexes) {
          if (startIdx < endIdx) {
            const pairLength = endIdx + lastWord.length - startIdx;
            validPairs.push({
              startIndex: startIdx,
              endIndex: endIdx + lastWord.length,
              length: pairLength,
            });
          }
        }
      }

      if (validPairs.length === 0) {
        return null;
      }

      // Sort pairs by how close the length is to the normalized search text length
      const targetLength = normalizedSearchText.length;
      validPairs.sort((a, b) => {
        const aDiff = Math.abs(a.length - targetLength);
        const bDiff = Math.abs(b.length - targetLength);
        return aDiff - bDiff;
      });

      // Find the corresponding indexes in the original text
      const bestMatch = validPairs[0];

      // Map normalized indexes back to the original text indexes
      // This is an approximation since normalization removes characters
      let originalStartIndex = 0;
      let normalizedIdx = 0;

      while (
        normalizedIdx < bestMatch.startIndex &&
        originalStartIndex < content.length
      ) {
        if (normalizeText(content[originalStartIndex]) !== "") {
          normalizedIdx++;
        }
        originalStartIndex++;
      }

      let originalEndIndex = originalStartIndex;
      normalizedIdx = bestMatch.startIndex;

      while (
        normalizedIdx < bestMatch.endIndex &&
        originalEndIndex < content.length
      ) {
        if (normalizeText(content[originalEndIndex]) !== "") {
          normalizedIdx++;
        }
        originalEndIndex++;
      }

      return {
        startIndex: originalStartIndex,
        endIndex: originalEndIndex,
      };
    };

    const bestMatch = findBestPartialMatch(content, textToHighlight);

    if (bestMatch) {
      logger.debug(
        "Found best partial match at indexes:",
        bestMatch.startIndex,
        bestMatch.endIndex,
      );

      return [bestMatch.startIndex, bestMatch.endIndex];
    } else {
      logger.warn(
        "Could not find any partial matches for:",
        textToHighlight,
      );
    }
  }
}
