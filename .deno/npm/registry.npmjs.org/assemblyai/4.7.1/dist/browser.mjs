const DEFAULT_FETCH_INIT = {
    cache: "no-store",
};

const buildUserAgent = (userAgent) => defaultUserAgentString +
    (userAgent === false
        ? ""
        : " AssemblyAI/1.0 (" +
            Object.entries({ ...defaultUserAgent, ...userAgent })
                .map(([key, item]) => item ? `${key}=${item.name}/${item.version}` : "")
                .join(" ") +
            ")");
let defaultUserAgentString = "";
if (typeof navigator !== "undefined" && navigator.userAgent) {
    defaultUserAgentString += navigator.userAgent;
}
const defaultUserAgent = {
    sdk: { name: "JavaScript", version: "4.7.1" },
};
if (typeof process !== "undefined") {
    if (process.versions.node && defaultUserAgentString.indexOf("Node") === -1) {
        defaultUserAgent.runtime_env = {
            name: "Node",
            version: process.versions.node,
        };
    }
    if (process.versions.bun && defaultUserAgentString.indexOf("Bun") === -1) {
        defaultUserAgent.runtime_env = {
            name: "Bun",
            version: process.versions.bun,
        };
    }
}
if (typeof Deno !== "undefined") {
    if (process.versions.bun && defaultUserAgentString.indexOf("Deno") === -1) {
        defaultUserAgent.runtime_env = { name: "Deno", version: Deno.version.deno };
    }
}

/**
 * Base class for services that communicate with the API.
 */
class BaseService {
    /**
     * Create a new service.
     * @param params - The parameters to use for the service.
     */
    constructor(params) {
        this.params = params;
        if (params.userAgent === false) {
            this.userAgent = undefined;
        }
        else {
            this.userAgent = buildUserAgent(params.userAgent || {});
        }
    }
    async fetch(input, init) {
        init = { ...DEFAULT_FETCH_INIT, ...init };
        let headers = {
            Authorization: this.params.apiKey,
            "Content-Type": "application/json",
        };
        if (DEFAULT_FETCH_INIT?.headers)
            headers = { ...headers, ...DEFAULT_FETCH_INIT.headers };
        if (init?.headers)
            headers = { ...headers, ...init.headers };
        if (this.userAgent) {
            headers["User-Agent"] = this.userAgent;
            {
                // chromium browsers have a bug where the user agent can't be modified
                if (typeof window !== "undefined" && "chrome" in window) {
                    headers["AssemblyAI-Agent"] =
                        this.userAgent;
                }
            }
        }
        init.headers = headers;
        if (!input.startsWith("http"))
            input = this.params.baseUrl + input;
        const response = await fetch(input, init);
        if (response.status >= 400) {
            let json;
            const text = await response.text();
            if (text) {
                try {
                    json = JSON.parse(text);
                }
                catch {
                    /* empty */
                }
                if (json?.error)
                    throw new Error(json.error);
                throw new Error(text);
            }
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        return response;
    }
    async fetchJson(input, init) {
        const response = await this.fetch(input, init);
        return response.json();
    }
}

class LemurService extends BaseService {
    summary(params) {
        return this.fetchJson("/lemur/v3/generate/summary", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    questionAnswer(params) {
        return this.fetchJson("/lemur/v3/generate/question-answer", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    actionItems(params) {
        return this.fetchJson("/lemur/v3/generate/action-items", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    task(params) {
        return this.fetchJson("/lemur/v3/generate/task", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    getResponse(id) {
        return this.fetchJson(`/lemur/v3/${id}`);
    }
    /**
     * Delete the data for a previously submitted LeMUR request.
     * @param id - ID of the LeMUR request
     */
    purgeRequestData(id) {
        return this.fetchJson(`/lemur/v3/${id}`, {
            method: "DELETE",
        });
    }
}

const { WritableStream } = typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
        ? global
        : globalThis;

const PolyfillWebSocket = WebSocket ?? global?.WebSocket ?? window?.WebSocket ?? self?.WebSocket;
const factory = (url, params) => {
    if (params) {
        return new PolyfillWebSocket(url, params);
    }
    return new PolyfillWebSocket(url);
};

const RealtimeErrorType = {
    BadSampleRate: 4000,
    AuthFailed: 4001,
    /**
     * @deprecated Use InsufficientFunds or FreeTierUser instead
     */
    InsufficientFundsOrFreeAccount: 4002,
    InsufficientFunds: 4002,
    FreeTierUser: 4003,
    NonexistentSessionId: 4004,
    SessionExpired: 4008,
    ClosedSession: 4010,
    RateLimited: 4029,
    UniqueSessionViolation: 4030,
    SessionTimeout: 4031,
    AudioTooShort: 4032,
    AudioTooLong: 4033,
    AudioTooSmallToTranscode: 4034,
    /**
     * @deprecated Don't use
     */
    BadJson: 4100,
    BadSchema: 4101,
    TooManyStreams: 4102,
    Reconnected: 4103,
    /**
     * @deprecated Don't use
     */
    ReconnectAttemptsExhausted: 1013,
    WordBoostParameterParsingFailed: 4104,
};
const RealtimeErrorMessages = {
    [RealtimeErrorType.BadSampleRate]: "Sample rate must be a positive integer",
    [RealtimeErrorType.AuthFailed]: "Not Authorized",
    [RealtimeErrorType.InsufficientFunds]: "Insufficient funds",
    [RealtimeErrorType.FreeTierUser]: "This feature is paid-only and requires you to add a credit card. Please visit https://app.assemblyai.com/ to add a credit card to your account.",
    [RealtimeErrorType.NonexistentSessionId]: "Session ID does not exist",
    [RealtimeErrorType.SessionExpired]: "Session has expired",
    [RealtimeErrorType.ClosedSession]: "Session is closed",
    [RealtimeErrorType.RateLimited]: "Rate limited",
    [RealtimeErrorType.UniqueSessionViolation]: "Unique session violation",
    [RealtimeErrorType.SessionTimeout]: "Session Timeout",
    [RealtimeErrorType.AudioTooShort]: "Audio too short",
    [RealtimeErrorType.AudioTooLong]: "Audio too long",
    [RealtimeErrorType.AudioTooSmallToTranscode]: "Audio too small to transcode",
    [RealtimeErrorType.BadJson]: "Bad JSON",
    [RealtimeErrorType.BadSchema]: "Bad schema",
    [RealtimeErrorType.TooManyStreams]: "Too many streams",
    [RealtimeErrorType.Reconnected]: "This session has been reconnected. This WebSocket is no longer valid.",
    [RealtimeErrorType.ReconnectAttemptsExhausted]: "Reconnect attempts exhausted",
    [RealtimeErrorType.WordBoostParameterParsingFailed]: "Could not parse word boost parameter",
};
class RealtimeError extends Error {
}

const defaultRealtimeUrl = "wss://api.assemblyai.com/v2/realtime/ws";
const forceEndOfUtteranceMessage = `{"force_end_utterance":true}`;
const terminateSessionMessage = `{"terminate_session":true}`;
/**
 * RealtimeTranscriber connects to the Streaming Speech-to-Text API and lets you transcribe audio in real-time.
 */
class RealtimeTranscriber {
    /**
     * Create a new RealtimeTranscriber.
     * @param params - Parameters to configure the RealtimeTranscriber
     */
    constructor(params) {
        this.listeners = {};
        this.realtimeUrl = params.realtimeUrl ?? defaultRealtimeUrl;
        this.sampleRate = params.sampleRate ?? 16_000;
        this.wordBoost = params.wordBoost;
        this.encoding = params.encoding;
        this.endUtteranceSilenceThreshold = params.endUtteranceSilenceThreshold;
        this.disablePartialTranscripts = params.disablePartialTranscripts;
        if ("token" in params && params.token)
            this.token = params.token;
        if ("apiKey" in params && params.apiKey)
            this.apiKey = params.apiKey;
        if (!(this.token || this.apiKey)) {
            throw new Error("API key or temporary token is required.");
        }
    }
    connectionUrl() {
        const url = new URL(this.realtimeUrl);
        if (url.protocol !== "wss:") {
            throw new Error("Invalid protocol, must be wss");
        }
        const searchParams = new URLSearchParams();
        if (this.token) {
            searchParams.set("token", this.token);
        }
        searchParams.set("sample_rate", this.sampleRate.toString());
        if (this.wordBoost && this.wordBoost.length > 0) {
            searchParams.set("word_boost", JSON.stringify(this.wordBoost));
        }
        if (this.encoding) {
            searchParams.set("encoding", this.encoding);
        }
        searchParams.set("enable_extra_session_information", "true");
        if (this.disablePartialTranscripts) {
            searchParams.set("disable_partial_transcripts", this.disablePartialTranscripts.toString());
        }
        url.search = searchParams.toString();
        return url;
    }
    /**
     * Add a listener for an event.
     * @param event - The event to listen for.
     * @param listener - The function to call when the event is emitted.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event, listener) {
        this.listeners[event] = listener;
    }
    /**
     * Connect to the server and begin a new session.
     * @returns A promise that resolves when the connection is established and the session begins.
     */
    connect() {
        return new Promise((resolve) => {
            if (this.socket) {
                throw new Error("Already connected");
            }
            const url = this.connectionUrl();
            if (this.token) {
                this.socket = factory(url.toString());
            }
            else {
                {
                    console.warn(`API key authentication is not supported for the RealtimeTranscriber in browser environment. Use temporary token authentication instead.
Learn more at https://github.com/AssemblyAI/assemblyai-node-sdk/blob/main/docs/compat.md#browser-compatibility.`);
                }
                this.socket = factory(url.toString(), {
                    headers: { Authorization: this.apiKey },
                });
            }
            this.socket.binaryType = "arraybuffer";
            this.socket.onopen = () => {
                if (this.endUtteranceSilenceThreshold === undefined ||
                    this.endUtteranceSilenceThreshold === null) {
                    return;
                }
                this.configureEndUtteranceSilenceThreshold(this.endUtteranceSilenceThreshold);
            };
            this.socket.onclose = ({ code, reason }) => {
                if (!reason) {
                    if (code in RealtimeErrorMessages) {
                        reason = RealtimeErrorMessages[code];
                    }
                }
                this.listeners.close?.(code, reason);
            };
            this.socket.onerror = (event) => {
                if (event.error)
                    this.listeners.error?.(event.error);
                else
                    this.listeners.error?.(new Error(event.message));
            };
            this.socket.onmessage = ({ data }) => {
                const message = JSON.parse(data.toString());
                if ("error" in message) {
                    this.listeners.error?.(new RealtimeError(message.error));
                    return;
                }
                switch (message.message_type) {
                    case "SessionBegins": {
                        const openObject = {
                            sessionId: message.session_id,
                            expiresAt: new Date(message.expires_at),
                        };
                        resolve(openObject);
                        this.listeners.open?.(openObject);
                        break;
                    }
                    case "PartialTranscript": {
                        // message.created is actually a string when coming from the socket
                        message.created = new Date(message.created);
                        this.listeners.transcript?.(message);
                        this.listeners["transcript.partial"]?.(message);
                        break;
                    }
                    case "FinalTranscript": {
                        // message.created is actually a string when coming from the socket
                        message.created = new Date(message.created);
                        this.listeners.transcript?.(message);
                        this.listeners["transcript.final"]?.(message);
                        break;
                    }
                    case "SessionInformation": {
                        this.listeners.session_information?.(message);
                        break;
                    }
                    case "SessionTerminated": {
                        this.sessionTerminatedResolve?.();
                        break;
                    }
                }
            };
        });
    }
    /**
     * Send audio data to the server.
     * @param audio - The audio data to send to the server.
     */
    sendAudio(audio) {
        this.send(audio);
    }
    /**
     * Create a writable stream that can be used to send audio data to the server.
     * @returns A writable stream that can be used to send audio data to the server.
     */
    stream() {
        return new WritableStream({
            write: (chunk) => {
                this.sendAudio(chunk);
            },
        });
    }
    /**
     * Manually end an utterance
     */
    forceEndUtterance() {
        this.send(forceEndOfUtteranceMessage);
    }
    /**
     * Configure the threshold for how long to wait before ending an utterance. Default is 700ms.
     * @param threshold - The duration of the end utterance silence threshold in milliseconds.
     * This value must be an integer between 0 and 20_000.
     */
    configureEndUtteranceSilenceThreshold(threshold) {
        this.send(`{"end_utterance_silence_threshold":${threshold}}`);
    }
    send(data) {
        if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
            throw new Error("Socket is not open for communication");
        }
        this.socket.send(data);
    }
    /**
     * Close the connection to the server.
     * @param waitForSessionTermination - If true, the method will wait for the session to be terminated before closing the connection.
     * While waiting for the session to be terminated, you will receive the final transcript and session information.
     */
    async close(waitForSessionTermination = true) {
        if (this.socket) {
            if (this.socket.readyState === this.socket.OPEN) {
                if (waitForSessionTermination) {
                    const sessionTerminatedPromise = new Promise((resolve) => {
                        this.sessionTerminatedResolve = resolve;
                    });
                    this.socket.send(terminateSessionMessage);
                    await sessionTerminatedPromise;
                }
                else {
                    this.socket.send(terminateSessionMessage);
                }
            }
            if (this.socket?.removeAllListeners)
                this.socket.removeAllListeners();
            this.socket.close();
        }
        this.listeners = {};
        this.socket = undefined;
    }
}
/**
 * @deprecated Use RealtimeTranscriber instead
 */
class RealtimeService extends RealtimeTranscriber {
}

class RealtimeTranscriberFactory extends BaseService {
    constructor(params) {
        super(params);
        this.rtFactoryParams = params;
    }
    /**
     * @deprecated Use transcriber(...) instead
     */
    createService(params) {
        return this.transcriber(params);
    }
    transcriber(params) {
        const serviceParams = { ...params };
        if (!serviceParams.token && !serviceParams.apiKey) {
            serviceParams.apiKey = this.rtFactoryParams.apiKey;
        }
        return new RealtimeTranscriber(serviceParams);
    }
    async createTemporaryToken(params) {
        const data = await this.fetchJson("/v2/realtime/token", {
            method: "POST",
            body: JSON.stringify(params),
        });
        return data.token;
    }
}
/**
 * @deprecated Use RealtimeTranscriberFactory instead
 */
class RealtimeServiceFactory extends RealtimeTranscriberFactory {
}

function getPath(path) {
    if (path.startsWith("http"))
        return null;
    if (path.startsWith("https"))
        return null;
    if (path.startsWith("data:"))
        return null;
    if (path.startsWith("file://"))
        return path.substring(7);
    if (path.startsWith("file:"))
        return path.substring(5);
    return path;
}

class TranscriptService extends BaseService {
    constructor(params, files) {
        super(params);
        this.files = files;
    }
    /**
     * Transcribe an audio file. This will create a transcript and wait until the transcript status is "completed" or "error".
     * @param params - The parameters to transcribe an audio file.
     * @param options - The options to transcribe an audio file.
     * @returns A promise that resolves to the transcript. The transcript status is "completed" or "error".
     */
    async transcribe(params, options) {
        const transcript = await this.submit(params);
        return await this.waitUntilReady(transcript.id, options);
    }
    /**
     * Submits a transcription job for an audio file. This will not wait until the transcript status is "completed" or "error".
     * @param params - The parameters to start the transcription of an audio file.
     * @returns A promise that resolves to the queued transcript.
     */
    async submit(params) {
        let audioUrl;
        let transcriptParams = undefined;
        if ("audio" in params) {
            const { audio, ...audioTranscriptParams } = params;
            if (typeof audio === "string") {
                const path = getPath(audio);
                if (path !== null) {
                    // audio is local path, upload local file
                    audioUrl = await this.files.upload(path);
                }
                else {
                    if (audio.startsWith("data:")) {
                        audioUrl = await this.files.upload(audio);
                    }
                    else {
                        // audio is not a local path, and not a data-URI, assume it's a normal URL
                        audioUrl = audio;
                    }
                }
            }
            else {
                // audio is of uploadable type
                audioUrl = await this.files.upload(audio);
            }
            transcriptParams = { ...audioTranscriptParams, audio_url: audioUrl };
        }
        else {
            transcriptParams = params;
        }
        const data = await this.fetchJson("/v2/transcript", {
            method: "POST",
            body: JSON.stringify(transcriptParams),
        });
        return data;
    }
    /**
     * Create a transcript.
     * @param params - The parameters to create a transcript.
     * @param options - The options used for creating the new transcript.
     * @returns A promise that resolves to the transcript.
     * @deprecated Use `transcribe` instead to transcribe a audio file that includes polling, or `submit` to transcribe a audio file without polling.
     */
    async create(params, options) {
        const path = getPath(params.audio_url);
        if (path !== null) {
            const uploadUrl = await this.files.upload(path);
            params.audio_url = uploadUrl;
        }
        const data = await this.fetchJson("/v2/transcript", {
            method: "POST",
            body: JSON.stringify(params),
        });
        if (options?.poll ?? true) {
            return await this.waitUntilReady(data.id, options);
        }
        return data;
    }
    /**
     * Wait until the transcript ready, either the status is "completed" or "error".
     * @param transcriptId - The ID of the transcript.
     * @param options - The options to wait until the transcript is ready.
     * @returns A promise that resolves to the transcript. The transcript status is "completed" or "error".
     */
    async waitUntilReady(transcriptId, options) {
        const pollingInterval = options?.pollingInterval ?? 3_000;
        const pollingTimeout = options?.pollingTimeout ?? -1;
        const startTime = Date.now();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const transcript = await this.get(transcriptId);
            if (transcript.status === "completed" || transcript.status === "error") {
                return transcript;
            }
            else if (pollingTimeout > 0 &&
                Date.now() - startTime > pollingTimeout) {
                throw new Error("Polling timeout");
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, pollingInterval));
            }
        }
    }
    /**
     * Retrieve a transcript.
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the transcript.
     */
    get(id) {
        return this.fetchJson(`/v2/transcript/${id}`);
    }
    /**
     * Retrieves a page of transcript listings.
     * @param params - The parameters to filter the transcript list by, or the URL to retrieve the transcript list from.
     */
    async list(params) {
        let url = "/v2/transcript";
        if (typeof params === "string") {
            url = params;
        }
        else if (params) {
            url = `${url}?${new URLSearchParams(Object.keys(params).map((key) => [
                key,
                params[key]?.toString() || "",
            ]))}`;
        }
        const data = await this.fetchJson(url);
        for (const transcriptListItem of data.transcripts) {
            transcriptListItem.created = new Date(transcriptListItem.created);
            if (transcriptListItem.completed) {
                transcriptListItem.completed = new Date(transcriptListItem.completed);
            }
        }
        return data;
    }
    /**
     * Delete a transcript
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the transcript.
     */
    delete(id) {
        return this.fetchJson(`/v2/transcript/${id}`, { method: "DELETE" });
    }
    /**
     * Search through the transcript for a specific set of keywords.
     * You can search for individual words, numbers, or phrases containing up to five words or numbers.
     * @param id - The identifier of the transcript.
     * @param words - Keywords to search for.
     * @returns A promise that resolves to the sentences.
     */
    wordSearch(id, words) {
        const params = new URLSearchParams({ words: words.join(",") });
        return this.fetchJson(`/v2/transcript/${id}/word-search?${params.toString()}`);
    }
    /**
     * Retrieve all sentences of a transcript.
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the sentences.
     */
    sentences(id) {
        return this.fetchJson(`/v2/transcript/${id}/sentences`);
    }
    /**
     * Retrieve all paragraphs of a transcript.
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the paragraphs.
     */
    paragraphs(id) {
        return this.fetchJson(`/v2/transcript/${id}/paragraphs`);
    }
    /**
     * Retrieve subtitles of a transcript.
     * @param id - The identifier of the transcript.
     * @param format - The format of the subtitles.
     * @param chars_per_caption - The maximum number of characters per caption.
     * @returns A promise that resolves to the subtitles text.
     */
    async subtitles(id, format = "srt", chars_per_caption) {
        let url = `/v2/transcript/${id}/${format}`;
        if (chars_per_caption) {
            const params = new URLSearchParams();
            params.set("chars_per_caption", chars_per_caption.toString());
            url += `?${params.toString()}`;
        }
        const response = await this.fetch(url);
        return await response.text();
    }
    /**
     * Retrieve the redacted audio URL of a transcript.
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the details of the redacted audio.
     * @deprecated Use `redactedAudio` instead.
     */
    redactions(id) {
        return this.redactedAudio(id);
    }
    /**
     * Retrieve the redacted audio URL of a transcript.
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the details of the redacted audio.
     */
    redactedAudio(id) {
        return this.fetchJson(`/v2/transcript/${id}/redacted-audio`);
    }
    /**
     * Retrieve the redacted audio file of a transcript.
     * @param id - The identifier of the transcript.
     * @returns A promise that resolves to the fetch HTTP response of the redacted audio file.
     */
    async redactedAudioFile(id) {
        const { redacted_audio_url, status } = await this.redactedAudio(id);
        if (status !== "redacted_audio_ready") {
            throw new Error(`Redacted audio status is ${status}`);
        }
        const response = await fetch(redacted_audio_url);
        if (!response.ok) {
            throw new Error(`Failed to fetch redacted audio: ${response.statusText}`);
        }
        return {
            arrayBuffer: response.arrayBuffer.bind(response),
            blob: response.blob.bind(response),
            body: response.body,
            bodyUsed: response.bodyUsed,
        };
    }
}

const readFile = async function (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
path) {
    throw new Error("Interacting with the file system is not supported in this environment.");
};

class FileService extends BaseService {
    /**
     * Upload a local file to AssemblyAI.
     * @param input - The local file path to upload, or a stream or buffer of the file to upload.
     * @returns A promise that resolves to the uploaded file URL.
     */
    async upload(input) {
        let fileData;
        if (typeof input === "string") {
            if (input.startsWith("data:")) {
                fileData = dataUrlToBlob(input);
            }
            else {
                fileData = await readFile();
            }
        }
        else
            fileData = input;
        const data = await this.fetchJson("/v2/upload", {
            method: "POST",
            body: fileData,
            headers: {
                "Content-Type": "application/octet-stream",
            },
            duplex: "half",
        });
        return data.upload_url;
    }
}
function dataUrlToBlob(dataUrl) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

const defaultBaseUrl = "https://api.assemblyai.com";
class AssemblyAI {
    /**
     * Create a new AssemblyAI client.
     * @param params - The parameters for the service, including the API key and base URL, if any.
     */
    constructor(params) {
        params.baseUrl = params.baseUrl || defaultBaseUrl;
        if (params.baseUrl && params.baseUrl.endsWith("/")) {
            params.baseUrl = params.baseUrl.slice(0, -1);
        }
        this.files = new FileService(params);
        this.transcripts = new TranscriptService(params, this.files);
        this.lemur = new LemurService(params);
        this.realtime = new RealtimeTranscriberFactory(params);
    }
}

export { AssemblyAI, FileService, LemurService, RealtimeService, RealtimeServiceFactory, RealtimeTranscriber, RealtimeTranscriberFactory, TranscriptService };