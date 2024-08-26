'use strict';

var areEqual = require("fbjs/lib/areEqual");
var warning = require("fbjs/lib/warning");
var WEAKMAP_SUPPORTED = typeof WeakMap === 'function';
var debugCache = WEAKMAP_SUPPORTED ? new WeakMap() : new Map();
function withProvidedVariables(userSuppliedVariables, providedVariables) {
  if (providedVariables != null) {
    var operationVariables = {};
    Object.assign(operationVariables, userSuppliedVariables);
    Object.keys(providedVariables).forEach(function (varName) {
      var providerFunction = providedVariables[varName].get;
      var providerResult = providerFunction();
      if (!debugCache.has(providerFunction)) {
        debugCache.set(providerFunction, providerResult);
        operationVariables[varName] = providerResult;
      } else {
        var cachedResult = debugCache.get(providerFunction);
        if (process.env.NODE_ENV !== "production") {
          process.env.NODE_ENV !== "production" ? warning(areEqual(providerResult, cachedResult), 'Relay: Expected function `%s` for provider `%s` to be a pure function, ' + 'but got conflicting return values `%s` and `%s`', providerFunction.name, varName, providerResult, cachedResult) : void 0;
        }
        operationVariables[varName] = cachedResult;
      }
    });
    return operationVariables;
  } else {
    return userSuppliedVariables;
  }
}
withProvidedVariables.tests_only_resetDebugCache = process.env.NODE_ENV !== "production" ? function () {
  debugCache = WEAKMAP_SUPPORTED ? new WeakMap() : new Map();
} : undefined;
module.exports = withProvidedVariables;