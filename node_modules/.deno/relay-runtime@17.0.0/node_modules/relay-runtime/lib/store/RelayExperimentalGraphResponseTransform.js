"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphModeNormalizer = void 0;
exports.normalizeResponse = normalizeResponse;
exports.normalizeResponseWithMetadata = normalizeResponseWithMetadata;
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _require = require('../util/RelayConcreteNode'),
  CLIENT_EXTENSION = _require.CLIENT_EXTENSION,
  CONDITION = _require.CONDITION,
  DEFER = _require.DEFER,
  FRAGMENT_SPREAD = _require.FRAGMENT_SPREAD,
  INLINE_FRAGMENT = _require.INLINE_FRAGMENT,
  LINKED_FIELD = _require.LINKED_FIELD,
  LINKED_HANDLE = _require.LINKED_HANDLE,
  SCALAR_FIELD = _require.SCALAR_FIELD,
  SCALAR_HANDLE = _require.SCALAR_HANDLE;
var _require2 = require('./RelayConcreteVariables'),
  getLocalVariables = _require2.getLocalVariables;
var _require3 = require('./RelayModernSelector'),
  createNormalizationSelector = _require3.createNormalizationSelector;
var _require4 = require('./RelayStoreUtils'),
  ROOT_TYPE = _require4.ROOT_TYPE,
  TYPENAME_KEY = _require4.TYPENAME_KEY,
  getStorageKey = _require4.getStorageKey;
var invariant = require('invariant');
var _require5 = require('relay-runtime'),
  generateClientID = _require5.generateClientID;
function normalizeResponse(response, selector, options) {
  var node = selector.node,
    variables = selector.variables,
    dataID = selector.dataID;
  var normalizer = new GraphModeNormalizer(variables, options);
  return normalizer.normalizeResponse(node, dataID, response);
}
function normalizeResponseWithMetadata(response, selector, options) {
  var node = selector.node,
    variables = selector.variables,
    dataID = selector.dataID;
  var normalizer = new GraphModeNormalizer(variables, options);
  var chunks = Array.from(normalizer.normalizeResponse(node, dataID, response));
  return [chunks, {
    duplicateFieldsAvoided: normalizer.duplicateFieldsAvoided
  }];
}
var GraphModeNormalizer = /*#__PURE__*/function () {
  function GraphModeNormalizer(variables, options) {
    this._actorIdentifier = options.actorIdentifier;
    this._path = options.path ? (0, _toConsumableArray2["default"])(options.path) : [];
    this._getDataID = options.getDataID;
    this._cacheKeyToStreamID = new Map();
    this._sentFields = new Map();
    this._nextStreamID = 0;
    this._variables = variables;
    this.duplicateFieldsAvoided = 0;
  }
  var _proto = GraphModeNormalizer.prototype;
  _proto._getStreamID = function _getStreamID() {
    return this._nextStreamID++;
  };
  _proto._getSentFields = function _getSentFields(cacheKey) {
    var maybeSent = this._sentFields.get(cacheKey);
    if (maybeSent != null) {
      return maybeSent;
    }
    var sent = new Set();
    this._sentFields.set(cacheKey, sent);
    return sent;
  };
  _proto._getObjectType = function _getObjectType(data) {
    var typeName = data[TYPENAME_KEY];
    !(typeName != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected a typename for record `%s`.', JSON.stringify(data, null, 2)) : invariant(false) : void 0;
    return typeName;
  };
  _proto._getStorageKey = function _getStorageKey(selection) {
    return getStorageKey(selection, this._variables);
  };
  _proto._getVariableValue = function _getVariableValue(name) {
    !this._variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Unexpected undefined variable `%s`.', name) : invariant(false) : void 0;
    return this._variables[name];
  };
  _proto.normalizeResponse = function* normalizeResponse(node, dataID, data) {
    var rootFields = {};
    yield* this._traverseSelections(node, data, rootFields, dataID, new Set());
    var $streamID = this._getStreamID();
    yield (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, rootFields), {}, {
      $kind: 'Record',
      $streamID: $streamID,
      __id: dataID,
      __typename: ROOT_TYPE
    });
    yield {
      $kind: 'Complete'
    };
  };
  _proto._flushFields = function* _flushFields(cacheKey, typename, fields) {
    var maybeStreamID = this._cacheKeyToStreamID.get(cacheKey);
    var $streamID = maybeStreamID !== null && maybeStreamID !== void 0 ? maybeStreamID : this._getStreamID();
    if (maybeStreamID == null) {
      this._cacheKeyToStreamID.set(cacheKey, $streamID);
      yield (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, fields), {}, {
        $kind: 'Record',
        __typename: typename,
        __id: cacheKey,
        $streamID: $streamID
      });
    } else if (Object.keys(fields).length > 0) {
      yield (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, fields), {}, {
        $kind: 'Extend',
        $streamID: $streamID
      });
    }
    return $streamID;
  };
  _proto._traverseSelections = function* _traverseSelections(node, data, parentFields, parentID, sentFields) {
    var selections = node.selections;
    var _iterator = (0, _createForOfIteratorHelper2["default"])(selections),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var selection = _step.value;
        switch (selection.kind) {
          case LINKED_FIELD:
            {
              var _selection$alias;
              var responseKey = (_selection$alias = selection.alias) !== null && _selection$alias !== void 0 ? _selection$alias : selection.name;
              var fieldData = data[responseKey];
              var storageKey = this._getStorageKey(selection);
              this._path.push(responseKey);
              var fieldValue = yield* this._traverseLinkedField(selection.plural, fieldData, storageKey, selection, parentID);
              this._path.pop();
              if (sentFields.has(storageKey)) {
                this.duplicateFieldsAvoided++;
                break;
              }
              parentFields[storageKey] = fieldValue;
              sentFields.add(storageKey);
              break;
            }
          case SCALAR_FIELD:
            {
              var _selection$alias2;
              var _responseKey = (_selection$alias2 = selection.alias) !== null && _selection$alias2 !== void 0 ? _selection$alias2 : selection.name;
              var _storageKey = this._getStorageKey(selection);
              if (sentFields.has(_storageKey)) {
                this.duplicateFieldsAvoided++;
                break;
              }
              var _fieldData = data[_responseKey];
              parentFields[_storageKey] = _fieldData;
              sentFields.add(_storageKey);
              break;
            }
          case INLINE_FRAGMENT:
            {
              var objType = this._getObjectType(data);
              var abstractKey = selection.abstractKey;
              if (abstractKey == null) {
                if (objType !== selection.type) {
                  break;
                }
              } else if (!data.hasOwnProperty(abstractKey)) {
                break;
              }
              yield* this._traverseSelections(selection, data, parentFields, parentID, sentFields);
              break;
            }
          case FRAGMENT_SPREAD:
            {
              var prevVariables = this._variables;
              this._variables = getLocalVariables(this._variables, selection.fragment.argumentDefinitions, selection.args);
              yield* this._traverseSelections(selection.fragment, data, parentFields, parentID, sentFields);
              this._variables = prevVariables;
              break;
            }
          case CONDITION:
            var conditionValue = Boolean(this._getVariableValue(selection.condition));
            if (conditionValue === selection.passingValue) {
              yield* this._traverseSelections(selection, data, parentFields, parentID, sentFields);
            }
            break;
          case DEFER:
            var isDeferred = selection["if"] === null || this._getVariableValue(selection["if"]);
            if (isDeferred === false) {
              yield* this._traverseSelections(selection, data, parentFields, parentID, sentFields);
            } else {
              this._incrementalPlaceholders.push({
                kind: 'defer',
                data: data,
                label: selection.label,
                path: (0, _toConsumableArray2["default"])(this._path),
                selector: createNormalizationSelector(selection, parentID, this._variables),
                typeName: this._getObjectType(data),
                actorIdentifier: this._actorIdentifier
              });
            }
            break;
          case CLIENT_EXTENSION:
            break;
          case SCALAR_HANDLE:
          case LINKED_HANDLE:
            break;
          default:
            throw new Error("Unexpected selection type: ".concat(selection.kind));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  _proto._traverseLinkedField = function* _traverseLinkedField(plural, fieldData, storageKey, selection, parentID, index) {
    var _selection$concreteTy;
    if (fieldData == null) {
      return null;
    }
    if (plural) {
      !Array.isArray(fieldData) ? process.env.NODE_ENV !== "production" ? invariant(false, "Expected fieldData to be an array. Got ".concat(JSON.stringify(fieldData))) : invariant(false) : void 0;
      var fieldValue = [];
      var _iterator2 = (0, _createForOfIteratorHelper2["default"])(fieldData.entries()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _step2.value,
            i = _step2$value[0],
            itemData = _step2$value[1];
          this._path.push(String(i));
          var itemValue = yield* this._traverseLinkedField(false, itemData, storageKey, selection, parentID, i);
          this._path.pop();
          fieldValue.push(itemValue);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var ids = fieldValue.map(function (value) {
        if (value == null) {
          return null;
        }
        !(typeof value.__id === 'number') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected objects in a plural linked field to have an __id.') : invariant(false) : void 0;
        return value.__id;
      });
      return {
        __ids: ids
      };
    }
    !(typeof fieldData === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected data for field `%s` to be an object.', storageKey) : invariant(false) : void 0;
    var objType = (_selection$concreteTy = selection.concreteType) !== null && _selection$concreteTy !== void 0 ? _selection$concreteTy : this._getObjectType(fieldData);
    var nextID = this._getDataID(fieldData, objType) || generateClientID(parentID, storageKey, index);
    !(typeof nextID === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected id on field `%s` to be a string.', storageKey) : invariant(false) : void 0;
    var fields = {};
    yield* this._traverseSelections(selection, fieldData, fields, nextID, this._getSentFields(nextID));
    var $streamID = yield* this._flushFields(nextID, objType, fields);
    return {
      __id: $streamID
    };
  };
  return GraphModeNormalizer;
}();
exports.GraphModeNormalizer = GraphModeNormalizer;