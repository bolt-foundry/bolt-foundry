/**
 * Binary audio data
 */
export type AudioData = ArrayBufferLike;
/**
 * The encoding of the audio data
 * @defaultValue "pcm_s16"le
 */
export type AudioEncoding = "pcm_s16le" | "pcm_mulaw";
/**
 * Configure the threshold for how long to wait before ending an utterance. Default is 700ms.
 */
export type ConfigureEndUtteranceSilenceThreshold = {
    /**
     * The duration threshold in milliseconds
     */
    end_utterance_silence_threshold: number;
};
/**
 * Transcript text at the end of an utterance with punctuation and casing.
 */
export type FinalTranscript = RealtimeBaseTranscript & {
    /**
     * Describes the type of message
     */
    message_type: "FinalTranscript";
    /**
     * Whether the text is punctuated and cased
     */
    punctuated: boolean;
    /**
     * Whether the text is formatted, for example Dollar -&gt; $
     */
    text_formatted: boolean;
};
/**
 * Manually end an utterance
 */
export type ForceEndUtterance = {
    /**
     * A boolean value to communicate that you wish to force the end of the utterance
     */
    force_end_utterance: boolean;
};
export type MessageType = "SessionBegins" | "PartialTranscript" | "FinalTranscript" | "SessionInformation" | "SessionTerminated";
/**
 * As you send audio data to the API, the API immediately starts responding with Partial Transcript results.
 */
export type PartialTranscript = RealtimeBaseTranscript & {
    /**
     * Describes the type of message
     */
    message_type: "PartialTranscript";
};
export type RealtimeBaseMessage = {
    /**
     * Describes the type of the message
     */
    message_type: MessageType;
};
export type RealtimeBaseTranscript = {
    /**
     * End time of audio sample relative to session start, in milliseconds
     */
    audio_end: number;
    /**
     * Start time of audio sample relative to session start, in milliseconds
     */
    audio_start: number;
    /**
     * The confidence score of the entire transcription, between 0 and 1
     */
    confidence: number;
    /**
     * The timestamp for the partial transcript
     */
    created: Date;
    /**
     * The partial transcript for your audio
     */
    text: string;
    /**
     * An array of objects, with the information for each word in the transcription text.
     * Includes the start and end time of the word in milliseconds, the confidence score of the word, and the text, which is the word itself.
     */
    words: Word[];
};
/**
 * Error message
 */
export type RealtimeError = {
    error: string;
};
export type RealtimeMessage = SessionBegins | PartialTranscript | FinalTranscript | SessionInformation | SessionTerminated | RealtimeError;
export type RealtimeTranscript = PartialTranscript | FinalTranscript;
export type RealtimeTranscriptType = "PartialTranscript" | "FinalTranscript";
/**
 * Session start
 */
export type SessionBegins = RealtimeBaseMessage & {
    /**
     * Timestamp when this session will expire
     */
    expires_at: Date;
    /**
     * Describes the type of the message
     */
    message_type: "SessionBegins";
    /**
     * Unique identifier for the established session
     */
    session_id: string;
};
/**
 * Information about the session
 * Information about the session that is concluding.
 * This message is sent at the end of the session, before the SessionTerminated message.
 */
export type SessionInformation = RealtimeBaseMessage & {
    /**
     * The total duration of the audio in seconds
     */
    audio_duration_seconds: number;
    /**
     * Describes the type of the message
     */
    message_type: "SessionInformation";
};
/**
 * Session terminated
 */
export type SessionTerminated = RealtimeBaseMessage & {
    /**
     * Describes the type of the message
     */
    message_type: "SessionTerminated";
};
/**
 * Terminate session
 */
export type TerminateSession = {
    /**
     * Set to true to end your streaming session forever
     */
    terminate_session: boolean;
};
export type Word = {
    /**
     * Confidence score of the word
     */
    confidence: number;
    /**
     * End time of the word in milliseconds
     */
    end: number;
    /**
     * Start time of the word in milliseconds
     */
    start: number;
    /**
     * The word itself
     */
    text: string;
};