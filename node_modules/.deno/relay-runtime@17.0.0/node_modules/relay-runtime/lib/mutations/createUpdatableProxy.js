'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _require = require('../store/RelayStoreUtils'),
  getArgumentValues = _require.getArgumentValues;
var _require2 = require('../util/RelayConcreteNode'),
  ACTOR_CHANGE = _require2.ACTOR_CHANGE,
  ALIASED_FRAGMENT_SPREAD = _require2.ALIASED_FRAGMENT_SPREAD,
  ALIASED_INLINE_FRAGMENT_SPREAD = _require2.ALIASED_INLINE_FRAGMENT_SPREAD,
  CATCH_FIELD = _require2.CATCH_FIELD,
  CLIENT_EDGE_TO_CLIENT_OBJECT = _require2.CLIENT_EDGE_TO_CLIENT_OBJECT,
  CLIENT_EDGE_TO_SERVER_OBJECT = _require2.CLIENT_EDGE_TO_SERVER_OBJECT,
  CLIENT_EXTENSION = _require2.CLIENT_EXTENSION,
  CONDITION = _require2.CONDITION,
  DEFER = _require2.DEFER,
  FRAGMENT_SPREAD = _require2.FRAGMENT_SPREAD,
  INLINE_DATA_FRAGMENT_SPREAD = _require2.INLINE_DATA_FRAGMENT_SPREAD,
  INLINE_FRAGMENT = _require2.INLINE_FRAGMENT,
  LINKED_FIELD = _require2.LINKED_FIELD,
  MODULE_IMPORT = _require2.MODULE_IMPORT,
  RELAY_LIVE_RESOLVER = _require2.RELAY_LIVE_RESOLVER,
  RELAY_RESOLVER = _require2.RELAY_RESOLVER,
  REQUIRED_FIELD = _require2.REQUIRED_FIELD,
  SCALAR_FIELD = _require2.SCALAR_FIELD,
  STREAM = _require2.STREAM;
var nonUpdatableKeys = ['id', '__id', '__typename', 'js'];
function createUpdatableProxy(updatableProxyRootRecord, variables, selections, recordSourceProxy, missingFieldHandlers) {
  var mutableUpdatableProxy = {};
  updateProxyFromSelections(mutableUpdatableProxy, updatableProxyRootRecord, variables, selections, recordSourceProxy, missingFieldHandlers);
  if (process.env.NODE_ENV !== "production") {
    Object.freeze(mutableUpdatableProxy);
  }
  return mutableUpdatableProxy;
}
function updateProxyFromSelections(mutableUpdatableProxy, updatableProxyRootRecord, variables, selections, recordSourceProxy, missingFieldHandlers) {
  var _selection$alias3;
  var _iterator = (0, _createForOfIteratorHelper2["default"])(selections),
    _step;
  try {
    var _loop = function _loop() {
      var selection = _step.value;
      switch (selection.kind) {
        case LINKED_FIELD:
          if (selection.plural) {
            Object.defineProperty(mutableUpdatableProxy, (_selection$alias = selection.alias) !== null && _selection$alias !== void 0 ? _selection$alias : selection.name, {
              get: createGetterForPluralLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers),
              set: createSetterForPluralLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy)
            });
          } else {
            Object.defineProperty(mutableUpdatableProxy, (_selection$alias2 = selection.alias) !== null && _selection$alias2 !== void 0 ? _selection$alias2 : selection.name, {
              get: createGetterForSingularLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers),
              set: createSetterForSingularLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy)
            });
          }
          break;
        case SCALAR_FIELD:
          var scalarFieldName = (_selection$alias3 = selection.alias) !== null && _selection$alias3 !== void 0 ? _selection$alias3 : selection.name;
          Object.defineProperty(mutableUpdatableProxy, scalarFieldName, {
            get: function get() {
              var _selection$args;
              var newVariables = getArgumentValues((_selection$args = selection.args) !== null && _selection$args !== void 0 ? _selection$args : [], variables);
              var value = updatableProxyRootRecord.getValue(selection.name, newVariables);
              if (value == null) {
                value = getScalarUsingMissingFieldHandlers(selection, newVariables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers);
              }
              return value;
            },
            set: nonUpdatableKeys.includes(selection.name) ? undefined : function (newValue) {
              var _selection$args2;
              var newVariables = getArgumentValues((_selection$args2 = selection.args) !== null && _selection$args2 !== void 0 ? _selection$args2 : [], variables);
              updatableProxyRootRecord.setValue__UNSAFE(newValue, selection.name, newVariables);
            }
          });
          break;
        case INLINE_FRAGMENT:
          if (updatableProxyRootRecord.getType() === selection.type) {
            updateProxyFromSelections(mutableUpdatableProxy, updatableProxyRootRecord, variables, selection.selections, recordSourceProxy, missingFieldHandlers);
          }
          break;
        case CLIENT_EXTENSION:
          updateProxyFromSelections(mutableUpdatableProxy, updatableProxyRootRecord, variables, selection.selections, recordSourceProxy, missingFieldHandlers);
          break;
        case FRAGMENT_SPREAD:
          break;
        case CONDITION:
        case ACTOR_CHANGE:
        case ALIASED_FRAGMENT_SPREAD:
        case INLINE_DATA_FRAGMENT_SPREAD:
        case ALIASED_INLINE_FRAGMENT_SPREAD:
        case CLIENT_EDGE_TO_CLIENT_OBJECT:
        case CLIENT_EDGE_TO_SERVER_OBJECT:
        case DEFER:
        case MODULE_IMPORT:
        case RELAY_LIVE_RESOLVER:
        case REQUIRED_FIELD:
        case CATCH_FIELD:
        case STREAM:
        case RELAY_RESOLVER:
          throw new Error('Encountered an unexpected ReaderSelection variant in RelayRecordSourceProxy. This indicates a bug in Relay.');
        default:
          selection.kind;
          throw new Error('Encountered an unexpected ReaderSelection variant in RelayRecordSourceProxy. This indicates a bug in Relay.');
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _selection$alias;
      var _selection$alias2;
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function createSetterForPluralLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy) {
  return function set(newValue) {
    var _selection$args3;
    var newVariables = getArgumentValues((_selection$args3 = selection.args) !== null && _selection$args3 !== void 0 ? _selection$args3 : [], variables);
    if (newValue == null) {
      throw new Error('Do not assign null to plural linked fields; assign an empty array instead.');
    } else {
      var recordProxies = newValue.map(function (item) {
        if (item == null) {
          throw new Error('When assigning an array of items, none of the items should be null or undefined.');
        }
        var __id = item.__id;
        if (__id == null) {
          throw new Error('The __id field must be present on each item passed to the setter. This indicates a bug in Relay.');
        }
        var newValueRecord = recordSourceProxy.get(__id);
        if (newValueRecord == null) {
          throw new Error("Did not find item with data id ".concat(__id, " in the store."));
        }
        return newValueRecord;
      });
      updatableProxyRootRecord.setLinkedRecords(recordProxies, selection.name, newVariables);
    }
  };
}
function createSetterForSingularLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy) {
  return function set(newValue) {
    var _selection$args4;
    var newVariables = getArgumentValues((_selection$args4 = selection.args) !== null && _selection$args4 !== void 0 ? _selection$args4 : [], variables);
    if (newValue == null) {
      updatableProxyRootRecord.setValue(newValue, selection.name, newVariables);
    } else {
      var __id = newValue.__id;
      if (__id == null) {
        throw new Error('The __id field must be present on the argument. This indicates a bug in Relay.');
      }
      var newValueRecord = recordSourceProxy.get(__id);
      if (newValueRecord == null) {
        throw new Error("Did not find item with data id ".concat(__id, " in the store."));
      }
      updatableProxyRootRecord.setLinkedRecord(newValueRecord, selection.name, newVariables);
    }
  };
}
function createGetterForPluralLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers) {
  return function () {
    var _selection$args5;
    var newVariables = getArgumentValues((_selection$args5 = selection.args) !== null && _selection$args5 !== void 0 ? _selection$args5 : [], variables);
    var linkedRecords = updatableProxyRootRecord.getLinkedRecords(selection.name, newVariables);
    if (linkedRecords === undefined) {
      linkedRecords = getPluralLinkedRecordUsingMissingFieldHandlers(selection, newVariables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers);
    }
    if (linkedRecords != null) {
      return linkedRecords.map(function (linkedRecord) {
        if (linkedRecord != null) {
          var updatableProxy = {};
          updateProxyFromSelections(updatableProxy, linkedRecord, variables, selection.selections, recordSourceProxy, missingFieldHandlers);
          if (process.env.NODE_ENV !== "production") {
            Object.freeze(updatableProxy);
          }
          return updatableProxy;
        } else {
          return linkedRecord;
        }
      });
    } else {
      return linkedRecords;
    }
  };
}
function createGetterForSingularLinkedField(selection, variables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers) {
  return function () {
    var _selection$args6;
    var newVariables = getArgumentValues((_selection$args6 = selection.args) !== null && _selection$args6 !== void 0 ? _selection$args6 : [], variables);
    var linkedRecord = updatableProxyRootRecord.getLinkedRecord(selection.name, newVariables);
    if (linkedRecord === undefined) {
      linkedRecord = getLinkedRecordUsingMissingFieldHandlers(selection, newVariables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers);
    }
    if (linkedRecord != null) {
      var updatableProxy = {};
      updateProxyFromSelections(updatableProxy, linkedRecord, variables, selection.selections, recordSourceProxy, missingFieldHandlers);
      if (process.env.NODE_ENV !== "production") {
        Object.freeze(updatableProxy);
      }
      return updatableProxy;
    } else {
      return linkedRecord;
    }
  };
}
function getLinkedRecordUsingMissingFieldHandlers(selection, newVariables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers) {
  var _iterator2 = (0, _createForOfIteratorHelper2["default"])(missingFieldHandlers),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var handler = _step2.value;
      if (handler.kind === 'linked') {
        var newId = handler.handle(selection, updatableProxyRootRecord, newVariables, recordSourceProxy);
        if (newId != null) {
          return recordSourceProxy.get(newId);
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
function getPluralLinkedRecordUsingMissingFieldHandlers(selection, newVariables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers) {
  var _iterator3 = (0, _createForOfIteratorHelper2["default"])(missingFieldHandlers),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var handler = _step3.value;
      if (handler.kind === 'pluralLinked') {
        var newIds = handler.handle(selection, updatableProxyRootRecord, newVariables, recordSourceProxy);
        if (newIds != null) {
          return newIds.map(function (newId) {
            if (newId != null) {
              return recordSourceProxy.get(newId);
            }
          });
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function getScalarUsingMissingFieldHandlers(selection, newVariables, updatableProxyRootRecord, recordSourceProxy, missingFieldHandlers) {
  var _iterator4 = (0, _createForOfIteratorHelper2["default"])(missingFieldHandlers),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var handler = _step4.value;
      if (handler.kind === 'scalar') {
        var value = handler.handle(selection, updatableProxyRootRecord, newVariables, recordSourceProxy);
        if (value !== undefined) {
          return value;
        }
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
}
module.exports = {
  createUpdatableProxy: createUpdatableProxy
};