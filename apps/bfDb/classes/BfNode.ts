import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import type {
  FieldBuilder,
  FieldSpec,
} from "apps/bfDb/builders/bfDb/makeFieldBuilder.ts";

import { defineBfNode } from "apps/bfDb/builders/bfDb/defineBfNode.ts";
import { RelationBuilder } from "apps/bfDb/builders/bfDb/RelationBuilder.ts";

type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : never;

// deno-lint-ignore no-explicit-any
export type AnyBfNodeCtor = abstract new (...args: any[]) => BfNode<any>;

type PropsFromFieldSpec<F extends Record<string, FieldSpec>> = {
  [K in keyof F]: FieldValue<F[K]>;
};
export type InferProps<T extends AnyBfNodeCtor> = T extends
  { bfNodeSpec: { fields: infer F extends Record<string, FieldSpec> } }
  ? PropsFromFieldSpec<F>
  : never;

export abstract class BfNode<TProps = unknown> extends GraphQLObjectBase {
  protected _props!: TProps;
  protected _savedProps!: TProps;
  static bfNodeSpec = defineBfNode((i) => i);
  static defineBfNode<
    F extends Record<string, FieldSpec>,
    R = unknown,
  >(
    builder: (
      // deno-lint-ignore ban-types
      f: FieldBuilder<{}>,
      r: RelationBuilder,
    ) => FieldBuilder<F>,
  ): { fields: F; relations: R } {
    return defineBfNode<F, R>(builder);
  }

  get props(): TProps {
    return this._props;
  }
}
