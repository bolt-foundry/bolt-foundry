import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { SDLValidationContext } from '../ValidationContext.d.ts';
/**
 * Unique directive names
 *
 * A GraphQL document is only valid if all defined directives have unique names.
 */
export declare function UniqueDirectiveNamesRule(
  context: SDLValidationContext,
): ASTVisitor;
