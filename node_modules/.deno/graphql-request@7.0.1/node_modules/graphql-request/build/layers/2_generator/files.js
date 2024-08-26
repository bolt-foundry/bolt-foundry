import { createFromBuffer } from '@dprint/formatter';
import { getPath } from '@dprint/typescript';
import fs from 'node:fs/promises';
import * as Path from 'node:path';
import { generateCode } from './generateCode.js';
import { fileExists } from './prelude.js';
export const generateFiles = async (input) => {
    const sourceDirPath = input.sourceDirPath ?? process.cwd();
    const schemaPath = input.schemaPath ?? Path.join(sourceDirPath, `schema.graphql`);
    const schemaSource = await fs.readFile(schemaPath, `utf8`);
    // todo support other extensions: .tsx,.js,.mjs,.cjs
    const customScalarCodecsFilePath = input.sourceCustomScalarCodecsFilePath
        ?? Path.join(sourceDirPath, `customScalarCodecs.ts`);
    const customScalarCodecsImportPath = Path.relative(input.outputDirPath, customScalarCodecsFilePath.replace(/\.ts$/, `.js`));
    const customScalarCodecsPathExists = await fileExists(customScalarCodecsFilePath);
    const typeScriptFormatter = (input.format ?? true) ? createFromBuffer(await fs.readFile(getPath())) : undefined;
    const codes = generateCode({
        name: input.name,
        schemaSource,
        importPaths: {
            customScalarCodecs: customScalarCodecsImportPath,
        },
        ...input.code,
        options: {
            formatter: typeScriptFormatter,
            customScalars: customScalarCodecsPathExists,
            errorTypeNamePattern: input.errorTypeNamePattern,
        },
    });
    await fs.mkdir(input.outputDirPath, { recursive: true });
    await Promise.all(codes.map((code) => {
        return fs.writeFile(`${input.outputDirPath}/${code.moduleName}.ts`, code.code, { encoding: `utf8` });
    }));
};
//# sourceMappingURL=files.js.map