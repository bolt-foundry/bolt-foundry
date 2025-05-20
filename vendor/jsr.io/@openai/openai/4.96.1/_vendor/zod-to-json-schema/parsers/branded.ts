import { ZodBrandedDef } from 'npm:zod@3';
import { parseDef } from '../parseDef.ts';
import { Refs } from '../Refs.ts';

export function parseBrandedDef(_def: ZodBrandedDef<any>, refs: Refs) {
  return parseDef(_def.type._def, refs);
}
