import type { ASTVisitor } from '../../language/visitor.d.ts';
import type {
  SDLValidationContext,
  ValidationContext,
} from '../ValidationContext.d.ts';
/**
 * Unique directive names per location
 *
 * A GraphQL document is only valid if all non-repeatable directives at
 * a given location are uniquely named.
 *
 * See https://spec.graphql.org/draft/#sec-Directives-Are-Unique-Per-Location
 */
export declare function UniqueDirectivesPerLocationRule(
  context: ValidationContext | SDLValidationContext,
): ASTVisitor;
