import { DocumentNode, OperationDefinitionNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { ExecutionRequest } from './Interfaces.d.ts';
export declare function getOperationASTFromDocument(documentNode: DocumentNode, operationName?: string): OperationDefinitionNode;
export declare const getOperationASTFromRequest: (request: ExecutionRequest) => OperationDefinitionNode;
