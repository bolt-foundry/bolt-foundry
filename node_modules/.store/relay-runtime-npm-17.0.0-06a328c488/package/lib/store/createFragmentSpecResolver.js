'use strict';

var RelayModernFragmentSpecResolver = require('./RelayModernFragmentSpecResolver');
var warning = require("fbjs/lib/warning");
function createFragmentSpecResolver(context, containerName, fragments, props, rootIsQueryRenderer, callback) {
  if (process.env.NODE_ENV !== "production") {
    var fragmentNames = Object.keys(fragments);
    fragmentNames.forEach(function (fragmentName) {
      var propValue = props[fragmentName];
      process.env.NODE_ENV !== "production" ? warning(propValue !== undefined, 'createFragmentSpecResolver: Expected prop `%s` to be supplied to `%s`, but ' + 'got `undefined`. Pass an explicit `null` if this is intentional.', fragmentName, containerName) : void 0;
    });
  }
  return new RelayModernFragmentSpecResolver(context, fragments, props, callback, rootIsQueryRenderer);
}
module.exports = createFragmentSpecResolver;