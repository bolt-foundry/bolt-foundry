import { ZodMapDef, ZodRecordDef, ZodTypeAny } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
import { JsonSchema7EnumType } from "./enum.d.ts";
import { JsonSchema7StringType } from "./string.d.ts";
type JsonSchema7RecordPropertyNamesType = Omit<JsonSchema7StringType, "type"> | Omit<JsonSchema7EnumType, "type">;
export type JsonSchema7RecordType = {
    type: "object";
    additionalProperties: JsonSchema7Type;
    propertyNames?: JsonSchema7RecordPropertyNamesType;
};
export declare function parseRecordDef(def: ZodRecordDef<ZodTypeAny, ZodTypeAny> | ZodMapDef, refs: Refs): JsonSchema7RecordType;
export {};
