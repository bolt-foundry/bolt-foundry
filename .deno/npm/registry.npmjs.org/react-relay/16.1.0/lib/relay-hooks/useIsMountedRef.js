'use strict';

var _require = require('react'),
  useEffect = _require.useEffect,
  useRef = _require.useRef;
function useIsMountedRef() {
  var isMountedRef = useRef(true);
  useEffect(function () {
    isMountedRef.current = true;
    return function () {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef;
}
module.exports = useIsMountedRef;