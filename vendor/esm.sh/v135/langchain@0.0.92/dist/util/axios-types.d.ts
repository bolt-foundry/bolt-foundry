import type { AxiosRequestConfig } from "https://esm.sh/v135/axios@1.6.2/index.d.ts";
import type { EventSourceMessage } from "./event-source-parse.d.ts";
export interface StreamingAxiosRequestConfig extends AxiosRequestConfig {
    responseType: "stream";
    /**
     * Called when a message is received. NOTE: Unlike the default browser
     * EventSource.onmessage, this callback is called for _all_ events,
     * even ones with a custom `event` field.
     */
    onmessage?: (ev: EventSourceMessage) => void;
}
export type StreamingAxiosConfiguration = StreamingAxiosRequestConfig | AxiosRequestConfig;
