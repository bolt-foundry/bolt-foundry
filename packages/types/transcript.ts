export type AWSWord = {
  alternatives: {
    confidence: number | string;
    content: string;
  }[];
  start_time?: string;
  end_time?: string;
  type: string;
};

export type AWSTranscript = {
  results: {
    items: AWSWord[];
    transcripts: {
      transcript: string;
    }[];
  };
};

export type DGWord = {
  id: string;
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker: number;
  speaker_confidence: number;
  punctuated_word: string;
};

export type Word = {
  text: string;
  startTime: number;
  endTime: number;
  speaker: string;
};

export type DGTranscript = {
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Array<DGWord>;
        paragraphs: {
          transcript: string;
          paragraphs: Array<{
            sentences: Array<{
              text: string;
              start: number;
              end: number;
            }>;
            speaker: number;
            num_words: number;
            start: number;
            end: number;
          }>;
        };
      }>;
    }>;
    utterances: Array<{
      start: number;
      end: number;
      confidence: number;
      channel: number;
      transcript: string;
      words: Array<DGWord>;
      speaker: number;
      id: string;
    }>;
  };
};

export type TranscriptType = AWSTranscript | DGTranscript;
