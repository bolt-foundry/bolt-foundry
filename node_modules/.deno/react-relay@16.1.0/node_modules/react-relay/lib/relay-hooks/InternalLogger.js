'use strict';

var loggerImpl = function loggerImpl(eventData) {};
module.exports = {
  setLoggerImplementation: function setLoggerImplementation(loggerFn) {
    loggerImpl = loggerFn;
  },
  logEvent: function logEvent(eventData) {
    return loggerImpl(eventData);
  }
};