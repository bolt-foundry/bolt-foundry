'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var warning = require("fbjs/lib/warning");
var TEMPORARY_RETAIN_DURATION_MS = 5 * 60 * 1000;
var SuspenseResource = /*#__PURE__*/function () {
  function SuspenseResource(retain) {
    var _this = this;
    (0, _defineProperty2["default"])(this, "_retainCount", 0);
    (0, _defineProperty2["default"])(this, "_retainDisposable", null);
    (0, _defineProperty2["default"])(this, "_releaseTemporaryRetain", null);
    this._retain = function (environment) {
      _this._retainCount++;
      if (_this._retainCount === 1) {
        _this._retainDisposable = retain(environment);
      }
      return {
        dispose: function dispose() {
          _this._retainCount = Math.max(0, _this._retainCount - 1);
          if (_this._retainCount === 0) {
            if (_this._retainDisposable != null) {
              _this._retainDisposable.dispose();
              _this._retainDisposable = null;
            } else {
              process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Expected disposable to release query to be defined.' + "If you're seeing this, this is likely a bug in Relay.") : void 0;
            }
          }
        }
      };
    };
  }
  var _proto = SuspenseResource.prototype;
  _proto.temporaryRetain = function temporaryRetain(environment) {
    var _this2 = this;
    var _this$_releaseTempora;
    if (environment.isServer()) {
      return {
        dispose: function dispose() {}
      };
    }
    var retention = this._retain(environment);
    var releaseQueryTimeout = null;
    var releaseTemporaryRetain = function releaseTemporaryRetain() {
      clearTimeout(releaseQueryTimeout);
      releaseQueryTimeout = null;
      _this2._releaseTemporaryRetain = null;
      retention.dispose();
    };
    releaseQueryTimeout = setTimeout(releaseTemporaryRetain, TEMPORARY_RETAIN_DURATION_MS);
    (_this$_releaseTempora = this._releaseTemporaryRetain) === null || _this$_releaseTempora === void 0 ? void 0 : _this$_releaseTempora.call(this);
    this._releaseTemporaryRetain = releaseTemporaryRetain;
    return {
      dispose: function dispose() {
        var _this$_releaseTempora2;
        (_this$_releaseTempora2 = _this2._releaseTemporaryRetain) === null || _this$_releaseTempora2 === void 0 ? void 0 : _this$_releaseTempora2.call(_this2);
      }
    };
  };
  _proto.permanentRetain = function permanentRetain(environment) {
    var disposable = this._retain(environment);
    this.releaseTemporaryRetain();
    return disposable;
  };
  _proto.releaseTemporaryRetain = function releaseTemporaryRetain() {
    var _this$_releaseTempora3;
    (_this$_releaseTempora3 = this._releaseTemporaryRetain) === null || _this$_releaseTempora3 === void 0 ? void 0 : _this$_releaseTempora3.call(this);
    this._releaseTemporaryRetain = null;
  };
  _proto.getRetainCount = function getRetainCount() {
    return this._retainCount;
  };
  return SuspenseResource;
}();
module.exports = SuspenseResource;