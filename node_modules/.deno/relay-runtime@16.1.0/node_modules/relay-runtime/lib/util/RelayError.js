'use strict';

function createError(type, name, messageFormat) {
  for (var _len = arguments.length, messageParams = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    messageParams[_key - 3] = arguments[_key];
  }
  var index = 0;
  var message = messageFormat.replace(/%s/g, function () {
    return String(messageParams[index++]);
  });
  var err = new Error(message);
  var error = Object.assign(err, {
    name: name,
    messageFormat: messageFormat,
    messageParams: messageParams,
    type: type,
    taalOpcodes: [2, 2]
  });
  if (error.stack === undefined) {
    try {
      throw error;
    } catch (_unused) {}
  }
  return error;
}
module.exports = {
  create: function create(name, messageFormat) {
    for (var _len2 = arguments.length, messageParams = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      messageParams[_key2 - 2] = arguments[_key2];
    }
    return createError.apply(void 0, ['error', name, messageFormat].concat(messageParams));
  },
  createWarning: function createWarning(name, messageFormat) {
    for (var _len3 = arguments.length, messageParams = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      messageParams[_key3 - 2] = arguments[_key3];
    }
    return createError.apply(void 0, ['warn', name, messageFormat].concat(messageParams));
  }
};