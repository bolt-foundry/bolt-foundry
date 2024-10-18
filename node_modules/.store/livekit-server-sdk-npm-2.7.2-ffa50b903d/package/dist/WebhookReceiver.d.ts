import type { BinaryReadOptions, JsonReadOptions, JsonValue } from '@bufbuild/protobuf';
import { WebhookEvent as ProtoWebhookEvent } from '@livekit/protocol';
export declare const authorizeHeader = "Authorize";
export declare class WebhookEvent extends ProtoWebhookEvent {
    event: WebhookEventNames;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebhookEvent;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebhookEvent;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebhookEvent;
}
export type WebhookEventNames = 'room_started' | 'room_finished' | 'participant_joined' | 'participant_left' | 'track_published' | 'track_unpublished' | 'egress_started' | 'egress_updated' | 'egress_ended' | 'ingress_started' | 'ingress_ended'
/**
 * @internal
 * @remarks only used as a default value, not a valid webhook event
 */
 | '';
export declare class WebhookReceiver {
    private verifier;
    constructor(apiKey: string, apiSecret: string);
    /**
     * @param body - string of the posted body
     * @param authHeader - `Authorization` header from the request
     * @param skipAuth - true to skip auth validation
     * @returns
     */
    receive(body: string, authHeader?: string, skipAuth?: boolean): Promise<WebhookEvent>;
}
//# sourceMappingURL=WebhookReceiver.d.ts.map