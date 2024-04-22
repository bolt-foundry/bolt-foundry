import { DefaultContext, Maybe, Plugin } from 'https://esm.sh/v135/@envelop/types@5.0.0/typings/index.d.ts';
export declare const useSchema: (schema: any) => Plugin;
export declare const useSchemaByContext: (schemaLoader: (context: Maybe<DefaultContext>) => any) => Plugin;
