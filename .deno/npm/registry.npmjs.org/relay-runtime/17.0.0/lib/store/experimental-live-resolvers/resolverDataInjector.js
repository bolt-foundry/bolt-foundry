'use strict';

var _require = require('../ResolverFragments'),
  readFragment = _require.readFragment;
var invariant = require('invariant');
function resolverDataInjector(fragment, _resolverFn, fieldName, isRequiredField) {
  var resolverFn = _resolverFn;
  return function (fragmentKey, args) {
    var data = readFragment(fragment, fragmentKey);
    if (fieldName != null) {
      if (data == null) {
        if (isRequiredField === true) {
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected required resolver field `%s` in fragment `%s` to be present. But resolvers fragment data is null/undefined.', fieldName, fragment.name) : invariant(false) : void 0;
        } else {
          return resolverFn(null, args);
        }
      }
      if (fieldName in data) {
        if (isRequiredField === true) {
          !(data[fieldName] != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected required resolver field `%s` in fragment `%s` to be non-null.', fieldName, fragment.name) : invariant(false) : void 0;
        }
        return resolverFn(data[fieldName], args);
      } else {
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Missing field `%s` in fragment `%s` in resolver response.', fieldName, fragment.name) : invariant(false) : void 0;
      }
    } else {
      return resolverFn(data, args);
    }
  };
}
module.exports = resolverDataInjector;