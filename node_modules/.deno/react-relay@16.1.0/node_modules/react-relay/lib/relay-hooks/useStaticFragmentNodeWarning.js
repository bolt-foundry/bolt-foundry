'use strict';

var useUnsafeRef_DEPRECATED = require('./useUnsafeRef_DEPRECATED');
var warning = require("fbjs/lib/warning");
function useStaticFragmentNodeWarning(fragmentNode, warningContext) {
  if (process.env.NODE_ENV !== "production") {
    var initialPropRef = useUnsafeRef_DEPRECATED(fragmentNode.name);
    process.env.NODE_ENV !== "production" ? warning(initialPropRef.current === fragmentNode.name, 'Relay: The %s has to remain the same over the lifetime of a component. ' + 'Changing it is not supported and will result in unexpected behavior.', warningContext) : void 0;
  }
}
module.exports = useStaticFragmentNodeWarning;