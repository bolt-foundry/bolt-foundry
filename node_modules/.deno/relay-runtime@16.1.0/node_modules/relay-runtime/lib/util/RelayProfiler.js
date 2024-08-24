'use strict';

var profileHandlersByName = {};
var defaultProfiler = {
  stop: function stop() {}
};
var RelayProfiler = {
  profile: function profile(name, state) {
    var handlers = profileHandlersByName[name];
    if (handlers && handlers.length > 0) {
      var stopHandlers = [];
      for (var ii = handlers.length - 1; ii >= 0; ii--) {
        var stopHandler = handlers[ii](name, state);
        stopHandlers.unshift(stopHandler);
      }
      return {
        stop: function stop(error) {
          stopHandlers.forEach(function (stopHandler) {
            return stopHandler(error);
          });
        }
      };
    }
    return defaultProfiler;
  },
  attachProfileHandler: function attachProfileHandler(name, handler) {
    if (!profileHandlersByName.hasOwnProperty(name)) {
      profileHandlersByName[name] = [];
    }
    profileHandlersByName[name].push(handler);
  },
  detachProfileHandler: function detachProfileHandler(name, handler) {
    if (profileHandlersByName.hasOwnProperty(name)) {
      removeFromArray(profileHandlersByName[name], handler);
    }
  }
};
function removeFromArray(array, element) {
  var index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
module.exports = RelayProfiler;