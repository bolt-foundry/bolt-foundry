import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { ValidationContext } from '../ValidationContext.d.ts';
/**
 * Fields on correct type
 *
 * A GraphQL document is only valid if all fields selected are defined by the
 * parent type, or are an allowed meta field such as __typename.
 *
 * See https://spec.graphql.org/draft/#sec-Field-Selections
 */
export declare function FieldsOnCorrectTypeRule(
  context: ValidationContext,
): ASTVisitor;
