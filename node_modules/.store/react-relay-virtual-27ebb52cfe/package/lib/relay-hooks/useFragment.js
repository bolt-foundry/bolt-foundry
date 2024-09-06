'use strict';

var _require = require('./loadQuery'),
  useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;
var useFragmentInternal = require('./useFragmentInternal');
var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');
var _require2 = require('react'),
  useDebugValue = _require2.useDebugValue;
var _require3 = require('relay-runtime'),
  getFragment = _require3.getFragment;
function useFragment(fragment, key) {
  useTrackLoadQueryInRender();
  var fragmentNode = getFragment(fragment);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useFragment()');
  var data = useFragmentInternal(fragmentNode, key, 'useFragment()');
  if (process.env.NODE_ENV !== "production") {
    useDebugValue({
      fragment: fragmentNode.name,
      data: data
    });
  }
  return data;
}
module.exports = useFragment;