import { GraphQLInputType } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { InputLeafValueTransformer, InputObjectValueTransformer, Maybe } from './types.d.ts';
export declare function transformInputValue(type: GraphQLInputType, value: any, inputLeafValueTransformer?: Maybe<InputLeafValueTransformer>, inputObjectValueTransformer?: Maybe<InputObjectValueTransformer>): any;
export declare function serializeInputValue(type: GraphQLInputType, value: any): any;
export declare function parseInputValue(type: GraphQLInputType, value: any): any;
export declare function parseInputValueLiteral(type: GraphQLInputType, value: any): any;
