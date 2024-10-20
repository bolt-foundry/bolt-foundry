import { BaseServiceParams } from "..";
import { LemurService } from "./lemur";
import { RealtimeTranscriber, RealtimeTranscriberFactory, RealtimeService, RealtimeServiceFactory } from "./realtime";
import { TranscriptService } from "./transcripts";
import { FileService } from "./files";
declare class AssemblyAI {
    /**
     * The files service.
     */
    files: FileService;
    /**
     * The transcripts service.
     */
    transcripts: TranscriptService;
    /**
     * The LeMUR service.
     */
    lemur: LemurService;
    /**
     * The realtime service.
     */
    realtime: RealtimeTranscriberFactory;
    /**
     * Create a new AssemblyAI client.
     * @param params - The parameters for the service, including the API key and base URL, if any.
     */
    constructor(params: BaseServiceParams);
}
export { AssemblyAI, LemurService, RealtimeTranscriberFactory, RealtimeTranscriber, RealtimeServiceFactory, RealtimeService, TranscriptService, FileService, };
