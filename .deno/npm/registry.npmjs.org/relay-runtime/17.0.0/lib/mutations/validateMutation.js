'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _require = require('../util/RelayConcreteNode'),
  ACTOR_CHANGE = _require.ACTOR_CHANGE,
  CLIENT_COMPONENT = _require.CLIENT_COMPONENT,
  CLIENT_EDGE_TO_CLIENT_OBJECT = _require.CLIENT_EDGE_TO_CLIENT_OBJECT,
  CLIENT_EXTENSION = _require.CLIENT_EXTENSION,
  CONDITION = _require.CONDITION,
  DEFER = _require.DEFER,
  FRAGMENT_SPREAD = _require.FRAGMENT_SPREAD,
  INLINE_FRAGMENT = _require.INLINE_FRAGMENT,
  LINKED_FIELD = _require.LINKED_FIELD,
  LINKED_HANDLE = _require.LINKED_HANDLE,
  MODULE_IMPORT = _require.MODULE_IMPORT,
  RELAY_LIVE_RESOLVER = _require.RELAY_LIVE_RESOLVER,
  RELAY_RESOLVER = _require.RELAY_RESOLVER,
  SCALAR_FIELD = _require.SCALAR_FIELD,
  SCALAR_HANDLE = _require.SCALAR_HANDLE,
  STREAM = _require.STREAM,
  TYPE_DISCRIMINATOR = _require.TYPE_DISCRIMINATOR;
var warning = require("fbjs/lib/warning");
var hasOwnProperty = Object.prototype.hasOwnProperty;
var validateMutation = function validateMutation() {};
if (process.env.NODE_ENV !== "production") {
  var addFieldToDiff = function addFieldToDiff(path, diff, isScalar) {
    var deepLoc = diff;
    path.split('.').forEach(function (key, index, arr) {
      if (deepLoc[key] == null) {
        deepLoc[key] = {};
      }
      if (isScalar && index === arr.length - 1) {
        deepLoc[key] = '<scalar>';
      }
      deepLoc = deepLoc[key];
    });
  };
  validateMutation = function validateMutation(optimisticResponse, mutation, variables) {
    var operationName = mutation.operation.name;
    var context = {
      path: 'ROOT',
      visitedPaths: new Set(),
      variables: variables || {},
      missingDiff: {},
      extraDiff: {},
      moduleImportPaths: new Set()
    };
    validateSelections(optimisticResponse, mutation.operation.selections, context);
    validateOptimisticResponse(optimisticResponse, context);
    process.env.NODE_ENV !== "production" ? warning(context.missingDiff.ROOT == null, 'Expected `optimisticResponse` to match structure of server response for mutation `%s`, please define fields for all of\n%s', operationName, JSON.stringify(context.missingDiff.ROOT, null, 2)) : void 0;
    process.env.NODE_ENV !== "production" ? warning(context.extraDiff.ROOT == null, 'Expected `optimisticResponse` to match structure of server response for mutation `%s`, please remove all fields of\n%s', operationName, JSON.stringify(context.extraDiff.ROOT, null, 2)) : void 0;
  };
  var validateSelections = function validateSelections(optimisticResponse, selections, context) {
    selections.forEach(function (selection) {
      return validateSelection(optimisticResponse, selection, context);
    });
  };
  var validateSelection = function validateSelection(optimisticResponse, selection, context) {
    switch (selection.kind) {
      case CONDITION:
        validateSelections(optimisticResponse, selection.selections, context);
        return;
      case CLIENT_COMPONENT:
      case FRAGMENT_SPREAD:
        validateSelections(optimisticResponse, selection.fragment.selections, context);
        return;
      case SCALAR_FIELD:
      case LINKED_FIELD:
        return validateField(optimisticResponse, selection, context);
      case ACTOR_CHANGE:
        return validateField(optimisticResponse, selection.linkedField, context);
      case INLINE_FRAGMENT:
        var type = selection.type;
        var isConcreteType = selection.abstractKey == null;
        validateAbstractKey(context, selection.abstractKey);
        selection.selections.forEach(function (subselection) {
          if (isConcreteType && optimisticResponse.__typename !== type) {
            return;
          }
          validateSelection(optimisticResponse, subselection, context);
        });
        return;
      case CLIENT_EXTENSION:
        selection.selections.forEach(function (subselection) {
          validateSelection(optimisticResponse, subselection, context);
        });
        return;
      case MODULE_IMPORT:
        return validateModuleImport(context);
      case TYPE_DISCRIMINATOR:
        return validateAbstractKey(context, selection.abstractKey);
      case RELAY_RESOLVER:
      case RELAY_LIVE_RESOLVER:
      case CLIENT_EDGE_TO_CLIENT_OBJECT:
      case LINKED_HANDLE:
      case SCALAR_HANDLE:
      case DEFER:
      case STREAM:
        {
          return;
        }
      default:
        selection;
        return;
    }
  };
  var validateModuleImport = function validateModuleImport(context) {
    context.moduleImportPaths.add(context.path);
  };
  var validateAbstractKey = function validateAbstractKey(context, abstractKey) {
    if (abstractKey != null) {
      var path = "".concat(context.path, ".").concat(abstractKey);
      context.visitedPaths.add(path);
    }
  };
  var validateField = function validateField(optimisticResponse, field, context) {
    var fieldName = field.alias || field.name;
    var path = "".concat(context.path, ".").concat(fieldName);
    context.visitedPaths.add(path);
    switch (field.kind) {
      case SCALAR_FIELD:
        if (hasOwnProperty.call(optimisticResponse, fieldName) === false) {
          addFieldToDiff(path, context.missingDiff, true);
        }
        return;
      case LINKED_FIELD:
        var selections = field.selections;
        if (optimisticResponse[fieldName] === null || hasOwnProperty.call(optimisticResponse, fieldName) && optimisticResponse[fieldName] === undefined) {
          return;
        }
        if (field.plural) {
          if (Array.isArray(optimisticResponse[fieldName])) {
            optimisticResponse[fieldName].forEach(function (r) {
              if (r !== null) {
                validateSelections(r, selections, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, context), {}, {
                  path: path
                }));
              }
            });
            return;
          } else {
            addFieldToDiff(path, context.missingDiff);
            return;
          }
        } else {
          if (optimisticResponse[fieldName] instanceof Object) {
            validateSelections(optimisticResponse[fieldName], selections, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, context), {}, {
              path: path
            }));
            return;
          } else {
            addFieldToDiff(path, context.missingDiff);
            return;
          }
        }
    }
  };
  var validateOptimisticResponse = function validateOptimisticResponse(optimisticResponse, context) {
    if (Array.isArray(optimisticResponse)) {
      optimisticResponse.forEach(function (r) {
        if (r instanceof Object) {
          validateOptimisticResponse(r, context);
        }
      });
      return;
    }
    Object.keys(optimisticResponse).forEach(function (key) {
      var value = optimisticResponse[key];
      var path = "".concat(context.path, ".").concat(key);
      if (context.moduleImportPaths.has(path)) {
        return;
      }
      if (!context.visitedPaths.has(path)) {
        addFieldToDiff(path, context.extraDiff);
        return;
      }
      if (value instanceof Object) {
        validateOptimisticResponse(value, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, context), {}, {
          path: path
        }));
      }
    });
  };
}
module.exports = validateMutation;