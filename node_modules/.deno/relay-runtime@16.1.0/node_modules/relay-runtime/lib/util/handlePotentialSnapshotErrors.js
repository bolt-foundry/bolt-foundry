'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
function handlePotentialSnapshotErrors(environment, missingRequiredFields, relayResolverErrors) {
  var _iterator = (0, _createForOfIteratorHelper2["default"])(relayResolverErrors),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var resolverError = _step.value;
      environment.requiredFieldLogger({
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
  if (missingRequiredFields != null) {
    switch (missingRequiredFields.action) {
      case 'THROW':
        {
          var _missingRequiredField = missingRequiredFields.field,
            path = _missingRequiredField.path,
            owner = _missingRequiredField.owner;
          environment.requiredFieldLogger({
            kind: 'missing_field.throw',
            owner: owner,
            fieldPath: path
          });
          throw new Error("Relay: Missing @required value at path '".concat(path, "' in '").concat(owner, "'."));
        }
      case 'LOG':
        missingRequiredFields.fields.forEach(function (_ref) {
          var path = _ref.path,
            owner = _ref.owner;
          environment.requiredFieldLogger({
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