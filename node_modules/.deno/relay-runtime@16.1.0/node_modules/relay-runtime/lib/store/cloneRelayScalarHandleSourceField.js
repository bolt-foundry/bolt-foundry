'use strict';

var _require = require('../util/RelayConcreteNode'),
  SCALAR_FIELD = _require.SCALAR_FIELD;
var _require2 = require('./RelayStoreUtils'),
  getHandleStorageKey = _require2.getHandleStorageKey;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
function cloneRelayScalarHandleSourceField(handleField, selections, variables) {
  var sourceField = selections.find(function (source) {
    return source.kind === SCALAR_FIELD && source.name === handleField.name && source.alias === handleField.alias && areEqual(source.args, handleField.args);
  });
  !(sourceField && sourceField.kind === SCALAR_FIELD) ? process.env.NODE_ENV !== "production" ? invariant(false, 'cloneRelayScalarHandleSourceField: Expected a corresponding source field for ' + 'handle `%s`.', handleField.handle) : invariant(false) : void 0;
  var handleKey = getHandleStorageKey(handleField, variables);
  return {
    kind: 'ScalarField',
    alias: sourceField.alias,
    name: handleKey,
    storageKey: handleKey,
    args: null
  };
}
module.exports = cloneRelayScalarHandleSourceField;