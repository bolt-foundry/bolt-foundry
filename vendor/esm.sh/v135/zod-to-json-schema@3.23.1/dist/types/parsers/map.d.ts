import { ZodMapDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
import { JsonSchema7RecordType } from "./record.d.ts";
export type JsonSchema7MapType = {
    type: "array";
    maxItems: 125;
    items: {
        type: "array";
        items: [JsonSchema7Type, JsonSchema7Type];
        minItems: 2;
        maxItems: 2;
    };
};
export declare function parseMapDef(def: ZodMapDef, refs: Refs): JsonSchema7MapType | JsonSchema7RecordType;
