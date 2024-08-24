'use strict';

var warning = require("fbjs/lib/warning");
var implementation = null;
function inject(impl) {
  process.env.NODE_ENV !== "production" ? warning(implementation === null, 'Relay HooksImplementation was injected twice.') : void 0;
  implementation = impl;
}
function get() {
  return implementation;
}
module.exports = {
  inject: inject,
  get: get
};