'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _excluded = ["path", "locations"];
var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var SELF = Symbol('$SELF');
var RelayFieldError = /*#__PURE__*/function (_Error) {
  (0, _inheritsLoose2["default"])(RelayFieldError, _Error);
  function RelayFieldError(message) {
    var _this;
    var errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    _this = _Error.call(this, message) || this;
    _this.name = 'RelayFieldError';
    _this.message = message;
    _this.errors = errors;
    return _this;
  }
  return RelayFieldError;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));
function buildErrorTrie(errors) {
  if (errors == null) {
    return null;
  }
  if (!RelayFeatureFlags.ENABLE_FIELD_ERROR_HANDLING) {
    return null;
  }
  var trie = new Map();
  var _iterator = (0, _createForOfIteratorHelper2["default"])(errors),
    _step;
  try {
    ERRORS: for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
        path = _step$value.path,
        _ = _step$value.locations,
        error = (0, _objectWithoutPropertiesLoose2["default"])(_step$value, _excluded);
      if (path == null) {
        continue;
      }
      var length = path.length;
      if (length === 0) {
        continue;
      }
      var lastIndex = length - 1;
      var currentTrie = trie;
      for (var index = 0; index < lastIndex; index++) {
        var key = path[index];
        var existingValue = currentTrie.get(key);
        if (existingValue instanceof Map) {
          currentTrie = existingValue;
          continue;
        }
        var newValue = new Map();
        if (Array.isArray(existingValue)) {
          newValue.set(SELF, existingValue);
        }
        currentTrie.set(key, newValue);
        currentTrie = newValue;
      }
      var lastKey = path[lastIndex];
      var container = currentTrie.get(lastKey);
      if (container instanceof Map) {
        currentTrie = container;
        container = currentTrie.get(lastKey);
        lastKey = SELF;
      }
      if (Array.isArray(container)) {
        container.push(error);
      } else {
        currentTrie.set(lastKey, [error]);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return trie;
}
function getErrorsByKey(trie, key) {
  var value = trie.get(key);
  if (value == null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value;
  }
  var errors = [];
  recursivelyCopyErrorsIntoArray(value, errors);
  return errors;
}
function recursivelyCopyErrorsIntoArray(trieOrSet, errors) {
  var _iterator2 = (0, _createForOfIteratorHelper2["default"])(trieOrSet),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _step2.value,
        childKey = _step2$value[0],
        value = _step2$value[1];
      var oldLength = errors.length;
      if (Array.isArray(value)) {
        errors.push.apply(errors, (0, _toConsumableArray2["default"])(value));
      } else {
        recursivelyCopyErrorsIntoArray(value, errors);
      }
      if (childKey === SELF) {
        continue;
      }
      var newLength = errors.length;
      for (var index = oldLength; index < newLength; index++) {
        var error = errors[index];
        if (error.path == null) {
          errors[index] = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, error), {}, {
            path: [childKey]
          });
        } else {
          error.path.unshift(childKey);
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
function getNestedErrorTrieByKey(trie, key) {
  var value = trie.get(key);
  if (value instanceof Map) {
    return value;
  }
  return null;
}
module.exports = {
  SELF: SELF,
  buildErrorTrie: buildErrorTrie,
  getNestedErrorTrieByKey: getNestedErrorTrieByKey,
  getErrorsByKey: getErrorsByKey,
  RelayFieldError: RelayFieldError
};