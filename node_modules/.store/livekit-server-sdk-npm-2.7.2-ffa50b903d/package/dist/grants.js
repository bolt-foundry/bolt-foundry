// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { TrackSource } from '@livekit/protocol';
export function trackSourceToString(source) {
    switch (source) {
        case TrackSource.CAMERA:
            return 'camera';
        case TrackSource.MICROPHONE:
            return 'microphone';
        case TrackSource.SCREEN_SHARE:
            return 'screen_share';
        case TrackSource.SCREEN_SHARE_AUDIO:
            return 'screen_share_audio';
        default:
            throw new TypeError(`Cannot convert TrackSource ${source} to string`);
    }
}
export function claimsToJwtPayload(grant) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claim = Object.assign({}, grant);
    // eslint-disable-next-line no-restricted-syntax
    if (Array.isArray((_a = claim.video) === null || _a === void 0 ? void 0 : _a.canPublishSources)) {
        claim.video.canPublishSources = claim.video.canPublishSources.map(trackSourceToString);
    }
    return claim;
}
//# sourceMappingURL=grants.js.map