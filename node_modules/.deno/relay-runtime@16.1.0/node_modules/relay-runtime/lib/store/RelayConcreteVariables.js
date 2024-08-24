'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _require = require('./RelayStoreUtils'),
  getArgumentValues = _require.getArgumentValues;
var invariant = require('invariant');
function getFragmentVariables(fragment, rootVariables, argumentVariables) {
  if (fragment.argumentDefinitions == null) {
    return argumentVariables;
  }
  var variables;
  fragment.argumentDefinitions.forEach(function (definition) {
    if (argumentVariables.hasOwnProperty(definition.name)) {
      return;
    }
    variables = variables || (0, _objectSpread2["default"])({}, argumentVariables);
    switch (definition.kind) {
      case 'LocalArgument':
        variables[definition.name] = definition.defaultValue;
        break;
      case 'RootArgument':
        if (!rootVariables.hasOwnProperty(definition.name)) {
          variables[definition.name] = undefined;
          break;
        }
        variables[definition.name] = rootVariables[definition.name];
        break;
      default:
        definition;
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayConcreteVariables: Unexpected node kind `%s` in fragment `%s`.', definition.kind, fragment.name) : invariant(false) : void 0;
    }
  });
  return variables || argumentVariables;
}
function getOperationVariables(operation, providedVariables, variables) {
  var operationVariables = {};
  operation.argumentDefinitions.forEach(function (def) {
    var value = def.defaultValue;
    if (variables[def.name] != null) {
      value = variables[def.name];
    }
    operationVariables[def.name] = value;
  });
  if (providedVariables != null) {
    Object.keys(providedVariables).forEach(function (varName) {
      operationVariables[varName] = providedVariables[varName].get();
    });
  }
  return operationVariables;
}
function getLocalVariables(currentVariables, argumentDefinitions, args) {
  if (argumentDefinitions == null) {
    return currentVariables;
  }
  var nextVariables = (0, _objectSpread2["default"])({}, currentVariables);
  var nextArgs = args ? getArgumentValues(args, currentVariables) : {};
  argumentDefinitions.forEach(function (def) {
    var _nextArgs$def$name;
    var value = (_nextArgs$def$name = nextArgs[def.name]) !== null && _nextArgs$def$name !== void 0 ? _nextArgs$def$name : def.defaultValue;
    nextVariables[def.name] = value;
  });
  return nextVariables;
}
module.exports = {
  getLocalVariables: getLocalVariables,
  getFragmentVariables: getFragmentVariables,
  getOperationVariables: getOperationVariables
};