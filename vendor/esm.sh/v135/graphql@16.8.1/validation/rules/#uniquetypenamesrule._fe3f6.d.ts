import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { SDLValidationContext } from '../ValidationContext.d.ts';
/**
 * Unique type names
 *
 * A GraphQL document is only valid if all defined types have unique names.
 */
export declare function UniqueTypeNamesRule(
  context: SDLValidationContext,
): ASTVisitor;
