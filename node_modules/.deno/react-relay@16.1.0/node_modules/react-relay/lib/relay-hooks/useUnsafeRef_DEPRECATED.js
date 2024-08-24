'use strict';

var _require = require('react'),
  useMemo = _require.useMemo;
function useUnsafeRef_DEPRECATED(init) {
  return useMemo(function () {
    return {
      current: init
    };
  }, []);
}
module.exports = useUnsafeRef_DEPRECATED;