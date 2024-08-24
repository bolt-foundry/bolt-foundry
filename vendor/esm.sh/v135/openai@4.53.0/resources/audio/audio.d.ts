import { APIResource } from "../../resource.d.ts";
import * as SpeechAPI from "./speech.d.ts";
import * as TranscriptionsAPI from "./transcriptions.d.ts";
import * as TranslationsAPI from "./translations.d.ts";
export declare class Audio extends APIResource {
    transcriptions: TranscriptionsAPI.Transcriptions;
    translations: TranslationsAPI.Translations;
    speech: SpeechAPI.Speech;
}
export declare namespace Audio {
    export import Transcriptions = TranscriptionsAPI.Transcriptions;
    export import Transcription = TranscriptionsAPI.Transcription;
    export import TranscriptionCreateParams = TranscriptionsAPI.TranscriptionCreateParams;
    export import Translations = TranslationsAPI.Translations;
    export import Translation = TranslationsAPI.Translation;
    export import TranslationCreateParams = TranslationsAPI.TranslationCreateParams;
    export import Speech = SpeechAPI.Speech;
    export import SpeechCreateParams = SpeechAPI.SpeechCreateParams;
}
//# sourceMappingURL=audio.d.ts.map
