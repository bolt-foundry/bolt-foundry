'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var loadEntryPoint = require('./loadEntryPoint');
var _require = require('./loadQuery'),
  useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;
var useIsMountedRef = require('./useIsMountedRef');
var _require2 = require('react'),
  useCallback = _require2.useCallback,
  useEffect = _require2.useEffect,
  useRef = _require2.useRef,
  useState = _require2.useState;
var initialNullEntryPointReferenceState = {
  kind: 'NullEntryPointReference'
};
function useLoadEntryPoint(environmentProvider, entryPoint, options) {
  var _options$TEST_ONLY__i, _options$TEST_ONLY__i2, _options$TEST_ONLY__i3, _options$TEST_ONLY__i4;
  useTrackLoadQueryInRender();
  var initialEntryPointReferenceInternal = (_options$TEST_ONLY__i = options === null || options === void 0 ? void 0 : (_options$TEST_ONLY__i2 = options.TEST_ONLY__initialEntryPointData) === null || _options$TEST_ONLY__i2 === void 0 ? void 0 : _options$TEST_ONLY__i2.entryPointReference) !== null && _options$TEST_ONLY__i !== void 0 ? _options$TEST_ONLY__i : initialNullEntryPointReferenceState;
  var initialEntryPointParamsInternal = (_options$TEST_ONLY__i3 = options === null || options === void 0 ? void 0 : (_options$TEST_ONLY__i4 = options.TEST_ONLY__initialEntryPointData) === null || _options$TEST_ONLY__i4 === void 0 ? void 0 : _options$TEST_ONLY__i4.entryPointParams) !== null && _options$TEST_ONLY__i3 !== void 0 ? _options$TEST_ONLY__i3 : null;
  var isMountedRef = useIsMountedRef();
  var undisposedEntryPointReferencesRef = useRef(new Set([initialEntryPointReferenceInternal]));
  var _useState = useState(initialEntryPointReferenceInternal),
    entryPointReference = _useState[0],
    setEntryPointReference = _useState[1];
  var _useState2 = useState(initialEntryPointParamsInternal),
    entryPointParams = _useState2[0],
    setEntryPointParams = _useState2[1];
  var disposeEntryPoint = useCallback(function () {
    if (isMountedRef.current) {
      var nullEntryPointReference = {
        kind: 'NullEntryPointReference'
      };
      undisposedEntryPointReferencesRef.current.add(nullEntryPointReference);
      setEntryPointReference(nullEntryPointReference);
    }
  }, [setEntryPointReference, isMountedRef]);
  var entryPointLoaderCallback = useCallback(function (params) {
    if (isMountedRef.current) {
      var updatedEntryPointReference = loadEntryPoint(environmentProvider, entryPoint, params);
      undisposedEntryPointReferencesRef.current.add(updatedEntryPointReference);
      setEntryPointReference(updatedEntryPointReference);
      setEntryPointParams(params);
    }
  }, [environmentProvider, entryPoint, setEntryPointReference, isMountedRef]);
  var maybeHiddenOrFastRefresh = useRef(false);
  useEffect(function () {
    return function () {
      maybeHiddenOrFastRefresh.current = true;
    };
  }, []);
  useEffect(function () {
    if (maybeHiddenOrFastRefresh.current === true) {
      maybeHiddenOrFastRefresh.current = false;
      if (entryPointReference.kind !== 'NullEntryPointReference' && entryPointParams != null) {
        entryPointLoaderCallback(entryPointParams);
      }
      return;
    }
    var undisposedEntryPointReferences = undisposedEntryPointReferencesRef.current;
    if (isMountedRef.current) {
      var _iterator = (0, _createForOfIteratorHelper2["default"])(undisposedEntryPointReferences),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var undisposedEntryPointReference = _step.value;
          if (undisposedEntryPointReference === entryPointReference) {
            break;
          }
          undisposedEntryPointReferences["delete"](undisposedEntryPointReference);
          if (undisposedEntryPointReference.kind !== 'NullEntryPointReference') {
            undisposedEntryPointReference.dispose();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, [entryPointReference, entryPointParams, entryPointLoaderCallback, isMountedRef]);
  useEffect(function () {
    return function disposeAllRemainingEntryPointReferences() {
      var _iterator2 = (0, _createForOfIteratorHelper2["default"])(undisposedEntryPointReferencesRef.current),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var unhandledStateChange = _step2.value;
          if (unhandledStateChange.kind !== 'NullEntryPointReference') {
            unhandledStateChange.dispose();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };
  }, []);
  return [entryPointReference.kind === 'NullEntryPointReference' ? null : entryPointReference, entryPointLoaderCallback, disposeEntryPoint];
}
module.exports = useLoadEntryPoint;