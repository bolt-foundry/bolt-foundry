'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _require = require('../multi-actor-environment/ActorUtils'),
  ACTOR_IDENTIFIER_FIELD_NAME = _require.ACTOR_IDENTIFIER_FIELD_NAME,
  getActorIdentifierFromPayload = _require.getActorIdentifierFromPayload;
var _require2 = require('../util/RelayConcreteNode'),
  ACTOR_CHANGE = _require2.ACTOR_CHANGE,
  CLIENT_COMPONENT = _require2.CLIENT_COMPONENT,
  CLIENT_EDGE_TO_CLIENT_OBJECT = _require2.CLIENT_EDGE_TO_CLIENT_OBJECT,
  CLIENT_EXTENSION = _require2.CLIENT_EXTENSION,
  CONDITION = _require2.CONDITION,
  DEFER = _require2.DEFER,
  FRAGMENT_SPREAD = _require2.FRAGMENT_SPREAD,
  INLINE_FRAGMENT = _require2.INLINE_FRAGMENT,
  LINKED_FIELD = _require2.LINKED_FIELD,
  LINKED_HANDLE = _require2.LINKED_HANDLE,
  MODULE_IMPORT = _require2.MODULE_IMPORT,
  RELAY_LIVE_RESOLVER = _require2.RELAY_LIVE_RESOLVER,
  RELAY_RESOLVER = _require2.RELAY_RESOLVER,
  SCALAR_FIELD = _require2.SCALAR_FIELD,
  SCALAR_HANDLE = _require2.SCALAR_HANDLE,
  STREAM = _require2.STREAM,
  TYPE_DISCRIMINATOR = _require2.TYPE_DISCRIMINATOR;
var _require3 = require('./ClientID'),
  generateClientID = _require3.generateClientID,
  isClientID = _require3.isClientID;
var _require4 = require('./RelayConcreteVariables'),
  getLocalVariables = _require4.getLocalVariables;
var _require5 = require('./RelayErrorTrie'),
  buildErrorTrie = _require5.buildErrorTrie,
  getErrorsByKey = _require5.getErrorsByKey,
  getNestedErrorTrieByKey = _require5.getNestedErrorTrieByKey;
var RelayModernRecord = require('./RelayModernRecord');
var _require6 = require('./RelayModernSelector'),
  createNormalizationSelector = _require6.createNormalizationSelector;
var _require7 = require('./RelayStoreUtils'),
  ROOT_ID = _require7.ROOT_ID,
  TYPENAME_KEY = _require7.TYPENAME_KEY,
  getArgumentValues = _require7.getArgumentValues,
  getHandleStorageKey = _require7.getHandleStorageKey,
  getModuleComponentKey = _require7.getModuleComponentKey,
  getModuleOperationKey = _require7.getModuleOperationKey,
  getStorageKey = _require7.getStorageKey;
var _require8 = require('./TypeID'),
  TYPE_SCHEMA_TYPE = _require8.TYPE_SCHEMA_TYPE,
  generateTypeID = _require8.generateTypeID;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
function normalize(recordSource, selector, response, options, errors) {
  var dataID = selector.dataID,
    node = selector.node,
    variables = selector.variables;
  var normalizer = new RelayResponseNormalizer(recordSource, variables, options);
  return normalizer.normalizeResponse(node, dataID, response, errors);
}
var RelayResponseNormalizer = /*#__PURE__*/function () {
  function RelayResponseNormalizer(recordSource, variables, options) {
    this._actorIdentifier = options.actorIdentifier;
    this._getDataId = options.getDataID;
    this._handleFieldPayloads = [];
    this._treatMissingFieldsAsNull = options.treatMissingFieldsAsNull;
    this._incrementalPlaceholders = [];
    this._isClientExtension = false;
    this._isUnmatchedAbstractType = false;
    this._followupPayloads = [];
    this._path = options.path ? (0, _toConsumableArray2["default"])(options.path) : [];
    this._recordSource = recordSource;
    this._variables = variables;
    this._shouldProcessClientComponents = options.shouldProcessClientComponents;
  }
  var _proto = RelayResponseNormalizer.prototype;
  _proto.normalizeResponse = function normalizeResponse(node, dataID, data, errors) {
    var record = this._recordSource.get(dataID);
    !record ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer(): Expected root record `%s` to exist.', dataID) : invariant(false) : void 0;
    this._assignClientAbstractTypes(node);
    this._errorTrie = buildErrorTrie(errors);
    this._traverseSelections(node, record, data);
    return {
      errors: errors,
      fieldPayloads: this._handleFieldPayloads,
      incrementalPlaceholders: this._incrementalPlaceholders,
      followupPayloads: this._followupPayloads,
      source: this._recordSource,
      isFinal: false
    };
  };
  _proto._assignClientAbstractTypes = function _assignClientAbstractTypes(node) {
    var clientAbstractTypes = node.clientAbstractTypes;
    if (clientAbstractTypes != null) {
      for (var _i = 0, _Object$keys = Object.keys(clientAbstractTypes); _i < _Object$keys.length; _i++) {
        var abstractType = _Object$keys[_i];
        var _iterator = (0, _createForOfIteratorHelper2["default"])(clientAbstractTypes[abstractType]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var concreteType = _step.value;
            var typeID = generateTypeID(concreteType);
            var typeRecord = this._recordSource.get(typeID);
            if (typeRecord == null) {
              typeRecord = RelayModernRecord.create(typeID, TYPE_SCHEMA_TYPE);
              this._recordSource.set(typeID, typeRecord);
            }
            RelayModernRecord.setValue(typeRecord, abstractType, true);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  };
  _proto._getVariableValue = function _getVariableValue(name) {
    !this._variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer(): Undefined variable `%s`.', name) : invariant(false) : void 0;
    return this._variables[name];
  };
  _proto._getRecordType = function _getRecordType(data) {
    var typeName = data[TYPENAME_KEY];
    !(typeName != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer(): Expected a typename for record `%s`.', JSON.stringify(data, null, 2)) : invariant(false) : void 0;
    return typeName;
  };
  _proto._traverseSelections = function _traverseSelections(node, record, data) {
    for (var i = 0; i < node.selections.length; i++) {
      var selection = node.selections[i];
      switch (selection.kind) {
        case SCALAR_FIELD:
        case LINKED_FIELD:
          this._normalizeField(selection, record, data);
          break;
        case CONDITION:
          var conditionValue = Boolean(this._getVariableValue(selection.condition));
          if (conditionValue === selection.passingValue) {
            this._traverseSelections(selection, record, data);
          }
          break;
        case FRAGMENT_SPREAD:
          {
            var prevVariables = this._variables;
            this._variables = getLocalVariables(this._variables, selection.fragment.argumentDefinitions, selection.args);
            this._traverseSelections(selection.fragment, record, data);
            this._variables = prevVariables;
            break;
          }
        case INLINE_FRAGMENT:
          {
            var abstractKey = selection.abstractKey;
            if (abstractKey == null) {
              var typeName = RelayModernRecord.getType(record);
              if (typeName === selection.type) {
                this._traverseSelections(selection, record, data);
              }
            } else {
              var implementsInterface = data.hasOwnProperty(abstractKey);
              var _typeName = RelayModernRecord.getType(record);
              var typeID = generateTypeID(_typeName);
              var typeRecord = this._recordSource.get(typeID);
              if (typeRecord == null) {
                typeRecord = RelayModernRecord.create(typeID, TYPE_SCHEMA_TYPE);
                this._recordSource.set(typeID, typeRecord);
              }
              RelayModernRecord.setValue(typeRecord, abstractKey, implementsInterface);
              if (implementsInterface) {
                this._traverseSelections(selection, record, data);
              }
            }
            break;
          }
        case TYPE_DISCRIMINATOR:
          {
            var _abstractKey = selection.abstractKey;
            var _implementsInterface = data.hasOwnProperty(_abstractKey);
            var _typeName2 = RelayModernRecord.getType(record);
            var _typeID = generateTypeID(_typeName2);
            var _typeRecord = this._recordSource.get(_typeID);
            if (_typeRecord == null) {
              _typeRecord = RelayModernRecord.create(_typeID, TYPE_SCHEMA_TYPE);
              this._recordSource.set(_typeID, _typeRecord);
            }
            RelayModernRecord.setValue(_typeRecord, _abstractKey, _implementsInterface);
            break;
          }
        case LINKED_HANDLE:
        case SCALAR_HANDLE:
          var args = selection.args ? getArgumentValues(selection.args, this._variables) : {};
          var fieldKey = getStorageKey(selection, this._variables);
          var handleKey = getHandleStorageKey(selection, this._variables);
          this._handleFieldPayloads.push({
            args: args,
            dataID: RelayModernRecord.getDataID(record),
            fieldKey: fieldKey,
            handle: selection.handle,
            handleKey: handleKey,
            handleArgs: selection.handleArgs ? getArgumentValues(selection.handleArgs, this._variables) : {}
          });
          break;
        case MODULE_IMPORT:
          this._normalizeModuleImport(selection, record, data);
          break;
        case DEFER:
          this._normalizeDefer(selection, record, data);
          break;
        case STREAM:
          this._normalizeStream(selection, record, data);
          break;
        case CLIENT_EXTENSION:
          var isClientExtension = this._isClientExtension;
          this._isClientExtension = true;
          this._traverseSelections(selection, record, data);
          this._isClientExtension = isClientExtension;
          break;
        case CLIENT_COMPONENT:
          if (this._shouldProcessClientComponents === false) {
            break;
          }
          this._traverseSelections(selection.fragment, record, data);
          break;
        case ACTOR_CHANGE:
          this._normalizeActorChange(selection, record, data);
          break;
        case RELAY_RESOLVER:
          this._normalizeResolver(selection, record, data);
          break;
        case RELAY_LIVE_RESOLVER:
          this._normalizeResolver(selection, record, data);
          break;
        case CLIENT_EDGE_TO_CLIENT_OBJECT:
          this._normalizeResolver(selection.backingField, record, data);
          break;
        default:
          selection;
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0;
      }
    }
  };
  _proto._normalizeResolver = function _normalizeResolver(resolver, record, data) {
    if (resolver.fragment != null) {
      this._traverseSelections(resolver.fragment, record, data);
    }
  };
  _proto._normalizeDefer = function _normalizeDefer(defer, record, data) {
    var isDeferred = defer["if"] === null || this._getVariableValue(defer["if"]);
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning(typeof isDeferred === 'boolean', 'RelayResponseNormalizer: Expected value for @defer `if` argument to ' + 'be a boolean, got `%s`.', isDeferred) : void 0;
    }
    if (isDeferred === false) {
      this._traverseSelections(defer, record, data);
    } else {
      this._incrementalPlaceholders.push({
        kind: 'defer',
        data: data,
        label: defer.label,
        path: (0, _toConsumableArray2["default"])(this._path),
        selector: createNormalizationSelector(defer, RelayModernRecord.getDataID(record), this._variables),
        typeName: RelayModernRecord.getType(record),
        actorIdentifier: this._actorIdentifier
      });
    }
  };
  _proto._normalizeStream = function _normalizeStream(stream, record, data) {
    this._traverseSelections(stream, record, data);
    var isStreamed = stream["if"] === null || this._getVariableValue(stream["if"]);
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning(typeof isStreamed === 'boolean', 'RelayResponseNormalizer: Expected value for @stream `if` argument ' + 'to be a boolean, got `%s`.', isStreamed) : void 0;
    }
    if (isStreamed === true) {
      this._incrementalPlaceholders.push({
        kind: 'stream',
        label: stream.label,
        path: (0, _toConsumableArray2["default"])(this._path),
        parentID: RelayModernRecord.getDataID(record),
        node: stream,
        variables: this._variables,
        actorIdentifier: this._actorIdentifier
      });
    }
  };
  _proto._normalizeModuleImport = function _normalizeModuleImport(moduleImport, record, data) {
    !(typeof data === 'object' && data) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected data for @module to be an object.') : invariant(false) : void 0;
    var typeName = RelayModernRecord.getType(record);
    var componentKey = getModuleComponentKey(moduleImport.documentName);
    var componentReference = moduleImport.componentModuleProvider || data[componentKey];
    RelayModernRecord.setValue(record, componentKey, componentReference !== null && componentReference !== void 0 ? componentReference : null);
    var operationKey = getModuleOperationKey(moduleImport.documentName);
    var operationReference = moduleImport.operationModuleProvider || data[operationKey];
    RelayModernRecord.setValue(record, operationKey, operationReference !== null && operationReference !== void 0 ? operationReference : null);
    if (operationReference != null) {
      this._followupPayloads.push({
        kind: 'ModuleImportPayload',
        args: moduleImport.args,
        data: data,
        dataID: RelayModernRecord.getDataID(record),
        operationReference: operationReference,
        path: (0, _toConsumableArray2["default"])(this._path),
        typeName: typeName,
        variables: this._variables,
        actorIdentifier: this._actorIdentifier
      });
    }
  };
  _proto._normalizeField = function _normalizeField(selection, record, data) {
    !(typeof data === 'object' && data) ? process.env.NODE_ENV !== "production" ? invariant(false, 'writeField(): Expected data for field `%s` to be an object.', selection.name) : invariant(false) : void 0;
    var responseKey = selection.alias || selection.name;
    var storageKey = getStorageKey(selection, this._variables);
    var fieldValue = data[responseKey];
    if (fieldValue == null) {
      if (fieldValue === undefined) {
        var isOptionalField = this._isClientExtension || this._isUnmatchedAbstractType;
        if (isOptionalField) {
          return;
        } else if (!this._treatMissingFieldsAsNull) {
          if (process.env.NODE_ENV !== "production") {
            process.env.NODE_ENV !== "production" ? warning(false, 'RelayResponseNormalizer: Payload did not contain a value ' + 'for field `%s: %s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload.', responseKey, storageKey) : void 0;
          }
          return;
        }
      }
      if (process.env.NODE_ENV !== "production") {
        if (selection.kind === SCALAR_FIELD) {
          this._validateConflictingFieldsWithIdenticalId(record, storageKey, null);
        }
      }
      RelayModernRecord.setValue(record, storageKey, null);
      var errorTrie = this._errorTrie;
      if (errorTrie != null) {
        var errors = getErrorsByKey(errorTrie, responseKey);
        if (errors != null) {
          RelayModernRecord.setErrors(record, storageKey, errors);
        }
      }
      return;
    }
    if (selection.kind === SCALAR_FIELD) {
      if (process.env.NODE_ENV !== "production") {
        this._validateConflictingFieldsWithIdenticalId(record, storageKey, fieldValue);
      }
      RelayModernRecord.setValue(record, storageKey, fieldValue);
    } else if (selection.kind === LINKED_FIELD) {
      this._path.push(responseKey);
      var oldErrorTrie = this._errorTrie;
      this._errorTrie = oldErrorTrie == null ? null : getNestedErrorTrieByKey(oldErrorTrie, responseKey);
      if (selection.plural) {
        this._normalizePluralLink(selection, record, storageKey, fieldValue);
      } else {
        this._normalizeLink(selection, record, storageKey, fieldValue);
      }
      this._errorTrie = oldErrorTrie;
      this._path.pop();
    } else {
      selection;
      !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s` during normalization.', selection.kind) : invariant(false) : void 0;
    }
  };
  _proto._normalizeActorChange = function _normalizeActorChange(selection, record, data) {
    var _field$concreteType;
    var field = selection.linkedField;
    !(typeof data === 'object' && data) ? process.env.NODE_ENV !== "production" ? invariant(false, '_normalizeActorChange(): Expected data for field `%s` to be an object.', field.name) : invariant(false) : void 0;
    var responseKey = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var fieldValue = data[responseKey];
    if (fieldValue == null) {
      if (fieldValue === undefined) {
        var isOptionalField = this._isClientExtension || this._isUnmatchedAbstractType;
        if (isOptionalField) {
          return;
        } else if (!this._treatMissingFieldsAsNull) {
          if (process.env.NODE_ENV !== "production") {
            process.env.NODE_ENV !== "production" ? warning(false, 'RelayResponseNormalizer: Payload did not contain a value ' + 'for field `%s: %s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload.', responseKey, storageKey) : void 0;
          }
          return;
        }
      }
      RelayModernRecord.setValue(record, storageKey, null);
      return;
    }
    var actorIdentifier = getActorIdentifierFromPayload(fieldValue);
    if (actorIdentifier == null) {
      if (process.env.NODE_ENV !== "production") {
        process.env.NODE_ENV !== "production" ? warning(false, 'RelayResponseNormalizer: Payload did not contain a value ' + 'for field `%s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload. Payload is `%s`.', ACTOR_IDENTIFIER_FIELD_NAME, JSON.stringify(fieldValue, null, 2)) : void 0;
      }
      RelayModernRecord.setValue(record, storageKey, null);
      return;
    }
    var typeName = (_field$concreteType = field.concreteType) !== null && _field$concreteType !== void 0 ? _field$concreteType : this._getRecordType(fieldValue);
    var nextID = this._getDataId(fieldValue, typeName) || RelayModernRecord.getLinkedRecordID(record, storageKey) || generateClientID(RelayModernRecord.getDataID(record), storageKey);
    !(typeof nextID === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected id on field `%s` to be a string.', storageKey) : invariant(false) : void 0;
    RelayModernRecord.setActorLinkedRecordID(record, storageKey, actorIdentifier, nextID);
    this._followupPayloads.push({
      kind: 'ActorPayload',
      data: fieldValue,
      dataID: nextID,
      path: [].concat((0, _toConsumableArray2["default"])(this._path), [responseKey]),
      typeName: typeName,
      variables: this._variables,
      node: field,
      actorIdentifier: actorIdentifier
    });
  };
  _proto._normalizeLink = function _normalizeLink(field, record, storageKey, fieldValue) {
    var _field$concreteType2;
    !(typeof fieldValue === 'object' && fieldValue) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected data for field `%s` to be an object.', storageKey) : invariant(false) : void 0;
    var nextID = this._getDataId(fieldValue, (_field$concreteType2 = field.concreteType) !== null && _field$concreteType2 !== void 0 ? _field$concreteType2 : this._getRecordType(fieldValue)) || RelayModernRecord.getLinkedRecordID(record, storageKey) || generateClientID(RelayModernRecord.getDataID(record), storageKey);
    !(typeof nextID === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected id on field `%s` to be a string.', storageKey) : invariant(false) : void 0;
    if (process.env.NODE_ENV !== "production") {
      this._validateConflictingLinkedFieldsWithIdenticalId(RelayModernRecord.getLinkedRecordID(record, storageKey), nextID, storageKey);
    }
    RelayModernRecord.setLinkedRecordID(record, storageKey, nextID);
    var nextRecord = this._recordSource.get(nextID);
    if (!nextRecord) {
      var typeName = field.concreteType || this._getRecordType(fieldValue);
      nextRecord = RelayModernRecord.create(nextID, typeName);
      this._recordSource.set(nextID, nextRecord);
    } else if (process.env.NODE_ENV !== "production") {
      this._validateRecordType(nextRecord, field, fieldValue);
    }
    this._traverseSelections(field, nextRecord, fieldValue);
  };
  _proto._normalizePluralLink = function _normalizePluralLink(field, record, storageKey, fieldValue) {
    var _this = this;
    !Array.isArray(fieldValue) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected data for field `%s` to be an array ' + 'of objects.', storageKey) : invariant(false) : void 0;
    var prevIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);
    var nextIDs = [];
    fieldValue.forEach(function (item, nextIndex) {
      var _field$concreteType3;
      if (item == null) {
        nextIDs.push(item);
        return;
      }
      _this._path.push(String(nextIndex));
      var oldErrorTrie = _this._errorTrie;
      _this._errorTrie = oldErrorTrie == null ? null : getNestedErrorTrieByKey(oldErrorTrie, nextIndex);
      !(typeof item === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected elements for field `%s` to be ' + 'objects.', storageKey) : invariant(false) : void 0;
      var nextID = _this._getDataId(item, (_field$concreteType3 = field.concreteType) !== null && _field$concreteType3 !== void 0 ? _field$concreteType3 : _this._getRecordType(item)) || prevIDs && prevIDs[nextIndex] || generateClientID(RelayModernRecord.getDataID(record), storageKey, nextIndex);
      !(typeof nextID === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayResponseNormalizer: Expected id of elements of field `%s` to ' + 'be strings.', storageKey) : invariant(false) : void 0;
      nextIDs.push(nextID);
      var nextRecord = _this._recordSource.get(nextID);
      if (!nextRecord) {
        var typeName = field.concreteType || _this._getRecordType(item);
        nextRecord = RelayModernRecord.create(nextID, typeName);
        _this._recordSource.set(nextID, nextRecord);
      } else if (process.env.NODE_ENV !== "production") {
        _this._validateRecordType(nextRecord, field, item);
      }
      if (process.env.NODE_ENV !== "production") {
        if (prevIDs) {
          _this._validateConflictingLinkedFieldsWithIdenticalId(prevIDs[nextIndex], nextID, storageKey);
        }
      }
      _this._traverseSelections(field, nextRecord, item);
      _this._errorTrie = oldErrorTrie;
      _this._path.pop();
    });
    RelayModernRecord.setLinkedRecordIDs(record, storageKey, nextIDs);
  };
  _proto._validateRecordType = function _validateRecordType(record, field, payload) {
    var _field$concreteType4;
    var typeName = (_field$concreteType4 = field.concreteType) !== null && _field$concreteType4 !== void 0 ? _field$concreteType4 : this._getRecordType(payload);
    var dataID = RelayModernRecord.getDataID(record);
    process.env.NODE_ENV !== "production" ? warning(isClientID(dataID) && dataID !== ROOT_ID || RelayModernRecord.getType(record) === typeName, 'RelayResponseNormalizer: Invalid record `%s`. Expected %s to be ' + 'consistent, but the record was assigned conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', dataID, TYPENAME_KEY, RelayModernRecord.getType(record), typeName) : void 0;
  };
  _proto._validateConflictingFieldsWithIdenticalId = function _validateConflictingFieldsWithIdenticalId(record, storageKey, fieldValue) {
    if (process.env.NODE_ENV !== "production") {
      var dataID = RelayModernRecord.getDataID(record);
      var previousValue = RelayModernRecord.getValue(record, storageKey);
      process.env.NODE_ENV !== "production" ? warning(storageKey === TYPENAME_KEY || previousValue === undefined || areEqual(previousValue, fieldValue), 'RelayResponseNormalizer: Invalid record. The record contains two ' + 'instances of the same id: `%s` with conflicting field, %s and its values: %s and %s. ' + 'If two fields are different but share ' + 'the same id, one field will overwrite the other.', dataID, storageKey, previousValue, fieldValue) : void 0;
    }
  };
  _proto._validateConflictingLinkedFieldsWithIdenticalId = function _validateConflictingLinkedFieldsWithIdenticalId(prevID, nextID, storageKey) {
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning(prevID === undefined || prevID === nextID, 'RelayResponseNormalizer: Invalid record. The record contains ' + 'references to the conflicting field, %s and its id values: %s and %s. ' + 'We need to make sure that the record the field points ' + 'to remains consistent or one field will overwrite the other.', storageKey, prevID, nextID) : void 0;
    }
  };
  return RelayResponseNormalizer;
}();
module.exports = {
  normalize: normalize
};