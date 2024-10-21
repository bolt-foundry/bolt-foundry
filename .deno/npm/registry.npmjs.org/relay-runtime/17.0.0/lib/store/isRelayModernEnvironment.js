'use strict';

function isRelayModernEnvironment(environment) {
  return Boolean(environment && environment['@@RelayModernEnvironment']);
}
module.exports = isRelayModernEnvironment;