import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { ASTValidationContext } from '../ValidationContext.d.ts';
/**
 * Unique operation names
 *
 * A GraphQL document is only valid if all defined operations have unique names.
 *
 * See https://spec.graphql.org/draft/#sec-Operation-Name-Uniqueness
 */
export declare function UniqueOperationNamesRule(
  context: ASTValidationContext,
): ASTVisitor;
