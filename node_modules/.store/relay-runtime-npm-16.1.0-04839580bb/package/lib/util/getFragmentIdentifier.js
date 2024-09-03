'use strict';

var _require = require('../store/RelayModernSelector'),
  getDataIDsFromFragment = _require.getDataIDsFromFragment,
  getSelector = _require.getSelector,
  getVariablesFromFragment = _require.getVariablesFromFragment;
var isEmptyObject = require('./isEmptyObject');
var RelayFeatureFlags = require('./RelayFeatureFlags');
var stableCopy = require('./stableCopy');
var _require2 = require('./StringInterner'),
  intern = _require2.intern;
function getFragmentIdentifier(fragmentNode, fragmentRef) {
  var selector = getSelector(fragmentNode, fragmentRef);
  var fragmentOwnerIdentifier = selector == null ? 'null' : selector.kind === 'SingularReaderSelector' ? selector.owner.identifier : '[' + selector.selectors.map(function (sel) {
    return sel.owner.identifier;
  }).join(',') + ']';
  var fragmentVariables = getVariablesFromFragment(fragmentNode, fragmentRef);
  var dataIDs = getDataIDsFromFragment(fragmentNode, fragmentRef);
  if (RelayFeatureFlags.ENABLE_GETFRAGMENTIDENTIFIER_OPTIMIZATION) {
    var ids = typeof dataIDs === 'undefined' ? 'missing' : dataIDs == null ? 'null' : Array.isArray(dataIDs) ? '[' + dataIDs.join(',') + ']' : dataIDs;
    ids = RelayFeatureFlags.STRING_INTERN_LEVEL <= 1 ? ids : intern(ids, RelayFeatureFlags.MAX_DATA_ID_LENGTH);
    return fragmentOwnerIdentifier + '/' + fragmentNode.name + '/' + (fragmentVariables == null || isEmptyObject(fragmentVariables) ? '{}' : JSON.stringify(stableCopy(fragmentVariables))) + '/' + ids;
  } else {
    var _JSON$stringify;
    var _ids = (_JSON$stringify = JSON.stringify(dataIDs)) !== null && _JSON$stringify !== void 0 ? _JSON$stringify : 'missing';
    _ids = RelayFeatureFlags.STRING_INTERN_LEVEL <= 1 ? _ids : intern(_ids, RelayFeatureFlags.MAX_DATA_ID_LENGTH);
    return fragmentOwnerIdentifier + '/' + fragmentNode.name + '/' + JSON.stringify(stableCopy(fragmentVariables)) + '/' + _ids;
  }
}
module.exports = getFragmentIdentifier;