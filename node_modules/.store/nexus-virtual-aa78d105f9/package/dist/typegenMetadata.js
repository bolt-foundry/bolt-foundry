"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypegenMetadata = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const path = (0, tslib_1.__importStar)(require("path"));
const lang_1 = require("./lang");
const typegenAutoConfig_1 = require("./typegenAutoConfig");
const typegenFormatPrettier_1 = require("./typegenFormatPrettier");
const typegenPrinter_1 = require("./typegenPrinter");
/**
 * Passed into the SchemaBuilder, this keeps track of any necessary field / type metadata we need to be aware
 * of when building the generated types and/or SDL artifact, including but not limited to:
 */
class TypegenMetadata {
    constructor(config) {
        this.config = config;
    }
    /** Generates the artifacts of the build based on what we know about the schema and how it was defined. */
    generateArtifacts(schema) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const sortedSchema = this.sortSchema(schema);
            const { typegen } = this.config.outputs;
            if (this.config.outputs.schema || typegen) {
                const { schemaTypes, tsTypes, globalTypes } = yield this.generateArtifactContents(sortedSchema, typegen);
                if (this.config.outputs.schema) {
                    yield this.writeFile('schema', schemaTypes, this.config.outputs.schema);
                }
                if (typegen) {
                    if (typeof typegen === 'string') {
                        yield this.writeFile('types', tsTypes, typegen);
                    }
                    else {
                        yield this.writeFile('types', tsTypes, typegen.outputPath);
                        if (typeof typegen.globalsPath === 'string') {
                            yield this.writeFile('types', globalTypes !== null && globalTypes !== void 0 ? globalTypes : '', typegen.globalsPath);
                        }
                    }
                }
            }
        });
    }
    generateArtifactContents(schema, typegen) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = {
                schemaTypes: this.generateSchemaFile(schema),
                tsTypes: '',
                globalTypes: null,
            };
            if (!typegen) {
                return result;
            }
            if (typeof typegen === 'string') {
                result.tsTypes = yield this.generateTypesFile(schema, typegen);
            }
            else {
                const generateResult = yield this.generateConfiguredTypes(schema, typegen);
                result.tsTypes = generateResult.tsTypes;
                result.globalTypes = generateResult.globalTypes;
            }
            return result;
        });
    }
    sortSchema(schema) {
        let sortedSchema = schema;
        if (typeof graphql_1.lexicographicSortSchema !== 'undefined') {
            sortedSchema = (0, graphql_1.lexicographicSortSchema)(schema);
        }
        return sortedSchema;
    }
    writeFile(type, output, filePath) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (typeof filePath !== 'string' || !path.isAbsolute(filePath)) {
                return Promise.reject(new Error(`Expected an absolute path to output the Nexus ${type}, saw ${filePath}`));
            }
            const fs = require('fs');
            const util = require('util');
            const [readFile, writeFile, removeFile, mkdir] = [
                util.promisify(fs.readFile),
                util.promisify(fs.writeFile),
                util.promisify(fs.unlink),
                util.promisify(fs.mkdir),
            ];
            let formatTypegen = null;
            if (typeof this.config.formatTypegen === 'function') {
                formatTypegen = this.config.formatTypegen;
            }
            else if (this.config.prettierConfig) {
                formatTypegen = (0, typegenFormatPrettier_1.typegenFormatPrettier)(this.config.prettierConfig);
            }
            const content = typeof formatTypegen === 'function' ? yield formatTypegen(output, type) : output;
            const [toSave, existing] = yield Promise.all([content, readFile(filePath, 'utf8').catch(() => '')]);
            if (toSave !== existing) {
                const dirPath = path.dirname(filePath);
                try {
                    yield mkdir(dirPath, { recursive: true });
                }
                catch (e) {
                    if (e.code !== 'EEXIST') {
                        throw e;
                    }
                }
                // VSCode reacts to file changes better if a file is first deleted,
                // apparently. See issue motivating this logic here:
                // https://github.com/graphql-nexus/schema/issues/247.
                try {
                    yield removeFile(filePath);
                }
                catch (e) {
                    /* istanbul ignore next */
                    if (e.code !== 'ENOENT' && e.code !== 'ENOTDIR') {
                        throw e;
                    }
                }
                return writeFile(filePath, toSave);
            }
        });
    }
    /** Generates the schema, adding any directives as necessary */
    generateSchemaFile(schema) {
        let printedSchema = this.config.customPrintSchemaFn
            ? this.config.customPrintSchemaFn(schema)
            : (0, graphql_1.printSchema)(schema);
        return [lang_1.SDL_HEADER, printedSchema].join('\n\n');
    }
    /** Generates the type definitions */
    generateTypesFile(schema, typegenPath) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const typegenInfo = yield this.getTypegenInfo(schema, typegenPath);
            return new typegenPrinter_1.TypegenPrinter(schema, Object.assign(Object.assign({ declareInputs: false }, typegenInfo), { typegenPath })).print();
        });
    }
    /** Generates the type definitions */
    generateConfiguredTypes(schema, typegen) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { outputPath: typegenPath, globalsPath, globalsHeaders, declareInputs = false } = typegen;
            const typegenInfo = yield this.getTypegenInfo(schema, typegenPath);
            return new typegenPrinter_1.TypegenPrinter(schema, Object.assign(Object.assign({}, typegenInfo), { typegenPath,
                globalsPath,
                globalsHeaders,
                declareInputs })).printConfigured();
        });
    }
    getTypegenInfo(schema, typegenPath) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if ('typegenConfig' in this.config) {
                throw new Error('Error: typegenConfig was removed from the API. Please open an issue if you were using it.');
            }
            if (this.config.sourceTypes) {
                return (0, typegenAutoConfig_1.typegenAutoConfig)(this.config.sourceTypes, this.config.contextType)(schema, typegenPath || ((_a = this.config.outputs.typegen) === null || _a === void 0 ? void 0 : _a.outputPath) || '');
            }
            return {
                nexusSchemaImportId: this.config.nexusSchemaImportId,
                headers: [lang_1.TYPEGEN_HEADER],
                imports: [],
                contextTypeImport: this.config.contextType,
                sourceTypeMap: {},
            };
        });
    }
}
exports.TypegenMetadata = TypegenMetadata;
//# sourceMappingURL=typegenMetadata.js.map