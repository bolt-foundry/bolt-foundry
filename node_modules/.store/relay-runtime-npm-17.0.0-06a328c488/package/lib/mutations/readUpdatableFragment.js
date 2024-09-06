'use strict';

var _require = require('../query/GraphQLTag'),
  getFragment = _require.getFragment;
var _require2 = require('../store/RelayModernSelector'),
  getVariablesFromFragment = _require2.getVariablesFromFragment;
var _require3 = require('../store/RelayStoreUtils'),
  ID_KEY = _require3.ID_KEY;
var _require4 = require('./createUpdatableProxy'),
  createUpdatableProxy = _require4.createUpdatableProxy;
var invariant = require('invariant');
function readUpdatableFragment(fragment, fragmentReference, proxy, missingFieldHandlers) {
  var updatableFragment = getFragment(fragment);
  var fragmentVariables = getVariablesFromFragment(updatableFragment, fragmentReference);
  var id = fragmentReference[ID_KEY];
  var fragmentRoot = proxy.get(id);
  !(fragmentRoot != null) ? process.env.NODE_ENV !== "production" ? invariant(false, "No record with ".concat(id, " was found. This likely indicates a problem with Relay.")) : invariant(false) : void 0;
  return {
    updatableData: createUpdatableProxy(fragmentRoot, fragmentVariables, updatableFragment.selections, proxy, missingFieldHandlers)
  };
}
module.exports = {
  readUpdatableFragment: readUpdatableFragment
};