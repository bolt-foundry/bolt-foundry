'use strict';

var resolverDataInjector = require('./store/experimental-live-resolvers/resolverDataInjector');
var _require = require('./store/experimental-live-resolvers/weakObjectWrapper'),
  weakObjectWrapper = _require.weakObjectWrapper,
  weakObjectWrapperLive = _require.weakObjectWrapperLive;
module.exports = {
  resolverDataInjector: resolverDataInjector,
  weakObjectWrapper: weakObjectWrapper,
  weakObjectWrapperLive: weakObjectWrapperLive
};