import { ArgumentNode, GraphQLInputType, VariableDefinitionNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export declare function updateArgument(argumentNodes: Record<string, ArgumentNode>, variableDefinitionsMap: Record<string, VariableDefinitionNode>, variableValues: Record<string, any>, argName: string, varName: string, type: GraphQLInputType, value: any): void;
export declare function createVariableNameGenerator(variableDefinitionMap: Record<string, VariableDefinitionNode>): (argName: string) => string;
