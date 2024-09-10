'use strict';

var useRefetchableFragmentInternal = require('./useRefetchableFragmentInternal');
var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');
var _require = require('react'),
  useDebugValue = _require.useDebugValue;
var _require2 = require('relay-runtime'),
  getFragment = _require2.getFragment;
function useRefetchableFragment(fragmentInput, fragmentRef) {
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useRefetchableFragment()');
  var _useRefetchableFragme = useRefetchableFragmentInternal(fragmentNode, fragmentRef, 'useRefetchableFragment()'),
    fragmentData = _useRefetchableFragme.fragmentData,
    refetch = _useRefetchableFragme.refetch;
  if (process.env.NODE_ENV !== "production") {
    useDebugValue({
      fragment: fragmentNode.name,
      data: fragmentData
    });
  }
  return [fragmentData, refetch];
}
module.exports = useRefetchableFragment;