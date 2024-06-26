import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { ValidationContext } from '../ValidationContext.d.ts';
/**
 * Variables are input types
 *
 * A GraphQL operation is only valid if all the variables it defines are of
 * input types (scalar, enum, or input object).
 *
 * See https://spec.graphql.org/draft/#sec-Variables-Are-Input-Types
 */
export declare function VariablesAreInputTypesRule(
  context: ValidationContext,
): ASTVisitor;
