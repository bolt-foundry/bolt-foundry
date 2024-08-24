'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = require('react');
var useMemo = React.useMemo;
function MatchContainer(_ref2) {
  var _ref;
  var fallback = _ref2.fallback,
    loader = _ref2.loader,
    match = _ref2.match,
    props = _ref2.props;
  if (match != null && typeof match !== 'object') {
    throw new Error('MatchContainer: Expected `match` value to be an object or null/undefined.');
  }
  var _ref3 = (_ref = match) !== null && _ref !== void 0 ? _ref : {},
    __id = _ref3.__id,
    __fragments = _ref3.__fragments,
    __fragmentOwner = _ref3.__fragmentOwner,
    __fragmentPropName = _ref3.__fragmentPropName,
    __module_component = _ref3.__module_component;
  if (__fragmentOwner != null && typeof __fragmentOwner !== 'object' || __fragmentPropName != null && typeof __fragmentPropName !== 'string' || __fragments != null && typeof __fragments !== 'object' || __id != null && typeof __id !== 'string') {
    throw new Error("MatchContainer: Invalid 'match' value, expected an object that has a " + "'...SomeFragment' spread.");
  }
  var LoadedContainer = __module_component != null ? loader(__module_component) : null;
  var fragmentProps = useMemo(function () {
    if (__fragmentPropName != null && __id != null && __fragments != null) {
      var fragProps = {};
      fragProps[__fragmentPropName] = {
        __id: __id,
        __fragments: __fragments,
        __fragmentOwner: __fragmentOwner
      };
      return fragProps;
    }
    return null;
  }, [__id, __fragments, __fragmentOwner, __fragmentPropName]);
  if (LoadedContainer != null && fragmentProps != null) {
    return /*#__PURE__*/React.createElement(LoadedContainer, (0, _extends2["default"])({}, props, fragmentProps));
  } else {
    return fallback !== null && fallback !== void 0 ? fallback : null;
  }
}
module.exports = MatchContainer;