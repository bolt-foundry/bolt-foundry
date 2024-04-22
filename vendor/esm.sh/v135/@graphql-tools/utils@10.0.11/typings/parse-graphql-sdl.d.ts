import { ASTNode, DocumentNode, StringValueNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { GraphQLParseOptions } from './Interfaces.d.ts';
export declare function parseGraphQLSDL(location: string | undefined, rawSDL: string, options?: GraphQLParseOptions): {
    location: string | undefined;
    document: DocumentNode;
};
export declare function transformCommentsToDescriptions(sourceSdl: string, options?: GraphQLParseOptions): DocumentNode;
type DiscriminateUnion<T, U> = T extends U ? T : never;
type DescribableASTNodes = DiscriminateUnion<ASTNode, {
    description?: StringValueNode;
}>;
export declare function isDescribable(node: ASTNode): node is DescribableASTNodes;
export {};
