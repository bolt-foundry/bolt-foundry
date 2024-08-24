'use strict';

function isRelayEnvironment(environment) {
  return typeof environment === 'object' && environment !== null && typeof environment.check === 'function' && typeof environment.lookup === 'function' && typeof environment.retain === 'function' && typeof environment.execute === 'function' && typeof environment.subscribe === 'function';
}
module.exports = isRelayEnvironment;