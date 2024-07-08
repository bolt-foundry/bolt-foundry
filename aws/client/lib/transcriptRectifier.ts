import {
  AssemblyAITranscript,
  AssemblyAIWord,
  AWSWord,
  DGTranscript,
  DGWord,
  TranscriptType,
} from "aws/types/transcript.ts";

function isDGTranscript(
  transcript: TranscriptType,
): transcript is DGTranscript {
  return (transcript as DGTranscript).results?.channels !== undefined;
}

function isAssemblyAITranscript(
  transcript: TranscriptType,
): transcript is AssemblyAITranscript {
  return (transcript as AssemblyAITranscript).acoustic_model ===
    "assemblyai_default";
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
  }).filter((item) => item !== undefined) as Array<DGWord>;
}

function convertAssemblyAITranscriptToDGWords(
  items: Array<AssemblyAIWord>,
): Array<DGWord> {
  return items.map((item: AssemblyAIWord) => {
    return {
      word: item.text, // not sure if this needs to have punctuation removed
      start: item.start / 1000,
      end: item.end / 1000,
      punctuated_word: item.text,
      speaker: item.speaker ?? "",
    };
  }).filter((item) => item !== undefined) as Array<DGWord>;
}

export function getTranscriptWords(
  transcript: TranscriptType,
): Array<DGWord> {
  if (isDGTranscript(transcript)) {
    return transcript.results.channels[0].alternatives[0].words;
  }
  if (isAssemblyAITranscript(transcript)) {
    return convertAssemblyAITranscriptToDGWords(transcript.words);
  }
  return convertAWSItemsToDGWords(transcript.results.items);
}

export function getTranscript(
  transcript: TranscriptType,
): string {
  if (isDGTranscript(transcript)) {
    return transcript.results.channels[0].alternatives[0].transcript;
  }
  if (isAssemblyAITranscript(transcript)) {
    return transcript.text;
  }
  return transcript.results.transcripts[0].transcript;
}
