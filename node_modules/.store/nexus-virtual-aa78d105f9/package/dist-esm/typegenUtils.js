import { __rest } from "tslib";
import * as path from 'path';
import { assertAbsolutePath, getOwnPackage, isProductionStage } from './utils';
/** Normalizes the builder config into the config we need for typegen */
export function resolveTypegenConfig(config) {
    const { outputs, shouldGenerateArtifacts = Boolean(!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') } = config, rest = __rest(config, ["outputs", "shouldGenerateArtifacts"]);
    const defaultSDLFilePath = path.join(process.cwd(), 'schema.graphql');
    let typegenFilePath = null;
    let sdlFilePath = null;
    if (outputs === undefined) {
        if (isProductionStage()) {
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
            sdlFilePath = assertAbsolutePath(outputs.schema, 'outputs.schema');
        }
        else if (outputs.schema === undefined && isProductionStage()) {
        }
        // handle typegen configuration
        if (typeof outputs.typegen === 'string') {
            typegenFilePath = {
                outputPath: assertAbsolutePath(outputs.typegen, 'outputs.typegen'),
            };
        }
        else if (typeof outputs.typegen === 'object') {
            typegenFilePath = Object.assign(Object.assign({}, outputs.typegen), { outputPath: assertAbsolutePath(outputs.typegen.outputPath, 'outputs.typegen.outputPath') });
            if (outputs.typegen.globalsPath) {
                typegenFilePath.globalsPath = assertAbsolutePath(outputs.typegen.globalsPath, 'outputs.typegen.globalsPath');
            }
        }
    }
    else if (outputs !== false) {
        console.warn(`You should specify a configuration value for outputs in Nexus' makeSchema. ` +
            `Provide one to remove this warning.`);
    }
    return Object.assign(Object.assign({}, rest), { nexusSchemaImportId: getOwnPackage().name, outputs: {
            typegen: shouldGenerateArtifacts ? typegenFilePath : null,
            schema: shouldGenerateArtifacts ? sdlFilePath : null,
        } });
}
//# sourceMappingURL=typegenUtils.js.map