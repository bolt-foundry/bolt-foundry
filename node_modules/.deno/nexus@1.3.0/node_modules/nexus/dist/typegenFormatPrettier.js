"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typegenFormatPrettier = void 0;
const tslib_1 = require("tslib");
const path = (0, tslib_1.__importStar)(require("path"));
// todo use Prettier.Options type instead of just `object`
// but will this force us to make prettier a dep then since that type would be user-visible?
function typegenFormatPrettier(prettierConfig) {
    return function formatTypegen(content, type) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let prettier;
            /* istanbul ignore next */
            try {
                prettier = require('prettier');
            }
            catch (_a) {
                console.warn('It looks like you provided a `prettierConfig` option to GraphQL Nexus, but you do not have prettier ' +
                    'installed as a dependency in your project. Please add it as a peerDependency of nexus to use this feature. ' +
                    'Skipping formatting.');
                return content;
            }
            let prettierConfigResolved;
            if (typeof prettierConfig === 'string') {
                /* istanbul ignore if */
                if (!path.isAbsolute(prettierConfig)) {
                    console.error(new Error(`Expected prettierrc path to be absolute, saw ${prettierConfig}. Skipping formatting.`));
                    return content;
                }
                prettierConfigResolved = (yield prettier.resolveConfig('ignore_this', {
                    config: prettierConfig,
                })); // non-null assert b/c config file is explicitly passed
            }
            else {
                prettierConfigResolved = prettierConfig;
            }
            return prettier.format(content, Object.assign(Object.assign({}, prettierConfigResolved), { parser: type === 'types' ? 'typescript' : 'graphql' }));
        });
    };
}
exports.typegenFormatPrettier = typegenFormatPrettier;
//# sourceMappingURL=typegenFormatPrettier.js.map