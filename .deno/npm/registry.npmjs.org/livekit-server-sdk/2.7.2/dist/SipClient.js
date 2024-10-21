// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { CreateSIPDispatchRuleRequest, CreateSIPInboundTrunkRequest, CreateSIPOutboundTrunkRequest, CreateSIPParticipantRequest, CreateSIPTrunkRequest, DeleteSIPDispatchRuleRequest, DeleteSIPTrunkRequest, ListSIPDispatchRuleRequest, ListSIPDispatchRuleResponse, ListSIPInboundTrunkRequest, ListSIPInboundTrunkResponse, ListSIPOutboundTrunkRequest, ListSIPOutboundTrunkResponse, ListSIPTrunkRequest, ListSIPTrunkResponse, SIPDispatchRule, SIPDispatchRuleDirect, SIPDispatchRuleIndividual, SIPDispatchRuleInfo, SIPInboundTrunkInfo, SIPOutboundTrunkInfo, SIPParticipantInfo, SIPTransport, SIPTrunkInfo, TransferSIPParticipantRequest, } from '@livekit/protocol';
import ServiceBase from './ServiceBase.js';
import { TwirpRpc, livekitPackage } from './TwirpRPC.js';
const svc = 'SIP';
/**
 * Client to access Egress APIs
 */
export class SipClient extends ServiceBase {
    /**
     * @param host - hostname including protocol. i.e. 'https://cluster.livekit.io'
     * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
     * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
     */
    constructor(host, apiKey, secret) {
        super(apiKey, secret);
        this.rpc = new TwirpRpc(host, livekitPackage);
    }
    /**
     * @param number - phone number of the trunk
     * @param opts - CreateSipTrunkOptions
     * @deprecated use `createSipInboundTrunk` or `createSipOutboundTrunk`
     */
    async createSipTrunk(number, opts) {
        let inboundAddresses;
        let inboundNumbers;
        let inboundUsername = '';
        let inboundPassword = '';
        let outboundAddress = '';
        let outboundUsername = '';
        let outboundPassword = '';
        let name = '';
        let metadata = '';
        if (opts !== undefined) {
            inboundAddresses = opts.inbound_addresses;
            inboundNumbers = opts.inbound_numbers;
            inboundUsername = opts.inbound_username || '';
            inboundPassword = opts.inbound_password || '';
            outboundAddress = opts.outbound_address || '';
            outboundUsername = opts.outbound_username || '';
            outboundPassword = opts.outbound_password || '';
            name = opts.name || '';
            metadata = opts.metadata || '';
        }
        const req = new CreateSIPTrunkRequest({
            name: name,
            metadata: metadata,
            inboundAddresses: inboundAddresses,
            inboundNumbers: inboundNumbers,
            inboundUsername: inboundUsername,
            inboundPassword: inboundPassword,
            outboundNumber: number,
            outboundAddress: outboundAddress,
            outboundUsername: outboundUsername,
            outboundPassword: outboundPassword,
        }).toJson();
        const data = await this.rpc.request(svc, 'CreateSIPTrunk', req, await this.authHeader({}, { admin: true }));
        return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param name - human-readable name of the trunk
     * @param numbers - phone numbers of the trunk
     * @param opts - CreateSipTrunkOptions
     */
    async createSipInboundTrunk(name, numbers, opts) {
        let allowedAddresses;
        let allowedNumbers;
        let authUsername = '';
        let authPassword = '';
        let metadata = '';
        if (opts !== undefined) {
            allowedAddresses = opts.allowed_addresses;
            allowedNumbers = opts.allowed_numbers;
            authUsername = opts.auth_username || '';
            authPassword = opts.auth_password || '';
            metadata = opts.metadata || '';
        }
        const req = new CreateSIPInboundTrunkRequest({
            trunk: new SIPInboundTrunkInfo({
                name: name,
                numbers: numbers,
                metadata: metadata,
                allowedAddresses: allowedAddresses,
                allowedNumbers: allowedNumbers,
                authUsername: authUsername,
                authPassword: authPassword,
            }),
        }).toJson();
        const data = await this.rpc.request(svc, 'CreateSIPInboundTrunk', req, await this.authHeader({}, { admin: true }));
        return SIPInboundTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param name - human-readable name of the trunk
     * @param address - hostname and port of the SIP server to dial
     * @param numbers - phone numbers of the trunk
     * @param opts - CreateSipTrunkOptions
     */
    async createSipOutboundTrunk(name, address, numbers, opts) {
        let authUsername = '';
        let authPassword = '';
        let transport = SIPTransport.SIP_TRANSPORT_AUTO;
        let metadata = '';
        if (opts !== undefined) {
            authUsername = opts.auth_username || '';
            authPassword = opts.auth_password || '';
            transport = opts.transport || SIPTransport.SIP_TRANSPORT_AUTO;
            metadata = opts.metadata || '';
        }
        const req = new CreateSIPOutboundTrunkRequest({
            trunk: new SIPOutboundTrunkInfo({
                name: name,
                address: address,
                numbers: numbers,
                metadata: metadata,
                transport: transport,
                authUsername: authUsername,
                authPassword: authPassword,
            }),
        }).toJson();
        const data = await this.rpc.request(svc, 'CreateSIPOutboundTrunk', req, await this.authHeader({}, { admin: true }));
        return SIPOutboundTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @deprecated use `listSipInboundTrunk` or `listSipOutboundTrunk`
     */
    async listSipTrunk() {
        var _a;
        const req = {};
        const data = await this.rpc.request(svc, 'ListSIPTrunk', new ListSIPTrunkRequest(req).toJson(), await this.authHeader({}, { admin: true }));
        return (_a = ListSIPTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items) !== null && _a !== void 0 ? _a : [];
    }
    async listSipInboundTrunk() {
        var _a;
        const req = {};
        const data = await this.rpc.request(svc, 'ListSIPInboundTrunk', new ListSIPInboundTrunkRequest(req).toJson(), await this.authHeader({}, { admin: true }));
        return (_a = ListSIPInboundTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items) !== null && _a !== void 0 ? _a : [];
    }
    async listSipOutboundTrunk() {
        var _a;
        const req = {};
        const data = await this.rpc.request(svc, 'ListSIPOutboundTrunk', new ListSIPOutboundTrunkRequest(req).toJson(), await this.authHeader({}, { admin: true }));
        return (_a = ListSIPOutboundTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * @param sipTrunkId - sip trunk to delete
     */
    async deleteSipTrunk(sipTrunkId) {
        const data = await this.rpc.request(svc, 'DeleteSIPTrunk', new DeleteSIPTrunkRequest({ sipTrunkId }).toJson(), await this.authHeader({}, { admin: true }));
        return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param rule - sip dispatch rule
     * @param opts - CreateSipDispatchRuleOptions
     */
    async createSipDispatchRule(rule, opts) {
        let trunkIds;
        let hidePhoneNumber = false;
        let name = '';
        let metadata = '';
        let ruleProto = undefined;
        if (opts !== undefined) {
            trunkIds = opts.trunkIds;
            hidePhoneNumber = opts.hidePhoneNumber || false;
            name = opts.name || '';
            metadata = opts.metadata || '';
        }
        if (rule.type == 'direct') {
            ruleProto = new SIPDispatchRule({
                rule: {
                    case: 'dispatchRuleDirect',
                    value: new SIPDispatchRuleDirect({
                        roomName: rule.roomName,
                        pin: rule.pin || '',
                    }),
                },
            });
        }
        else if (rule.type == 'individual') {
            ruleProto = new SIPDispatchRule({
                rule: {
                    case: 'dispatchRuleIndividual',
                    value: new SIPDispatchRuleIndividual({
                        roomPrefix: rule.roomPrefix,
                        pin: rule.pin || '',
                    }),
                },
            });
        }
        const req = new CreateSIPDispatchRuleRequest({
            rule: ruleProto,
            trunkIds: trunkIds,
            hidePhoneNumber: hidePhoneNumber,
            name: name,
            metadata: metadata,
        }).toJson();
        const data = await this.rpc.request(svc, 'CreateSIPDispatchRule', req, await this.authHeader({}, { admin: true }));
        return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    async listSipDispatchRule() {
        var _a;
        const req = {};
        const data = await this.rpc.request(svc, 'ListSIPDispatchRule', new ListSIPDispatchRuleRequest(req).toJson(), await this.authHeader({}, { admin: true }));
        return (_a = ListSIPDispatchRuleResponse.fromJson(data, { ignoreUnknownFields: true }).items) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * @param sipDispatchRuleId - sip trunk to delete
     */
    async deleteSipDispatchRule(sipDispatchRuleId) {
        const data = await this.rpc.request(svc, 'DeleteSIPDispatchRule', new DeleteSIPDispatchRuleRequest({ sipDispatchRuleId }).toJson(), await this.authHeader({}, { admin: true }));
        return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param sipTrunkId - sip trunk to use for the call
     * @param number - number to dial
     * @param roomName - room to attach the call to
     * @param opts - CreateSipParticipantOptions
     */
    async createSipParticipant(sipTrunkId, number, roomName, opts) {
        let participantIdentity = '';
        let participantName = '';
        let participantMetadata = '';
        let dtmf = '';
        let playRingtone = false;
        let hidePhoneNumber = false;
        if (opts !== undefined) {
            participantIdentity = opts.participantIdentity || '';
            participantName = opts.participantName || '';
            participantMetadata = opts.participantMetadata || '';
            dtmf = opts.dtmf || '';
            playRingtone = opts.playRingtone || false;
            hidePhoneNumber = opts.hidePhoneNumber || false;
        }
        const req = new CreateSIPParticipantRequest({
            sipTrunkId: sipTrunkId,
            sipCallTo: number,
            roomName: roomName,
            participantIdentity: participantIdentity,
            participantName: participantName,
            participantMetadata: participantMetadata,
            dtmf: dtmf,
            playRingtone: playRingtone,
            hidePhoneNumber: hidePhoneNumber,
        }).toJson();
        const data = await this.rpc.request(svc, 'CreateSIPParticipant', req, await this.authHeader({}, { call: true }));
        return SIPParticipantInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param roomName - room the SIP participant to transfer is connectd to
     * @param participantIdentity - identity of the SIP participant to transfer
     * @param transferTo - SIP URL to transfer the participant to
     */
    async transferSipParticipant(roomName, participantIdentity, transferTo) {
        const req = new TransferSIPParticipantRequest({
            participantIdentity: participantIdentity,
            roomName: roomName,
            transferTo: transferTo,
        }).toJson();
        await this.rpc.request(svc, 'TransferSIPParticipant', req, await this.authHeader({ roomAdmin: true, room: roomName }, { call: true }));
    }
}
//# sourceMappingURL=SipClient.js.map