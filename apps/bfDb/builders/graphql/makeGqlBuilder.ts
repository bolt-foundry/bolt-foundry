import type { GraphQLInputType, GraphQLResolveInfo } from "graphql";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/builders/bfDb/types.ts";

type ThisNode = InstanceType<AnyBfNodeCtor>;

type MaybePromise<T> = T | Promise<T>;

/** Generic placeholder for a mutation's payload */
type NMutationPayload = Record<string, unknown>;

type ArgsBuilder = {
  string(name: string): ArgsBuilder;
  int(name: string): ArgsBuilder;
  float(name: string): ArgsBuilder;
  boolean(name: string): ArgsBuilder;
  id(name: string): ArgsBuilder;
};

export interface GqlBuilder<
  R extends Record<string, unknown> = Record<string, unknown>,
> {
  string<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<string>;
    },
  ): GqlBuilder;

  int<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<number>;
    },
  ): GqlBuilder;

  boolean<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<boolean>;
    },
  ): GqlBuilder;

  id<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<string>;
    },
  ): GqlBuilder;

  object<N extends keyof R & string>(name: N, opts?: {
    args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
    resolve?: (
      root: ThisNode,
      args: Record<string, unknown>,
      ctx: BfGraphqlContext,
      info: GraphQLResolveInfo,
    ) => MaybePromise<R[N]>;
  }): GqlBuilder;

  connection<N extends keyof R & string>(
    name: N,
    opts?: {
      additionalArgs?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
      resolve?: (
        root: ThisNode,
        args: ConnectionArguments & Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<Connection<ThisNode>>;
    },
  ): GqlBuilder;

  mutation<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<NMutationPayload>;
    },
  ): GqlBuilder;

  _spec: {
    fields: Record<string, unknown>;
    relations: Record<string, unknown>;
  };
}

export function makeGqlBuilder(): GqlBuilder {
  // Initial implementation scaffold
  const builder: GqlBuilder = {
    string(_name, _opts) {
      return this;
    },
    int(_name, _opts) {
      return this;
    },
    boolean(_name, _opts) {
      return this;
    },
    id(_name, _opts) {
      return this;
    },
    object(_name, _opts) {
      return this;
    },
    connection(_name, _opts) {
      return this;
    },
    mutation(_name, _opts) {
      return this;
    },
    _spec: {
      fields: {},
      relations: {},
    },
  };

  return builder;
}
