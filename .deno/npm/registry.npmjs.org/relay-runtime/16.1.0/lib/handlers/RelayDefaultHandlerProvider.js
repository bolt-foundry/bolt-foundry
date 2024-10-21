'use strict';

var ConnectionHandler = require('./connection/ConnectionHandler');
var MutationHandlers = require('./connection/MutationHandlers');
var invariant = require('invariant');
function RelayDefaultHandlerProvider(handle) {
  switch (handle) {
    case 'connection':
      return ConnectionHandler;
    case 'deleteRecord':
      return MutationHandlers.DeleteRecordHandler;
    case 'deleteEdge':
      return MutationHandlers.DeleteEdgeHandler;
    case 'appendEdge':
      return MutationHandlers.AppendEdgeHandler;
    case 'prependEdge':
      return MutationHandlers.PrependEdgeHandler;
    case 'appendNode':
      return MutationHandlers.AppendNodeHandler;
    case 'prependNode':
      return MutationHandlers.PrependNodeHandler;
  }
  !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayDefaultHandlerProvider: No handler provided for `%s`.', handle) : invariant(false) : void 0;
}
module.exports = RelayDefaultHandlerProvider;