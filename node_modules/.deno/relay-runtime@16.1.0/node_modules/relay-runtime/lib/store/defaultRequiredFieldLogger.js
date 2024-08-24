'use strict';

var defaultRequiredFieldLogger = function defaultRequiredFieldLogger(event) {
  if (process.env.NODE_ENV !== "production" && event.kind === 'missing_field.log') {
    throw new Error('Relay Environment Configuration Error (dev only): `@required(action: LOG)` requires that the Relay Environment be configured with a `requiredFieldLogger`.');
  }
};
module.exports = defaultRequiredFieldLogger;