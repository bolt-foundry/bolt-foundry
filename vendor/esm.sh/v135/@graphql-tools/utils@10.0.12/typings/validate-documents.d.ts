import { ASTVisitor, DocumentNode, GraphQLSchema, ValidationContext } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export type ValidationRule = (context: ValidationContext) => ASTVisitor;
export declare function validateGraphQlDocuments(schema: GraphQLSchema, documents: DocumentNode[], rules?: ValidationRule[]): readonly import("https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts").GraphQLError[];
export declare function createDefaultRules(): import("https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts").ValidationRule[];
