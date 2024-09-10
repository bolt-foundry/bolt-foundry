'use strict';

var areEqual = require("fbjs/lib/areEqual");
var _require = require('react'),
  useState = _require.useState;
function useMemoVariables(variables) {
  var _useState = useState(variables),
    mirroredVariables = _useState[0],
    setMirroredVariables = _useState[1];
  if (areEqual(variables, mirroredVariables)) {
    return mirroredVariables;
  } else {
    setMirroredVariables(variables);
    return variables;
  }
}
module.exports = useMemoVariables;