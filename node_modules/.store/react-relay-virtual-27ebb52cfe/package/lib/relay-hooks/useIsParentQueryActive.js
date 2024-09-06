'use strict';

var useIsOperationNodeActive = require('./useIsOperationNodeActive');
var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');
var _require = require('relay-runtime'),
  getFragment = _require.getFragment;
function useIsParentQueryActive(fragmentInput, fragmentRef) {
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of useIsParentQueryActive()');
  return useIsOperationNodeActive(fragmentNode, fragmentRef);
}
module.exports = useIsParentQueryActive;