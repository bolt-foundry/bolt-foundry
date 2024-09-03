'use strict';

var HooksImplementation = require('./HooksImplementation');
var _require = require('./loadQuery'),
  useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;
var useFragmentNode = require('./useFragmentNode');
var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');
var _require2 = require('react'),
  useDebugValue = _require2.useDebugValue;
var _require3 = require('relay-runtime'),
  getFragment = _require3.getFragment;
function useFragment_LEGACY(fragment, key) {
  useTrackLoadQueryInRender();
  var fragmentNode = getFragment(fragment);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useFragment()');
  var _useFragmentNode = useFragmentNode(fragmentNode, key, 'useFragment()'),
    data = _useFragmentNode.data;
  if (process.env.NODE_ENV !== "production") {
    useDebugValue({
      fragment: fragmentNode.name,
      data: data
    });
  }
  return data;
}
function useFragment(fragment, key) {
  var impl = HooksImplementation.get();
  if (impl) {
    return impl.useFragment(fragment, key);
  } else {
    return useFragment_LEGACY(fragment, key);
  }
}
module.exports = useFragment;