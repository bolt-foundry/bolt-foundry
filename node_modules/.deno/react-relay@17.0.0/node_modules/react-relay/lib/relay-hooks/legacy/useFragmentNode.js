'use strict';

var useRelayEnvironment = require('../useRelayEnvironment');
var useUnsafeRef_DEPRECATED = require('../useUnsafeRef_DEPRECATED');
var _require = require('./FragmentResource'),
  getFragmentResourceForEnvironment = _require.getFragmentResourceForEnvironment;
var _require2 = require('react'),
  useEffect = _require2.useEffect,
  useState = _require2.useState;
var _require3 = require('relay-runtime'),
  RelayFeatureFlags = _require3.RelayFeatureFlags,
  getFragmentIdentifier = _require3.getFragmentIdentifier;
var warning = require("fbjs/lib/warning");
function useFragmentNode(fragmentNode, fragmentRef, componentDisplayName) {
  var environment = useRelayEnvironment();
  var FragmentResource = getFragmentResourceForEnvironment(environment);
  var isMountedRef = useUnsafeRef_DEPRECATED(false);
  var _useState = useState(0),
    forceUpdate = _useState[1];
  var fragmentIdentifier = getFragmentIdentifier(fragmentNode, fragmentRef);
  var fragmentResult = FragmentResource.readWithIdentifier(fragmentNode, fragmentRef, fragmentIdentifier, componentDisplayName);
  var isListeningForUpdatesRef = useUnsafeRef_DEPRECATED(true);
  function enableStoreUpdates() {
    isListeningForUpdatesRef.current = true;
    var didMissUpdates = FragmentResource.checkMissedUpdates(fragmentResult)[0];
    if (didMissUpdates) {
      handleDataUpdate();
    }
  }
  function disableStoreUpdates() {
    isListeningForUpdatesRef.current = false;
  }
  function handleDataUpdate() {
    if (isMountedRef.current === false || isListeningForUpdatesRef.current === false) {
      return;
    }
    forceUpdate(function (count) {
      return count + 1;
    });
  }
  useEffect(function () {
    isMountedRef.current = true;
    var disposable = FragmentResource.subscribe(fragmentResult, handleDataUpdate);
    return function () {
      isMountedRef.current = false;
      disposable.dispose();
    };
  }, [environment, fragmentIdentifier]);
  if (RelayFeatureFlags.LOG_MISSING_RECORDS_IN_PROD || process.env.NODE_ENV !== "production") {
    if (fragmentRef != null && (fragmentResult.data === undefined || Array.isArray(fragmentResult.data) && fragmentResult.data.length > 0 && fragmentResult.data.every(function (data) {
      return data === undefined;
    }))) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Expected to have been able to read non-null data for ' + 'fragment `%s` declared in ' + '`%s`, since fragment reference was non-null. ' + "Make sure that that `%s`'s parent isn't " + 'holding on to and/or passing a fragment reference for data that ' + 'has been deleted.', fragmentNode.name, componentDisplayName, componentDisplayName) : void 0;
    }
  }
  return {
    data: fragmentResult.data,
    disableStoreUpdates: disableStoreUpdates,
    enableStoreUpdates: enableStoreUpdates
  };
}
module.exports = useFragmentNode;