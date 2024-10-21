import { EgressInfo, ListEgressRequest, ListEgressResponse, ParticipantEgressRequest, RoomCompositeEgressRequest, StopEgressRequest, TrackCompositeEgressRequest, TrackEgressRequest, UpdateLayoutRequest, UpdateStreamRequest, WebEgressRequest, } from '@livekit/protocol';
import ServiceBase from './ServiceBase.js';
import { TwirpRpc, livekitPackage } from './TwirpRPC.js';
const svc = 'Egress';
/**
 * Client to access Egress APIs
 */
export class EgressClient extends ServiceBase {
    /**
     * @param host - hostname including protocol. i.e. 'https://cluster.livekit.io'
     * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
     * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
     */
    constructor(host, apiKey, secret) {
        super(apiKey, secret);
        this.rpc = new TwirpRpc(host, livekitPackage);
    }
    async startRoomCompositeEgress(roomName, output, optsOrLayout, options, audioOnly, videoOnly, customBaseUrl) {
        let layout;
        if (optsOrLayout !== undefined) {
            if (typeof optsOrLayout === 'string') {
                layout = optsOrLayout;
            }
            else {
                const opts = optsOrLayout;
                layout = opts.layout;
                options = opts.encodingOptions;
                audioOnly = opts.audioOnly;
                videoOnly = opts.videoOnly;
                customBaseUrl = opts.customBaseUrl;
            }
        }
        layout !== null && layout !== void 0 ? layout : (layout = '');
        audioOnly !== null && audioOnly !== void 0 ? audioOnly : (audioOnly = false);
        videoOnly !== null && videoOnly !== void 0 ? videoOnly : (videoOnly = false);
        customBaseUrl !== null && customBaseUrl !== void 0 ? customBaseUrl : (customBaseUrl = '');
        const { output: legacyOutput, options: egressOptions, fileOutputs, streamOutputs, segmentOutputs, imageOutputs, } = this.getOutputParams(output, options);
        const req = new RoomCompositeEgressRequest({
            roomName,
            layout,
            audioOnly,
            videoOnly,
            customBaseUrl,
            output: legacyOutput,
            options: egressOptions,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs,
        }).toJson();
        const data = await this.rpc.request(svc, 'StartRoomCompositeEgress', req, await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param url - url
     * @param output - file or stream output
     * @param opts - WebOptions
     */
    async startWebEgress(url, output, opts) {
        const audioOnly = (opts === null || opts === void 0 ? void 0 : opts.audioOnly) || false;
        const videoOnly = (opts === null || opts === void 0 ? void 0 : opts.videoOnly) || false;
        const awaitStartSignal = (opts === null || opts === void 0 ? void 0 : opts.awaitStartSignal) || false;
        const { output: legacyOutput, options, fileOutputs, streamOutputs, segmentOutputs, imageOutputs, } = this.getOutputParams(output, opts === null || opts === void 0 ? void 0 : opts.encodingOptions);
        const req = new WebEgressRequest({
            url,
            audioOnly,
            videoOnly,
            awaitStartSignal,
            output: legacyOutput,
            options,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs,
        }).toJson();
        const data = await this.rpc.request(svc, 'StartWebEgress', req, await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * Export a participant's audio and video tracks,
     *
     * @param roomName - room name
     * @param output - one or more outputs
     * @param opts - ParticipantEgressOptions
     */
    async startParticipantEgress(roomName, identity, output, opts) {
        const { options, fileOutputs, streamOutputs, segmentOutputs, imageOutputs } = this.getOutputParams(output, opts === null || opts === void 0 ? void 0 : opts.encodingOptions);
        const req = new ParticipantEgressRequest({
            roomName,
            identity,
            options,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs,
        }).toJson();
        const data = await this.rpc.request(svc, 'StartParticipantEgress', req, await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    async startTrackCompositeEgress(roomName, output, optsOrAudioTrackId, videoTrackId, options) {
        let audioTrackId;
        if (optsOrAudioTrackId !== undefined) {
            if (typeof optsOrAudioTrackId === 'string') {
                audioTrackId = optsOrAudioTrackId;
            }
            else {
                const opts = optsOrAudioTrackId;
                audioTrackId = opts.audioTrackId;
                videoTrackId = opts.videoTrackId;
                options = opts.encodingOptions;
            }
        }
        audioTrackId !== null && audioTrackId !== void 0 ? audioTrackId : (audioTrackId = '');
        videoTrackId !== null && videoTrackId !== void 0 ? videoTrackId : (videoTrackId = '');
        const { output: legacyOutput, options: egressOptions, fileOutputs, streamOutputs, segmentOutputs, imageOutputs, } = this.getOutputParams(output, options);
        const req = new TrackCompositeEgressRequest({
            roomName,
            audioTrackId,
            videoTrackId,
            output: legacyOutput,
            options: egressOptions,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs,
        }).toJson();
        const data = await this.rpc.request(svc, 'StartTrackCompositeEgress', req, await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEncodedOutputs(output) {
        return (output.file !== undefined ||
            output.stream !== undefined ||
            output.segments !== undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEncodedFileOutput(output) {
        return (output.filepath !== undefined ||
            output.fileType !== undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isSegmentedFileOutput(output) {
        return (output.filenamePrefix !== undefined ||
            output.playlistName !== undefined ||
            output.filenameSuffix !== undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isStreamOutput(output) {
        return (output.protocol !== undefined || output.urls !== undefined);
    }
    getOutputParams(output, opts) {
        let file;
        let fileOutputs;
        let stream;
        let streamOutputs;
        let segments;
        let segmentOutputs;
        let imageOutputs;
        if (this.isEncodedOutputs(output)) {
            if (output.file !== undefined) {
                fileOutputs = [output.file];
            }
            if (output.stream !== undefined) {
                streamOutputs = [output.stream];
            }
            if (output.segments !== undefined) {
                segmentOutputs = [output.segments];
            }
            if (output.images !== undefined) {
                imageOutputs = [output.images];
            }
        }
        else if (this.isEncodedFileOutput(output)) {
            file = output;
            fileOutputs = [file];
        }
        else if (this.isSegmentedFileOutput(output)) {
            segments = output;
            segmentOutputs = [segments];
        }
        else if (this.isStreamOutput(output)) {
            stream = output;
            streamOutputs = [stream];
        }
        let legacyOutput;
        if (file) {
            legacyOutput = {
                case: 'file',
                value: file,
            };
        }
        else if (stream) {
            legacyOutput = {
                case: 'stream',
                value: stream,
            };
        }
        else if (segments) {
            legacyOutput = {
                case: 'segments',
                value: segments,
            };
        }
        let egressOptions;
        if (opts) {
            if (typeof opts === 'number') {
                egressOptions = {
                    case: 'preset',
                    value: opts,
                };
            }
            else {
                egressOptions = {
                    case: 'advanced',
                    value: opts,
                };
            }
        }
        return {
            output: legacyOutput,
            options: egressOptions,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs,
        };
    }
    /**
     * @param roomName - room name
     * @param output - file or websocket output
     * @param trackId - track Id
     */
    async startTrackEgress(roomName, output, trackId) {
        let legacyOutput;
        if (typeof output === 'string') {
            legacyOutput = {
                case: 'websocketUrl',
                value: output,
            };
        }
        else {
            legacyOutput = {
                case: 'file',
                value: output,
            };
        }
        const req = new TrackEgressRequest({
            roomName,
            trackId,
            output: legacyOutput,
        }).toJson();
        const data = await this.rpc.request(svc, 'StartTrackEgress', req, await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param egressId -
     * @param layout -
     */
    async updateLayout(egressId, layout) {
        const data = await this.rpc.request(svc, 'UpdateLayout', new UpdateLayoutRequest({ egressId, layout }).toJson(), await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param egressId -
     * @param addOutputUrls -
     * @param removeOutputUrls -
     */
    async updateStream(egressId, addOutputUrls, removeOutputUrls) {
        addOutputUrls !== null && addOutputUrls !== void 0 ? addOutputUrls : (addOutputUrls = []);
        removeOutputUrls !== null && removeOutputUrls !== void 0 ? removeOutputUrls : (removeOutputUrls = []);
        const data = await this.rpc.request(svc, 'UpdateStream', new UpdateStreamRequest({ egressId, addOutputUrls, removeOutputUrls }).toJson(), await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
    /**
     * @param roomName - list egress for one room only
     */
    async listEgress(options) {
        var _a;
        let req = {};
        if (typeof options === 'string') {
            req.roomName = options;
        }
        else if (options !== undefined) {
            req = options;
        }
        const data = await this.rpc.request(svc, 'ListEgress', new ListEgressRequest(req).toJson(), await this.authHeader({ roomRecord: true }));
        return (_a = ListEgressResponse.fromJson(data, { ignoreUnknownFields: true }).items) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * @param egressId -
     */
    async stopEgress(egressId) {
        const data = await this.rpc.request(svc, 'StopEgress', new StopEgressRequest({ egressId }).toJson(), await this.authHeader({ roomRecord: true }));
        return EgressInfo.fromJson(data, { ignoreUnknownFields: true });
    }
}
//# sourceMappingURL=EgressClient.js.map