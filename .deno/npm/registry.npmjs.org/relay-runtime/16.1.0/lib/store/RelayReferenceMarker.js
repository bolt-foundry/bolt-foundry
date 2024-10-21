'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var getOperation = require('../util/getOperation');
var RelayConcreteNode = require('../util/RelayConcreteNode');
var cloneRelayHandleSourceField = require('./cloneRelayHandleSourceField');
var getOutputTypeRecordIDs = require('./experimental-live-resolvers/getOutputTypeRecordIDs');
var _require = require('./RelayConcreteVariables'),
  getLocalVariables = _require.getLocalVariables;
var RelayModernRecord = require('./RelayModernRecord');
var RelayStoreUtils = require('./RelayStoreUtils');
var _require2 = require('./TypeID'),
  generateTypeID = _require2.generateTypeID;
var invariant = require('invariant');
var ACTOR_CHANGE = RelayConcreteNode.ACTOR_CHANGE,
  CONDITION = RelayConcreteNode.CONDITION,
  CLIENT_COMPONENT = RelayConcreteNode.CLIENT_COMPONENT,
  CLIENT_EXTENSION = RelayConcreteNode.CLIENT_EXTENSION,
  DEFER = RelayConcreteNode.DEFER,
  FRAGMENT_SPREAD = RelayConcreteNode.FRAGMENT_SPREAD,
  INLINE_FRAGMENT = RelayConcreteNode.INLINE_FRAGMENT,
  LINKED_FIELD = RelayConcreteNode.LINKED_FIELD,
  MODULE_IMPORT = RelayConcreteNode.MODULE_IMPORT,
  LINKED_HANDLE = RelayConcreteNode.LINKED_HANDLE,
  SCALAR_FIELD = RelayConcreteNode.SCALAR_FIELD,
  SCALAR_HANDLE = RelayConcreteNode.SCALAR_HANDLE,
  STREAM = RelayConcreteNode.STREAM,
  TYPE_DISCRIMINATOR = RelayConcreteNode.TYPE_DISCRIMINATOR,
  RELAY_RESOLVER = RelayConcreteNode.RELAY_RESOLVER,
  RELAY_LIVE_RESOLVER = RelayConcreteNode.RELAY_LIVE_RESOLVER,
  CLIENT_EDGE_TO_CLIENT_OBJECT = RelayConcreteNode.CLIENT_EDGE_TO_CLIENT_OBJECT;
var getStorageKey = RelayStoreUtils.getStorageKey,
  getModuleOperationKey = RelayStoreUtils.getModuleOperationKey;
function mark(recordSource, selector, references, operationLoader, shouldProcessClientComponents) {
  var dataID = selector.dataID,
    node = selector.node,
    variables = selector.variables;
  var marker = new RelayReferenceMarker(recordSource, variables, references, operationLoader, shouldProcessClientComponents);
  marker.mark(node, dataID);
}
var RelayReferenceMarker = /*#__PURE__*/function () {
  function RelayReferenceMarker(recordSource, variables, references, operationLoader, shouldProcessClientComponents) {
    this._operationLoader = operationLoader !== null && operationLoader !== void 0 ? operationLoader : null;
    this._operationName = null;
    this._recordSource = recordSource;
    this._references = references;
    this._variables = variables;
    this._shouldProcessClientComponents = shouldProcessClientComponents;
  }
  var _proto = RelayReferenceMarker.prototype;
  _proto.mark = function mark(node, dataID) {
    if (node.kind === 'Operation' || node.kind === 'SplitOperation') {
      this._operationName = node.name;
    }
    this._traverse(node, dataID);
  };
  _proto._traverse = function _traverse(node, dataID) {
    this._references.add(dataID);
    var record = this._recordSource.get(dataID);
    if (record == null) {
      return;
    }
    this._traverseSelections(node.selections, record);
  };
  _proto._getVariableValue = function _getVariableValue(name) {
    !this._variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReferenceMarker(): Undefined variable `%s`.', name) : invariant(false) : void 0;
    return this._variables[name];
  };
  _proto._traverseSelections = function _traverseSelections(selections, record) {
    var _this = this;
    selections.forEach(function (selection) {
      switch (selection.kind) {
        case ACTOR_CHANGE:
          _this._traverseLink(selection.linkedField, record);
          break;
        case LINKED_FIELD:
          if (selection.plural) {
            _this._traversePluralLink(selection, record);
          } else {
            _this._traverseLink(selection, record);
          }
          break;
        case CONDITION:
          var conditionValue = Boolean(_this._getVariableValue(selection.condition));
          if (conditionValue === selection.passingValue) {
            _this._traverseSelections(selection.selections, record);
          }
          break;
        case INLINE_FRAGMENT:
          if (selection.abstractKey == null) {
            var typeName = RelayModernRecord.getType(record);
            if (typeName != null && typeName === selection.type || typeName === RelayStoreUtils.ROOT_TYPE) {
              _this._traverseSelections(selection.selections, record);
            }
          } else {
            var _typeName = RelayModernRecord.getType(record);
            var typeID = generateTypeID(_typeName);
            _this._references.add(typeID);
            _this._traverseSelections(selection.selections, record);
          }
          break;
        case FRAGMENT_SPREAD:
          var prevVariables = _this._variables;
          _this._variables = getLocalVariables(_this._variables, selection.fragment.argumentDefinitions, selection.args);
          _this._traverseSelections(selection.fragment.selections, record);
          _this._variables = prevVariables;
          break;
        case LINKED_HANDLE:
          var handleField = cloneRelayHandleSourceField(selection, selections, _this._variables);
          if (handleField.plural) {
            _this._traversePluralLink(handleField, record);
          } else {
            _this._traverseLink(handleField, record);
          }
          break;
        case DEFER:
        case STREAM:
          _this._traverseSelections(selection.selections, record);
          break;
        case SCALAR_FIELD:
        case SCALAR_HANDLE:
          break;
        case TYPE_DISCRIMINATOR:
          {
            var _typeName2 = RelayModernRecord.getType(record);
            var _typeID = generateTypeID(_typeName2);
            _this._references.add(_typeID);
            break;
          }
        case MODULE_IMPORT:
          _this._traverseModuleImport(selection, record);
          break;
        case CLIENT_EXTENSION:
          _this._traverseSelections(selection.selections, record);
          break;
        case CLIENT_COMPONENT:
          if (_this._shouldProcessClientComponents === false) {
            break;
          }
          _this._traverseSelections(selection.fragment.selections, record);
          break;
        case RELAY_RESOLVER:
          _this._traverseResolverField(selection, record);
          break;
        case RELAY_LIVE_RESOLVER:
          _this._traverseResolverField(selection, record);
          break;
        case CLIENT_EDGE_TO_CLIENT_OBJECT:
          _this._traverseClientEdgeToClientObject(selection, record);
          break;
        default:
          selection;
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReferenceMarker: Unknown AST node `%s`.', selection) : invariant(false) : void 0;
      }
    });
  };
  _proto._traverseClientEdgeToClientObject = function _traverseClientEdgeToClientObject(field, record) {
    var dataID = this._traverseResolverField(field.backingField, record);
    if (dataID == null) {
      return;
    }
    var resolverRecord = this._recordSource.get(dataID);
    if (resolverRecord == null) {
      return;
    }
    if (field.backingField.isOutputType) {
      var outputTypeRecordIDs = getOutputTypeRecordIDs(resolverRecord);
      if (outputTypeRecordIDs != null) {
        var _iterator = (0, _createForOfIteratorHelper2["default"])(outputTypeRecordIDs),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _dataID = _step.value;
            this._references.add(_dataID);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    } else {
      var linkedField = field.linkedField;
      var concreteType = linkedField.concreteType;
      if (concreteType == null) {
        return;
      }
      if (linkedField.plural) {
        var dataIDs = RelayModernRecord.getResolverLinkedRecordIDs(resolverRecord, concreteType);
        if (dataIDs != null) {
          var _iterator2 = (0, _createForOfIteratorHelper2["default"])(dataIDs),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _dataID2 = _step2.value;
              if (_dataID2 != null) {
                this._traverse(linkedField, _dataID2);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } else {
        var _dataID3 = RelayModernRecord.getResolverLinkedRecordID(resolverRecord, concreteType);
        if (_dataID3 != null) {
          this._traverse(linkedField, _dataID3);
        }
      }
    }
  };
  _proto._traverseResolverField = function _traverseResolverField(field, record) {
    var storageKey = getStorageKey(field, this._variables);
    var dataID = RelayModernRecord.getLinkedRecordID(record, storageKey);
    if (dataID != null) {
      this._references.add(dataID);
    }
    var fragment = field.fragment;
    if (fragment != null) {
      this._traverseSelections([fragment], record);
    }
    return dataID;
  };
  _proto._traverseModuleImport = function _traverseModuleImport(moduleImport, record) {
    var _this$_operationName;
    var operationLoader = this._operationLoader;
    !(operationLoader !== null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReferenceMarker: Expected an operationLoader to be configured when using `@module`. ' + 'Could not load fragment `%s` in operation `%s`.', moduleImport.fragmentName, (_this$_operationName = this._operationName) !== null && _this$_operationName !== void 0 ? _this$_operationName : '(unknown)') : invariant(false) : void 0;
    var operationKey = getModuleOperationKey(moduleImport.documentName);
    var operationReference = RelayModernRecord.getValue(record, operationKey);
    if (operationReference == null) {
      return;
    }
    var normalizationRootNode = operationLoader.get(operationReference);
    if (normalizationRootNode != null) {
      var operation = getOperation(normalizationRootNode);
      var prevVariables = this._variables;
      this._variables = getLocalVariables(this._variables, operation.argumentDefinitions, moduleImport.args);
      this._traverseSelections(operation.selections, record);
      this._variables = prevVariables;
    }
  };
  _proto._traverseLink = function _traverseLink(field, record) {
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
    if (linkedID == null) {
      return;
    }
    this._traverse(field, linkedID);
  };
  _proto._traversePluralLink = function _traversePluralLink(field, record) {
    var _this2 = this;
    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);
    if (linkedIDs == null) {
      return;
    }
    linkedIDs.forEach(function (linkedID) {
      if (linkedID != null) {
        _this2._traverse(field, linkedID);
      }
    });
  };
  return RelayReferenceMarker;
}();
module.exports = {
  mark: mark
};