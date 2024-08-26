'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _RelayErrorTrie = require("../store/RelayErrorTrie");
var _RelayFeatureFlags = _interopRequireDefault(require("./RelayFeatureFlags"));
function handlePotentialSnapshotErrors(environment, missingRequiredFields, relayResolverErrors, errorResponseFields, throwOnFieldError) {
  var _iterator = (0, _createForOfIteratorHelper2["default"])(relayResolverErrors),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var resolverError = _step.value;
      environment.relayFieldLogger({
        kind: 'relay_resolver.error',
        owner: resolverError.field.owner,
        fieldPath: resolverError.field.path,
        error: resolverError.error
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (relayResolverErrors.length > 0 && (_RelayFeatureFlags["default"].ENABLE_FIELD_ERROR_HANDLING_THROW_BY_DEFAULT || throwOnFieldError)) {
    throw new _RelayErrorTrie.RelayFieldError("Relay: Unexpected resolver exception", relayResolverErrors.map(function (e) {
      return {
        message: e.error.message
      };
    }));
  }
  if ((_RelayFeatureFlags["default"].ENABLE_FIELD_ERROR_HANDLING || throwOnFieldError) && errorResponseFields != null) {
    if (errorResponseFields != null) {
      var _iterator2 = (0, _createForOfIteratorHelper2["default"])(errorResponseFields),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var fieldError = _step2.value;
          var path = fieldError.path,
            owner = fieldError.owner,
            error = fieldError.error;
          environment.relayFieldLogger({
            kind: 'relay_field_payload.error',
            owner: owner,
            fieldPath: path,
            error: error
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    if (_RelayFeatureFlags["default"].ENABLE_FIELD_ERROR_HANDLING_THROW_BY_DEFAULT || throwOnFieldError) {
      throw new _RelayErrorTrie.RelayFieldError("Relay: Unexpected response payload - this object includes an errors property in which you can access the underlying errors", errorResponseFields.map(function (_ref) {
        var error = _ref.error;
        return error;
      }));
    }
  }
  if (missingRequiredFields != null) {
    switch (missingRequiredFields.action) {
      case 'THROW':
        {
          var _missingRequiredField = missingRequiredFields.field,
            _path = _missingRequiredField.path,
            _owner = _missingRequiredField.owner;
          environment.relayFieldLogger({
            kind: 'missing_field.throw',
            owner: _owner,
            fieldPath: _path
          });
          throw new Error("Relay: Missing @required value at path '".concat(_path, "' in '").concat(_owner, "'."));
        }
      case 'LOG':
        missingRequiredFields.fields.forEach(function (_ref2) {
          var path = _ref2.path,
            owner = _ref2.owner;
          environment.relayFieldLogger({
            kind: 'missing_field.log',
            owner: owner,
            fieldPath: path
          });
        });
        break;
      default:
        {
          missingRequiredFields.action;
        }
    }
  }
}
module.exports = handlePotentialSnapshotErrors;