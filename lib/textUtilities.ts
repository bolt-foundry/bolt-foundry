import { DGWord } from "packages/types/transcript.ts";

export function transcriptToSrt(transcriptWords: Array<DGWord>) {
  let srt = "";
  let segmentNumber = 1;
  let line = "";
  let wordCount = 0;
  let start = convertTimestampToSrtTime(transcriptWords[0].start);
  let end = convertTimestampToSrtTime(transcriptWords[0].end);

  for (const item of transcriptWords) {
    if (item == null) continue;
    const word = item.punctuated_word;
    if (word == null) continue;
    if (wordCount === 0) {
      start = convertTimestampToSrtTime(item.start);
      srt += `${segmentNumber}\n${start} --> `;
    }

    line += `${word} `;

    wordCount++;
    end = convertTimestampToSrtTime(item.end);
    if (wordCount === 5) {
      srt += `${end}\n${line}\n\n`;
      line = "";
      wordCount = 0;
      segmentNumber++;
    }
  }
  if (line !== "") {
    srt += `${end}\n${line}\n\n`;
  }

  return srt;
}

function convertTimestampToSrtTime(timestamp: string | number) {
  const timestampNumber = Number(timestamp);
  const hours = Math.floor(timestampNumber / 3600);
  const minutes = Math.floor((timestampNumber % 3600) / 60);
  const seconds = Math.floor(timestampNumber % 60);
  const milliseconds = Math.floor((timestampNumber % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${
    pad(milliseconds, 3)
  }`;
}

function pad(number: number, length = 2) {
  return String(number).padStart(length, "0");
}

export function generateTranscriptText(words: Array<DGWord>) {
  return words.map((word) => word.punctuated_word).filter((wordText) =>
    wordText != null
  ).join(" ");
}

export function unpunctuateWord(word: string) {
  return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]'"?<>\\]/g, "");
}

type SwearsFilterOptions = {
  showFirstLetter?: boolean;
  useAsterisks?: boolean;
};

const characterFill = "@#$%&@#$%&@#$%&@#$%&@#$%&";

export function swearsFilter(
  text: string,
  swears: Array<string>,
  options: SwearsFilterOptions = {},
) {
  if (Array.isArray(swears)) {
    const swearPattern = new RegExp(`\\b(${swears.join("|")})\\b`, "gi");
    return text.replace(
      swearPattern,
      (match) => {
        const firstCharacter = match.charAt(0);
        let newText = options.useAsterisks
          ? "*".repeat(match.length) // fill with asterisks
          : characterFill.slice(0, match.length); // fill with characters from characterFill
        if (options.showFirstLetter) {
          newText = firstCharacter + newText.slice(1);
        }
        return newText;
      },
    );
  }
  return text;
}
