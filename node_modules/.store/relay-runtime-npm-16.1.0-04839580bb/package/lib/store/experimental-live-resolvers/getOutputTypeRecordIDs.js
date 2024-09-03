'use strict';

var RelayModernRecord = require('../RelayModernRecord');
var _require = require('../RelayStoreUtils'),
  RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS = _require.RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS;
var invariant = require('invariant');
function getOutputTypeRecordIDs(record) {
  var maybeOutputTypeRecordIDs = RelayModernRecord.getValue(record, RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS);
  if (maybeOutputTypeRecordIDs == null) {
    return null;
  }
  !(maybeOutputTypeRecordIDs instanceof Set) ? process.env.NODE_ENV !== "production" ? invariant(false, 'getOutputTypeRecordIDs: Expected the `%s` field on record `%s` to be of type Set. Instead, it is a %s.', RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS, typeof maybeOutputTypeRecordIDs) : invariant(false) : void 0;
  return maybeOutputTypeRecordIDs;
}
module.exports = getOutputTypeRecordIDs;