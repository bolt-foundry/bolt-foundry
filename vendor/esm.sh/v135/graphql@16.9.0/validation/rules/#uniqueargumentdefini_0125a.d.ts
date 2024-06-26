import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { SDLValidationContext } from '../ValidationContext.d.ts';
/**
 * Unique argument definition names
 *
 * A GraphQL Object or Interface type is only valid if all its fields have uniquely named arguments.
 * A GraphQL Directive is only valid if all its arguments are uniquely named.
 */
export declare function UniqueArgumentDefinitionNamesRule(
  context: SDLValidationContext,
): ASTVisitor;
