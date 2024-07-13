"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    queryAndGenerateAsync: ()=>queryAndGenerateAsync,
    selectAndGenerateAsync: ()=>selectAndGenerateAsync
});
function _path() {
    const data = /*#__PURE__*/ _interopRequireDefault(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _resolveFrom() {
    const data = /*#__PURE__*/ _interopRequireDefault(require("resolve-from"));
    _resolveFrom = function() {
        return data;
    };
    return data;
}
const _templates = require("./templates");
const _installAsync = require("../install/installAsync");
const _log = require("../log");
const _dir = require("../utils/dir");
const _errors = require("../utils/errors");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function queryAndGenerateAsync(projectRoot, { files , props , extras  }) {
    const valid = files.filter((file)=>!!_templates.TEMPLATES.find((template)=>template.destination(props) === file));
    if (valid.length !== files.length) {
        const diff = files.filter((file)=>!_templates.TEMPLATES.find((template)=>template.destination(props) === file));
        throw new _errors.CommandError(`Invalid files: ${diff.join(", ")}. Allowed: ${_templates.TEMPLATES.map((template)=>template.destination(props)).join(", ")}`);
    }
    if (!valid.length) {
        return;
    }
    _log.Log.log(`Generating: ${valid.join(", ")}`);
    return generateAsync(projectRoot, {
        answer: files.map((file)=>_templates.TEMPLATES.findIndex((template)=>template.destination(props) === file)),
        props,
        extras
    });
}
async function selectAndGenerateAsync(projectRoot, { props , extras  }) {
    const answer = await (0, _templates.selectTemplatesAsync)(projectRoot, props);
    if (!(answer == null ? void 0 : answer.length)) {
        _log.Log.exit("\n› Exiting with no change...", 0);
    }
    await generateAsync(projectRoot, {
        answer,
        props,
        extras
    });
}
async function generateAsync(projectRoot, { answer , props , extras  }) {
    // Copy files
    await Promise.all(answer.map(async (file)=>{
        const template = _templates.TEMPLATES[file];
        if (template.id === "tsconfig.json") {
            const { typescript  } = await Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./typescript.js")));
            return typescript(projectRoot);
        }
        const projectFilePath = _path().default.resolve(projectRoot, template.destination(props));
        // copy the file from template
        return (0, _dir.copyAsync)(template.file(projectRoot), projectFilePath, {
            overwrite: true,
            recursive: true
        });
    }));
    // Install dependencies
    const packages = answer.map((file)=>_templates.TEMPLATES[file].dependencies).flat().filter((pkg)=>!_resolveFrom().default.silent(projectRoot, pkg));
    if (packages.length) {
        _log.Log.debug("Installing " + packages.join(", "));
        await (0, _installAsync.installAsync)(packages, {}, [
            "--dev",
            ...extras
        ]);
    }
}

//# sourceMappingURL=generate.js.map