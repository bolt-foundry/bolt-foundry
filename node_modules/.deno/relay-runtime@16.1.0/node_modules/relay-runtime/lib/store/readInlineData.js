'use strict';

var _require = require('../query/GraphQLTag'),
  getInlineDataFragment = _require.getInlineDataFragment;
var _require2 = require('./RelayStoreUtils'),
  FRAGMENTS_KEY = _require2.FRAGMENTS_KEY;
var invariant = require('invariant');
function readInlineData(fragment, fragmentRef) {
  var _fragmentRef$FRAGMENT;
  var inlineDataFragment = getInlineDataFragment(fragment);
  if (fragmentRef == null) {
    return fragmentRef;
  }
  !(typeof fragmentRef === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'readInlineData(): Expected an object, got `%s`.', typeof fragmentRef) : invariant(false) : void 0;
  var inlineData = (_fragmentRef$FRAGMENT = fragmentRef[FRAGMENTS_KEY]) === null || _fragmentRef$FRAGMENT === void 0 ? void 0 : _fragmentRef$FRAGMENT[inlineDataFragment.name];
  !(inlineData != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'readInlineData(): Expected fragment `%s` to be spread in the parent ' + 'fragment.', inlineDataFragment.name) : invariant(false) : void 0;
  return inlineData;
}
module.exports = readInlineData;