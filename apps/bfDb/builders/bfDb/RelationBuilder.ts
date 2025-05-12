// apps/bfDb/builders/bfDb/RelationBuilder.ts
import type { AnyBfNodeCtor } from "apps/bfDb/classes/BfNode.ts";
import type { Cardinality, FieldSpec, RelationSpec } from "./types.ts";

export class RelationBuilder<
  // cumulative map of relations we’ve added so far
  R extends Record<string, RelationSpec> = {},
> {
  /** internal bag that the fluent API mutates */
  private _specs: Record<string, RelationSpec>;

  constructor(specs: Record<string, RelationSpec> = {}) {
    this._specs = specs;
  }

  /** called by FieldBuilder to expose the finished specs */
  _done() {
    return this._specs as R;
  }

  relation<
    N extends string,
    // eslint-ignore ban-types – we really want an empty object default
    NR extends RelationSpec = RelationSpec,
  >(
    name: N,
    target: () => AnyBfNodeCtor,
    edge: (e: EdgeBuilder<{}>) => EdgeBuilder<NR["props"]>,
  ): RelationBuilder<
    // accumulate relation map
    & R
    & { [K in N]: RelationSpec }
  > {
    const edgeBuilder = edge(new EdgeBuilder());
    const { _edgeProps, _cardinality } = edgeBuilder._done();
    this._specs[name] = {
      direction: "out",
      cardinality: _cardinality,
      target,
      props: _edgeProps,
    };
    // return a *new* builder for generic growth
    return new RelationBuilder(this._specs) as unknown as RelationBuilder<
      & R
      & { [K in N]: RelationSpec }
    >;
  }
}

/* ---------- helper for per-edge props ---------- */

class EdgeBuilder<
  P extends Record<string, FieldSpec> = {},
> {
  _edgeProps: Record<string, FieldSpec> = {};
  _cardinality: Cardinality = "one";

  string<N extends string>(
    name: N,
  ): EdgeBuilder<P & { [K in N]: { kind: "string" } }> {
    this._edgeProps[name] = { kind: "string" };
    return this as unknown as EdgeBuilder<
      P & { [K in N]: { kind: "string" } }
    >;
  }

  number<N extends string>(
    name: N,
  ): EdgeBuilder<P & { [K in N]: { kind: "number" } }> {
    this._edgeProps[name] = { kind: "number" };
    return this as unknown as EdgeBuilder<
      P & { [K in N]: { kind: "number" } }
    >;
  }

  many() {
    this._cardinality = "many";
    return this;
  }

  _done() {
    return { _edgeProps: this._edgeProps, _cardinality: this._cardinality };
  }
}
