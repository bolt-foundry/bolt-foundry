import type { Maybe } from '../jsutils/Maybe.d.ts';
import type { ObjMap } from '../jsutils/ObjMap.d.ts';
import type { ValueNode } from '../language/ast.d.ts';
import type { GraphQLInputType } from '../type/definition.d.ts';
/**
 * Produces a JavaScript value given a GraphQL Value AST.
 *
 * A GraphQL type must be provided, which will be used to interpret different
 * GraphQL Value literals.
 *
 * Returns `undefined` when the value could not be validly coerced according to
 * the provided type.
 *
 * | GraphQL Value        | JSON Value    |
 * | -------------------- | ------------- |
 * | Input Object         | Object        |
 * | List                 | Array         |
 * | Boolean              | Boolean       |
 * | String               | String        |
 * | Int / Float          | Number        |
 * | Enum Value           | Unknown       |
 * | NullValue            | null          |
 *
 */
export declare function valueFromAST(
  valueNode: Maybe<ValueNode>,
  type: GraphQLInputType,
  variables?: Maybe<ObjMap<unknown>>,
): unknown;
