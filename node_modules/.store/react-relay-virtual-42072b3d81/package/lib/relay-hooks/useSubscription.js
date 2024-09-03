'use strict';

var useRelayEnvironment = require('./useRelayEnvironment');
var _require = require('react'),
  useEffect = _require.useEffect;
var _require2 = require('relay-runtime'),
  requestSubscription = _require2.requestSubscription;
function useSubscription(config, requestSubscriptionFn) {
  var actualRequestSubscription = requestSubscriptionFn !== null && requestSubscriptionFn !== void 0 ? requestSubscriptionFn : requestSubscription;
  var environment = useRelayEnvironment();
  useEffect(function () {
    var _actualRequestSubscri = actualRequestSubscription(environment, config),
      dispose = _actualRequestSubscri.dispose;
    return dispose;
  }, [environment, config, actualRequestSubscription]);
}
module.exports = useSubscription;