'use strict';

function registerEnvironmentWithDevTools(environment) {
  var _global = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : undefined;
  var devToolsHook = _global && _global.__RELAY_DEVTOOLS_HOOK__;
  if (devToolsHook) {
    devToolsHook.registerEnvironment(environment);
  }
}
module.exports = registerEnvironmentWithDevTools;