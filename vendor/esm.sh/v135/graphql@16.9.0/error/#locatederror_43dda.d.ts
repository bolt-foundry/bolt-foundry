import type { Maybe } from '../jsutils/Maybe.d.ts';
import type { ASTNode } from '../language/ast.d.ts';
import { GraphQLError } from './GraphQLError.d.ts';
/**
 * Given an arbitrary value, presumably thrown while attempting to execute a
 * GraphQL operation, produce a new GraphQLError aware of the location in the
 * document responsible for the original Error.
 */
export declare function locatedError(
  rawOriginalError: unknown,
  nodes: ASTNode | ReadonlyArray<ASTNode> | undefined | null,
  path?: Maybe<ReadonlyArray<string | number>>,
): GraphQLError;
