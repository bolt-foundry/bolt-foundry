import { ZodOptionalDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export declare const parseOptionalDef: (def: ZodOptionalDef, refs: Refs) => JsonSchema7Type | undefined;
