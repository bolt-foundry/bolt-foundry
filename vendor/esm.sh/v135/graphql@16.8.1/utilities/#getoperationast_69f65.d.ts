import type { Maybe } from '../jsutils/Maybe.d.ts';
import type { DocumentNode, OperationDefinitionNode } from '../language/ast.d.ts';
/**
 * Returns an operation AST given a document AST and optionally an operation
 * name. If a name is not provided, an operation is only returned if only one is
 * provided in the document.
 */
export declare function getOperationAST(
  documentAST: DocumentNode,
  operationName?: Maybe<string>,
): Maybe<OperationDefinitionNode>;
