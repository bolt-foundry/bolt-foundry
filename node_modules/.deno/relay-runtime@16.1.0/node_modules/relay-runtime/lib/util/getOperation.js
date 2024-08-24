'use strict';

var _require = require('./RelayConcreteNode'),
  REQUEST = _require.REQUEST,
  SPLIT_OPERATION = _require.SPLIT_OPERATION;
function getOperation(node) {
  switch (node.kind) {
    case REQUEST:
      return node.operation;
    case SPLIT_OPERATION:
    default:
      return node;
  }
}
module.exports = getOperation;