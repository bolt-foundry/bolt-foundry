import { ZodDiscriminatedUnionDef, ZodUnionDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export declare const primitiveMappings: {
    readonly ZodString: "string";
    readonly ZodNumber: "number";
    readonly ZodBigInt: "integer";
    readonly ZodBoolean: "boolean";
    readonly ZodNull: "null";
};
type JsonSchema7Primitive = (typeof primitiveMappings)[keyof typeof primitiveMappings];
export type JsonSchema7UnionType = JsonSchema7PrimitiveUnionType | JsonSchema7AnyOfType;
type JsonSchema7PrimitiveUnionType = {
    type: JsonSchema7Primitive | JsonSchema7Primitive[];
} | {
    type: JsonSchema7Primitive | JsonSchema7Primitive[];
    enum: (string | number | bigint | boolean | null)[];
};
type JsonSchema7AnyOfType = {
    anyOf: JsonSchema7Type[];
};
export declare function parseUnionDef(def: ZodUnionDef | ZodDiscriminatedUnionDef<any, any>, refs: Refs): JsonSchema7PrimitiveUnionType | JsonSchema7AnyOfType | undefined;
export {};
