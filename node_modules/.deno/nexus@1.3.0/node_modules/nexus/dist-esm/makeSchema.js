import { __awaiter } from "tslib";
import { makeSchemaInternal } from './builder';
import { TypegenMetadata } from './typegenMetadata';
import { resolveTypegenConfig } from './typegenUtils';
import { assertNoMissingTypes, runAbstractTypeRuntimeChecks } from './utils';
/**
 * Defines the GraphQL schema, by combining the GraphQL types defined by the GraphQL Nexus layer or any
 * manually defined GraphQLType objects.
 *
 * Requires at least one type be named "Query", which will be used as the root query type.
 */
export function makeSchema(config) {
    const { schema, missingTypes, finalConfig } = makeSchemaInternal(config);
    const typegenConfig = resolveTypegenConfig(finalConfig);
    const sdl = typegenConfig.outputs.schema;
    const typegen = typegenConfig.outputs.typegen;
    if (sdl || typegen) {
        // Generating in the next tick allows us to use the schema
        // in the optional thunk for the typegen config
        const typegenPromise = new TypegenMetadata(typegenConfig).generateArtifacts(schema);
        if (config.shouldExitAfterGenerateArtifacts) {
            let typegenPath = '(not enabled)';
            if (typegenConfig.outputs.typegen) {
                typegenPath = typegenConfig.outputs.typegen.outputPath;
                if (typegenConfig.outputs.typegen.globalsPath) {
                    typegenPath += ` / ${typegenConfig.outputs.typegen.globalsPath}`;
                }
            }
            typegenPromise
                .then(() => {
                console.log(`Generated Artifacts:
          TypeScript Types  ==> ${typegenPath}
          GraphQL Schema    ==> ${typegenConfig.outputs.schema || '(not enabled)'}`);
                process.exit(0);
            })
                .catch((e) => {
                console.error(e);
                process.exit(1);
            });
        }
        else {
            typegenPromise.catch((e) => {
                console.error(e);
            });
        }
    }
    assertNoMissingTypes(schema, missingTypes);
    runAbstractTypeRuntimeChecks(schema, finalConfig.features);
    return schema;
}
/** Like makeSchema except that typegen is always run and waited upon. */
export function generateSchema(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { schema, missingTypes, finalConfig } = makeSchemaInternal(config);
        const typegenConfig = resolveTypegenConfig(finalConfig);
        yield new TypegenMetadata(typegenConfig).generateArtifacts(schema);
        assertNoMissingTypes(schema, missingTypes);
        runAbstractTypeRuntimeChecks(schema, finalConfig.features);
        return schema;
    });
}
/**
 * Mainly useful for testing, generates the schema and returns the artifacts that would have been otherwise
 * written to the filesystem.
 */
generateSchema.withArtifacts = (config, typegen = null) => __awaiter(void 0, void 0, void 0, function* () {
    const { schema, missingTypes, finalConfig } = makeSchemaInternal(config);
    const typegenConfig = resolveTypegenConfig(finalConfig);
    const { schemaTypes, tsTypes, globalTypes } = yield new TypegenMetadata(typegenConfig).generateArtifactContents(schema, typegen);
    assertNoMissingTypes(schema, missingTypes);
    runAbstractTypeRuntimeChecks(schema, finalConfig.features);
    return { schema, schemaTypes, tsTypes, globalTypes };
});
//# sourceMappingURL=makeSchema.js.map