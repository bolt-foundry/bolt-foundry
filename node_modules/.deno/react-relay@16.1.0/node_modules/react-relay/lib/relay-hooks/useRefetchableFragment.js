'use strict';

var HooksImplementation = require('./HooksImplementation');
var useRefetchableFragmentNode = require('./useRefetchableFragmentNode');
var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');
var _require = require('react'),
  useDebugValue = _require.useDebugValue;
var _require2 = require('relay-runtime'),
  getFragment = _require2.getFragment;
function useRefetchableFragment_LEGACY(fragmentInput, fragmentRef) {
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useRefetchableFragment()');
  var _useRefetchableFragme = useRefetchableFragmentNode(fragmentNode, fragmentRef, 'useRefetchableFragment()'),
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
function useRefetchableFragment(fragmentInput, parentFragmentRef) {
  var impl = HooksImplementation.get();
  if (impl) {
    return impl.useRefetchableFragment(fragmentInput, parentFragmentRef);
  } else {
    return useRefetchableFragment_LEGACY(fragmentInput, parentFragmentRef);
  }
}
module.exports = useRefetchableFragment;