import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { ValidationContext } from '../ValidationContext.d.ts';
/**
 * No unused variables
 *
 * A GraphQL operation is only valid if all variables defined by an operation
 * are used, either directly or within a spread fragment.
 *
 * See https://spec.graphql.org/draft/#sec-All-Variables-Used
 */
export declare function NoUnusedVariablesRule(
  context: ValidationContext,
): ASTVisitor;
