'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _toPropertyKey2 = _interopRequireDefault(require("@babel/runtime/helpers/toPropertyKey"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var deepFreeze = require('../util/deepFreeze');
var _require = require('./ClientID'),
  generateClientObjectClientID = _require.generateClientObjectClientID,
  isClientID = _require.isClientID;
var _require2 = require('./experimental-live-resolvers/LiveResolverSuspenseSentinel'),
  isSuspenseSentinel = _require2.isSuspenseSentinel;
var _require3 = require('./RelayStoreUtils'),
  ACTOR_IDENTIFIER_KEY = _require3.ACTOR_IDENTIFIER_KEY,
  ERRORS_KEY = _require3.ERRORS_KEY,
  ID_KEY = _require3.ID_KEY,
  INVALIDATED_AT_KEY = _require3.INVALIDATED_AT_KEY,
  REF_KEY = _require3.REF_KEY,
  REFS_KEY = _require3.REFS_KEY,
  RELAY_RESOLVER_VALUE_KEY = _require3.RELAY_RESOLVER_VALUE_KEY,
  ROOT_ID = _require3.ROOT_ID,
  TYPENAME_KEY = _require3.TYPENAME_KEY;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
function clone(record) {
  return (0, _objectSpread2["default"])({}, record);
}
function copyFields(source, sink) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (key !== ID_KEY && key !== TYPENAME_KEY) {
        sink[key] = source[key];
      }
    }
  }
}
function create(dataID, typeName) {
  var record = {};
  record[ID_KEY] = dataID;
  record[TYPENAME_KEY] = typeName;
  return record;
}
function fromObject(json) {
  return json;
}
function getDataID(record) {
  return record[ID_KEY];
}
function getFields(record) {
  if (ERRORS_KEY in record) {
    return Object.keys(record).filter(function (field) {
      return field !== ERRORS_KEY;
    });
  }
  return Object.keys(record);
}
function getType(record) {
  return record[TYPENAME_KEY];
}
function getErrors(record, storageKey) {
  var _record$ERRORS_KEY;
  return (_record$ERRORS_KEY = record[ERRORS_KEY]) === null || _record$ERRORS_KEY === void 0 ? void 0 : _record$ERRORS_KEY[storageKey];
}
function getValue(record, storageKey) {
  var value = record[storageKey];
  if (value && typeof value === 'object') {
    !(!value.hasOwnProperty(REF_KEY) && !value.hasOwnProperty(REFS_KEY)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getValue(): Expected a scalar (non-link) value for `%s.%s` ' + 'but found %s.', record[ID_KEY], storageKey, value.hasOwnProperty(REF_KEY) ? 'a linked record' : 'plural linked records') : invariant(false) : void 0;
  }
  return value;
}
function hasValue(record, storageKey) {
  return storageKey in record;
}
function getLinkedRecordID(record, storageKey) {
  var maybeLink = record[storageKey];
  if (maybeLink == null) {
    return maybeLink;
  }
  var link = maybeLink;
  !(typeof link === 'object' && link && typeof link[REF_KEY] === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getLinkedRecordID(): Expected `%s.%s` to be a linked ID, ' + 'was `%s`.%s', record[ID_KEY], storageKey, JSON.stringify(link), typeof link === 'object' && link[REFS_KEY] !== undefined ? ' It appears to be a plural linked record: did you mean to call ' + 'getLinkedRecords() instead of getLinkedRecord()?' : '') : invariant(false) : void 0;
  return link[REF_KEY];
}
function hasLinkedRecordID(record, storageKey) {
  var maybeLink = record[storageKey];
  if (maybeLink == null) {
    return false;
  }
  var link = maybeLink;
  return typeof link === 'object' && link && typeof link[REF_KEY] === 'string';
}
function getLinkedRecordIDs(record, storageKey) {
  var links = record[storageKey];
  if (links == null) {
    return links;
  }
  !(typeof links === 'object' && Array.isArray(links[REFS_KEY])) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getLinkedRecordIDs(): Expected `%s.%s` to contain an array ' + 'of linked IDs, got `%s`.%s', record[ID_KEY], storageKey, JSON.stringify(links), typeof links === 'object' && links[REF_KEY] !== undefined ? ' It appears to be a singular linked record: did you mean to call ' + 'getLinkedRecord() instead of getLinkedRecords()?' : '') : invariant(false) : void 0;
  return links[REFS_KEY];
}
function hasLinkedRecordIDs(record, storageKey) {
  var links = record[storageKey];
  if (links == null) {
    return false;
  }
  return typeof links === 'object' && Array.isArray(links[REFS_KEY]) && links[REFS_KEY].every(function (link) {
    return typeof link === 'string';
  });
}
function getInvalidationEpoch(record) {
  if (record == null) {
    return null;
  }
  var invalidatedAt = record[INVALIDATED_AT_KEY];
  if (typeof invalidatedAt !== 'number') {
    return null;
  }
  return invalidatedAt;
}
function update(prevRecord, nextRecord) {
  var _updated2;
  if (process.env.NODE_ENV !== "production") {
    var _getType, _getType2;
    var prevID = getDataID(prevRecord);
    var nextID = getDataID(nextRecord);
    process.env.NODE_ENV !== "production" ? warning(prevID === nextID, 'RelayModernRecord: Invalid record update, expected both versions of ' + 'the record to have the same id, got `%s` and `%s`.', prevID, nextID) : void 0;
    var prevType = (_getType = getType(prevRecord)) !== null && _getType !== void 0 ? _getType : null;
    var nextType = (_getType2 = getType(nextRecord)) !== null && _getType2 !== void 0 ? _getType2 : null;
    process.env.NODE_ENV !== "production" ? warning(isClientID(nextID) && nextID !== ROOT_ID || prevType === nextType, 'RelayModernRecord: Invalid record update, expected both versions of ' + 'record `%s` to have the same `%s` but got conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', prevID, TYPENAME_KEY, prevType, nextType) : void 0;
  }
  var prevErrorsByKey = prevRecord[ERRORS_KEY];
  var nextErrorsByKey = nextRecord[ERRORS_KEY];
  var updated = null;
  if (prevErrorsByKey == null && nextErrorsByKey == null) {
    var _updated;
    for (var storageKey in nextRecord) {
      if (updated || !areEqual(prevRecord[storageKey], nextRecord[storageKey])) {
        updated = updated !== null ? updated : (0, _objectSpread2["default"])({}, prevRecord);
        updated[storageKey] = nextRecord[storageKey];
      }
    }
    return (_updated = updated) !== null && _updated !== void 0 ? _updated : prevRecord;
  }
  for (var _storageKey2 in nextRecord) {
    if (_storageKey2 === ERRORS_KEY) {
      continue;
    }
    var nextValue = nextRecord[_storageKey2];
    var nextErrors = nextErrorsByKey === null || nextErrorsByKey === void 0 ? void 0 : nextErrorsByKey[_storageKey2];
    if (updated == null) {
      var prevValue = prevRecord[_storageKey2];
      var prevErrors = prevErrorsByKey === null || prevErrorsByKey === void 0 ? void 0 : prevErrorsByKey[_storageKey2];
      if (areEqual(prevValue, nextValue) && areEqual(prevErrors, nextErrors)) {
        continue;
      }
      updated = (0, _objectSpread2["default"])({}, prevRecord);
      if (prevErrorsByKey != null) {
        updated[ERRORS_KEY] = (0, _objectSpread2["default"])({}, prevErrorsByKey);
      }
    }
    setValue(updated, _storageKey2, nextValue);
    setErrors(updated, _storageKey2, nextErrors);
  }
  return (_updated2 = updated) !== null && _updated2 !== void 0 ? _updated2 : prevRecord;
}
function merge(record1, record2) {
  if (process.env.NODE_ENV !== "production") {
    var _getType3, _getType4;
    var prevID = getDataID(record1);
    var nextID = getDataID(record2);
    process.env.NODE_ENV !== "production" ? warning(prevID === nextID, 'RelayModernRecord: Invalid record merge, expected both versions of ' + 'the record to have the same id, got `%s` and `%s`.', prevID, nextID) : void 0;
    var prevType = (_getType3 = getType(record1)) !== null && _getType3 !== void 0 ? _getType3 : null;
    var nextType = (_getType4 = getType(record2)) !== null && _getType4 !== void 0 ? _getType4 : null;
    process.env.NODE_ENV !== "production" ? warning(isClientID(nextID) && nextID !== ROOT_ID || prevType === nextType, 'RelayModernRecord: Invalid record merge, expected both versions of ' + 'record `%s` to have the same `%s` but got conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', prevID, TYPENAME_KEY, prevType, nextType) : void 0;
  }
  if (ERRORS_KEY in record1 || ERRORS_KEY in record2) {
    var errors1 = record1[ERRORS_KEY],
      fields1 = (0, _objectWithoutPropertiesLoose2["default"])(record1, [ERRORS_KEY].map(_toPropertyKey2["default"]));
    var errors2 = record2[ERRORS_KEY],
      fields2 = (0, _objectWithoutPropertiesLoose2["default"])(record2, [ERRORS_KEY].map(_toPropertyKey2["default"]));
    var updated = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, fields1), fields2);
    if (errors1 == null && errors2 == null) {
      return updated;
    }
    var updatedErrors = {};
    for (var storageKey in errors1) {
      if (fields2.hasOwnProperty(storageKey)) {
        continue;
      }
      updatedErrors[storageKey] = errors1[storageKey];
    }
    for (var _storageKey3 in errors2) {
      updatedErrors[_storageKey3] = errors2[_storageKey3];
    }
    for (var _storageKey in updatedErrors) {
      updated[ERRORS_KEY] = updatedErrors;
      break;
    }
    return updated;
  } else {
    return (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, record1), record2);
  }
}
function freeze(record) {
  deepFreeze(record);
}
function setErrors(record, storageKey, errors) {
  if (process.env.NODE_ENV !== "production") {
    process.env.NODE_ENV !== "production" ? warning(storageKey in record, 'RelayModernRecord: Invalid error update, `%s` should not be undefined.', storageKey) : void 0;
  }
  var errorsByStorageKey = record[ERRORS_KEY];
  if (errors != null && errors.length > 0) {
    if (errorsByStorageKey == null) {
      record[ERRORS_KEY] = (0, _defineProperty2["default"])({}, storageKey, errors);
    } else {
      errorsByStorageKey[storageKey] = errors;
    }
  } else if (errorsByStorageKey != null) {
    if (delete errorsByStorageKey[storageKey]) {
      for (var otherStorageKey in errorsByStorageKey) {
        if (errorsByStorageKey.hasOwnProperty(otherStorageKey)) {
          return;
        }
      }
      delete record[ERRORS_KEY];
    }
  }
}
function setValue(record, storageKey, value) {
  if (process.env.NODE_ENV !== "production") {
    var prevID = getDataID(record);
    if (storageKey === ID_KEY) {
      process.env.NODE_ENV !== "production" ? warning(prevID === value, 'RelayModernRecord: Invalid field update, expected both versions of ' + 'the record to have the same id, got `%s` and `%s`.', prevID, value) : void 0;
    } else if (storageKey === TYPENAME_KEY) {
      var _getType5;
      var prevType = (_getType5 = getType(record)) !== null && _getType5 !== void 0 ? _getType5 : null;
      var nextType = value !== null && value !== void 0 ? value : null;
      process.env.NODE_ENV !== "production" ? warning(isClientID(getDataID(record)) && getDataID(record) !== ROOT_ID || prevType === nextType, 'RelayModernRecord: Invalid field update, expected both versions of ' + 'record `%s` to have the same `%s` but got conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', prevID, TYPENAME_KEY, prevType, nextType) : void 0;
    }
  }
  record[storageKey] = value;
}
function setLinkedRecordID(record, storageKey, linkedID) {
  var link = {};
  link[REF_KEY] = linkedID;
  record[storageKey] = link;
}
function setLinkedRecordIDs(record, storageKey, linkedIDs) {
  var links = {};
  links[REFS_KEY] = linkedIDs;
  record[storageKey] = links;
}
function setActorLinkedRecordID(record, storageKey, actorIdentifier, linkedID) {
  var link = {};
  link[REF_KEY] = linkedID;
  link[ACTOR_IDENTIFIER_KEY] = actorIdentifier;
  record[storageKey] = link;
}
function getActorLinkedRecordID(record, storageKey) {
  var link = record[storageKey];
  if (link == null) {
    return link;
  }
  !(typeof link === 'object' && typeof link[REF_KEY] === 'string' && link[ACTOR_IDENTIFIER_KEY] != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getActorLinkedRecordID(): Expected `%s.%s` to be an actor specific linked ID, ' + 'was `%s`.', record[ID_KEY], storageKey, JSON.stringify(link)) : invariant(false) : void 0;
  return [link[ACTOR_IDENTIFIER_KEY], link[REF_KEY]];
}
function getResolverLinkedRecordID(record, typeName) {
  var id = getValue(record, RELAY_RESOLVER_VALUE_KEY);
  if (id == null || isSuspenseSentinel(id)) {
    return null;
  }
  if (typeof id === 'object') {
    id = id.id;
  }
  !(typeof id === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getResolverLinkedRecordID(): Expected value to be a linked ID, ' + 'was `%s`.', JSON.stringify(id)) : invariant(false) : void 0;
  return generateClientObjectClientID(typeName, id);
}
function getResolverLinkedRecordIDs(record, typeName) {
  var resolverValue = getValue(record, RELAY_RESOLVER_VALUE_KEY);
  if (resolverValue == null || isSuspenseSentinel(resolverValue)) {
    return null;
  }
  !Array.isArray(resolverValue) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getResolverLinkedRecordIDs(): Expected value to be an array of linked IDs, ' + 'was `%s`.', JSON.stringify(resolverValue)) : invariant(false) : void 0;
  return resolverValue.map(function (id) {
    if (id == null) {
      return null;
    }
    if (typeof id === 'object') {
      id = id.id;
    }
    !(typeof id === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernRecord.getResolverLinkedRecordIDs(): Expected item within resolver linked field to be a DataID, ' + 'was `%s`.', JSON.stringify(id)) : invariant(false) : void 0;
    return generateClientObjectClientID(typeName, id);
  });
}
function toJSON(record) {
  return record;
}
module.exports = {
  clone: clone,
  copyFields: copyFields,
  create: create,
  freeze: freeze,
  fromObject: fromObject,
  getDataID: getDataID,
  getErrors: getErrors,
  getFields: getFields,
  getInvalidationEpoch: getInvalidationEpoch,
  getLinkedRecordID: getLinkedRecordID,
  getLinkedRecordIDs: getLinkedRecordIDs,
  getType: getType,
  getValue: getValue,
  hasValue: hasValue,
  hasLinkedRecordID: hasLinkedRecordID,
  hasLinkedRecordIDs: hasLinkedRecordIDs,
  merge: merge,
  setErrors: setErrors,
  setValue: setValue,
  setLinkedRecordID: setLinkedRecordID,
  setLinkedRecordIDs: setLinkedRecordIDs,
  update: update,
  getActorLinkedRecordID: getActorLinkedRecordID,
  setActorLinkedRecordID: setActorLinkedRecordID,
  getResolverLinkedRecordID: getResolverLinkedRecordID,
  getResolverLinkedRecordIDs: getResolverLinkedRecordIDs,
  toJSON: toJSON
};