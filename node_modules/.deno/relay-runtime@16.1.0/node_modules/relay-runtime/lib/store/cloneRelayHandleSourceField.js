'use strict';

var _require = require('../util/RelayConcreteNode'),
  LINKED_FIELD = _require.LINKED_FIELD;
var _require2 = require('./RelayStoreUtils'),
  getHandleStorageKey = _require2.getHandleStorageKey;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
function cloneRelayHandleSourceField(handleField, selections, variables) {
  var sourceField = selections.find(function (source) {
    return source.kind === LINKED_FIELD && source.name === handleField.name && source.alias === handleField.alias && areEqual(source.args, handleField.args);
  });
  !(sourceField && sourceField.kind === LINKED_FIELD) ? process.env.NODE_ENV !== "production" ? invariant(false, 'cloneRelayHandleSourceField: Expected a corresponding source field for ' + 'handle `%s`.', handleField.handle) : invariant(false) : void 0;
  var handleKey = getHandleStorageKey(handleField, variables);
  return {
    kind: 'LinkedField',
    alias: sourceField.alias,
    name: handleKey,
    storageKey: handleKey,
    args: null,
    concreteType: sourceField.concreteType,
    plural: sourceField.plural,
    selections: sourceField.selections
  };
}
module.exports = cloneRelayHandleSourceField;