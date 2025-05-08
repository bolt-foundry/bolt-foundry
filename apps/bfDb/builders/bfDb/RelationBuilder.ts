import type { AnyBfNodeCtor } from "apps/bfDb/classes/BfNode.ts";

export type RelationBuilder = {
  toOne<N extends string, Ctor extends AnyBfNodeCtor>(n: N, t: Ctor): void;
  toMany<N extends string, Ctor extends AnyBfNodeCtor>(n: N, t: Ctor): void;
};

export const makeRelationBuilder = (_: unknown[]): RelationBuilder => ({
  toOne() {},
  toMany() {},
});
