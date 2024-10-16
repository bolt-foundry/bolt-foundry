import type { ASTVisitor } from '../../language/visitor.d.ts';
import type {
  SDLValidationContext,
  ValidationContext,
} from '../ValidationContext.d.ts';
/**
 * Known type names
 *
 * A GraphQL document is only valid if referenced types (specifically
 * variable definitions and fragment conditions) are defined by the type schema.
 *
 * See https://spec.graphql.org/draft/#sec-Fragment-Spread-Type-Existence
 */
export declare function KnownTypeNamesRule(
  context: ValidationContext | SDLValidationContext,
): ASTVisitor;
