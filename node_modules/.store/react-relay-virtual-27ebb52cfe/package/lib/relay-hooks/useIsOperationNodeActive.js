'use strict';

var useRelayEnvironment = require('./useRelayEnvironment');
var invariant = require('invariant');
var React = require('react');
var _require = require('relay-runtime'),
  getObservableForActiveRequest = _require.__internal.getObservableForActiveRequest,
  getSelector = _require.getSelector;
var useEffect = React.useEffect,
  useState = React.useState,
  useMemo = React.useMemo;
function useIsOperationNodeActive(fragmentNode, fragmentRef) {
  var environment = useRelayEnvironment();
  var observable = useMemo(function () {
    var selector = getSelector(fragmentNode, fragmentRef);
    if (selector == null) {
      return null;
    }
    !(selector.kind === 'SingularReaderSelector') ? process.env.NODE_ENV !== "production" ? invariant(false, 'useIsOperationNodeActive: Plural fragments are not supported.') : invariant(false) : void 0;
    return getObservableForActiveRequest(environment, selector.owner);
  }, [environment, fragmentNode, fragmentRef]);
  var _useState = useState(observable != null),
    isActive = _useState[0],
    setIsActive = _useState[1];
  useEffect(function () {
    var subscription;
    setIsActive(observable != null);
    if (observable != null) {
      var onCompleteOrError = function onCompleteOrError() {
        setIsActive(false);
      };
      subscription = observable.subscribe({
        complete: onCompleteOrError,
        error: onCompleteOrError
      });
    }
    return function () {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [observable]);
  return isActive;
}
module.exports = useIsOperationNodeActive;