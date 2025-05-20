import { ZodEffectsDef } from 'npm:zod@3';
import { JsonSchema7Type, parseDef } from '../parseDef.ts';
import { Refs } from '../Refs.ts';

export function parseEffectsDef(
  _def: ZodEffectsDef,
  refs: Refs,
  forceResolution: boolean,
): JsonSchema7Type | undefined {
  return refs.effectStrategy === 'input' ? parseDef(_def.schema._def, refs, forceResolution) : {};
}
