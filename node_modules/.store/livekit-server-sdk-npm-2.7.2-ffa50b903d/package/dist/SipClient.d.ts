import { SIPDispatchRuleInfo, SIPInboundTrunkInfo, SIPOutboundTrunkInfo, SIPParticipantInfo, SIPTransport, SIPTrunkInfo } from '@livekit/protocol';
import ServiceBase from './ServiceBase.js';
/**
 * @deprecated use CreateSipInboundTrunkOptions or CreateSipOutboundTrunkOptions
 */
export interface CreateSipTrunkOptions {
    name?: string;
    metadata?: string;
    inbound_addresses?: string[];
    inbound_numbers?: string[];
    inbound_username?: string;
    inbound_password?: string;
    outbound_address?: string;
    outbound_username?: string;
    outbound_password?: string;
}
export interface CreateSipInboundTrunkOptions {
    metadata?: string;
    allowed_addresses?: string[];
    allowed_numbers?: string[];
    auth_username?: string;
    auth_password?: string;
}
export interface CreateSipOutboundTrunkOptions {
    metadata?: string;
    transport: SIPTransport;
    auth_username?: string;
    auth_password?: string;
}
export interface SipDispatchRuleDirect {
    type: 'direct';
    roomName: string;
    pin?: string;
}
export interface SipDispatchRuleIndividual {
    type: 'individual';
    roomPrefix: string;
    pin?: string;
}
export interface CreateSipDispatchRuleOptions {
    name?: string;
    metadata?: string;
    trunkIds?: string[];
    hidePhoneNumber?: boolean;
}
export interface CreateSipParticipantOptions {
    participantIdentity?: string;
    participantName?: string;
    participantMetadata?: string;
    dtmf?: string;
    playRingtone?: boolean;
    hidePhoneNumber?: boolean;
}
/**
 * Client to access Egress APIs
 */
export declare class SipClient extends ServiceBase {
    private readonly rpc;
    /**
     * @param host - hostname including protocol. i.e. 'https://cluster.livekit.io'
     * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
     * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
     */
    constructor(host: string, apiKey?: string, secret?: string);
    /**
     * @param number - phone number of the trunk
     * @param opts - CreateSipTrunkOptions
     * @deprecated use `createSipInboundTrunk` or `createSipOutboundTrunk`
     */
    createSipTrunk(number: string, opts?: CreateSipTrunkOptions): Promise<SIPTrunkInfo>;
    /**
     * @param name - human-readable name of the trunk
     * @param numbers - phone numbers of the trunk
     * @param opts - CreateSipTrunkOptions
     */
    createSipInboundTrunk(name: string, numbers: string[], opts?: CreateSipInboundTrunkOptions): Promise<SIPInboundTrunkInfo>;
    /**
     * @param name - human-readable name of the trunk
     * @param address - hostname and port of the SIP server to dial
     * @param numbers - phone numbers of the trunk
     * @param opts - CreateSipTrunkOptions
     */
    createSipOutboundTrunk(name: string, address: string, numbers: string[], opts?: CreateSipOutboundTrunkOptions): Promise<SIPOutboundTrunkInfo>;
    /**
     * @deprecated use `listSipInboundTrunk` or `listSipOutboundTrunk`
     */
    listSipTrunk(): Promise<Array<SIPTrunkInfo>>;
    listSipInboundTrunk(): Promise<Array<SIPInboundTrunkInfo>>;
    listSipOutboundTrunk(): Promise<Array<SIPOutboundTrunkInfo>>;
    /**
     * @param sipTrunkId - sip trunk to delete
     */
    deleteSipTrunk(sipTrunkId: string): Promise<SIPTrunkInfo>;
    /**
     * @param rule - sip dispatch rule
     * @param opts - CreateSipDispatchRuleOptions
     */
    createSipDispatchRule(rule: SipDispatchRuleDirect | SipDispatchRuleIndividual, opts?: CreateSipDispatchRuleOptions): Promise<SIPDispatchRuleInfo>;
    listSipDispatchRule(): Promise<Array<SIPDispatchRuleInfo>>;
    /**
     * @param sipDispatchRuleId - sip trunk to delete
     */
    deleteSipDispatchRule(sipDispatchRuleId: string): Promise<SIPDispatchRuleInfo>;
    /**
     * @param sipTrunkId - sip trunk to use for the call
     * @param number - number to dial
     * @param roomName - room to attach the call to
     * @param opts - CreateSipParticipantOptions
     */
    createSipParticipant(sipTrunkId: string, number: string, roomName: string, opts?: CreateSipParticipantOptions): Promise<SIPParticipantInfo>;
    /**
     * @param roomName - room the SIP participant to transfer is connectd to
     * @param participantIdentity - identity of the SIP participant to transfer
     * @param transferTo - SIP URL to transfer the participant to
     */
    transferSipParticipant(roomName: string, participantIdentity: string, transferTo: string): Promise<void>;
}
//# sourceMappingURL=SipClient.d.ts.map