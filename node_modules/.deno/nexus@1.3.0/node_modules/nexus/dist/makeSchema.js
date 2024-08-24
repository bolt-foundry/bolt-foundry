"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchema = exports.makeSchema = void 0;
const tslib_1 = require("tslib");
const builder_1 = require("./builder");
const typegenMetadata_1 = require("./typegenMetadata");
const typegenUtils_1 = require("./typegenUtils");
const utils_1 = require("./utils");
/**
 * Defines the GraphQL schema, by combining the GraphQL types defined by the GraphQL Nexus layer or any
 * manually defined GraphQLType objects.
 *
 * Requires at least one type be named "Query", which will be used as the root query type.
 */
function makeSchema(config) {
    const { schema, missingTypes, finalConfig } = (0, builder_1.makeSchemaInternal)(config);
    const typegenConfig = (0, typegenUtils_1.resolveTypegenConfig)(finalConfig);
    const sdl = typegenConfig.outputs.schema;
    const typegen = typegenConfig.outputs.typegen;
    if (sdl || typegen) {
        // Generating in the next tick allows us to use the schema
        // in the optional thunk for the typegen config
        const typegenPromise = new typegenMetadata_1.TypegenMetadata(typegenConfig).generateArtifacts(schema);
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
    (0, utils_1.assertNoMissingTypes)(schema, missingTypes);
    (0, utils_1.runAbstractTypeRuntimeChecks)(schema, finalConfig.features);
    return schema;
}
exports.makeSchema = makeSchema;
/** Like makeSchema except that typegen is always run and waited upon. */
function generateSchema(config) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { schema, missingTypes, finalConfig } = (0, builder_1.makeSchemaInternal)(config);
        const typegenConfig = (0, typegenUtils_1.resolveTypegenConfig)(finalConfig);
        yield new typegenMetadata_1.TypegenMetadata(typegenConfig).generateArtifacts(schema);
        (0, utils_1.assertNoMissingTypes)(schema, missingTypes);
        (0, utils_1.runAbstractTypeRuntimeChecks)(schema, finalConfig.features);
        return schema;
    });
}
exports.generateSchema = generateSchema;
/**
 * Mainly useful for testing, generates the schema and returns the artifacts that would have been otherwise
 * written to the filesystem.
 */
generateSchema.withArtifacts = (config, typegen = null) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { schema, missingTypes, finalConfig } = (0, builder_1.makeSchemaInternal)(config);
    const typegenConfig = (0, typegenUtils_1.resolveTypegenConfig)(finalConfig);
    const { schemaTypes, tsTypes, globalTypes } = yield new typegenMetadata_1.TypegenMetadata(typegenConfig).generateArtifactContents(schema, typegen);
    (0, utils_1.assertNoMissingTypes)(schema, missingTypes);
    (0, utils_1.runAbstractTypeRuntimeChecks)(schema, finalConfig.features);
    return { schema, schemaTypes, tsTypes, globalTypes };
});
//# sourceMappingURL=makeSchema.js.map