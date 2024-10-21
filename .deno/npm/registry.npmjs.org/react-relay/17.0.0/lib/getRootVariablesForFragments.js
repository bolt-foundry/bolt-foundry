'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _require = require('relay-runtime'),
  getSelector = _require.getSelector;
function getRootVariablesForFragments(fragments, props) {
  var rootVariables = {};
  Object.keys(fragments).forEach(function (key) {
    var _selector$selectors$, _selector$selectors$2, _selector$owner$varia;
    var fragmentNode = fragments[key];
    var fragmentRef = props[key];
    var selector = getSelector(fragmentNode, fragmentRef);
    var fragmentOwnerVariables = selector != null && selector.kind === 'PluralReaderSelector' ? (_selector$selectors$ = (_selector$selectors$2 = selector.selectors[0]) === null || _selector$selectors$2 === void 0 ? void 0 : _selector$selectors$2.owner.variables) !== null && _selector$selectors$ !== void 0 ? _selector$selectors$ : {} : (_selector$owner$varia = selector === null || selector === void 0 ? void 0 : selector.owner.variables) !== null && _selector$owner$varia !== void 0 ? _selector$owner$varia : {};
    rootVariables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, rootVariables), fragmentOwnerVariables);
  });
  return rootVariables;
}
module.exports = getRootVariablesForFragments;