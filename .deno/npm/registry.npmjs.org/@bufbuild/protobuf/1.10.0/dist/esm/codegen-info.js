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
import { localName, safeIdentifier, safeObjectProperty, } from "./private/names.js";
import { getUnwrappedFieldType } from "./private/field-wrapper.js";
import { scalarZeroValue } from "./private/scalars.js";
import { reifyWkt } from "./private/reify-wkt.js";
import { LongType, ScalarType } from "./scalar.js";
const packageName = "@bufbuild/protobuf";
export const codegenInfo = {
    packageName: "@bufbuild/protobuf",
    localName,
    reifyWkt,
    getUnwrappedFieldType,
    scalarDefaultValue: scalarZeroValue,
    scalarZeroValue,
    safeIdentifier,
    safeObjectProperty,
    // prettier-ignore
    symbols: {
        proto2: { typeOnly: false, privateImportPath: "./proto2.js", publicImportPath: packageName },
        proto3: { typeOnly: false, privateImportPath: "./proto3.js", publicImportPath: packageName },
        Message: { typeOnly: false, privateImportPath: "./message.js", publicImportPath: packageName },
        PartialMessage: { typeOnly: true, privateImportPath: "./message.js", publicImportPath: packageName },
        PlainMessage: { typeOnly: true, privateImportPath: "./message.js", publicImportPath: packageName },
        FieldList: { typeOnly: true, privateImportPath: "./field-list.js", publicImportPath: packageName },
        MessageType: { typeOnly: true, privateImportPath: "./message-type.js", publicImportPath: packageName },
        Extension: { typeOnly: true, privateImportPath: "./extension.js", publicImportPath: packageName },
        BinaryReadOptions: { typeOnly: true, privateImportPath: "./binary-format.js", publicImportPath: packageName },
        BinaryWriteOptions: { typeOnly: true, privateImportPath: "./binary-format.js", publicImportPath: packageName },
        JsonReadOptions: { typeOnly: true, privateImportPath: "./json-format.js", publicImportPath: packageName },
        JsonWriteOptions: { typeOnly: true, privateImportPath: "./json-format.js", publicImportPath: packageName },
        JsonValue: { typeOnly: true, privateImportPath: "./json-format.js", publicImportPath: packageName },
        JsonObject: { typeOnly: true, privateImportPath: "./json-format.js", publicImportPath: packageName },
        protoDouble: { typeOnly: false, privateImportPath: "./proto-double.js", publicImportPath: packageName },
        protoInt64: { typeOnly: false, privateImportPath: "./proto-int64.js", publicImportPath: packageName },
        ScalarType: { typeOnly: false, privateImportPath: "./scalar.js", publicImportPath: packageName },
        LongType: { typeOnly: false, privateImportPath: "./scalar.js", publicImportPath: packageName },
        MethodKind: { typeOnly: false, privateImportPath: "./service-type.js", publicImportPath: packageName },
        MethodIdempotency: { typeOnly: false, privateImportPath: "./service-type.js", publicImportPath: packageName },
        IMessageTypeRegistry: { typeOnly: true, privateImportPath: "./type-registry.js", publicImportPath: packageName },
    },
    wktSourceFiles: [
        "google/protobuf/compiler/plugin.proto",
        "google/protobuf/any.proto",
        "google/protobuf/api.proto",
        "google/protobuf/descriptor.proto",
        "google/protobuf/duration.proto",
        "google/protobuf/empty.proto",
        "google/protobuf/field_mask.proto",
        "google/protobuf/source_context.proto",
        "google/protobuf/struct.proto",
        "google/protobuf/timestamp.proto",
        "google/protobuf/type.proto",
        "google/protobuf/wrappers.proto",
    ],
};
