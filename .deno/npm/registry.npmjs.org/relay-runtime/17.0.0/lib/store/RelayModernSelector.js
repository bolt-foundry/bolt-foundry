'use strict';

var _require = require('./RelayConcreteVariables'),
  getFragmentVariables = _require.getFragmentVariables;
var _require2 = require('./RelayStoreUtils'),
  CLIENT_EDGE_TRAVERSAL_PATH = _require2.CLIENT_EDGE_TRAVERSAL_PATH,
  FRAGMENT_OWNER_KEY = _require2.FRAGMENT_OWNER_KEY,
  FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT = _require2.FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT,
  FRAGMENTS_KEY = _require2.FRAGMENTS_KEY,
  ID_KEY = _require2.ID_KEY;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
function getSingularSelector(fragment, item) {
  !(typeof item === 'object' && item !== null && !Array.isArray(item)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, JSON.stringify(item)) : invariant(false) : void 0;
  var dataID = item[ID_KEY];
  var fragments = item[FRAGMENTS_KEY];
  var mixedOwner = item[FRAGMENT_OWNER_KEY];
  var mixedClientEdgeTraversalPath = item[CLIENT_EDGE_TRAVERSAL_PATH];
  if (typeof dataID === 'string' && typeof fragments === 'object' && fragments !== null && typeof fragments[fragment.name] === 'object' && fragments[fragment.name] !== null && typeof mixedOwner === 'object' && mixedOwner !== null && (mixedClientEdgeTraversalPath == null || Array.isArray(mixedClientEdgeTraversalPath))) {
    var owner = mixedOwner;
    var clientEdgeTraversalPath = mixedClientEdgeTraversalPath;
    var argumentVariables = fragments[fragment.name];
    var fragmentVariables = getFragmentVariables(fragment, owner.variables, argumentVariables);
    var isWithinUnmatchedTypeRefinement = argumentVariables[FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT] === true;
    return createReaderSelector(fragment, dataID, fragmentVariables, owner, isWithinUnmatchedTypeRefinement, clientEdgeTraversalPath);
  }
  if (process.env.NODE_ENV !== "production") {
    var stringifiedItem = JSON.stringify(item);
    if (stringifiedItem.length > 499) {
      stringifiedItem = stringifiedItem.substr(0, 498) + "\u2026";
    }
    process.env.NODE_ENV !== "production" ? warning(false, 'RelayModernSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s` without `@relay(mask: false)`.', fragment.name, stringifiedItem, fragment.name) : void 0;
  }
  return null;
}
function getPluralSelector(fragment, items) {
  var selectors = null;
  items.forEach(function (item, ii) {
    var selector = item != null ? getSingularSelector(fragment, item) : null;
    if (selector != null) {
      selectors = selectors || [];
      selectors.push(selector);
    }
  });
  if (selectors == null) {
    return null;
  } else {
    return {
      kind: 'PluralReaderSelector',
      selectors: selectors
    };
  }
}
function getSelector(fragment, item) {
  if (item == null) {
    return item;
  } else if (fragment.metadata && fragment.metadata.plural === true) {
    !Array.isArray(item) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernSelector: Expected value for fragment `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', fragment.name, JSON.stringify(item), fragment.name) : invariant(false) : void 0;
    return getPluralSelector(fragment, item);
  } else {
    !!Array.isArray(item) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernSelector: Expected value for fragment `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', fragment.name, JSON.stringify(item), fragment.name) : invariant(false) : void 0;
    return getSingularSelector(fragment, item);
  }
}
function getSelectorsFromObject(fragments, object) {
  var selectors = {};
  for (var key in fragments) {
    if (fragments.hasOwnProperty(key)) {
      var fragment = fragments[key];
      var item = object[key];
      selectors[key] = getSelector(fragment, item);
    }
  }
  return selectors;
}
function getDataIDsFromObject(fragments, object) {
  var ids = {};
  for (var key in fragments) {
    if (fragments.hasOwnProperty(key)) {
      var fragment = fragments[key];
      var item = object[key];
      ids[key] = getDataIDsFromFragment(fragment, item);
    }
  }
  return ids;
}
function getDataIDsFromFragment(fragment, item) {
  if (item == null) {
    return item;
  } else if (fragment.metadata && fragment.metadata.plural === true) {
    !Array.isArray(item) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernSelector: Expected value for fragment `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', fragment.name, JSON.stringify(item), fragment.name) : invariant(false) : void 0;
    return getDataIDs(fragment, item);
  } else {
    !!Array.isArray(item) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernFragmentSpecResolver: Expected value for fragment `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', fragment.name, JSON.stringify(item), fragment.name) : invariant(false) : void 0;
    return getDataID(fragment, item);
  }
}
function getDataIDs(fragment, items) {
  var ids = null;
  items.forEach(function (item) {
    var id = item != null ? getDataID(fragment, item) : null;
    if (id != null) {
      ids = ids || [];
      ids.push(id);
    }
  });
  return ids;
}
function getDataID(fragment, item) {
  !(typeof item === 'object' && item !== null && !Array.isArray(item)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, JSON.stringify(item)) : invariant(false) : void 0;
  var dataID = item[ID_KEY];
  if (typeof dataID === 'string') {
    return dataID;
  }
  process.env.NODE_ENV !== "production" ? warning(false, 'RelayModernSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s` without `@relay(mask: false)`, or `null` is passed as the fragment ' + "reference for `%s` if it's conditonally included and the condition isn't met.", fragment.name, JSON.stringify(item), fragment.name, fragment.name) : void 0;
  return null;
}
function getVariablesFromObject(fragments, object) {
  var variables = {};
  for (var key in fragments) {
    if (fragments.hasOwnProperty(key)) {
      var fragment = fragments[key];
      var item = object[key];
      var itemVariables = getVariablesFromFragment(fragment, item);
      Object.assign(variables, itemVariables);
    }
  }
  return variables;
}
function getVariablesFromFragment(fragment, item) {
  var _fragment$metadata;
  if (item == null) {
    return {};
  } else if (((_fragment$metadata = fragment.metadata) === null || _fragment$metadata === void 0 ? void 0 : _fragment$metadata.plural) === true) {
    !Array.isArray(item) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernSelector: Expected value for fragment `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', fragment.name, JSON.stringify(item), fragment.name) : invariant(false) : void 0;
    return getVariablesFromPluralFragment(fragment, item);
  } else {
    !!Array.isArray(item) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernFragmentSpecResolver: Expected value for fragment `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', fragment.name, JSON.stringify(item), fragment.name) : invariant(false) : void 0;
    return getVariablesFromSingularFragment(fragment, item) || {};
  }
}
function getVariablesFromSingularFragment(fragment, item) {
  var selector = getSingularSelector(fragment, item);
  if (!selector) {
    return null;
  }
  return selector.variables;
}
function getVariablesFromPluralFragment(fragment, items) {
  var variables = {};
  items.forEach(function (value, ii) {
    if (value != null) {
      var itemVariables = getVariablesFromSingularFragment(fragment, value);
      if (itemVariables != null) {
        Object.assign(variables, itemVariables);
      }
    }
  });
  return variables;
}
function areEqualSingularSelectors(thisSelector, thatSelector) {
  return thisSelector.dataID === thatSelector.dataID && thisSelector.node === thatSelector.node && areEqual(thisSelector.variables, thatSelector.variables) && areEqualOwners(thisSelector.owner, thatSelector.owner) && thisSelector.isWithinUnmatchedTypeRefinement === thatSelector.isWithinUnmatchedTypeRefinement && areEqualClientEdgeTraversalPaths(thisSelector.clientEdgeTraversalPath, thatSelector.clientEdgeTraversalPath);
}
function areEqualOwners(thisOwner, thatOwner) {
  if (thisOwner === thatOwner) {
    return true;
  } else {
    return thisOwner.identifier === thatOwner.identifier && areEqual(thisOwner.cacheConfig, thatOwner.cacheConfig);
  }
}
function areEqualClientEdgeTraversalPaths(thisPath, thatPath) {
  if (thisPath === thatPath) {
    return true;
  }
  if (thisPath == null || thatPath == null || thisPath.length !== thatPath.length) {
    return false;
  }
  var idx = thisPath.length;
  while (idx--) {
    var a = thisPath[idx];
    var b = thatPath[idx];
    if (a === b) {
      continue;
    }
    if (a == null || b == null || a.clientEdgeDestinationID !== b.clientEdgeDestinationID || a.readerClientEdge !== b.readerClientEdge) {
      return false;
    }
  }
  return true;
}
function areEqualSelectors(a, b) {
  if (a === b) {
    return true;
  } else if (a == null) {
    return b == null;
  } else if (b == null) {
    return a == null;
  } else if (a.kind === 'SingularReaderSelector' && b.kind === 'SingularReaderSelector') {
    return areEqualSingularSelectors(a, b);
  } else if (a.kind === 'PluralReaderSelector' && b.kind === 'PluralReaderSelector') {
    return a.selectors.length === b.selectors.length && a.selectors.every(function (s, i) {
      return areEqualSingularSelectors(s, b.selectors[i]);
    });
  } else {
    return false;
  }
}
function createReaderSelector(fragment, dataID, variables, request) {
  var isWithinUnmatchedTypeRefinement = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var clientEdgeTraversalPath = arguments.length > 5 ? arguments[5] : undefined;
  return {
    kind: 'SingularReaderSelector',
    dataID: dataID,
    isWithinUnmatchedTypeRefinement: isWithinUnmatchedTypeRefinement,
    clientEdgeTraversalPath: clientEdgeTraversalPath !== null && clientEdgeTraversalPath !== void 0 ? clientEdgeTraversalPath : null,
    node: fragment,
    variables: variables,
    owner: request
  };
}
function createNormalizationSelector(node, dataID, variables) {
  return {
    dataID: dataID,
    node: node,
    variables: variables
  };
}
module.exports = {
  areEqualSelectors: areEqualSelectors,
  createReaderSelector: createReaderSelector,
  createNormalizationSelector: createNormalizationSelector,
  getDataIDsFromFragment: getDataIDsFromFragment,
  getDataIDsFromObject: getDataIDsFromObject,
  getSingularSelector: getSingularSelector,
  getPluralSelector: getPluralSelector,
  getSelector: getSelector,
  getSelectorsFromObject: getSelectorsFromObject,
  getVariablesFromSingularFragment: getVariablesFromSingularFragment,
  getVariablesFromPluralFragment: getVariablesFromPluralFragment,
  getVariablesFromFragment: getVariablesFromFragment,
  getVariablesFromObject: getVariablesFromObject
};