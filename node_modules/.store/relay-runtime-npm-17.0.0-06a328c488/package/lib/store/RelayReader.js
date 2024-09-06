'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _require = require('../util/RelayConcreteNode'),
  ACTOR_CHANGE = _require.ACTOR_CHANGE,
  ALIASED_FRAGMENT_SPREAD = _require.ALIASED_FRAGMENT_SPREAD,
  ALIASED_INLINE_FRAGMENT_SPREAD = _require.ALIASED_INLINE_FRAGMENT_SPREAD,
  CATCH_FIELD = _require.CATCH_FIELD,
  CLIENT_EDGE_TO_CLIENT_OBJECT = _require.CLIENT_EDGE_TO_CLIENT_OBJECT,
  CLIENT_EDGE_TO_SERVER_OBJECT = _require.CLIENT_EDGE_TO_SERVER_OBJECT,
  CLIENT_EXTENSION = _require.CLIENT_EXTENSION,
  CONDITION = _require.CONDITION,
  DEFER = _require.DEFER,
  FRAGMENT_SPREAD = _require.FRAGMENT_SPREAD,
  INLINE_DATA_FRAGMENT_SPREAD = _require.INLINE_DATA_FRAGMENT_SPREAD,
  INLINE_FRAGMENT = _require.INLINE_FRAGMENT,
  LINKED_FIELD = _require.LINKED_FIELD,
  MODULE_IMPORT = _require.MODULE_IMPORT,
  RELAY_LIVE_RESOLVER = _require.RELAY_LIVE_RESOLVER,
  RELAY_RESOLVER = _require.RELAY_RESOLVER,
  REQUIRED_FIELD = _require.REQUIRED_FIELD,
  SCALAR_FIELD = _require.SCALAR_FIELD,
  STREAM = _require.STREAM;
var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var _require2 = require('./experimental-live-resolvers/LiveResolverSuspenseSentinel'),
  isSuspenseSentinel = _require2.isSuspenseSentinel;
var RelayConcreteVariables = require('./RelayConcreteVariables');
var RelayModernRecord = require('./RelayModernRecord');
var _require3 = require('./RelayStoreUtils'),
  CLIENT_EDGE_TRAVERSAL_PATH = _require3.CLIENT_EDGE_TRAVERSAL_PATH,
  FRAGMENT_OWNER_KEY = _require3.FRAGMENT_OWNER_KEY,
  FRAGMENT_PROP_NAME_KEY = _require3.FRAGMENT_PROP_NAME_KEY,
  FRAGMENTS_KEY = _require3.FRAGMENTS_KEY,
  ID_KEY = _require3.ID_KEY,
  MODULE_COMPONENT_KEY = _require3.MODULE_COMPONENT_KEY,
  ROOT_ID = _require3.ROOT_ID,
  getArgumentValues = _require3.getArgumentValues,
  getModuleComponentKey = _require3.getModuleComponentKey,
  getStorageKey = _require3.getStorageKey;
var _require4 = require('./ResolverCache'),
  NoopResolverCache = _require4.NoopResolverCache;
var _require5 = require('./ResolverFragments'),
  RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL = _require5.RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL,
  withResolverContext = _require5.withResolverContext;
var _require6 = require('./TypeID'),
  generateTypeID = _require6.generateTypeID;
var invariant = require('invariant');
function read(recordSource, selector, resolverCache) {
  var reader = new RelayReader(recordSource, selector, resolverCache !== null && resolverCache !== void 0 ? resolverCache : new NoopResolverCache());
  return reader.read();
}
var RelayReader = /*#__PURE__*/function () {
  function RelayReader(recordSource, selector, resolverCache) {
    var _selector$clientEdgeT;
    this._clientEdgeTraversalPath = (_selector$clientEdgeT = selector.clientEdgeTraversalPath) !== null && _selector$clientEdgeT !== void 0 && _selector$clientEdgeT.length ? (0, _toConsumableArray2["default"])(selector.clientEdgeTraversalPath) : [];
    this._missingClientEdges = [];
    this._missingLiveResolverFields = [];
    this._isMissingData = false;
    this._isWithinUnmatchedTypeRefinement = false;
    this._missingRequiredFields = null;
    this._errorResponseFields = null;
    this._owner = selector.owner;
    this._recordSource = recordSource;
    this._seenRecords = new Set();
    this._selector = selector;
    this._variables = selector.variables;
    this._resolverCache = resolverCache;
    this._resolverErrors = [];
    this._fragmentName = selector.node.name;
    this._updatedDataIDs = new Set();
  }
  var _proto = RelayReader.prototype;
  _proto.read = function read() {
    var _this$_selector = this._selector,
      node = _this$_selector.node,
      dataID = _this$_selector.dataID,
      isWithinUnmatchedTypeRefinement = _this$_selector.isWithinUnmatchedTypeRefinement;
    var abstractKey = node.abstractKey;
    var record = this._recordSource.get(dataID);
    var isDataExpectedToBePresent = !isWithinUnmatchedTypeRefinement;
    if (isDataExpectedToBePresent && abstractKey == null && record != null) {
      var recordType = RelayModernRecord.getType(record);
      if (recordType !== node.type && dataID !== ROOT_ID) {
        isDataExpectedToBePresent = false;
      }
    }
    if (isDataExpectedToBePresent && abstractKey != null && record != null) {
      var implementsInterface = this._implementsInterface(record, abstractKey);
      if (implementsInterface === false) {
        isDataExpectedToBePresent = false;
      } else if (implementsInterface == null) {
        this._isMissingData = true;
      }
    }
    this._isWithinUnmatchedTypeRefinement = !isDataExpectedToBePresent;
    var data = this._traverse(node, dataID, null);
    if (this._updatedDataIDs.size > 0) {
      this._resolverCache.notifyUpdatedSubscribers(this._updatedDataIDs);
      this._updatedDataIDs.clear();
    }
    return {
      data: data,
      isMissingData: this._isMissingData && isDataExpectedToBePresent,
      missingClientEdges: this._missingClientEdges.length ? this._missingClientEdges : null,
      missingLiveResolverFields: this._missingLiveResolverFields,
      seenRecords: this._seenRecords,
      selector: this._selector,
      missingRequiredFields: this._missingRequiredFields,
      relayResolverErrors: this._resolverErrors,
      errorResponseFields: this._errorResponseFields
    };
  };
  _proto._maybeAddErrorResponseFields = function _maybeAddErrorResponseFields(record, storageKey) {
    if (!RelayFeatureFlags.ENABLE_FIELD_ERROR_HANDLING) {
      return;
    }
    var errors = RelayModernRecord.getErrors(record, storageKey);
    if (errors == null) {
      return;
    }
    var owner = this._fragmentName;
    if (this._errorResponseFields == null) {
      this._errorResponseFields = [];
    }
    var _iterator = (0, _createForOfIteratorHelper2["default"])(errors),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _error$path;
        var error = _step.value;
        this._errorResponseFields.push({
          owner: owner,
          path: ((_error$path = error.path) !== null && _error$path !== void 0 ? _error$path : []).join('.'),
          error: error
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  _proto._markDataAsMissing = function _markDataAsMissing() {
    this._isMissingData = true;
    if (this._clientEdgeTraversalPath.length) {
      var top = this._clientEdgeTraversalPath[this._clientEdgeTraversalPath.length - 1];
      if (top !== null) {
        this._missingClientEdges.push({
          request: top.readerClientEdge.operation,
          clientEdgeDestinationID: top.clientEdgeDestinationID
        });
      }
    }
  };
  _proto._traverse = function _traverse(node, dataID, prevData) {
    var record = this._recordSource.get(dataID);
    this._seenRecords.add(dataID);
    if (record == null) {
      if (record === undefined) {
        this._markDataAsMissing();
      }
      return record;
    }
    var data = prevData || {};
    var hadRequiredData = this._traverseSelections(node.selections, record, data);
    return hadRequiredData ? data : null;
  };
  _proto._getVariableValue = function _getVariableValue(name) {
    !this._variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Undefined variable `%s`.', name) : invariant(false) : void 0;
    return this._variables[name];
  };
  _proto._maybeReportUnexpectedNull = function _maybeReportUnexpectedNull(fieldPath, action) {
    var _this$_missingRequire;
    if (((_this$_missingRequire = this._missingRequiredFields) === null || _this$_missingRequire === void 0 ? void 0 : _this$_missingRequire.action) === 'THROW') {
      return;
    }
    var owner = this._fragmentName;
    switch (action) {
      case 'THROW':
        this._missingRequiredFields = {
          action: action,
          field: {
            path: fieldPath,
            owner: owner
          }
        };
        return;
      case 'LOG':
        if (this._missingRequiredFields == null) {
          this._missingRequiredFields = {
            action: action,
            fields: [{
              path: fieldPath,
              owner: owner
            }]
          };
        } else {
          this._missingRequiredFields = {
            action: action,
            fields: [].concat((0, _toConsumableArray2["default"])(this._missingRequiredFields.fields), [{
              path: fieldPath,
              owner: owner
            }])
          };
        }
        return;
      default:
        action;
    }
  };
  _proto._handleCatchFieldValue = function _handleCatchFieldValue(selection, record, data, value) {
    var _selection$field$back, _selection$field, _field$alias, _this$_missingRequire2;
    var to = selection.to;
    var field = (_selection$field$back = (_selection$field = selection.field) === null || _selection$field === void 0 ? void 0 : _selection$field.backingField) !== null && _selection$field$back !== void 0 ? _selection$field$back : selection.field;
    var fieldName = (_field$alias = field === null || field === void 0 ? void 0 : field.alias) !== null && _field$alias !== void 0 ? _field$alias : field === null || field === void 0 ? void 0 : field.name;
    !(fieldName != null) ? process.env.NODE_ENV !== "production" ? invariant(false, "Couldn't determine field name for this field. It might be a ReaderClientExtension - which is not yet supported.") : invariant(false) : void 0;
    if (this._errorResponseFields != null) {
      for (var i = 0; i < this._errorResponseFields.length; i++) {
        this._errorResponseFields[i].to = to;
      }
    }
    if (((_this$_missingRequire2 = this._missingRequiredFields) === null || _this$_missingRequire2 === void 0 ? void 0 : _this$_missingRequire2.action) === 'THROW') {
      var _this$_missingRequire3;
      if (((_this$_missingRequire3 = this._missingRequiredFields) === null || _this$_missingRequire3 === void 0 ? void 0 : _this$_missingRequire3.field) == null) {
        return;
      }
      if (this._errorResponseFields == null) {
        this._errorResponseFields = [];
      }
      var _this$_missingRequire4 = this._missingRequiredFields.field,
        owner = _this$_missingRequire4.owner,
        path = _this$_missingRequire4.path;
      this._errorResponseFields.push({
        owner: owner,
        path: path,
        error: {
          message: "Relay: Missing @required value at path '".concat(path, "' in '").concat(owner, "'.")
        },
        to: to
      });
      this._missingRequiredFields = null;
      return;
    }
    if (this._errorResponseFields != null) {
      var errors = this._errorResponseFields.map(function (error) {
        return error.error;
      });
      data[fieldName] = {
        ok: false,
        errors: errors
      };
      return;
    }
    data[fieldName] = {
      ok: true,
      value: value
    };
  };
  _proto._handleRequiredFieldValue = function _handleRequiredFieldValue(selection, value) {
    if (value == null) {
      var action = selection.action;
      if (action !== 'NONE') {
        this._maybeReportUnexpectedNull(selection.path, action);
      }
      return false;
    }
    return true;
  };
  _proto._traverseSelections = function _traverseSelections(selections, record, data) {
    for (var i = 0; i < selections.length; i++) {
      var selection = selections[i];
      switch (selection.kind) {
        case REQUIRED_FIELD:
          var requiredFieldValue = this._readClientSideDirectiveField(selection, record, data);
          if (!this._handleRequiredFieldValue(selection, requiredFieldValue)) {
            return false;
          }
          break;
        case CATCH_FIELD:
          var catchFieldValue = this._readClientSideDirectiveField(selection, record, data);
          if (RelayFeatureFlags.ENABLE_FIELD_ERROR_HANDLING_CATCH_DIRECTIVE) {
            if (selection.to != 'NULL') {
              this._handleCatchFieldValue(selection, record, data, catchFieldValue);
            }
          }
          break;
        case SCALAR_FIELD:
          this._readScalar(selection, record, data);
          break;
        case LINKED_FIELD:
          if (selection.plural) {
            this._readPluralLink(selection, record, data);
          } else {
            this._readLink(selection, record, data);
          }
          break;
        case CONDITION:
          var conditionValue = Boolean(this._getVariableValue(selection.condition));
          if (conditionValue === selection.passingValue) {
            var hasExpectedData = this._traverseSelections(selection.selections, record, data);
            if (!hasExpectedData) {
              return false;
            }
          }
          break;
        case INLINE_FRAGMENT:
          {
            if (this._readInlineFragment(selection, record, data) === false) {
              return false;
            }
            break;
          }
        case RELAY_LIVE_RESOLVER:
        case RELAY_RESOLVER:
          {
            if (!RelayFeatureFlags.ENABLE_RELAY_RESOLVERS) {
              throw new Error('Relay Resolver fields are not yet supported.');
            }
            this._readResolverField(selection, record, data);
            break;
          }
        case FRAGMENT_SPREAD:
          this._createFragmentPointer(selection, record, data);
          break;
        case ALIASED_FRAGMENT_SPREAD:
          data[selection.name] = this._createAliasedFragmentSpread(selection, record);
          break;
        case ALIASED_INLINE_FRAGMENT_SPREAD:
          {
            var fieldValue = this._readInlineFragment(selection.fragment, record, {});
            if (fieldValue === false) {
              fieldValue = null;
            }
            data[selection.name] = fieldValue;
            break;
          }
        case MODULE_IMPORT:
          this._readModuleImport(selection, record, data);
          break;
        case INLINE_DATA_FRAGMENT_SPREAD:
          this._createInlineDataOrResolverFragmentPointer(selection, record, data);
          break;
        case DEFER:
        case CLIENT_EXTENSION:
          {
            var isMissingData = this._isMissingData;
            var alreadyMissingClientEdges = this._missingClientEdges.length;
            this._clientEdgeTraversalPath.push(null);
            var _hasExpectedData = this._traverseSelections(selection.selections, record, data);
            this._isMissingData = isMissingData || this._missingClientEdges.length > alreadyMissingClientEdges || this._missingLiveResolverFields.length > 0;
            this._clientEdgeTraversalPath.pop();
            if (!_hasExpectedData) {
              return false;
            }
            break;
          }
        case STREAM:
          {
            var _hasExpectedData2 = this._traverseSelections(selection.selections, record, data);
            if (!_hasExpectedData2) {
              return false;
            }
            break;
          }
        case ACTOR_CHANGE:
          this._readActorChange(selection, record, data);
          break;
        case CLIENT_EDGE_TO_CLIENT_OBJECT:
        case CLIENT_EDGE_TO_SERVER_OBJECT:
          this._readClientEdge(selection, record, data);
          break;
        default:
          selection;
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0;
      }
    }
    return true;
  };
  _proto._readClientSideDirectiveField = function _readClientSideDirectiveField(selection, record, data) {
    switch (selection.field.kind) {
      case SCALAR_FIELD:
        return this._readScalar(selection.field, record, data);
      case LINKED_FIELD:
        if (selection.field.plural) {
          return this._readPluralLink(selection.field, record, data);
        } else {
          return this._readLink(selection.field, record, data);
        }
      case RELAY_RESOLVER:
        if (!RelayFeatureFlags.ENABLE_RELAY_RESOLVERS) {
          throw new Error('Relay Resolver fields are not yet supported.');
        }
        return this._readResolverField(selection.field, record, data);
      case RELAY_LIVE_RESOLVER:
        if (!RelayFeatureFlags.ENABLE_RELAY_RESOLVERS) {
          throw new Error('Relay Resolver fields are not yet supported.');
        }
        return this._readResolverField(selection.field, record, data);
      case CLIENT_EDGE_TO_CLIENT_OBJECT:
      case CLIENT_EDGE_TO_SERVER_OBJECT:
        if (!RelayFeatureFlags.ENABLE_RELAY_RESOLVERS) {
          throw new Error('Relay Resolver fields are not yet supported.');
        }
        return this._readClientEdge(selection.field, record, data);
      default:
        selection.field.kind;
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0;
    }
  };
  _proto._readResolverField = function _readResolverField(field, record, data) {
    var _field$alias2;
    var parentRecordID = RelayModernRecord.getDataID(record);
    var result = this._readResolverFieldImpl(field, parentRecordID);
    var fieldName = (_field$alias2 = field.alias) !== null && _field$alias2 !== void 0 ? _field$alias2 : field.name;
    data[fieldName] = result;
    return result;
  };
  _proto._readResolverFieldImpl = function _readResolverFieldImpl(field, parentRecordID) {
    var _this = this;
    var fragment = field.fragment;
    var snapshot;
    var getDataForResolverFragment = function getDataForResolverFragment(singularReaderSelector) {
      if (snapshot != null) {
        return {
          data: snapshot.data,
          isMissingData: snapshot.isMissingData
        };
      }
      snapshot = read(_this._recordSource, singularReaderSelector, _this._resolverCache);
      return {
        data: snapshot.data,
        isMissingData: snapshot.isMissingData
      };
    };
    var evaluate = function evaluate() {
      if (fragment != null) {
        var key = {
          __id: parentRecordID,
          __fragmentOwner: _this._owner,
          __fragments: (0, _defineProperty2["default"])({}, fragment.name, fragment.args ? getArgumentValues(fragment.args, _this._variables) : {})
        };
        var resolverContext = {
          getDataForResolverFragment: getDataForResolverFragment
        };
        return withResolverContext(resolverContext, function () {
          var _getResolverValue = getResolverValue(field, _this._variables, key),
            resolverResult = _getResolverValue[0],
            resolverError = _getResolverValue[1];
          return {
            resolverResult: resolverResult,
            snapshot: snapshot,
            error: resolverError
          };
        });
      } else {
        var _getResolverValue2 = getResolverValue(field, _this._variables, null),
          resolverResult = _getResolverValue2[0],
          _resolverError = _getResolverValue2[1];
        return {
          resolverResult: resolverResult,
          snapshot: undefined,
          error: _resolverError
        };
      }
    };
    var _this$_resolverCache$ = this._resolverCache.readFromCacheOrEvaluate(parentRecordID, field, this._variables, evaluate, getDataForResolverFragment),
      result = _this$_resolverCache$[0],
      seenRecord = _this$_resolverCache$[1],
      resolverError = _this$_resolverCache$[2],
      cachedSnapshot = _this$_resolverCache$[3],
      suspenseID = _this$_resolverCache$[4],
      updatedDataIDs = _this$_resolverCache$[5];
    this._propogateResolverMetadata(field.path, cachedSnapshot, resolverError, seenRecord, suspenseID, updatedDataIDs);
    return result;
  };
  _proto._propogateResolverMetadata = function _propogateResolverMetadata(fieldPath, cachedSnapshot, resolverError, seenRecord, suspenseID, updatedDataIDs) {
    if (cachedSnapshot != null) {
      if (cachedSnapshot.missingRequiredFields != null) {
        this._addMissingRequiredFields(cachedSnapshot.missingRequiredFields);
      }
      if (cachedSnapshot.missingClientEdges != null) {
        var _iterator2 = (0, _createForOfIteratorHelper2["default"])(cachedSnapshot.missingClientEdges),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var missing = _step2.value;
            this._missingClientEdges.push(missing);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      if (cachedSnapshot.missingLiveResolverFields != null) {
        this._isMissingData = this._isMissingData || cachedSnapshot.missingLiveResolverFields.length > 0;
        var _iterator3 = (0, _createForOfIteratorHelper2["default"])(cachedSnapshot.missingLiveResolverFields),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var missingResolverField = _step3.value;
            this._missingLiveResolverFields.push(missingResolverField);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      var _iterator4 = (0, _createForOfIteratorHelper2["default"])(cachedSnapshot.relayResolverErrors),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var error = _step4.value;
          this._resolverErrors.push(error);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      this._isMissingData = this._isMissingData || cachedSnapshot.isMissingData;
    }
    if (resolverError) {
      this._resolverErrors.push({
        field: {
          path: fieldPath,
          owner: this._fragmentName
        },
        error: resolverError
      });
    }
    if (seenRecord != null) {
      this._seenRecords.add(seenRecord);
    }
    if (suspenseID != null) {
      this._isMissingData = true;
      this._missingLiveResolverFields.push({
        path: "".concat(this._fragmentName, ".").concat(fieldPath),
        liveStateID: suspenseID
      });
    }
    if (updatedDataIDs != null) {
      var _iterator5 = (0, _createForOfIteratorHelper2["default"])(updatedDataIDs),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var recordID = _step5.value;
          this._updatedDataIDs.add(recordID);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  };
  _proto._readClientEdge = function _readClientEdge(field, record, data) {
    var _this2 = this;
    var _backingField$alias;
    var backingField = field.backingField;
    !(backingField.kind !== 'ClientExtension') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Client extension client edges are not yet implemented.') : invariant(false) : void 0;
    var fieldName = (_backingField$alias = backingField.alias) !== null && _backingField$alias !== void 0 ? _backingField$alias : backingField.name;
    var backingFieldData = {};
    this._traverseSelections([backingField], record, backingFieldData);
    var clientEdgeResolverResponse = backingFieldData[fieldName];
    if (clientEdgeResolverResponse == null || isSuspenseSentinel(clientEdgeResolverResponse)) {
      data[fieldName] = clientEdgeResolverResponse;
      return clientEdgeResolverResponse;
    }
    if (field.linkedField.plural) {
      !Array.isArray(clientEdgeResolverResponse) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected plural Client Edge Relay Resolver to return an array containing IDs or objects with shape {id}.') : invariant(false) : void 0;
      var storeIDs;
      !(field.kind === CLIENT_EDGE_TO_CLIENT_OBJECT) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Unexpected Client Edge to plural server type. This should be prevented by the compiler.') : invariant(false) : void 0;
      if (field.backingField.normalizationInfo == null) {
        storeIDs = clientEdgeResolverResponse.map(function (itemResponse) {
          var _field$concreteType;
          var concreteType = (_field$concreteType = field.concreteType) !== null && _field$concreteType !== void 0 ? _field$concreteType : itemResponse.__typename;
          !(typeof concreteType === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected resolver modeling an edge to an abstract type to return an object with a `__typename` property.') : invariant(false) : void 0;
          var localId = extractIdFromResponse(itemResponse);
          var id = _this2._resolverCache.ensureClientRecord(localId, concreteType);
          var modelResolvers = field.modelResolvers;
          if (modelResolvers != null) {
            var modelResolver = modelResolvers[concreteType];
            !(modelResolver !== undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, "Invalid `__typename` returned by resolver. Expected one of ".concat(Object.keys(modelResolvers).join(', '), " but got `").concat(concreteType, "`.")) : invariant(false) : void 0;
            var model = _this2._readResolverFieldImpl(modelResolver, id);
            return model != null ? id : null;
          }
          return id;
        });
      } else {
        storeIDs = clientEdgeResolverResponse.map(extractIdFromResponse);
      }
      this._clientEdgeTraversalPath.push(null);
      var edgeValues = this._readLinkedIds(field.linkedField, storeIDs, record, data);
      this._clientEdgeTraversalPath.pop();
      data[fieldName] = edgeValues;
      return edgeValues;
    } else {
      var _field$concreteType2;
      var id = extractIdFromResponse(clientEdgeResolverResponse);
      var storeID;
      var concreteType = (_field$concreteType2 = field.concreteType) !== null && _field$concreteType2 !== void 0 ? _field$concreteType2 : clientEdgeResolverResponse.__typename;
      var traversalPathSegment;
      if (field.kind === CLIENT_EDGE_TO_CLIENT_OBJECT) {
        if (field.backingField.normalizationInfo == null) {
          !(typeof concreteType === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected resolver modeling an edge to an abstract type to return an object with a `__typename` property.') : invariant(false) : void 0;
          storeID = this._resolverCache.ensureClientRecord(id, concreteType);
          traversalPathSegment = null;
        } else {
          storeID = id;
          traversalPathSegment = null;
        }
      } else {
        storeID = id;
        traversalPathSegment = {
          readerClientEdge: field,
          clientEdgeDestinationID: id
        };
      }
      var modelResolvers = field.modelResolvers;
      if (modelResolvers != null) {
        !(typeof concreteType === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected resolver modeling an edge to an abstract type to return an object with a `__typename` property.') : invariant(false) : void 0;
        var modelResolver = modelResolvers[concreteType];
        !(modelResolver !== undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, "Invalid `__typename` returned by resolver. Expected one of ".concat(Object.keys(modelResolvers).join(', '), " but got `").concat(concreteType, "`.")) : invariant(false) : void 0;
        var model = this._readResolverFieldImpl(modelResolver, storeID);
        if (model == null) {
          data[fieldName] = null;
          return null;
        }
      }
      this._clientEdgeTraversalPath.push(traversalPathSegment);
      var prevData = data[fieldName];
      !(prevData == null || typeof prevData === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', fieldName, RelayModernRecord.getDataID(record), prevData) : invariant(false) : void 0;
      var edgeValue = this._traverse(field.linkedField, storeID, prevData);
      this._clientEdgeTraversalPath.pop();
      data[fieldName] = edgeValue;
      return edgeValue;
    }
  };
  _proto._readScalar = function _readScalar(field, record, data) {
    var _field$alias3;
    var fieldName = (_field$alias3 = field.alias) !== null && _field$alias3 !== void 0 ? _field$alias3 : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var value = RelayModernRecord.getValue(record, storageKey);
    if (value === null) {
      this._maybeAddErrorResponseFields(record, storageKey);
    } else if (value === undefined) {
      this._markDataAsMissing();
    }
    data[fieldName] = value;
    return value;
  };
  _proto._readLink = function _readLink(field, record, data) {
    var _field$alias4;
    var fieldName = (_field$alias4 = field.alias) !== null && _field$alias4 !== void 0 ? _field$alias4 : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
    if (linkedID == null) {
      data[fieldName] = linkedID;
      if (linkedID === null) {
        this._maybeAddErrorResponseFields(record, storageKey);
      } else if (linkedID === undefined) {
        this._markDataAsMissing();
      }
      return linkedID;
    }
    var prevData = data[fieldName];
    !(prevData == null || typeof prevData === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', fieldName, RelayModernRecord.getDataID(record), prevData) : invariant(false) : void 0;
    var value = this._traverse(field, linkedID, prevData);
    data[fieldName] = value;
    return value;
  };
  _proto._readActorChange = function _readActorChange(field, record, data) {
    var _field$alias5;
    var fieldName = (_field$alias5 = field.alias) !== null && _field$alias5 !== void 0 ? _field$alias5 : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var externalRef = RelayModernRecord.getActorLinkedRecordID(record, storageKey);
    if (externalRef == null) {
      data[fieldName] = externalRef;
      if (externalRef === undefined) {
        this._markDataAsMissing();
      } else if (externalRef === null) {
        this._maybeAddErrorResponseFields(record, storageKey);
      }
      return data[fieldName];
    }
    var actorIdentifier = externalRef[0],
      dataID = externalRef[1];
    var fragmentRef = {};
    this._createFragmentPointer(field.fragmentSpread, RelayModernRecord.fromObject({
      __id: dataID
    }), fragmentRef);
    data[fieldName] = {
      __fragmentRef: fragmentRef,
      __viewer: actorIdentifier
    };
    return data[fieldName];
  };
  _proto._readPluralLink = function _readPluralLink(field, record, data) {
    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);
    if (linkedIDs === null) {
      this._maybeAddErrorResponseFields(record, storageKey);
    }
    return this._readLinkedIds(field, linkedIDs, record, data);
  };
  _proto._readLinkedIds = function _readLinkedIds(field, linkedIDs, record, data) {
    var _this3 = this;
    var _field$alias6;
    var fieldName = (_field$alias6 = field.alias) !== null && _field$alias6 !== void 0 ? _field$alias6 : field.name;
    if (linkedIDs == null) {
      data[fieldName] = linkedIDs;
      if (linkedIDs === undefined) {
        this._markDataAsMissing();
      }
      return linkedIDs;
    }
    var prevData = data[fieldName];
    !(prevData == null || Array.isArray(prevData)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an array, got `%s`.', fieldName, RelayModernRecord.getDataID(record), prevData) : invariant(false) : void 0;
    var linkedArray = prevData || [];
    linkedIDs.forEach(function (linkedID, nextIndex) {
      if (linkedID == null) {
        if (linkedID === undefined) {
          _this3._markDataAsMissing();
        }
        linkedArray[nextIndex] = linkedID;
        return;
      }
      var prevItem = linkedArray[nextIndex];
      !(prevItem == null || typeof prevItem === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', fieldName, RelayModernRecord.getDataID(record), prevItem) : invariant(false) : void 0;
      linkedArray[nextIndex] = _this3._traverse(field, linkedID, prevItem);
    });
    data[fieldName] = linkedArray;
    return linkedArray;
  };
  _proto._readModuleImport = function _readModuleImport(moduleImport, record, data) {
    var componentKey = getModuleComponentKey(moduleImport.documentName);
    var component = RelayModernRecord.getValue(record, componentKey);
    if (component == null) {
      if (component === undefined) {
        this._markDataAsMissing();
      }
      return;
    }
    this._createFragmentPointer({
      kind: 'FragmentSpread',
      name: moduleImport.fragmentName,
      args: moduleImport.args
    }, record, data);
    data[FRAGMENT_PROP_NAME_KEY] = moduleImport.fragmentPropName;
    data[MODULE_COMPONENT_KEY] = component;
  };
  _proto._createAliasedFragmentSpread = function _createAliasedFragmentSpread(namedFragmentSpread, record) {
    var abstractKey = namedFragmentSpread.abstractKey;
    if (abstractKey == null) {
      var typeName = RelayModernRecord.getType(record);
      if (typeName == null || typeName !== namedFragmentSpread.type) {
        return null;
      }
    } else {
      var implementsInterface = this._implementsInterface(record, abstractKey);
      if (implementsInterface === false) {
        return null;
      } else if (implementsInterface == null) {
        this._markDataAsMissing();
        return undefined;
      }
    }
    var fieldData = {};
    this._createFragmentPointer(namedFragmentSpread.fragment, record, fieldData);
    return RelayModernRecord.fromObject(fieldData);
  };
  _proto._readInlineFragment = function _readInlineFragment(inlineFragment, record, data) {
    if (inlineFragment.type == null) {
      var hasExpectedData = this._traverseSelections(inlineFragment.selections, record, data);
      if (hasExpectedData === false) {
        return false;
      }
      return data;
    }
    var abstractKey = inlineFragment.abstractKey;
    if (abstractKey == null) {
      var typeName = RelayModernRecord.getType(record);
      if (typeName == null || typeName !== inlineFragment.type) {
        return null;
      } else {
        var hasExpectedData = this._traverseSelections(inlineFragment.selections, record, data);
        if (!hasExpectedData) {
          return false;
        }
      }
    } else {
      var implementsInterface = this._implementsInterface(record, abstractKey);
      var parentIsMissingData = this._isMissingData;
      var parentIsWithinUnmatchedTypeRefinement = this._isWithinUnmatchedTypeRefinement;
      this._isWithinUnmatchedTypeRefinement = parentIsWithinUnmatchedTypeRefinement || implementsInterface === false;
      this._traverseSelections(inlineFragment.selections, record, data);
      this._isWithinUnmatchedTypeRefinement = parentIsWithinUnmatchedTypeRefinement;
      if (implementsInterface === false) {
        this._isMissingData = parentIsMissingData;
        return undefined;
      } else if (implementsInterface == null) {
        this._markDataAsMissing();
        return null;
      }
    }
    return data;
  };
  _proto._createFragmentPointer = function _createFragmentPointer(fragmentSpread, record, data) {
    var fragmentPointers = data[FRAGMENTS_KEY];
    if (fragmentPointers == null) {
      fragmentPointers = data[FRAGMENTS_KEY] = {};
    }
    !(typeof fragmentPointers === 'object' && fragmentPointers != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers) : invariant(false) : void 0;
    if (data[ID_KEY] == null) {
      data[ID_KEY] = RelayModernRecord.getDataID(record);
    }
    fragmentPointers[fragmentSpread.name] = getArgumentValues(fragmentSpread.args, this._variables, this._isWithinUnmatchedTypeRefinement);
    data[FRAGMENT_OWNER_KEY] = this._owner;
    if (this._clientEdgeTraversalPath.length > 0 && this._clientEdgeTraversalPath[this._clientEdgeTraversalPath.length - 1] !== null) {
      data[CLIENT_EDGE_TRAVERSAL_PATH] = (0, _toConsumableArray2["default"])(this._clientEdgeTraversalPath);
    }
  };
  _proto._createInlineDataOrResolverFragmentPointer = function _createInlineDataOrResolverFragmentPointer(fragmentSpreadOrFragment, record, data) {
    var fragmentPointers = data[FRAGMENTS_KEY];
    if (fragmentPointers == null) {
      fragmentPointers = data[FRAGMENTS_KEY] = {};
    }
    !(typeof fragmentPointers === 'object' && fragmentPointers != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers) : invariant(false) : void 0;
    if (data[ID_KEY] == null) {
      data[ID_KEY] = RelayModernRecord.getDataID(record);
    }
    var inlineData = {};
    var parentFragmentName = this._fragmentName;
    this._fragmentName = fragmentSpreadOrFragment.name;
    var parentVariables = this._variables;
    var argumentVariables = fragmentSpreadOrFragment.args ? getArgumentValues(fragmentSpreadOrFragment.args, this._variables) : {};
    this._variables = RelayConcreteVariables.getFragmentVariables(fragmentSpreadOrFragment, this._owner.variables, argumentVariables);
    this._traverseSelections(fragmentSpreadOrFragment.selections, record, inlineData);
    this._variables = parentVariables;
    this._fragmentName = parentFragmentName;
    fragmentPointers[fragmentSpreadOrFragment.name] = inlineData;
  };
  _proto._addMissingRequiredFields = function _addMissingRequiredFields(additional) {
    if (this._missingRequiredFields == null) {
      this._missingRequiredFields = additional;
      return;
    }
    if (this._missingRequiredFields.action === 'THROW') {
      return;
    }
    if (additional.action === 'THROW') {
      this._missingRequiredFields = additional;
      return;
    }
    this._missingRequiredFields = {
      action: 'LOG',
      fields: [].concat((0, _toConsumableArray2["default"])(this._missingRequiredFields.fields), (0, _toConsumableArray2["default"])(additional.fields))
    };
  };
  _proto._implementsInterface = function _implementsInterface(record, abstractKey) {
    var typeName = RelayModernRecord.getType(record);
    var typeRecord = this._recordSource.get(generateTypeID(typeName));
    var implementsInterface = typeRecord != null ? RelayModernRecord.getValue(typeRecord, abstractKey) : null;
    return implementsInterface;
  };
  return RelayReader;
}();
function getResolverValue(field, variables, fragmentKey) {
  var resolverFunction = typeof field.resolverModule === 'function' ? field.resolverModule : field.resolverModule["default"];
  var resolverResult = null;
  var resolverError = null;
  try {
    var resolverFunctionArgs = [];
    if (field.fragment != null) {
      resolverFunctionArgs.push(fragmentKey);
    }
    var args = field.args ? getArgumentValues(field.args, variables) : undefined;
    resolverFunctionArgs.push(args);
    resolverResult = resolverFunction.apply(null, resolverFunctionArgs);
  } catch (e) {
    if (e === RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL) {
      resolverResult = undefined;
    } else {
      resolverError = e;
    }
  }
  return [resolverResult, resolverError];
}
function extractIdFromResponse(individualResponse) {
  if (typeof individualResponse === 'string') {
    return individualResponse;
  } else if (typeof individualResponse === 'object' && individualResponse != null && typeof individualResponse.id === 'string') {
    return individualResponse.id;
  }
  !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected object returned from an edge resolver to be a string or an object with an `id` property') : invariant(false) : void 0;
}
module.exports = {
  read: read
};