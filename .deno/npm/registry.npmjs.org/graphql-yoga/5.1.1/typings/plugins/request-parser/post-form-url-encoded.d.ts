import { GraphQLParams } from '../../types.js';
export declare function isPOSTFormUrlEncodedRequest(request: Request): boolean;
export declare function parsePOSTFormUrlEncodedRequest(request: Request): Promise<GraphQLParams>;
