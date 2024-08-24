import { ZodPipelineDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
import { JsonSchema7AllOfType } from "./intersection.d.ts";
export declare const parsePipelineDef: (def: ZodPipelineDef<any, any>, refs: Refs) => JsonSchema7AllOfType | JsonSchema7Type | undefined;
