import { ZodObjectDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7ObjectType = {
    type: "object";
    properties: Record<string, JsonSchema7Type>;
    additionalProperties: boolean | JsonSchema7Type;
    required?: string[];
};
export declare function parseObjectDefX(def: ZodObjectDef, refs: Refs): JsonSchema7ObjectType;
export declare function parseObjectDef(def: ZodObjectDef, refs: Refs): JsonSchema7ObjectType;
