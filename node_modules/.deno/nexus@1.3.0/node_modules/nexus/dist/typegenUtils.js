"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypegenConfig = void 0;
const tslib_1 = require("tslib");
const path = (0, tslib_1.__importStar)(require("path"));
const utils_1 = require("./utils");
/** Normalizes the builder config into the config we need for typegen */
function resolveTypegenConfig(config) {
    const { outputs, shouldGenerateArtifacts = Boolean(!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') } = config, rest = (0, tslib_1.__rest)(config, ["outputs", "shouldGenerateArtifacts"]);
    const defaultSDLFilePath = path.join(process.cwd(), 'schema.graphql');
    let typegenFilePath = null;
    let sdlFilePath = null;
    if (outputs === undefined) {
        if ((0, utils_1.isProductionStage)()) {
            sdlFilePath = defaultSDLFilePath;
        }
    }
    else if (outputs === true) {
        sdlFilePath = defaultSDLFilePath;
    }
    else if (typeof outputs === 'object') {
        if (outputs.schema === true) {
            sdlFilePath = defaultSDLFilePath;
        }
        else if (typeof outputs.schema === 'string') {
            sdlFilePath = (0, utils_1.assertAbsolutePath)(outputs.schema, 'outputs.schema');
        }
        else if (outputs.schema === undefined && (0, utils_1.isProductionStage)()) {
        }
        // handle typegen configuration
        if (typeof outputs.typegen === 'string') {
            typegenFilePath = {
                outputPath: (0, utils_1.assertAbsolutePath)(outputs.typegen, 'outputs.typegen'),
            };
        }
        else if (typeof outputs.typegen === 'object') {
            typegenFilePath = Object.assign(Object.assign({}, outputs.typegen), { outputPath: (0, utils_1.assertAbsolutePath)(outputs.typegen.outputPath, 'outputs.typegen.outputPath') });
            if (outputs.typegen.globalsPath) {
                typegenFilePath.globalsPath = (0, utils_1.assertAbsolutePath)(outputs.typegen.globalsPath, 'outputs.typegen.globalsPath');
            }
        }
    }
    else if (outputs !== false) {
        console.warn(`You should specify a configuration value for outputs in Nexus' makeSchema. ` +
            `Provide one to remove this warning.`);
    }
    return Object.assign(Object.assign({}, rest), { nexusSchemaImportId: (0, utils_1.getOwnPackage)().name, outputs: {
            typegen: shouldGenerateArtifacts ? typegenFilePath : null,
            schema: shouldGenerateArtifacts ? sdlFilePath : null,
        } });
}
exports.resolveTypegenConfig = resolveTypegenConfig;
//# sourceMappingURL=typegenUtils.js.map