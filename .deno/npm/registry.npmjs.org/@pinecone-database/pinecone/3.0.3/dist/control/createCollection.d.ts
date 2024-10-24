import { CollectionModel, CreateCollectionRequest, ManageIndexesApi } from '../pinecone-generated-ts-fetch/control';
type CreateCollectionRequestType = keyof CreateCollectionRequest;
export declare const CreateCollectionRequestProperties: CreateCollectionRequestType[];
export declare const createCollection: (api: ManageIndexesApi) => (options: CreateCollectionRequest) => Promise<CollectionModel>;
export {};
