import type { ObjMap } from '../jsutils/ObjMap.d.ts';
import type { DocumentNode } from '../language/ast.d.ts';
/**
 * separateOperations accepts a single AST document which may contain many
 * operations and fragments and returns a collection of AST documents each of
 * which contains a single operation as well the fragment definitions it
 * refers to.
 */
export declare function separateOperations(
  documentAST: DocumentNode,
): ObjMap<DocumentNode>;
