"use strict";
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = void 0;
const message_js_1 = require("../../message.js");
const proto3_js_1 = require("../../proto3.js");
/**
 * `Any` contains an arbitrary serialized protocol buffer message along with a
 * URL that describes the type of the serialized message.
 *
 * Protobuf library provides support to pack/unpack Any values in the form
 * of utility functions or additional generated methods of the Any type.
 *
 * Example 1: Pack and unpack a message in C++.
 *
 *     Foo foo = ...;
 *     Any any;
 *     any.PackFrom(foo);
 *     ...
 *     if (any.UnpackTo(&foo)) {
 *       ...
 *     }
 *
 * Example 2: Pack and unpack a message in Java.
 *
 *     Foo foo = ...;
 *     Any any = Any.pack(foo);
 *     ...
 *     if (any.is(Foo.class)) {
 *       foo = any.unpack(Foo.class);
 *     }
 *     // or ...
 *     if (any.isSameTypeAs(Foo.getDefaultInstance())) {
 *       foo = any.unpack(Foo.getDefaultInstance());
 *     }
 *
 *  Example 3: Pack and unpack a message in Python.
 *
 *     foo = Foo(...)
 *     any = Any()
 *     any.Pack(foo)
 *     ...
 *     if any.Is(Foo.DESCRIPTOR):
 *       any.Unpack(foo)
 *       ...
 *
 *  Example 4: Pack and unpack a message in Go
 *
 *      foo := &pb.Foo{...}
 *      any, err := anypb.New(foo)
 *      if err != nil {
 *        ...
 *      }
 *      ...
 *      foo := &pb.Foo{}
 *      if err := any.UnmarshalTo(foo); err != nil {
 *        ...
 *      }
 *
 * The pack methods provided by protobuf library will by default use
 * 'type.googleapis.com/full.type.name' as the type URL and the unpack
 * methods only use the fully qualified type name after the last '/'
 * in the type URL, for example "foo.bar.com/x/y.z" will yield type
 * name "y.z".
 *
 * JSON
 * ====
 * The JSON representation of an `Any` value uses the regular
 * representation of the deserialized, embedded message, with an
 * additional field `@type` which contains the type URL. Example:
 *
 *     package google.profile;
 *     message Person {
 *       string first_name = 1;
 *       string last_name = 2;
 *     }
 *
 *     {
 *       "@type": "type.googleapis.com/google.profile.Person",
 *       "firstName": <string>,
 *       "lastName": <string>
 *     }
 *
 * If the embedded message type is well-known and has a custom JSON
 * representation, that representation will be embedded adding a field
 * `value` which holds the custom JSON in addition to the `@type`
 * field. Example (for message [google.protobuf.Duration][]):
 *
 *     {
 *       "@type": "type.googleapis.com/google.protobuf.Duration",
 *       "value": "1.212s"
 *     }
 *
 *
 * @generated from message google.protobuf.Any
 */
class Any extends message_js_1.Message {
    constructor(data) {
        super();
        /**
         * A URL/resource name that uniquely identifies the type of the serialized
         * protocol buffer message. This string must contain at least
         * one "/" character. The last segment of the URL's path must represent
         * the fully qualified name of the type (as in
         * `path/google.protobuf.Duration`). The name should be in a canonical form
         * (e.g., leading "." is not accepted).
         *
         * In practice, teams usually precompile into the binary all types that they
         * expect it to use in the context of Any. However, for URLs which use the
         * scheme `http`, `https`, or no scheme, one can optionally set up a type
         * server that maps type URLs to message definitions as follows:
         *
         * * If no scheme is provided, `https` is assumed.
         * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
         *   value in binary format, or produce an error.
         * * Applications are allowed to cache lookup results based on the
         *   URL, or have them precompiled into a binary to avoid any
         *   lookup. Therefore, binary compatibility needs to be preserved
         *   on changes to types. (Use versioned type names to manage
         *   breaking changes.)
         *
         * Note: this functionality is not currently available in the official
         * protobuf release, and it is not used for type URLs beginning with
         * type.googleapis.com. As of May 2023, there are no widely used type server
         * implementations and no plans to implement one.
         *
         * Schemes other than `http`, `https` (or the empty scheme) might be
         * used with implementation specific semantics.
         *
         *
         * @generated from field: string type_url = 1;
         */
        this.typeUrl = "";
        /**
         * Must be a valid serialized protocol buffer of the above specified type.
         *
         * @generated from field: bytes value = 2;
         */
        this.value = new Uint8Array(0);
        proto3_js_1.proto3.util.initPartial(data, this);
    }
    toJson(options) {
        var _a;
        if (this.typeUrl === "") {
            return {};
        }
        const typeName = this.typeUrlToName(this.typeUrl);
        const messageType = (_a = options === null || options === void 0 ? void 0 : options.typeRegistry) === null || _a === void 0 ? void 0 : _a.findMessage(typeName);
        if (!messageType) {
            throw new Error(`cannot encode message google.protobuf.Any to JSON: "${this.typeUrl}" is not in the type registry`);
        }
        const message = messageType.fromBinary(this.value);
        let json = message.toJson(options);
        if (typeName.startsWith("google.protobuf.") || (json === null || Array.isArray(json) || typeof json !== "object")) {
            json = { value: json };
        }
        json["@type"] = this.typeUrl;
        return json;
    }
    fromJson(json, options) {
        var _a;
        if (json === null || Array.isArray(json) || typeof json != "object") {
            throw new Error(`cannot decode message google.protobuf.Any from JSON: expected object but got ${json === null ? "null" : Array.isArray(json) ? "array" : typeof json}`);
        }
        if (Object.keys(json).length == 0) {
            return this;
        }
        const typeUrl = json["@type"];
        if (typeof typeUrl != "string" || typeUrl == "") {
            throw new Error(`cannot decode message google.protobuf.Any from JSON: "@type" is empty`);
        }
        const typeName = this.typeUrlToName(typeUrl), messageType = (_a = options === null || options === void 0 ? void 0 : options.typeRegistry) === null || _a === void 0 ? void 0 : _a.findMessage(typeName);
        if (!messageType) {
            throw new Error(`cannot decode message google.protobuf.Any from JSON: ${typeUrl} is not in the type registry`);
        }
        let message;
        if (typeName.startsWith("google.protobuf.") && Object.prototype.hasOwnProperty.call(json, "value")) {
            message = messageType.fromJson(json["value"], options);
        }
        else {
            const copy = Object.assign({}, json);
            delete copy["@type"];
            message = messageType.fromJson(copy, options);
        }
        this.packFrom(message);
        return this;
    }
    packFrom(message) {
        this.value = message.toBinary();
        this.typeUrl = this.typeNameToUrl(message.getType().typeName);
    }
    unpackTo(target) {
        if (!this.is(target.getType())) {
            return false;
        }
        target.fromBinary(this.value);
        return true;
    }
    unpack(registry) {
        if (this.typeUrl === "") {
            return undefined;
        }
        const messageType = registry.findMessage(this.typeUrlToName(this.typeUrl));
        if (!messageType) {
            return undefined;
        }
        return messageType.fromBinary(this.value);
    }
    is(type) {
        if (this.typeUrl === '') {
            return false;
        }
        const name = this.typeUrlToName(this.typeUrl);
        let typeName = '';
        if (typeof type === 'string') {
            typeName = type;
        }
        else {
            typeName = type.typeName;
        }
        return name === typeName;
    }
    typeNameToUrl(name) {
        return `type.googleapis.com/${name}`;
    }
    typeUrlToName(url) {
        if (!url.length) {
            throw new Error(`invalid type url: ${url}`);
        }
        const slash = url.lastIndexOf("/");
        const name = slash >= 0 ? url.substring(slash + 1) : url;
        if (!name.length) {
            throw new Error(`invalid type url: ${url}`);
        }
        return name;
    }
    static pack(message) {
        const any = new Any();
        any.packFrom(message);
        return any;
    }
    static fromBinary(bytes, options) {
        return new Any().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
        return new Any().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
        return new Any().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
        return proto3_js_1.proto3.util.equals(Any, a, b);
    }
}
exports.Any = Any;
Any.runtime = proto3_js_1.proto3;
Any.typeName = "google.protobuf.Any";
Any.fields = proto3_js_1.proto3.util.newFieldList(() => [
    { no: 1, name: "type_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
]);