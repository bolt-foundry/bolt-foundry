'use strict';

var React = require('react');
var ProfilerContext = React.createContext({
  wrapPrepareQueryResource: function wrapPrepareQueryResource(cb) {
    return cb();
  }
});
module.exports = ProfilerContext;