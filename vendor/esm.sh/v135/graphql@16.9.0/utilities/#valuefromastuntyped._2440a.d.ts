import type { Maybe } from '../jsutils/Maybe.d.ts';
import type { ObjMap } from '../jsutils/ObjMap.d.ts';
import type { ValueNode } from '../language/ast.d.ts';
/**
 * Produces a JavaScript value given a GraphQL Value AST.
 *
 * Unlike `valueFromAST()`, no type is provided. The resulting JavaScript value
 * will reflect the provided GraphQL value AST.
 *
 * | GraphQL Value        | JavaScript Value |
 * | -------------------- | ---------------- |
 * | Input Object         | Object           |
 * | List                 | Array            |
 * | Boolean              | Boolean          |
 * | String / Enum        | String           |
 * | Int / Float          | Number           |
 * | Null                 | null             |
 *
 */
export declare function valueFromASTUntyped(
  valueNode: ValueNode,
  variables?: Maybe<ObjMap<unknown>>,
): unknown;
