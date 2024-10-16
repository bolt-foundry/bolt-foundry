import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { ASTValidationContext } from '../ValidationContext.d.ts';
/**
 * Unique input field names
 *
 * A GraphQL input object value is only valid if all supplied fields are
 * uniquely named.
 *
 * See https://spec.graphql.org/draft/#sec-Input-Object-Field-Uniqueness
 */
export declare function UniqueInputFieldNamesRule(
  context: ASTValidationContext,
): ASTVisitor;
