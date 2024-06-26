import type { ASTVisitor } from '../../language/visitor.d.ts';
import type { ASTValidationContext } from '../ValidationContext.d.ts';
export declare function MaxIntrospectionDepthRule(
  context: ASTValidationContext,
): ASTVisitor;
