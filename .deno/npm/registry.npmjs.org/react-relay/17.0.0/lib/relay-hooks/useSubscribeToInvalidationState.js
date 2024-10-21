'use strict';

var useRelayEnvironment = require('./useRelayEnvironment');
var _require = require('react'),
  useEffect = _require.useEffect,
  useRef = _require.useRef;
function useSubscribeToInvalidationState(dataIDs, callback) {
  var environment = useRelayEnvironment();
  var disposableRef = useRef(null);
  var stableDataIDs = Array.from(dataIDs).sort().join('');
  useEffect(function () {
    var store = environment.getStore();
    var invalidationState = store.lookupInvalidationState(dataIDs);
    var disposable = store.subscribeToInvalidationState(invalidationState, callback);
    disposableRef.current = disposable;
    return function () {
      return disposable.dispose();
    };
  }, [stableDataIDs, callback, environment]);
  return {
    dispose: function dispose() {
      if (disposableRef.current != null) {
        disposableRef.current.dispose();
      }
    }
  };
}
module.exports = useSubscribeToInvalidationState;