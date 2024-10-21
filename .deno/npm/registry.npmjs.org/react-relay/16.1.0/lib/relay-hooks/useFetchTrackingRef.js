'use strict';

var useUnsafeRef_DEPRECATED = require('./useUnsafeRef_DEPRECATED');
var _require = require('react'),
  useCallback = _require.useCallback,
  useEffect = _require.useEffect;
function useFetchTrackingRef() {
  var subscriptionRef = useUnsafeRef_DEPRECATED(null);
  var isFetchingRef = useUnsafeRef_DEPRECATED(false);
  var disposeFetch = useCallback(function () {
    if (subscriptionRef.current != null) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    isFetchingRef.current = false;
  }, []);
  var startFetch = useCallback(function (subscription) {
    subscriptionRef.current = subscription;
    isFetchingRef.current = true;
  }, []);
  var completeFetch = useCallback(function () {
    subscriptionRef.current = null;
    isFetchingRef.current = false;
  }, []);
  useEffect(function () {
    return disposeFetch;
  }, [disposeFetch]);
  return {
    isFetchingRef: isFetchingRef,
    startFetch: startFetch,
    disposeFetch: disposeFetch,
    completeFetch: completeFetch
  };
}
module.exports = useFetchTrackingRef;