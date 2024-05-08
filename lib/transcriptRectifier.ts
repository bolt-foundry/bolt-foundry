import {
  AWSWord,
  DGTranscript,
  DGWord,
  TranscriptType,
} from "packages/types/transcript.ts";

function isDGTranscript(
  transcript: TranscriptType,
): transcript is DGTranscript {
  return (transcript as DGTranscript).results.channels !== undefined;
}

function convertAWSItemsToDGWords(
  items: Array<AWSWord>,
): Array<DGWord> {
  return items.map((item: AWSWord, index, arr) => {
    if (item.type === "punctuation") return null;
    const word = item.alternatives[0].content;
    const punctuated_word = arr[index + 1].type === "punctuation"
      ? word + arr[index + 1].alternatives[0].content
      : word;
    return {
      word,
      start: parseFloat(item.start_time ?? "0"),
      end: parseFloat(item.end_time ?? "0"),
      punctuated_word,
    };
  }).filter((item) => item !== undefined) as DGWord[];
}

export function getTranscriptWords(
  transcript: TranscriptType,
): Array<DGWord> {
  return isDGTranscript(transcript)
    ? transcript.results.channels[0].alternatives[0].words
    : convertAWSItemsToDGWords(transcript.results.items);
}

export function getTranscript(
  transcript: TranscriptType,
): string {
  return isDGTranscript(transcript)
    ? transcript.results.channels[0].alternatives[0].transcript
    : transcript.results.transcripts[0].transcript;
}
