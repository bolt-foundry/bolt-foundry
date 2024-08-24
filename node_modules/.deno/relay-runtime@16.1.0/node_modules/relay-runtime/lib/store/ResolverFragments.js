'use strict';

var _require = require('../query/GraphQLTag'),
  getFragment = _require.getFragment;
var _require2 = require('./RelayModernSelector'),
  getSelector = _require2.getSelector;
var invariant = require('invariant');
var contextStack = [];
function withResolverContext(context, cb) {
  contextStack.push(context);
  try {
    return cb();
  } finally {
    contextStack.pop();
  }
}
function readFragment(fragmentInput, fragmentKey) {
  if (!contextStack.length) {
    throw new Error('readFragment should be called only from within a Relay Resolver function.');
  }
  var context = contextStack[contextStack.length - 1];
  var fragmentNode = getFragment(fragmentInput);
  var fragmentSelector = getSelector(fragmentNode, fragmentKey);
  !(fragmentSelector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, "Expected a selector for the fragment of the resolver ".concat(fragmentNode.name, ", but got null.")) : invariant(false) : void 0;
  !(fragmentSelector.kind === 'SingularReaderSelector') ? process.env.NODE_ENV !== "production" ? invariant(false, "Expected a singular reader selector for the fragment of the resolver ".concat(fragmentNode.name, ", but it was plural.")) : invariant(false) : void 0;
  var _context$getDataForRe = context.getDataForResolverFragment(fragmentSelector, fragmentKey),
    data = _context$getDataForRe.data,
    isMissingData = _context$getDataForRe.isMissingData;
  if (isMissingData) {
    throw RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL;
  }
  return data;
}
var RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL = {};
module.exports = {
  readFragment: readFragment,
  withResolverContext: withResolverContext,
  RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL: RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL
};