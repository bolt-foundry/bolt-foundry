'use strict';

var invariant = require('invariant');
function assertFragmentMap(componentName, fragmentSpec) {
  !(fragmentSpec && typeof fragmentSpec === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Could not create Relay Container for `%s`. ' + 'Expected a set of GraphQL fragments, got `%s` instead.', componentName, fragmentSpec) : invariant(false) : void 0;
  for (var key in fragmentSpec) {
    if (fragmentSpec.hasOwnProperty(key)) {
      var fragment = fragmentSpec[key];
      !(fragment && (typeof fragment === 'object' || typeof fragment === 'function')) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Could not create Relay Container for `%s`. ' + 'The value of fragment `%s` was expected to be a fragment, got `%s` instead.', componentName, key, fragment) : invariant(false) : void 0;
    }
  }
}
module.exports = assertFragmentMap;