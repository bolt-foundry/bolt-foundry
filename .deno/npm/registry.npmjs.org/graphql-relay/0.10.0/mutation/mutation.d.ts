import type {
  GraphQLFieldConfig,
  GraphQLFieldExtensions,
  GraphQLInputFieldConfig,
  GraphQLResolveInfo,
  ThunkObjMap,
} from 'graphql';
declare type MutationFn = (
  object: any,
  ctx: any,
  info: GraphQLResolveInfo,
) => unknown;
/**
 * A description of a mutation consumable by mutationWithClientMutationId
 * to create a GraphQLFieldConfig for that mutation.
 *
 * The inputFields and outputFields should not include `clientMutationId`,
 * as this will be provided automatically.
 *
 * An input object will be created containing the input fields, and an
 * object will be created containing the output fields.
 *
 * mutateAndGetPayload will receive an Object with a key for each
 * input field, and it should return an Object with a key for each
 * output field. It may return synchronously, or return a Promise.
 */
interface MutationConfig {
  name: string;
  description?: string;
  deprecationReason?: string;
  extensions?: GraphQLFieldExtensions<any, any>;
  inputFields: ThunkObjMap<GraphQLInputFieldConfig>;
  outputFields: ThunkObjMap<GraphQLFieldConfig<any, any>>;
  mutateAndGetPayload: MutationFn;
}
/**
 * Returns a GraphQLFieldConfig for the mutation described by the
 * provided MutationConfig.
 */
export declare function mutationWithClientMutationId(
  config: MutationConfig,
): GraphQLFieldConfig<unknown, unknown>;
export {};
