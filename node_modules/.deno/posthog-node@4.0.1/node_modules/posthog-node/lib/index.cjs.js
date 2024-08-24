'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rusha = require('rusha');

var version = "4.0.1";

var PostHogPersistedProperty;
(function (PostHogPersistedProperty) {
    PostHogPersistedProperty["AnonymousId"] = "anonymous_id";
    PostHogPersistedProperty["DistinctId"] = "distinct_id";
    PostHogPersistedProperty["Props"] = "props";
    PostHogPersistedProperty["FeatureFlags"] = "feature_flags";
    PostHogPersistedProperty["FeatureFlagPayloads"] = "feature_flag_payloads";
    PostHogPersistedProperty["OverrideFeatureFlags"] = "override_feature_flags";
    PostHogPersistedProperty["Queue"] = "queue";
    PostHogPersistedProperty["OptedOut"] = "opted_out";
    PostHogPersistedProperty["SessionId"] = "session_id";
    PostHogPersistedProperty["SessionLastTimestamp"] = "session_timestamp";
    PostHogPersistedProperty["PersonProperties"] = "person_properties";
    PostHogPersistedProperty["GroupProperties"] = "group_properties";
    PostHogPersistedProperty["InstalledAppBuild"] = "installed_app_build";
    PostHogPersistedProperty["InstalledAppVersion"] = "installed_app_version";
})(PostHogPersistedProperty || (PostHogPersistedProperty = {}));

function assert(truthyValue, message) {
    if (!truthyValue) {
        throw new Error(message);
    }
}
function removeTrailingSlash(url) {
    return url?.replace(/\/+$/, '');
}
async function retriable(fn, props) {
    let lastError = null;
    for (let i = 0; i < props.retryCount + 1; i++) {
        if (i > 0) {
            // don't wait when it's the last try
            await new Promise((r) => setTimeout(r, props.retryDelay));
        }
        try {
            const res = await fn();
            return res;
        }
        catch (e) {
            lastError = e;
            if (!props.retryCheck(e)) {
                throw e;
            }
        }
    }
    throw lastError;
}
function currentTimestamp() {
    return new Date().getTime();
}
function currentISOTime() {
    return new Date().toISOString();
}
function safeSetTimeout(fn, timeout) {
    // NOTE: we use this so rarely that it is totally fine to do `safeSetTimeout(fn, 0)``
    // rather than setImmediate.
    const t = setTimeout(fn, timeout);
    // We unref if available to prevent Node.js hanging on exit
    t?.unref && t?.unref();
    return t;
}

// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
// private property
const f = String.fromCharCode;
const keyStrBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const baseReverseDic = {};
function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (let i = 0; i < alphabet.length; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
    }
    return baseReverseDic[alphabet][character];
}
const LZString = {
    compressToBase64: function (input) {
        if (input == null) {
            return '';
        }
        const res = LZString._compress(input, 6, function (a) {
            return keyStrBase64.charAt(a);
        });
        switch (res.length % 4 // To produce valid Base64
        ) {
            default: // When could this happen ?
            case 0:
                return res;
            case 1:
                return res + '===';
            case 2:
                return res + '==';
            case 3:
                return res + '=';
        }
    },
    decompressFromBase64: function (input) {
        if (input == null) {
            return '';
        }
        if (input == '') {
            return null;
        }
        return LZString._decompress(input.length, 32, function (index) {
            return getBaseValue(keyStrBase64, input.charAt(index));
        });
    },
    compress: function (uncompressed) {
        return LZString._compress(uncompressed, 16, function (a) {
            return f(a);
        });
    },
    _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) {
            return '';
        }
        const context_dictionary = {}, context_dictionaryToCreate = {}, context_data = [];
        let i, value, context_c = '', context_wc = '', context_w = '', context_enlargeIn = 2, // Compensate for the first entry which should not count
        context_dictSize = 3, context_numBits = 2, context_data_val = 0, context_data_position = 0, ii;
        for (ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
            }
            else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                // Add wc to the dictionary.
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
            }
        }
        // Output the code for w.
        if (context_w !== '') {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = context_data_val << 1;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            }
            else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
        }
        // Mark the end of the stream
        value = 2;
        for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
            }
            else {
                context_data_position++;
            }
            value = value >> 1;
        }
        // Flush the last char
        while (true) {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                break;
            }
            else {
                context_data_position++;
            }
        }
        return context_data.join('');
    },
    decompress: function (compressed) {
        if (compressed == null) {
            return '';
        }
        if (compressed == '') {
            return null;
        }
        return LZString._decompress(compressed.length, 32768, function (index) {
            return compressed.charCodeAt(index);
        });
    },
    _decompress: function (length, resetValue, getNextValue) {
        const dictionary = [], result = [], data = { val: getNextValue(0), position: resetValue, index: 1 };
        let enlargeIn = 4, dictSize = 4, numBits = 3, entry = '', i, w, bits, resb, maxpower, power, c;
        for (i = 0; i < 3; i += 1) {
            dictionary[i] = i;
        }
        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;
        while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        switch ((bits)) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = f(bits);
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = f(bits);
                break;
            case 2:
                return '';
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        while (true) {
            if (data.index > length) {
                return '';
            }
            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch ((c = bits)) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = f(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = f(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 2:
                    return result.join('');
            }
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
            if (dictionary[c]) {
                entry = dictionary[c];
            }
            else {
                if (c === dictSize) {
                    entry = w + w.charAt(0);
                }
                else {
                    return null;
                }
            }
            result.push(entry);
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
        }
    },
};

class SimpleEventEmitter {
    constructor() {
        this.events = {};
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => {
            this.events[event] = this.events[event].filter((x) => x !== listener);
        };
    }
    emit(event, payload) {
        for (const listener of this.events[event] || []) {
            listener(payload);
        }
        for (const listener of this.events['*'] || []) {
            listener(event, payload);
        }
    }
}

// vendor from: https://github.com/LiosK/uuidv7/blob/f30b7a7faff73afbce0b27a46c638310f96912ba/src/index.ts
// https://github.com/LiosK/uuidv7#license
/**
 * uuidv7: An experimental implementation of the proposed UUID Version 7
 *
 * @license Apache-2.0
 * @copyright 2021-2023 LiosK
 * @packageDocumentation
 */
const DIGITS = "0123456789abcdef";
/** Represents a UUID as a 16-byte byte array. */
class UUID {
    /** @param bytes - The 16-byte byte array representation. */
    constructor(bytes) {
        this.bytes = bytes;
    }
    /**
     * Creates an object from the internal representation, a 16-byte byte array
     * containing the binary UUID representation in the big-endian byte order.
     *
     * This method does NOT shallow-copy the argument, and thus the created object
     * holds the reference to the underlying buffer.
     *
     * @throws TypeError if the length of the argument is not 16.
     */
    static ofInner(bytes) {
        if (bytes.length !== 16) {
            throw new TypeError("not 128-bit length");
        }
        else {
            return new UUID(bytes);
        }
    }
    /**
     * Builds a byte array from UUIDv7 field values.
     *
     * @param unixTsMs - A 48-bit `unix_ts_ms` field value.
     * @param randA - A 12-bit `rand_a` field value.
     * @param randBHi - The higher 30 bits of 62-bit `rand_b` field value.
     * @param randBLo - The lower 32 bits of 62-bit `rand_b` field value.
     * @throws RangeError if any field value is out of the specified range.
     */
    static fromFieldsV7(unixTsMs, randA, randBHi, randBLo) {
        if (!Number.isInteger(unixTsMs) ||
            !Number.isInteger(randA) ||
            !Number.isInteger(randBHi) ||
            !Number.isInteger(randBLo) ||
            unixTsMs < 0 ||
            randA < 0 ||
            randBHi < 0 ||
            randBLo < 0 ||
            unixTsMs > 281474976710655 ||
            randA > 0xfff ||
            randBHi > 1073741823 ||
            randBLo > 4294967295) {
            throw new RangeError("invalid field value");
        }
        const bytes = new Uint8Array(16);
        bytes[0] = unixTsMs / 2 ** 40;
        bytes[1] = unixTsMs / 2 ** 32;
        bytes[2] = unixTsMs / 2 ** 24;
        bytes[3] = unixTsMs / 2 ** 16;
        bytes[4] = unixTsMs / 2 ** 8;
        bytes[5] = unixTsMs;
        bytes[6] = 0x70 | (randA >>> 8);
        bytes[7] = randA;
        bytes[8] = 0x80 | (randBHi >>> 24);
        bytes[9] = randBHi >>> 16;
        bytes[10] = randBHi >>> 8;
        bytes[11] = randBHi;
        bytes[12] = randBLo >>> 24;
        bytes[13] = randBLo >>> 16;
        bytes[14] = randBLo >>> 8;
        bytes[15] = randBLo;
        return new UUID(bytes);
    }
    /**
     * Builds a byte array from a string representation.
     *
     * This method accepts the following formats:
     *
     * - 32-digit hexadecimal format without hyphens: `0189dcd553117d408db09496a2eef37b`
     * - 8-4-4-4-12 hyphenated format: `0189dcd5-5311-7d40-8db0-9496a2eef37b`
     * - Hyphenated format with surrounding braces: `{0189dcd5-5311-7d40-8db0-9496a2eef37b}`
     * - RFC 4122 URN format: `urn:uuid:0189dcd5-5311-7d40-8db0-9496a2eef37b`
     *
     * Leading and trailing whitespaces represents an error.
     *
     * @throws SyntaxError if the argument could not parse as a valid UUID string.
     */
    static parse(uuid) {
        let hex = undefined;
        switch (uuid.length) {
            case 32:
                hex = /^[0-9a-f]{32}$/i.exec(uuid)?.[0];
                break;
            case 36:
                hex =
                    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
                        .exec(uuid)
                        ?.slice(1, 6)
                        .join("");
                break;
            case 38:
                hex =
                    /^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i
                        .exec(uuid)
                        ?.slice(1, 6)
                        .join("");
                break;
            case 45:
                hex =
                    /^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
                        .exec(uuid)
                        ?.slice(1, 6)
                        .join("");
                break;
        }
        if (hex) {
            const inner = new Uint8Array(16);
            for (let i = 0; i < 16; i += 4) {
                const n = parseInt(hex.substring(2 * i, 2 * i + 8), 16);
                inner[i + 0] = n >>> 24;
                inner[i + 1] = n >>> 16;
                inner[i + 2] = n >>> 8;
                inner[i + 3] = n;
            }
            return new UUID(inner);
        }
        else {
            throw new SyntaxError("could not parse UUID string");
        }
    }
    /**
     * @returns The 8-4-4-4-12 canonical hexadecimal string representation
     * (`0189dcd5-5311-7d40-8db0-9496a2eef37b`).
     */
    toString() {
        let text = "";
        for (let i = 0; i < this.bytes.length; i++) {
            text += DIGITS.charAt(this.bytes[i] >>> 4);
            text += DIGITS.charAt(this.bytes[i] & 0xf);
            if (i === 3 || i === 5 || i === 7 || i === 9) {
                text += "-";
            }
        }
        return text;
    }
    /**
     * @returns The 32-digit hexadecimal representation without hyphens
     * (`0189dcd553117d408db09496a2eef37b`).
     */
    toHex() {
        let text = "";
        for (let i = 0; i < this.bytes.length; i++) {
            text += DIGITS.charAt(this.bytes[i] >>> 4);
            text += DIGITS.charAt(this.bytes[i] & 0xf);
        }
        return text;
    }
    /** @returns The 8-4-4-4-12 canonical hexadecimal string representation. */
    toJSON() {
        return this.toString();
    }
    /**
     * Reports the variant field value of the UUID or, if appropriate, "NIL" or
     * "MAX".
     *
     * For convenience, this method reports "NIL" or "MAX" if `this` represents
     * the Nil or Max UUID, although the Nil and Max UUIDs are technically
     * subsumed under the variants `0b0` and `0b111`, respectively.
     */
    getVariant() {
        const n = this.bytes[8] >>> 4;
        if (n < 0) {
            throw new Error("unreachable");
        }
        else if (n <= 0b0111) {
            return this.bytes.every((e) => e === 0) ? "NIL" : "VAR_0";
        }
        else if (n <= 0b1011) {
            return "VAR_10";
        }
        else if (n <= 0b1101) {
            return "VAR_110";
        }
        else if (n <= 0b1111) {
            return this.bytes.every((e) => e === 0xff) ? "MAX" : "VAR_RESERVED";
        }
        else {
            throw new Error("unreachable");
        }
    }
    /**
     * Returns the version field value of the UUID or `undefined` if the UUID does
     * not have the variant field value of `0b10`.
     */
    getVersion() {
        return this.getVariant() === "VAR_10" ? this.bytes[6] >>> 4 : undefined;
    }
    /** Creates an object from `this`. */
    clone() {
        return new UUID(this.bytes.slice(0));
    }
    /** Returns true if `this` is equivalent to `other`. */
    equals(other) {
        return this.compareTo(other) === 0;
    }
    /**
     * Returns a negative integer, zero, or positive integer if `this` is less
     * than, equal to, or greater than `other`, respectively.
     */
    compareTo(other) {
        for (let i = 0; i < 16; i++) {
            const diff = this.bytes[i] - other.bytes[i];
            if (diff !== 0) {
                return Math.sign(diff);
            }
        }
        return 0;
    }
}
/**
 * Encapsulates the monotonic counter state.
 *
 * This class provides APIs to utilize a separate counter state from that of the
 * global generator used by {@link uuidv7} and {@link uuidv7obj}. In addition to
 * the default {@link generate} method, this class has {@link generateOrAbort}
 * that is useful to absolutely guarantee the monotonically increasing order of
 * generated UUIDs. See their respective documentation for details.
 */
class V7Generator {
    /**
     * Creates a generator object with the default random number generator, or
     * with the specified one if passed as an argument. The specified random
     * number generator should be cryptographically strong and securely seeded.
     */
    constructor(randomNumberGenerator) {
        this.timestamp = 0;
        this.counter = 0;
        this.random = randomNumberGenerator ?? getDefaultRandom();
    }
    /**
     * Generates a new UUIDv7 object from the current timestamp, or resets the
     * generator upon significant timestamp rollback.
     *
     * This method returns a monotonically increasing UUID by reusing the previous
     * timestamp even if the up-to-date timestamp is smaller than the immediately
     * preceding UUID's. However, when such a clock rollback is considered
     * significant (i.e., by more than ten seconds), this method resets the
     * generator and returns a new UUID based on the given timestamp, breaking the
     * increasing order of UUIDs.
     *
     * See {@link generateOrAbort} for the other mode of generation and
     * {@link generateOrResetCore} for the low-level primitive.
     */
    generate() {
        return this.generateOrResetCore(Date.now(), 10000);
    }
    /**
     * Generates a new UUIDv7 object from the current timestamp, or returns
     * `undefined` upon significant timestamp rollback.
     *
     * This method returns a monotonically increasing UUID by reusing the previous
     * timestamp even if the up-to-date timestamp is smaller than the immediately
     * preceding UUID's. However, when such a clock rollback is considered
     * significant (i.e., by more than ten seconds), this method aborts and
     * returns `undefined` immediately.
     *
     * See {@link generate} for the other mode of generation and
     * {@link generateOrAbortCore} for the low-level primitive.
     */
    generateOrAbort() {
        return this.generateOrAbortCore(Date.now(), 10000);
    }
    /**
     * Generates a new UUIDv7 object from the `unixTsMs` passed, or resets the
     * generator upon significant timestamp rollback.
     *
     * This method is equivalent to {@link generate} except that it takes a custom
     * timestamp and clock rollback allowance.
     *
     * @param rollbackAllowance - The amount of `unixTsMs` rollback that is
     * considered significant. A suggested value is `10_000` (milliseconds).
     * @throws RangeError if `unixTsMs` is not a 48-bit positive integer.
     */
    generateOrResetCore(unixTsMs, rollbackAllowance) {
        let value = this.generateOrAbortCore(unixTsMs, rollbackAllowance);
        if (value === undefined) {
            // reset state and resume
            this.timestamp = 0;
            value = this.generateOrAbortCore(unixTsMs, rollbackAllowance);
        }
        return value;
    }
    /**
     * Generates a new UUIDv7 object from the `unixTsMs` passed, or returns
     * `undefined` upon significant timestamp rollback.
     *
     * This method is equivalent to {@link generateOrAbort} except that it takes a
     * custom timestamp and clock rollback allowance.
     *
     * @param rollbackAllowance - The amount of `unixTsMs` rollback that is
     * considered significant. A suggested value is `10_000` (milliseconds).
     * @throws RangeError if `unixTsMs` is not a 48-bit positive integer.
     */
    generateOrAbortCore(unixTsMs, rollbackAllowance) {
        const MAX_COUNTER = 4398046511103;
        if (!Number.isInteger(unixTsMs) ||
            unixTsMs < 1 ||
            unixTsMs > 281474976710655) {
            throw new RangeError("`unixTsMs` must be a 48-bit positive integer");
        }
        else if (rollbackAllowance < 0 || rollbackAllowance > 281474976710655) {
            throw new RangeError("`rollbackAllowance` out of reasonable range");
        }
        if (unixTsMs > this.timestamp) {
            this.timestamp = unixTsMs;
            this.resetCounter();
        }
        else if (unixTsMs + rollbackAllowance >= this.timestamp) {
            // go on with previous timestamp if new one is not much smaller
            this.counter++;
            if (this.counter > MAX_COUNTER) {
                // increment timestamp at counter overflow
                this.timestamp++;
                this.resetCounter();
            }
        }
        else {
            // abort if clock went backwards to unbearable extent
            return undefined;
        }
        return UUID.fromFieldsV7(this.timestamp, Math.trunc(this.counter / 2 ** 30), this.counter & (2 ** 30 - 1), this.random.nextUint32());
    }
    /** Initializes the counter at a 42-bit random integer. */
    resetCounter() {
        this.counter =
            this.random.nextUint32() * 0x400 + (this.random.nextUint32() & 0x3ff);
    }
    /**
     * Generates a new UUIDv4 object utilizing the random number generator inside.
     *
     * @internal
     */
    generateV4() {
        const bytes = new Uint8Array(Uint32Array.of(this.random.nextUint32(), this.random.nextUint32(), this.random.nextUint32(), this.random.nextUint32()).buffer);
        bytes[6] = 0x40 | (bytes[6] >>> 4);
        bytes[8] = 0x80 | (bytes[8] >>> 2);
        return UUID.ofInner(bytes);
    }
}
/** A global flag to force use of cryptographically strong RNG. */
// declare const UUIDV7_DENY_WEAK_RNG: boolean;
/** Returns the default random number generator available in the environment. */
const getDefaultRandom = () => {
    // fix: crypto isn't available in react-native, always use Math.random
    //   // detect Web Crypto API
    //   if (
    //     typeof crypto !== "undefined" &&
    //     typeof crypto.getRandomValues !== "undefined"
    //   ) {
    //     return new BufferedCryptoRandom();
    //   } else {
    //     // fall back on Math.random() unless the flag is set to true
    //     if (typeof UUIDV7_DENY_WEAK_RNG !== "undefined" && UUIDV7_DENY_WEAK_RNG) {
    //       throw new Error("no cryptographically strong RNG available");
    //     }
    //     return {
    //       nextUint32: (): number =>
    //         Math.trunc(Math.random() * 0x1_0000) * 0x1_0000 +
    //         Math.trunc(Math.random() * 0x1_0000),
    //     };
    //   }
    return {
        nextUint32: () => Math.trunc(Math.random() * 65536) * 65536 +
            Math.trunc(Math.random() * 65536),
    };
};
// /**
//  * Wraps `crypto.getRandomValues()` to enable buffering; this uses a small
//  * buffer by default to avoid both unbearable throughput decline in some
//  * environments and the waste of time and space for unused values.
//  */
// class BufferedCryptoRandom {
//   private readonly buffer = new Uint32Array(8);
//   private cursor = 0xffff;
//   nextUint32(): number {
//     if (this.cursor >= this.buffer.length) {
//       crypto.getRandomValues(this.buffer);
//       this.cursor = 0;
//     }
//     return this.buffer[this.cursor++];
//   }
// }
let defaultGenerator;
/**
 * Generates a UUIDv7 string.
 *
 * @returns The 8-4-4-4-12 canonical hexadecimal string representation
 * ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
 */
const uuidv7 = () => uuidv7obj().toString();
/** Generates a UUIDv7 object. */
const uuidv7obj = () => (defaultGenerator || (defaultGenerator = new V7Generator())).generate();

class PostHogFetchHttpError extends Error {
    constructor(response) {
        super('HTTP error while fetching PostHog: ' + response.status);
        this.response = response;
        this.name = 'PostHogFetchHttpError';
    }
}
class PostHogFetchNetworkError extends Error {
    constructor(error) {
        // TRICKY: "cause" is a newer property but is just ignored otherwise. Cast to any to ignore the type issue.
        // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        super('Network error while fetching PostHog', error instanceof Error ? { cause: error } : {});
        this.error = error;
        this.name = 'PostHogFetchNetworkError';
    }
}
function isPostHogFetchError(err) {
    return typeof err === 'object' && (err instanceof PostHogFetchHttpError || err instanceof PostHogFetchNetworkError);
}
class PostHogCoreStateless {
    constructor(apiKey, options) {
        this.flushPromise = null;
        this.disableGeoip = true;
        this.disabled = false;
        this.defaultOptIn = true;
        this.pendingPromises = {};
        // internal
        this._events = new SimpleEventEmitter();
        this._isInitialized = false;
        assert(apiKey, "You must pass your PostHog project's api key.");
        this.apiKey = apiKey;
        this.host = removeTrailingSlash(options?.host || 'https://app.posthog.com');
        this.flushAt = options?.flushAt ? Math.max(options?.flushAt, 1) : 20;
        this.maxBatchSize = Math.max(this.flushAt, options?.maxBatchSize ?? 100);
        this.maxQueueSize = Math.max(this.flushAt, options?.maxQueueSize ?? 1000);
        this.flushInterval = options?.flushInterval ?? 10000;
        this.captureMode = options?.captureMode || 'form';
        // If enable is explicitly set to false we override the optout
        this.defaultOptIn = options?.defaultOptIn ?? true;
        this._retryOptions = {
            retryCount: options?.fetchRetryCount ?? 3,
            retryDelay: options?.fetchRetryDelay ?? 3000,
            retryCheck: isPostHogFetchError,
        };
        this.requestTimeout = options?.requestTimeout ?? 10000; // 10 seconds
        this.featureFlagsRequestTimeoutMs = options?.featureFlagsRequestTimeoutMs ?? 3000; // 3 seconds
        this.disableGeoip = options?.disableGeoip ?? true;
        this.disabled = options?.disabled ?? false;
        // Init promise allows the derived class to block calls until it is ready
        this._initPromise = Promise.resolve();
        this._isInitialized = true;
    }
    wrap(fn) {
        if (this.disabled) {
            if (this.isDebug) {
                console.warn('[PostHog] The client is disabled');
            }
            return;
        }
        if (this._isInitialized) {
            // NOTE: We could also check for the "opt in" status here...
            return fn();
        }
        this._initPromise.then(() => fn());
    }
    getCommonEventProperties() {
        return {
            $lib: this.getLibraryId(),
            $lib_version: this.getLibraryVersion(),
        };
    }
    get optedOut() {
        return this.getPersistedProperty(PostHogPersistedProperty.OptedOut) ?? !this.defaultOptIn;
    }
    async optIn() {
        this.wrap(() => {
            this.setPersistedProperty(PostHogPersistedProperty.OptedOut, false);
        });
    }
    async optOut() {
        this.wrap(() => {
            this.setPersistedProperty(PostHogPersistedProperty.OptedOut, true);
        });
    }
    on(event, cb) {
        return this._events.on(event, cb);
    }
    debug(enabled = true) {
        this.removeDebugCallback?.();
        if (enabled) {
            const removeDebugCallback = this.on('*', (event, payload) => console.log('PostHog Debug', event, payload));
            this.removeDebugCallback = () => {
                removeDebugCallback();
                this.removeDebugCallback = undefined;
            };
        }
    }
    get isDebug() {
        return !!this.removeDebugCallback;
    }
    buildPayload(payload) {
        return {
            distinct_id: payload.distinct_id,
            event: payload.event,
            properties: {
                ...(payload.properties || {}),
                ...this.getCommonEventProperties(), // Common PH props
            },
        };
    }
    addPendingPromise(promise) {
        const promiseUUID = uuidv7();
        this.pendingPromises[promiseUUID] = promise;
        promise
            .catch(() => { })
            .finally(() => {
            delete this.pendingPromises[promiseUUID];
        });
        return promise;
    }
    /***
     *** TRACKING
     ***/
    identifyStateless(distinctId, properties, options) {
        this.wrap(() => {
            // The properties passed to identifyStateless are event properties.
            // To add person properties, pass in all person properties to the `$set` key.
            const payload = {
                ...this.buildPayload({
                    distinct_id: distinctId,
                    event: '$identify',
                    properties,
                }),
            };
            this.enqueue('identify', payload, options);
        });
    }
    captureStateless(distinctId, event, properties, options) {
        this.wrap(() => {
            const payload = this.buildPayload({ distinct_id: distinctId, event, properties });
            this.enqueue('capture', payload, options);
        });
    }
    aliasStateless(alias, distinctId, properties, options) {
        this.wrap(() => {
            const payload = this.buildPayload({
                event: '$create_alias',
                distinct_id: distinctId,
                properties: {
                    ...(properties || {}),
                    distinct_id: distinctId,
                    alias,
                },
            });
            this.enqueue('alias', payload, options);
        });
    }
    /***
     *** GROUPS
     ***/
    groupIdentifyStateless(groupType, groupKey, groupProperties, options, distinctId, eventProperties) {
        this.wrap(() => {
            const payload = this.buildPayload({
                distinct_id: distinctId || `$${groupType}_${groupKey}`,
                event: '$groupidentify',
                properties: {
                    $group_type: groupType,
                    $group_key: groupKey,
                    $group_set: groupProperties || {},
                    ...(eventProperties || {}),
                },
            });
            this.enqueue('capture', payload, options);
        });
    }
    /***
     *** FEATURE FLAGS
     ***/
    async getDecide(distinctId, groups = {}, personProperties = {}, groupProperties = {}, extraPayload = {}) {
        await this._initPromise;
        const url = `${this.host}/decide/?v=3`;
        const fetchOptions = {
            method: 'POST',
            headers: { ...this.getCustomHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: this.apiKey,
                distinct_id: distinctId,
                groups,
                person_properties: personProperties,
                group_properties: groupProperties,
                ...extraPayload,
            }),
        };
        // Don't retry /decide API calls
        return this.fetchWithRetry(url, fetchOptions, { retryCount: 0 }, this.featureFlagsRequestTimeoutMs)
            .then((response) => response.json())
            .catch((error) => {
            this._events.emit('error', error);
            return undefined;
        });
    }
    async getFeatureFlagStateless(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const featureFlags = await this.getFeatureFlagsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip);
        if (!featureFlags) {
            // If we haven't loaded flags yet, or errored out, we respond with undefined
            return undefined;
        }
        let response = featureFlags[key];
        // `/decide` v3 returns all flags
        if (response === undefined) {
            // For cases where the flag is unknown, return false
            response = false;
        }
        // If we have flags we either return the value (true or string) or false
        return response;
    }
    async getFeatureFlagPayloadStateless(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const payloads = await this.getFeatureFlagPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip);
        if (!payloads) {
            return undefined;
        }
        const response = payloads[key];
        // Undefined means a loading or missing data issue. Null means evaluation happened and there was no match
        if (response === undefined) {
            return null;
        }
        return response;
    }
    async getFeatureFlagPayloadsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const payloads = (await this.getFeatureFlagsAndPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip)).payloads;
        return payloads;
    }
    _parsePayload(response) {
        try {
            return JSON.parse(response);
        }
        catch {
            return response;
        }
    }
    async getFeatureFlagsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        return (await this.getFeatureFlagsAndPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip)).flags;
    }
    async getFeatureFlagsAndPayloadsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const extraPayload = {};
        if (disableGeoip ?? this.disableGeoip) {
            extraPayload['geoip_disable'] = true;
        }
        const decideResponse = await this.getDecide(distinctId, groups, personProperties, groupProperties, extraPayload);
        const flags = decideResponse?.featureFlags;
        const payloads = decideResponse?.featureFlagPayloads;
        let parsedPayloads = payloads;
        if (payloads) {
            parsedPayloads = Object.fromEntries(Object.entries(payloads).map(([k, v]) => [k, this._parsePayload(v)]));
        }
        return {
            flags,
            payloads: parsedPayloads,
        };
    }
    /***
     *** QUEUEING AND FLUSHING
     ***/
    enqueue(type, _message, options) {
        this.wrap(() => {
            if (this.optedOut) {
                this._events.emit(type, `Library is disabled. Not sending event. To re-enable, call posthog.optIn()`);
                return;
            }
            const message = {
                ..._message,
                type: type,
                library: this.getLibraryId(),
                library_version: this.getLibraryVersion(),
                timestamp: options?.timestamp ? options?.timestamp : currentISOTime(),
                uuid: options?.uuid ? options.uuid : uuidv7(),
            };
            const addGeoipDisableProperty = options?.disableGeoip ?? this.disableGeoip;
            if (addGeoipDisableProperty) {
                if (!message.properties) {
                    message.properties = {};
                }
                message['properties']['$geoip_disable'] = true;
            }
            if (message.distinctId) {
                message.distinct_id = message.distinctId;
                delete message.distinctId;
            }
            const queue = this.getPersistedProperty(PostHogPersistedProperty.Queue) || [];
            if (queue.length >= this.maxQueueSize) {
                queue.shift();
                console.info('Queue is full, the oldest event is dropped.');
            }
            queue.push({ message });
            this.setPersistedProperty(PostHogPersistedProperty.Queue, queue);
            this._events.emit(type, message);
            // Flush queued events if we meet the flushAt length
            if (queue.length >= this.flushAt) {
                this.flushBackground();
            }
            if (this.flushInterval && !this._flushTimer) {
                this._flushTimer = safeSetTimeout(() => this.flushBackground(), this.flushInterval);
            }
        });
    }
    clearFlushTimer() {
        if (this._flushTimer) {
            clearTimeout(this._flushTimer);
            this._flushTimer = undefined;
        }
    }
    /**
     * Helper for flushing the queue in the background
     * Avoids unnecessary promise errors
     */
    flushBackground() {
        void this.flush().catch(() => { });
    }
    async flush() {
        if (!this.flushPromise) {
            this.flushPromise = this._flush().finally(() => {
                this.flushPromise = null;
            });
            this.addPendingPromise(this.flushPromise);
        }
        return this.flushPromise;
    }
    getCustomHeaders() {
        // Don't set the user agent if we're not on a browser. The latest spec allows
        // the User-Agent header (see https://fetch.spec.whatwg.org/#terminology-headers
        // and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader),
        // but browsers such as Chrome and Safari have not caught up.
        const customUserAgent = this.getCustomUserAgent();
        const headers = {};
        if (customUserAgent && customUserAgent !== '') {
            headers['User-Agent'] = customUserAgent;
        }
        return headers;
    }
    async _flush() {
        this.clearFlushTimer();
        await this._initPromise;
        const queue = this.getPersistedProperty(PostHogPersistedProperty.Queue) || [];
        if (!queue.length) {
            return [];
        }
        const items = queue.slice(0, this.maxBatchSize);
        const messages = items.map((item) => item.message);
        const persistQueueChange = () => {
            const refreshedQueue = this.getPersistedProperty(PostHogPersistedProperty.Queue) || [];
            this.setPersistedProperty(PostHogPersistedProperty.Queue, refreshedQueue.slice(items.length));
        };
        const data = {
            api_key: this.apiKey,
            batch: messages,
            sent_at: currentISOTime(),
        };
        const payload = JSON.stringify(data);
        const url = this.captureMode === 'form'
            ? `${this.host}/e/?ip=1&_=${currentTimestamp()}&v=${this.getLibraryVersion()}`
            : `${this.host}/batch/`;
        const fetchOptions = this.captureMode === 'form'
            ? {
                method: 'POST',
                mode: 'no-cors',
                credentials: 'omit',
                headers: { ...this.getCustomHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `data=${encodeURIComponent(LZString.compressToBase64(payload))}&compression=lz64`,
            }
            : {
                method: 'POST',
                headers: { ...this.getCustomHeaders(), 'Content-Type': 'application/json' },
                body: payload,
            };
        try {
            await this.fetchWithRetry(url, fetchOptions);
        }
        catch (err) {
            // depending on the error type, eg a malformed JSON or broken queue, it'll always return an error
            // and this will be an endless loop, in this case, if the error isn't a network issue, we always remove the items from the queue
            if (!(err instanceof PostHogFetchNetworkError)) {
                persistQueueChange();
            }
            this._events.emit('error', err);
            throw err;
        }
        persistQueueChange();
        this._events.emit('flush', messages);
        return messages;
    }
    async fetchWithRetry(url, options, retryOptions, requestTimeout) {
        var _a;
        (_a = AbortSignal).timeout ?? (_a.timeout = function timeout(ms) {
            const ctrl = new AbortController();
            setTimeout(() => ctrl.abort(), ms);
            return ctrl.signal;
        });
        return await retriable(async () => {
            let res = null;
            try {
                res = await this.fetch(url, {
                    signal: AbortSignal.timeout(requestTimeout ?? this.requestTimeout),
                    ...options,
                });
            }
            catch (e) {
                // fetch will only throw on network errors or on timeouts
                throw new PostHogFetchNetworkError(e);
            }
            // If we're in no-cors mode, we can't access the response status
            // We only throw on HTTP errors if we're not in no-cors mode
            // https://developer.mozilla.org/en-US/docs/Web/API/Request/mode#no-cors
            const isNoCors = options.mode === 'no-cors';
            if (!isNoCors && (res.status < 200 || res.status >= 400)) {
                throw new PostHogFetchHttpError(res);
            }
            return res;
        }, { ...this._retryOptions, ...retryOptions });
    }
    async shutdown(shutdownTimeoutMs = 30000) {
        await this._initPromise;
        this.clearFlushTimer();
        try {
            await Promise.all(Object.values(this.pendingPromises));
            const startTimeWithDelay = Date.now() + shutdownTimeoutMs;
            while (true) {
                const queue = this.getPersistedProperty(PostHogPersistedProperty.Queue) || [];
                if (queue.length === 0) {
                    break;
                }
                // flush again to make sure we send all events, some of which might've been added
                // while we were waiting for the pending promises to resolve
                // For example, see sendFeatureFlags in posthog-node/src/posthog-node.ts::capture
                await this.flush();
                // If we've been waiting for more than the shutdownTimeoutMs, stop it
                const now = Date.now();
                if (startTimeWithDelay < now) {
                    break;
                }
            }
        }
        catch (e) {
            if (!isPostHogFetchError(e)) {
                throw e;
            }
            console.error('Error while shutting down PostHog', e);
        }
    }
}

class PostHogMemoryStorage {
    constructor() {
        this._memoryStorage = {};
    }
    getProperty(key) {
        return this._memoryStorage[key];
    }
    setProperty(key, value) {
        this._memoryStorage[key] = value !== null ? value : undefined;
    }
}

/**
 * Fetch wrapper
 *
 * We want to polyfill fetch when not available with axios but use it when it is.
 * NOTE: The current version of Axios has an issue when in non-node environments like Clouflare Workers.
 * This is currently solved by using the global fetch if available instead.
 * See https://github.com/PostHog/posthog-js-lite/issues/127 for more info
 */
let _fetch = // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
typeof fetch !== 'undefined' ? fetch : typeof global.fetch !== 'undefined' ? global.fetch : undefined;

if (!_fetch) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axios = require('axios');

  _fetch = async (url, options) => {
    const res = await axios.request({
      url,
      headers: options.headers,
      method: options.method.toLowerCase(),
      data: options.body,
      signal: options.signal,
      // fetch only throws on network errors, not on HTTP errors
      validateStatus: () => true
    });
    return {
      status: res.status,
      text: async () => res.data,
      json: async () => res.data
    };
  };
} // NOTE: We have to export this as default, even though we prefer named exports as we are relying on detecting "fetch" in the global scope


var fetch$1 = _fetch;

const LONG_SCALE = 0xfffffffffffffff;

class ClientError extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ClientError';
    this.message = message;
    Object.setPrototypeOf(this, ClientError.prototype);
  }

}

class InconclusiveMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor); // instanceof doesn't work in ES3 or ES5
    // https://www.dannyguo.com/blog/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript/
    // this is the workaround

    Object.setPrototypeOf(this, InconclusiveMatchError.prototype);
  }

}

class FeatureFlagsPoller {
  constructor({
    pollingInterval,
    personalApiKey,
    projectApiKey,
    timeout,
    host,
    customHeaders,
    ...options
  }) {
    this.debugMode = false;
    this.pollingInterval = pollingInterval;
    this.personalApiKey = personalApiKey;
    this.featureFlags = [];
    this.featureFlagsByKey = {};
    this.groupTypeMapping = {};
    this.cohorts = {};
    this.loadedSuccessfullyOnce = false;
    this.timeout = timeout;
    this.projectApiKey = projectApiKey;
    this.host = host;
    this.poller = undefined; // NOTE: as any is required here as the AbortSignal typing is slightly misaligned but works just fine

    this.fetch = options.fetch || fetch$1;
    this.onError = options.onError;
    this.customHeaders = customHeaders;
    void this.loadFeatureFlags();
  }

  debug(enabled = true) {
    this.debugMode = enabled;
  }

  async getFeatureFlag(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}) {
    await this.loadFeatureFlags();
    let response = undefined;
    let featureFlag = undefined;

    if (!this.loadedSuccessfullyOnce) {
      return response;
    }

    for (const flag of this.featureFlags) {
      if (key === flag.key) {
        featureFlag = flag;
        break;
      }
    }

    if (featureFlag !== undefined) {
      try {
        response = this.computeFlagLocally(featureFlag, distinctId, groups, personProperties, groupProperties);

        if (this.debugMode) {
          console.debug(`Successfully computed flag locally: ${key} -> ${response}`);
        }
      } catch (e) {
        if (e instanceof InconclusiveMatchError) {
          if (this.debugMode) {
            console.debug(`InconclusiveMatchError when computing flag locally: ${key}: ${e}`);
          }
        } else if (e instanceof Error) {
          this.onError?.(new Error(`Error computing flag locally: ${key}: ${e}`));
        }
      }
    }

    return response;
  }

  async computeFeatureFlagPayloadLocally(key, matchValue) {
    await this.loadFeatureFlags();
    let response = undefined;

    if (!this.loadedSuccessfullyOnce) {
      return undefined;
    }

    if (typeof matchValue == 'boolean') {
      response = this.featureFlagsByKey?.[key]?.filters?.payloads?.[matchValue.toString()];
    } else if (typeof matchValue == 'string') {
      response = this.featureFlagsByKey?.[key]?.filters?.payloads?.[matchValue];
    } // Undefined means a loading or missing data issue. Null means evaluation happened and there was no match


    if (response === undefined || response === null) {
      return null;
    }

    try {
      return JSON.parse(response);
    } catch {
      return response;
    }
  }

  async getAllFlagsAndPayloads(distinctId, groups = {}, personProperties = {}, groupProperties = {}) {
    await this.loadFeatureFlags();
    const response = {};
    const payloads = {};
    let fallbackToDecide = this.featureFlags.length == 0;
    this.featureFlags.map(async flag => {
      try {
        const matchValue = this.computeFlagLocally(flag, distinctId, groups, personProperties, groupProperties);
        response[flag.key] = matchValue;
        const matchPayload = await this.computeFeatureFlagPayloadLocally(flag.key, matchValue);

        if (matchPayload) {
          payloads[flag.key] = matchPayload;
        }
      } catch (e) {
        if (e instanceof InconclusiveMatchError) ; else if (e instanceof Error) {
          this.onError?.(new Error(`Error computing flag locally: ${flag.key}: ${e}`));
        }

        fallbackToDecide = true;
      }
    });
    return {
      response,
      payloads,
      fallbackToDecide
    };
  }

  computeFlagLocally(flag, distinctId, groups = {}, personProperties = {}, groupProperties = {}) {
    if (flag.ensure_experience_continuity) {
      throw new InconclusiveMatchError('Flag has experience continuity enabled');
    }

    if (!flag.active) {
      return false;
    }

    const flagFilters = flag.filters || {};
    const aggregation_group_type_index = flagFilters.aggregation_group_type_index;

    if (aggregation_group_type_index != undefined) {
      const groupName = this.groupTypeMapping[String(aggregation_group_type_index)];

      if (!groupName) {
        if (this.debugMode) {
          console.warn(`[FEATURE FLAGS] Unknown group type index ${aggregation_group_type_index} for feature flag ${flag.key}`);
        }

        throw new InconclusiveMatchError('Flag has unknown group type index');
      }

      if (!(groupName in groups)) {
        if (this.debugMode) {
          console.warn(`[FEATURE FLAGS] Can't compute group feature flag: ${flag.key} without group names passed in`);
        }

        return false;
      }

      const focusedGroupProperties = groupProperties[groupName];
      return this.matchFeatureFlagProperties(flag, groups[groupName], focusedGroupProperties);
    } else {
      return this.matchFeatureFlagProperties(flag, distinctId, personProperties);
    }
  }

  matchFeatureFlagProperties(flag, distinctId, properties) {
    const flagFilters = flag.filters || {};
    const flagConditions = flagFilters.groups || [];
    let isInconclusive = false;
    let result = undefined; // # Stable sort conditions with variant overrides to the top. This ensures that if overrides are present, they are
    // # evaluated first, and the variant override is applied to the first matching condition.

    const sortedFlagConditions = [...flagConditions].sort((conditionA, conditionB) => {
      const AHasVariantOverride = !!conditionA.variant;
      const BHasVariantOverride = !!conditionB.variant;

      if (AHasVariantOverride && BHasVariantOverride) {
        return 0;
      } else if (AHasVariantOverride) {
        return -1;
      } else if (BHasVariantOverride) {
        return 1;
      } else {
        return 0;
      }
    });

    for (const condition of sortedFlagConditions) {
      try {
        if (this.isConditionMatch(flag, distinctId, condition, properties)) {
          const variantOverride = condition.variant;
          const flagVariants = flagFilters.multivariate?.variants || [];

          if (variantOverride && flagVariants.some(variant => variant.key === variantOverride)) {
            result = variantOverride;
          } else {
            result = this.getMatchingVariant(flag, distinctId) || true;
          }

          break;
        }
      } catch (e) {
        if (e instanceof InconclusiveMatchError) {
          isInconclusive = true;
        } else {
          throw e;
        }
      }
    }

    if (result !== undefined) {
      return result;
    } else if (isInconclusive) {
      throw new InconclusiveMatchError("Can't determine if feature flag is enabled or not with given properties");
    } // We can only return False when all conditions are False


    return false;
  }

  isConditionMatch(flag, distinctId, condition, properties) {
    const rolloutPercentage = condition.rollout_percentage;

    if ((condition.properties || []).length > 0) {
      for (const prop of condition.properties) {
        const propertyType = prop.type;
        let matches = false;

        if (propertyType === 'cohort') {
          matches = matchCohort(prop, properties, this.cohorts, this.debugMode);
        } else {
          matches = matchProperty(prop, properties);
        }

        if (!matches) {
          return false;
        }
      }

      if (rolloutPercentage == undefined) {
        return true;
      }
    }

    if (rolloutPercentage != undefined && _hash(flag.key, distinctId) > rolloutPercentage / 100.0) {
      return false;
    }

    return true;
  }

  getMatchingVariant(flag, distinctId) {
    const hashValue = _hash(flag.key, distinctId, 'variant');

    const matchingVariant = this.variantLookupTable(flag).find(variant => {
      return hashValue >= variant.valueMin && hashValue < variant.valueMax;
    });

    if (matchingVariant) {
      return matchingVariant.key;
    }

    return undefined;
  }

  variantLookupTable(flag) {
    const lookupTable = [];
    let valueMin = 0;
    let valueMax = 0;
    const flagFilters = flag.filters || {};
    const multivariates = flagFilters.multivariate?.variants || [];
    multivariates.forEach(variant => {
      valueMax = valueMin + variant.rollout_percentage / 100.0;
      lookupTable.push({
        valueMin,
        valueMax,
        key: variant.key
      });
      valueMin = valueMax;
    });
    return lookupTable;
  }

  async loadFeatureFlags(forceReload = false) {
    if (!this.loadedSuccessfullyOnce || forceReload) {
      await this._loadFeatureFlags();
    }
  }

  async _loadFeatureFlags() {
    if (this.poller) {
      clearTimeout(this.poller);
      this.poller = undefined;
    }

    this.poller = setTimeout(() => this._loadFeatureFlags(), this.pollingInterval);

    try {
      const res = await this._requestFeatureFlagDefinitions();

      if (res && res.status === 401) {
        throw new ClientError(`Your personalApiKey is invalid. Are you sure you're not using your Project API key? More information: https://posthog.com/docs/api/overview`);
      }

      if (res && res.status !== 200) {
        // something else went wrong, or the server is down.
        // In this case, don't override existing flags
        return;
      }

      const responseJson = await res.json();

      if (!('flags' in responseJson)) {
        this.onError?.(new Error(`Invalid response when getting feature flags: ${JSON.stringify(responseJson)}`));
      }

      this.featureFlags = responseJson.flags || [];
      this.featureFlagsByKey = this.featureFlags.reduce((acc, curr) => (acc[curr.key] = curr, acc), {});
      this.groupTypeMapping = responseJson.group_type_mapping || {};
      this.cohorts = responseJson.cohorts || [];
      this.loadedSuccessfullyOnce = true;
    } catch (err) {
      // if an error that is not an instance of ClientError is thrown
      // we silently ignore the error when reloading feature flags
      if (err instanceof ClientError) {
        this.onError?.(err);
      }
    }
  }

  async _requestFeatureFlagDefinitions() {
    const url = `${this.host}/api/feature_flag/local_evaluation?token=${this.projectApiKey}&send_cohorts`;
    const options = {
      method: 'GET',
      headers: { ...this.customHeaders,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.personalApiKey}`
      }
    };
    let abortTimeout = null;

    if (this.timeout && typeof this.timeout === 'number') {
      const controller = new AbortController();
      abortTimeout = safeSetTimeout(() => {
        controller.abort();
      }, this.timeout);
      options.signal = controller.signal;
    }

    try {
      return await this.fetch(url, options);
    } finally {
      clearTimeout(abortTimeout);
    }
  }

  stopPoller() {
    clearTimeout(this.poller);
  }

} // # This function takes a distinct_id and a feature flag key and returns a float between 0 and 1.
// # Given the same distinct_id and key, it'll always return the same float. These floats are
// # uniformly distributed between 0 and 1, so if we want to show this feature to 20% of traffic
// # we can do _hash(key, distinct_id) < 0.2


function _hash(key, distinctId, salt = '') {
  // rusha is a fast sha1 implementation in pure javascript
  const sha1Hash = rusha.createHash();
  sha1Hash.update(`${key}.${distinctId}${salt}`);
  return parseInt(sha1Hash.digest('hex').slice(0, 15), 16) / LONG_SCALE;
}

function matchProperty(property, propertyValues) {
  const key = property.key;
  const value = property.value;
  const operator = property.operator || 'exact';

  if (!(key in propertyValues)) {
    throw new InconclusiveMatchError(`Property ${key} not found in propertyValues`);
  } else if (operator === 'is_not_set') {
    throw new InconclusiveMatchError(`Operator is_not_set is not supported`);
  }

  const overrideValue = propertyValues[key];

  function computeExactMatch(value, overrideValue) {
    if (Array.isArray(value)) {
      return value.map(val => String(val).toLowerCase()).includes(String(overrideValue).toLowerCase());
    }

    return String(value).toLowerCase() === String(overrideValue).toLowerCase();
  }

  function compare(lhs, rhs, operator) {
    if (operator === 'gt') {
      return lhs > rhs;
    } else if (operator === 'gte') {
      return lhs >= rhs;
    } else if (operator === 'lt') {
      return lhs < rhs;
    } else if (operator === 'lte') {
      return lhs <= rhs;
    } else {
      throw new Error(`Invalid operator: ${operator}`);
    }
  }

  switch (operator) {
    case 'exact':
      return computeExactMatch(value, overrideValue);

    case 'is_not':
      return !computeExactMatch(value, overrideValue);

    case 'is_set':
      return key in propertyValues;

    case 'icontains':
      return String(overrideValue).toLowerCase().includes(String(value).toLowerCase());

    case 'not_icontains':
      return !String(overrideValue).toLowerCase().includes(String(value).toLowerCase());

    case 'regex':
      return isValidRegex(String(value)) && String(overrideValue).match(String(value)) !== null;

    case 'not_regex':
      return isValidRegex(String(value)) && String(overrideValue).match(String(value)) === null;

    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
      {
        // :TRICKY: We adjust comparison based on the override value passed in,
        // to make sure we handle both numeric and string comparisons appropriately.
        let parsedValue = typeof value === 'number' ? value : null;

        if (typeof value === 'string') {
          try {
            parsedValue = parseFloat(value);
          } catch (err) {// pass
          }
        }

        if (parsedValue != null && overrideValue != null) {
          // check both null and undefined
          if (typeof overrideValue === 'string') {
            return compare(overrideValue, String(value), operator);
          } else {
            return compare(overrideValue, parsedValue, operator);
          }
        } else {
          return compare(String(overrideValue), String(value), operator);
        }
      }

    case 'is_date_after':
    case 'is_date_before':
      {
        let parsedDate = relativeDateParseForFeatureFlagMatching(String(value));

        if (parsedDate == null) {
          parsedDate = convertToDateTime(value);
        }

        if (parsedDate == null) {
          throw new InconclusiveMatchError(`Invalid date: ${value}`);
        }

        const overrideDate = convertToDateTime(overrideValue);

        if (['is_date_before'].includes(operator)) {
          return overrideDate < parsedDate;
        }

        return overrideDate > parsedDate;
      }

    default:
      throw new InconclusiveMatchError(`Unknown operator: ${operator}`);
  }
}

function matchCohort(property, propertyValues, cohortProperties, debugMode = false) {
  const cohortId = String(property.value);

  if (!(cohortId in cohortProperties)) {
    throw new InconclusiveMatchError("can't match cohort without a given cohort property value");
  }

  const propertyGroup = cohortProperties[cohortId];
  return matchPropertyGroup(propertyGroup, propertyValues, cohortProperties, debugMode);
}

function matchPropertyGroup(propertyGroup, propertyValues, cohortProperties, debugMode = false) {
  if (!propertyGroup) {
    return true;
  }

  const propertyGroupType = propertyGroup.type;
  const properties = propertyGroup.values;

  if (!properties || properties.length === 0) {
    // empty groups are no-ops, always match
    return true;
  }

  let errorMatchingLocally = false;

  if ('values' in properties[0]) {
    // a nested property group
    for (const prop of properties) {
      try {
        const matches = matchPropertyGroup(prop, propertyValues, cohortProperties, debugMode);

        if (propertyGroupType === 'AND') {
          if (!matches) {
            return false;
          }
        } else {
          // OR group
          if (matches) {
            return true;
          }
        }
      } catch (err) {
        if (err instanceof InconclusiveMatchError) {
          if (debugMode) {
            console.debug(`Failed to compute property ${prop} locally: ${err}`);
          }

          errorMatchingLocally = true;
        } else {
          throw err;
        }
      }
    }

    if (errorMatchingLocally) {
      throw new InconclusiveMatchError("Can't match cohort without a given cohort property value");
    } // if we get here, all matched in AND case, or none matched in OR case


    return propertyGroupType === 'AND';
  } else {
    for (const prop of properties) {
      try {
        let matches;

        if (prop.type === 'cohort') {
          matches = matchCohort(prop, propertyValues, cohortProperties, debugMode);
        } else {
          matches = matchProperty(prop, propertyValues);
        }

        const negation = prop.negation || false;

        if (propertyGroupType === 'AND') {
          // if negated property, do the inverse
          if (!matches && !negation) {
            return false;
          }

          if (matches && negation) {
            return false;
          }
        } else {
          // OR group
          if (matches && !negation) {
            return true;
          }

          if (!matches && negation) {
            return true;
          }
        }
      } catch (err) {
        if (err instanceof InconclusiveMatchError) {
          if (debugMode) {
            console.debug(`Failed to compute property ${prop} locally: ${err}`);
          }

          errorMatchingLocally = true;
        } else {
          throw err;
        }
      }
    }

    if (errorMatchingLocally) {
      throw new InconclusiveMatchError("can't match cohort without a given cohort property value");
    } // if we get here, all matched in AND case, or none matched in OR case


    return propertyGroupType === 'AND';
  }
}

function isValidRegex(regex) {
  try {
    new RegExp(regex);
    return true;
  } catch (err) {
    return false;
  }
}

function convertToDateTime(value) {
  if (value instanceof Date) {
    return value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);

    if (!isNaN(date.valueOf())) {
      return date;
    }

    throw new InconclusiveMatchError(`${value} is in an invalid date format`);
  } else {
    throw new InconclusiveMatchError(`The date provided ${value} must be a string, number, or date object`);
  }
}

function relativeDateParseForFeatureFlagMatching(value) {
  const regex = /^-?(?<number>[0-9]+)(?<interval>[a-z])$/;
  const match = value.match(regex);
  const parsedDt = new Date(new Date().toISOString());

  if (match) {
    if (!match.groups) {
      return null;
    }

    const number = parseInt(match.groups['number']);

    if (number >= 10000) {
      // Guard against overflow, disallow numbers greater than 10_000
      return null;
    }

    const interval = match.groups['interval'];

    if (interval == 'h') {
      parsedDt.setUTCHours(parsedDt.getUTCHours() - number);
    } else if (interval == 'd') {
      parsedDt.setUTCDate(parsedDt.getUTCDate() - number);
    } else if (interval == 'w') {
      parsedDt.setUTCDate(parsedDt.getUTCDate() - number * 7);
    } else if (interval == 'm') {
      parsedDt.setUTCMonth(parsedDt.getUTCMonth() - number);
    } else if (interval == 'y') {
      parsedDt.setUTCFullYear(parsedDt.getUTCFullYear() - number);
    } else {
      return null;
    }

    return parsedDt;
  } else {
    return null;
  }
}

const THIRTY_SECONDS = 30 * 1000;
const MAX_CACHE_SIZE = 50 * 1000; // The actual exported Nodejs API.

class PostHog extends PostHogCoreStateless {
  constructor(apiKey, options = {}) {
    options.captureMode = options?.captureMode || 'json';
    super(apiKey, options);
    this._memoryStorage = new PostHogMemoryStorage();
    this.options = options;

    if (options.personalApiKey) {
      this.featureFlagsPoller = new FeatureFlagsPoller({
        pollingInterval: typeof options.featureFlagsPollingInterval === 'number' ? options.featureFlagsPollingInterval : THIRTY_SECONDS,
        personalApiKey: options.personalApiKey,
        projectApiKey: apiKey,
        timeout: options.requestTimeout ?? 10000,
        host: this.host,
        fetch: options.fetch,
        onError: err => {
          this._events.emit('error', err);
        },
        customHeaders: this.getCustomHeaders()
      });
    }

    this.distinctIdHasSentFlagCalls = {};
    this.maxCacheSize = options.maxCacheSize || MAX_CACHE_SIZE;
  }

  getPersistedProperty(key) {
    return this._memoryStorage.getProperty(key);
  }

  setPersistedProperty(key, value) {
    return this._memoryStorage.setProperty(key, value);
  }

  fetch(url, options) {
    return this.options.fetch ? this.options.fetch(url, options) : fetch$1(url, options);
  }

  getLibraryId() {
    return 'posthog-node';
  }

  getLibraryVersion() {
    return version;
  }

  getCustomUserAgent() {
    return `${this.getLibraryId()}/${this.getLibraryVersion()}`;
  }

  enable() {
    return super.optIn();
  }

  disable() {
    return super.optOut();
  }

  debug(enabled = true) {
    super.debug(enabled);
    this.featureFlagsPoller?.debug(enabled);
  }

  capture({
    distinctId,
    event,
    properties,
    groups,
    sendFeatureFlags,
    timestamp,
    disableGeoip,
    uuid
  }) {
    const _capture = props => {
      super.captureStateless(distinctId, event, props, {
        timestamp,
        disableGeoip,
        uuid
      });
    };

    const _getFlags = (distinctId, groups, disableGeoip) => {
      return super.getFeatureFlagsStateless(distinctId, groups, undefined, undefined, disableGeoip);
    }; // :TRICKY: If we flush, or need to shut down, to not lose events we want this promise to resolve before we flush


    const capturePromise = Promise.resolve().then(async () => {
      if (sendFeatureFlags) {
        // If we are sending feature flags, we need to make sure we have the latest flags
        // return await super.getFeatureFlagsStateless(distinctId, groups, undefined, undefined, disableGeoip)
        return await _getFlags(distinctId, groups, disableGeoip);
      }

      if ((this.featureFlagsPoller?.featureFlags?.length || 0) > 0) {
        // Otherwise we may as well check for the flags locally and include them if there
        const groupsWithStringValues = {};

        for (const [key, value] of Object.entries(groups || {})) {
          groupsWithStringValues[key] = String(value);
        }

        return await this.getAllFlags(distinctId, {
          groups: groupsWithStringValues,
          disableGeoip,
          onlyEvaluateLocally: true
        });
      }

      return {};
    }).then(flags => {
      // Derive the relevant flag properties to add
      const additionalProperties = {};

      if (flags) {
        for (const [feature, variant] of Object.entries(flags)) {
          additionalProperties[`$feature/${feature}`] = variant;
        }
      }

      const activeFlags = Object.keys(flags || {}).filter(flag => flags?.[flag] !== false);

      if (activeFlags.length > 0) {
        additionalProperties['$active_feature_flags'] = activeFlags;
      }

      return additionalProperties;
    }).catch(() => {
      // Something went wrong getting the flag info - we should capture the event anyways
      return {};
    }).then(additionalProperties => {
      // No matter what - capture the event
      _capture({ ...additionalProperties,
        ...properties,
        $groups: groups
      });
    });
    this.addPendingPromise(capturePromise);
  }

  identify({
    distinctId,
    properties,
    disableGeoip
  }) {
    // Catch properties passed as $set and move them to the top level
    const personProperties = properties?.$set || properties;
    super.identifyStateless(distinctId, {
      $set: personProperties
    }, {
      disableGeoip
    });
  }

  alias(data) {
    super.aliasStateless(data.alias, data.distinctId, undefined, {
      disableGeoip: data.disableGeoip
    });
  }

  async getFeatureFlag(key, distinctId, options) {
    const {
      groups,
      disableGeoip
    } = options || {};
    let {
      onlyEvaluateLocally,
      sendFeatureFlagEvents,
      personProperties,
      groupProperties
    } = options || {};
    const adjustedProperties = this.addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties);
    personProperties = adjustedProperties.allPersonProperties;
    groupProperties = adjustedProperties.allGroupProperties; // set defaults

    if (onlyEvaluateLocally == undefined) {
      onlyEvaluateLocally = false;
    }

    if (sendFeatureFlagEvents == undefined) {
      sendFeatureFlagEvents = true;
    }

    let response = await this.featureFlagsPoller?.getFeatureFlag(key, distinctId, groups, personProperties, groupProperties);
    const flagWasLocallyEvaluated = response !== undefined;

    if (!flagWasLocallyEvaluated && !onlyEvaluateLocally) {
      response = await super.getFeatureFlagStateless(key, distinctId, groups, personProperties, groupProperties, disableGeoip);
    }

    const featureFlagReportedKey = `${key}_${response}`;

    if (sendFeatureFlagEvents && (!(distinctId in this.distinctIdHasSentFlagCalls) || !this.distinctIdHasSentFlagCalls[distinctId].includes(featureFlagReportedKey))) {
      if (Object.keys(this.distinctIdHasSentFlagCalls).length >= this.maxCacheSize) {
        this.distinctIdHasSentFlagCalls = {};
      }

      if (Array.isArray(this.distinctIdHasSentFlagCalls[distinctId])) {
        this.distinctIdHasSentFlagCalls[distinctId].push(featureFlagReportedKey);
      } else {
        this.distinctIdHasSentFlagCalls[distinctId] = [featureFlagReportedKey];
      }

      this.capture({
        distinctId,
        event: '$feature_flag_called',
        properties: {
          $feature_flag: key,
          $feature_flag_response: response,
          locally_evaluated: flagWasLocallyEvaluated,
          [`$feature/${key}`]: response
        },
        groups,
        disableGeoip
      });
    }

    return response;
  }

  async getFeatureFlagPayload(key, distinctId, matchValue, options) {
    const {
      groups,
      disableGeoip
    } = options || {};
    let {
      onlyEvaluateLocally,
      sendFeatureFlagEvents,
      personProperties,
      groupProperties
    } = options || {};
    const adjustedProperties = this.addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties);
    personProperties = adjustedProperties.allPersonProperties;
    groupProperties = adjustedProperties.allGroupProperties;
    let response = undefined; // Try to get match value locally if not provided

    if (!matchValue) {
      matchValue = await this.getFeatureFlag(key, distinctId, { ...options,
        onlyEvaluateLocally: true
      });
    }

    if (matchValue) {
      response = await this.featureFlagsPoller?.computeFeatureFlagPayloadLocally(key, matchValue);
    } // set defaults


    if (onlyEvaluateLocally == undefined) {
      onlyEvaluateLocally = false;
    }

    if (sendFeatureFlagEvents == undefined) {
      sendFeatureFlagEvents = true;
    } // set defaults


    if (onlyEvaluateLocally == undefined) {
      onlyEvaluateLocally = false;
    }

    const payloadWasLocallyEvaluated = response !== undefined;

    if (!payloadWasLocallyEvaluated && !onlyEvaluateLocally) {
      response = await super.getFeatureFlagPayloadStateless(key, distinctId, groups, personProperties, groupProperties, disableGeoip);
    }

    return response;
  }

  async isFeatureEnabled(key, distinctId, options) {
    const feat = await this.getFeatureFlag(key, distinctId, options);

    if (feat === undefined) {
      return undefined;
    }

    return !!feat || false;
  }

  async getAllFlags(distinctId, options) {
    const response = await this.getAllFlagsAndPayloads(distinctId, options);
    return response.featureFlags;
  }

  async getAllFlagsAndPayloads(distinctId, options) {
    const {
      groups,
      disableGeoip
    } = options || {};
    let {
      onlyEvaluateLocally,
      personProperties,
      groupProperties
    } = options || {};
    const adjustedProperties = this.addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties);
    personProperties = adjustedProperties.allPersonProperties;
    groupProperties = adjustedProperties.allGroupProperties; // set defaults

    if (onlyEvaluateLocally == undefined) {
      onlyEvaluateLocally = false;
    }

    const localEvaluationResult = await this.featureFlagsPoller?.getAllFlagsAndPayloads(distinctId, groups, personProperties, groupProperties);
    let featureFlags = {};
    let featureFlagPayloads = {};
    let fallbackToDecide = true;

    if (localEvaluationResult) {
      featureFlags = localEvaluationResult.response;
      featureFlagPayloads = localEvaluationResult.payloads;
      fallbackToDecide = localEvaluationResult.fallbackToDecide;
    }

    if (fallbackToDecide && !onlyEvaluateLocally) {
      const remoteEvaluationResult = await super.getFeatureFlagsAndPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip);
      featureFlags = { ...featureFlags,
        ...(remoteEvaluationResult.flags || {})
      };
      featureFlagPayloads = { ...featureFlagPayloads,
        ...(remoteEvaluationResult.payloads || {})
      };
    }

    return {
      featureFlags,
      featureFlagPayloads
    };
  }

  groupIdentify({
    groupType,
    groupKey,
    properties,
    distinctId,
    disableGeoip
  }) {
    super.groupIdentifyStateless(groupType, groupKey, properties, {
      disableGeoip
    }, distinctId);
  }

  async reloadFeatureFlags() {
    await this.featureFlagsPoller?.loadFeatureFlags(true);
  }

  async shutdown(shutdownTimeoutMs) {
    this.featureFlagsPoller?.stopPoller();
    return super.shutdown(shutdownTimeoutMs);
  }

  addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties) {
    const allPersonProperties = {
      distinct_id: distinctId,
      ...(personProperties || {})
    };
    const allGroupProperties = {};

    if (groups) {
      for (const groupName of Object.keys(groups)) {
        allGroupProperties[groupName] = {
          $group_key: groups[groupName],
          ...(groupProperties?.[groupName] || {})
        };
      }
    }

    return {
      allPersonProperties,
      allGroupProperties
    };
  }

}

/**
 * Integrate Sentry with PostHog. This will add a direct link to the person in Sentry, and an $exception event in PostHog.
 *
 * ### Usage
 *
 *     Sentry.init({
 *          dsn: 'https://example',
 *          integrations: [
 *              new PostHogSentryIntegration(posthog)
 *          ]
 *     })
 *
 *     Sentry.setTag(PostHogSentryIntegration.POSTHOG_ID_TAG, 'some distinct id');
 *
 * @param {Object} [posthog] The posthog object
 * @param {string} [organization] Optional: The Sentry organization, used to send a direct link from PostHog to Sentry
 * @param {Number} [projectId] Optional: The Sentry project id, used to send a direct link from PostHog to Sentry
 * @param {string} [prefix] Optional: Url of a self-hosted sentry instance (default: https://sentry.io/organizations/)
 */
class PostHogSentryIntegration {
  constructor(posthog, posthogHost, organization, prefix) {
    this.posthog = posthog;
    this.posthogHost = posthogHost;
    this.organization = organization;
    this.prefix = prefix;
    this.name = 'posthog-node';
    this.posthogHost = posthog.options.host ?? 'https://app.posthog.com';
  }

  setupOnce(addGlobalEventProcessor, getCurrentHub) {
    addGlobalEventProcessor(event => {
      if (event.exception?.values === undefined || event.exception.values.length === 0) {
        return event;
      }

      if (!event.tags) {
        event.tags = {};
      }

      const sentry = getCurrentHub(); // Get the PostHog user ID from a specific tag, which users can set on their Sentry scope as they need.

      const userId = event.tags[PostHogSentryIntegration.POSTHOG_ID_TAG];

      if (userId === undefined) {
        // If we can't find a user ID, don't bother linking the event. We won't be able to send anything meaningful to PostHog without it.
        return event;
      }

      event.tags['PostHog Person URL'] = new URL(`/person/${userId}`, this.posthogHost).toString();
      const properties = {
        // PostHog Exception Properties
        $exception_message: event.exception.values[0]?.value,
        $exception_type: event.exception.values[0]?.type,
        $exception_personURL: event.tags['PostHog Person URL'],
        // Sentry Exception Properties
        $sentry_event_id: event.event_id,
        $sentry_exception: event.exception,
        $sentry_exception_message: event.exception.values[0]?.value,
        $sentry_exception_type: event.exception.values[0]?.type,
        $sentry_tags: event.tags
      };
      const projectId = sentry.getClient()?.getDsn()?.projectId;

      if (this.organization !== undefined && projectId !== undefined && event.event_id !== undefined) {
        properties.$sentry_url = `${this.prefix ?? 'https://sentry.io/organizations'}/${this.organization}/issues/?project=${projectId}&query=${event.event_id}`;
      }

      this.posthog.capture({
        event: '$exception',
        distinctId: userId,
        properties
      });
      return event;
    });
  }

}
PostHogSentryIntegration.POSTHOG_ID_TAG = 'posthog_distinct_id';

exports.PostHog = PostHog;
exports.PostHogSentryIntegration = PostHogSentryIntegration;
//# sourceMappingURL=index.cjs.js.map
