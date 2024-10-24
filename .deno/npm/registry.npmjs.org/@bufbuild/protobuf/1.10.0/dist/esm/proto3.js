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
import { makeProtoRuntime } from "./private/proto-runtime.js";
import { InternalFieldList } from "./private/field-list.js";
import { scalarZeroValue } from "./private/scalars.js";
import { normalizeFieldInfos } from "./private/field-normalize.js";
/**
 * Provides functionality for messages defined with the proto3 syntax.
 */
export const proto3 = makeProtoRuntime("proto3", (fields) => {
    return new InternalFieldList(fields, (source) => normalizeFieldInfos(source, true));
}, 
// TODO merge with proto2 and initExtensionField, also see initPartial, equals, clone
(target) => {
    for (const member of target.getType().fields.byMember()) {
        if (member.opt) {
            continue;
        }
        const name = member.localName, t = target;
        if (member.repeated) {
            t[name] = [];
            continue;
        }
        switch (member.kind) {
            case "oneof":
                t[name] = { case: undefined };
                break;
            case "enum":
                t[name] = 0;
                break;
            case "map":
                t[name] = {};
                break;
            case "scalar":
                t[name] = scalarZeroValue(member.T, member.L);
                break;
            case "message":
                // message fields are always optional in proto3
                break;
        }
    }
});
