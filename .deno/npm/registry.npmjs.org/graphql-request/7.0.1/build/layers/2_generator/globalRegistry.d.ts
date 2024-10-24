import type { Values } from '../../lib/prelude.js';
import type { TSError } from '../../lib/TSError.js';
import type { Schema } from '../1_Schema/__.js';
declare global {
    export namespace GraphQLRequestTypes {
        interface Schemas {
        }
    }
}
export type GlobalRegistry = Record<string, {
    index: Schema.Index;
    customScalars: Record<string, Schema.Scalar.Scalar>;
    featureOptions: {
        schemaErrors: boolean;
    };
}>;
export declare namespace GlobalRegistry {
    type Schemas = GraphQLRequestTypes.Schemas;
    type SchemaList = Values<Schemas>;
    type DefaultSchemaName = 'default';
    type SchemaNames = keyof GraphQLRequestTypes.Schemas extends never ? TSError<'SchemaNames', 'No schemas have been registered. Did you run graphql-request generate?'> : keyof GraphQLRequestTypes.Schemas;
    type HasSchemaErrors<$Schema extends SchemaList> = $Schema['featureOptions']['schemaErrors'];
    type HasSchemaErrorsViaName<$Name extends SchemaNames> = GraphQLRequestTypes.Schemas[$Name]['featureOptions']['schemaErrors'];
    type GetSchemaIndex<$Name extends SchemaNames> = GraphQLRequestTypes.Schemas[$Name]['index'];
    type SchemaIndexDefault = GetSchemaIndex<DefaultSchemaName>;
    type GetSchemaIndexOrDefault<$Name extends SchemaNames | undefined> = $Name extends SchemaNames ? GetSchemaIndex<$Name> : SchemaIndexDefault;
}
//# sourceMappingURL=globalRegistry.d.ts.map