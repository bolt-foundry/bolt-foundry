'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var getRelayHandleKey = require('../util/getRelayHandleKey');
var RelayConcreteNode = require('../util/RelayConcreteNode');
var stableCopy = require('../util/stableCopy');
var invariant = require('invariant');
var VARIABLE = RelayConcreteNode.VARIABLE,
  LITERAL = RelayConcreteNode.LITERAL,
  OBJECT_VALUE = RelayConcreteNode.OBJECT_VALUE,
  LIST_VALUE = RelayConcreteNode.LIST_VALUE;
var ERRORS_KEY = '__errors';
var MODULE_COMPONENT_KEY_PREFIX = '__module_component_';
var MODULE_OPERATION_KEY_PREFIX = '__module_operation_';
function getArgumentValue(arg, variables) {
  if (arg.kind === VARIABLE) {
    return getStableVariableValue(arg.variableName, variables);
  } else if (arg.kind === LITERAL) {
    return arg.value;
  } else if (arg.kind === OBJECT_VALUE) {
    var value = {};
    arg.fields.forEach(function (field) {
      value[field.name] = getArgumentValue(field, variables);
    });
    return value;
  } else if (arg.kind === LIST_VALUE) {
    var _value = [];
    arg.items.forEach(function (item) {
      item != null ? _value.push(getArgumentValue(item, variables)) : null;
    });
    return _value;
  }
}
function getArgumentValues(args, variables, isWithinUnmatchedTypeRefinement) {
  var values = {};
  if (isWithinUnmatchedTypeRefinement) {
    values[RelayStoreUtils.FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT] = true;
  }
  if (args) {
    args.forEach(function (arg) {
      values[arg.name] = getArgumentValue(arg, variables);
    });
  }
  return values;
}
function getHandleStorageKey(handleField, variables) {
  var dynamicKey = handleField.dynamicKey,
    handle = handleField.handle,
    key = handleField.key,
    name = handleField.name,
    args = handleField.args,
    filters = handleField.filters;
  var handleName = getRelayHandleKey(handle, key, name);
  var filterArgs = null;
  if (args && filters && args.length !== 0 && filters.length !== 0) {
    filterArgs = args.filter(function (arg) {
      return filters.indexOf(arg.name) > -1;
    });
  }
  if (dynamicKey) {
    filterArgs = filterArgs != null ? [dynamicKey].concat((0, _toConsumableArray2["default"])(filterArgs)) : [dynamicKey];
  }
  if (filterArgs === null) {
    return handleName;
  } else {
    return formatStorageKey(handleName, getArgumentValues(filterArgs, variables));
  }
}
function getStorageKey(field, variables) {
  if (field.storageKey) {
    return field.storageKey;
  }
  var args = getArguments(field);
  var name = field.name;
  return args && args.length !== 0 ? formatStorageKey(name, getArgumentValues(args, variables)) : name;
}
function getArguments(field) {
  if (field.kind === 'RelayResolver' || field.kind === 'RelayLiveResolver') {
    var _field$fragment2;
    if (field.args == null) {
      var _field$fragment;
      return (_field$fragment = field.fragment) === null || _field$fragment === void 0 ? void 0 : _field$fragment.args;
    }
    if (((_field$fragment2 = field.fragment) === null || _field$fragment2 === void 0 ? void 0 : _field$fragment2.args) == null) {
      return field.args;
    }
    return field.args.concat(field.fragment.args);
  }
  var args = typeof field.args === 'undefined' ? undefined : field.args;
  return args;
}
function getStableStorageKey(name, args) {
  return formatStorageKey(name, stableCopy(args));
}
function formatStorageKey(name, argValues) {
  if (!argValues) {
    return name;
  }
  var values = [];
  for (var argName in argValues) {
    if (argValues.hasOwnProperty(argName)) {
      var value = argValues[argName];
      if (value != null) {
        var _JSON$stringify;
        values.push(argName + ':' + ((_JSON$stringify = JSON.stringify(value)) !== null && _JSON$stringify !== void 0 ? _JSON$stringify : 'undefined'));
      }
    }
  }
  return values.length === 0 ? name : name + "(".concat(values.join(','), ")");
}
function getStableVariableValue(name, variables) {
  !variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'getVariableValue(): Undefined variable `%s`.', name) : invariant(false) : void 0;
  return stableCopy(variables[name]);
}
function getModuleComponentKey(documentName) {
  return "".concat(MODULE_COMPONENT_KEY_PREFIX).concat(documentName);
}
function getModuleOperationKey(documentName) {
  return "".concat(MODULE_OPERATION_KEY_PREFIX).concat(documentName);
}
var RelayStoreUtils = {
  ACTOR_IDENTIFIER_KEY: '__actorIdentifier',
  CLIENT_EDGE_TRAVERSAL_PATH: '__clientEdgeTraversalPath',
  FRAGMENTS_KEY: '__fragments',
  FRAGMENT_OWNER_KEY: '__fragmentOwner',
  FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT: '$isWithinUnmatchedTypeRefinement',
  FRAGMENT_PROP_NAME_KEY: '__fragmentPropName',
  MODULE_COMPONENT_KEY: '__module_component',
  ERRORS_KEY: ERRORS_KEY,
  ID_KEY: '__id',
  REF_KEY: '__ref',
  REFS_KEY: '__refs',
  ROOT_ID: 'client:root',
  ROOT_TYPE: '__Root',
  TYPENAME_KEY: '__typename',
  INVALIDATED_AT_KEY: '__invalidated_at',
  RELAY_RESOLVER_VALUE_KEY: '__resolverValue',
  RELAY_RESOLVER_INVALIDATION_KEY: '__resolverValueMayBeInvalid',
  RELAY_RESOLVER_SNAPSHOT_KEY: '__resolverSnapshot',
  RELAY_RESOLVER_ERROR_KEY: '__resolverError',
  RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS: '__resolverOutputTypeRecordIDs',
  formatStorageKey: formatStorageKey,
  getArgumentValue: getArgumentValue,
  getArgumentValues: getArgumentValues,
  getHandleStorageKey: getHandleStorageKey,
  getStorageKey: getStorageKey,
  getStableStorageKey: getStableStorageKey,
  getModuleComponentKey: getModuleComponentKey,
  getModuleOperationKey: getModuleOperationKey
};
module.exports = RelayStoreUtils;