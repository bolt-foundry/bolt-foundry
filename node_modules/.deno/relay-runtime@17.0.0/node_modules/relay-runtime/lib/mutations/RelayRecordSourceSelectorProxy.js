'use strict';

var _require = require('../store/RelayStoreUtils'),
  ROOT_TYPE = _require.ROOT_TYPE,
  getStorageKey = _require.getStorageKey;
var _require2 = require('./readUpdatableFragment'),
  _readUpdatableFragment = _require2.readUpdatableFragment;
var _require3 = require('./readUpdatableQuery'),
  _readUpdatableQuery = _require3.readUpdatableQuery;
var invariant = require('invariant');
var RelayRecordSourceSelectorProxy = /*#__PURE__*/function () {
  function RelayRecordSourceSelectorProxy(mutator, recordSource, readSelector, missingFieldHandlers) {
    this.__mutator = mutator;
    this.__recordSource = recordSource;
    this._readSelector = readSelector;
    this._missingFieldHandlers = missingFieldHandlers;
  }
  var _proto = RelayRecordSourceSelectorProxy.prototype;
  _proto.create = function create(dataID, typeName) {
    return this.__recordSource.create(dataID, typeName);
  };
  _proto["delete"] = function _delete(dataID) {
    this.__recordSource["delete"](dataID);
  };
  _proto.get = function get(dataID) {
    return this.__recordSource.get(dataID);
  };
  _proto.getRoot = function getRoot() {
    return this.__recordSource.getRoot();
  };
  _proto.getOperationRoot = function getOperationRoot() {
    var root = this.__recordSource.get(this._readSelector.dataID);
    if (!root) {
      root = this.__recordSource.create(this._readSelector.dataID, ROOT_TYPE);
    }
    return root;
  };
  _proto._getRootField = function _getRootField(selector, fieldName, plural) {
    var field = selector.node.selections.find(function (selection) {
      return selection.kind === 'LinkedField' && selection.name === fieldName || selection.kind === 'RequiredField' && selection.field.name === fieldName;
    });
    if (field && field.kind === 'RequiredField') {
      field = field.field;
    }
    !(field && field.kind === 'LinkedField') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayRecordSourceSelectorProxy#getRootField(): Cannot find root ' + 'field `%s`, no such field is defined on GraphQL document `%s`.', fieldName, selector.node.name) : invariant(false) : void 0;
    !(field.plural === plural) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayRecordSourceSelectorProxy#getRootField(): Expected root field ' + '`%s` to be %s.', fieldName, plural ? 'plural' : 'singular') : invariant(false) : void 0;
    return field;
  };
  _proto.getRootField = function getRootField(fieldName) {
    var field = this._getRootField(this._readSelector, fieldName, false);
    var storageKey = getStorageKey(field, this._readSelector.variables);
    return this.getOperationRoot().getLinkedRecord(storageKey);
  };
  _proto.getPluralRootField = function getPluralRootField(fieldName) {
    var field = this._getRootField(this._readSelector, fieldName, true);
    var storageKey = getStorageKey(field, this._readSelector.variables);
    return this.getOperationRoot().getLinkedRecords(storageKey);
  };
  _proto.invalidateStore = function invalidateStore() {
    this.__recordSource.invalidateStore();
  };
  _proto.readUpdatableQuery = function readUpdatableQuery(query, variables) {
    return _readUpdatableQuery(query, variables, this, this._missingFieldHandlers);
  };
  _proto.readUpdatableFragment = function readUpdatableFragment(fragment, fragmentReference) {
    return _readUpdatableFragment(fragment, fragmentReference, this, this._missingFieldHandlers);
  };
  return RelayRecordSourceSelectorProxy;
}();
module.exports = RelayRecordSourceSelectorProxy;