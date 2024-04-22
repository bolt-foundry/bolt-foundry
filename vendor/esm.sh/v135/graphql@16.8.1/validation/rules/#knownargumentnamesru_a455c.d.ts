import type { ASTVisitor } from '../../language/visitor.d.ts';
import type {
  SDLValidationContext,
  ValidationContext,
} from '../ValidationContext.d.ts';
/**
 * Known argument names
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 *
 * See https://spec.graphql.org/draft/#sec-Argument-Names
 * See https://spec.graphql.org/draft/#sec-Directives-Are-In-Valid-Locations
 */
export declare function KnownArgumentNamesRule(
  context: ValidationContext,
): ASTVisitor;
/**
 * @internal
 */
export declare function KnownArgumentNamesOnDirectivesRule(
  context: ValidationContext | SDLValidationContext,
): ASTVisitor;
