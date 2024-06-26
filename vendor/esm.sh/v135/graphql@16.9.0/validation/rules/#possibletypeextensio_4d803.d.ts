import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { SDLValidationContext } from '../ValidationContext.d.ts';
/**
 * Possible type extension
 *
 * A type extension is only valid if the type is defined and has the same kind.
 */
export declare function PossibleTypeExtensionsRule(
  context: SDLValidationContext,
): ASTVisitor;
