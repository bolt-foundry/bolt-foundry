'use strict';

var _require = require('./ClientID'),
  generateClientID = _require.generateClientID;
var _require2 = require('./RelayStoreUtils'),
  ROOT_ID = _require2.ROOT_ID;
var VIEWER_ID = generateClientID(ROOT_ID, 'viewer');
var VIEWER_TYPE = 'Viewer';
module.exports = {
  VIEWER_ID: VIEWER_ID,
  VIEWER_TYPE: VIEWER_TYPE
};