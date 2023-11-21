"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.BamArgumentError = exports.BamSizeLimitError = exports.BamBufferOverrunError = exports.BamMalformedError = exports.BamUnimplementedError = exports.BamError = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var BamError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(BamError, _Error);

  var _super = _createSuper(BamError);

  function BamError() {
    (0, _classCallCheck2.default)(this, BamError);
    return _super.apply(this, arguments);
  }

  return BamError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));
/** Error caused by encountering a part of the BAM spec that has not yet been implemented */


exports.BamError = BamError;

var BamUnimplementedError = /*#__PURE__*/function (_Error2) {
  (0, _inherits2.default)(BamUnimplementedError, _Error2);

  var _super2 = _createSuper(BamUnimplementedError);

  function BamUnimplementedError() {
    (0, _classCallCheck2.default)(this, BamUnimplementedError);
    return _super2.apply(this, arguments);
  }

  return BamUnimplementedError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));
/** An error caused by malformed data.  */


exports.BamUnimplementedError = BamUnimplementedError;

var BamMalformedError = /*#__PURE__*/function (_BamError) {
  (0, _inherits2.default)(BamMalformedError, _BamError);

  var _super3 = _createSuper(BamMalformedError);

  function BamMalformedError() {
    (0, _classCallCheck2.default)(this, BamMalformedError);
    return _super3.apply(this, arguments);
  }

  return BamMalformedError;
}(BamError);
/**
 * An error caused by attempting to read beyond the end of the defined data.
 */


exports.BamMalformedError = BamMalformedError;

var BamBufferOverrunError = /*#__PURE__*/function (_BamMalformedError) {
  (0, _inherits2.default)(BamBufferOverrunError, _BamMalformedError);

  var _super4 = _createSuper(BamBufferOverrunError);

  function BamBufferOverrunError() {
    (0, _classCallCheck2.default)(this, BamBufferOverrunError);
    return _super4.apply(this, arguments);
  }

  return BamBufferOverrunError;
}(BamMalformedError);
/**
 * An error caused by data being too big, exceeding a size limit.
 */


exports.BamBufferOverrunError = BamBufferOverrunError;

var BamSizeLimitError = /*#__PURE__*/function (_BamError2) {
  (0, _inherits2.default)(BamSizeLimitError, _BamError2);

  var _super5 = _createSuper(BamSizeLimitError);

  function BamSizeLimitError() {
    (0, _classCallCheck2.default)(this, BamSizeLimitError);
    return _super5.apply(this, arguments);
  }

  return BamSizeLimitError;
}(BamError);
/**
 * An invalid argument was supplied to a bam-js method or object.
 */


exports.BamSizeLimitError = BamSizeLimitError;

var BamArgumentError = /*#__PURE__*/function (_BamError3) {
  (0, _inherits2.default)(BamArgumentError, _BamError3);

  var _super6 = _createSuper(BamArgumentError);

  function BamArgumentError() {
    (0, _classCallCheck2.default)(this, BamArgumentError);
    return _super6.apply(this, arguments);
  }

  return BamArgumentError;
}(BamError);

exports.BamArgumentError = BamArgumentError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcnJvcnMudHMiXSwibmFtZXMiOlsiQmFtRXJyb3IiLCJFcnJvciIsIkJhbVVuaW1wbGVtZW50ZWRFcnJvciIsIkJhbU1hbGZvcm1lZEVycm9yIiwiQmFtQnVmZmVyT3ZlcnJ1bkVycm9yIiwiQmFtU2l6ZUxpbWl0RXJyb3IiLCJCYW1Bcmd1bWVudEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQWFBLFE7Ozs7Ozs7Ozs7OytDQUFpQkMsSztBQUU5Qjs7Ozs7SUFDYUMscUI7Ozs7Ozs7Ozs7OytDQUE4QkQsSztBQUUzQzs7Ozs7SUFDYUUsaUI7Ozs7Ozs7Ozs7O0VBQTBCSCxRO0FBRXZDOzs7Ozs7O0lBR2FJLHFCOzs7Ozs7Ozs7OztFQUE4QkQsaUI7QUFFM0M7Ozs7Ozs7SUFHYUUsaUI7Ozs7Ozs7Ozs7O0VBQTBCTCxRO0FBRXZDOzs7Ozs7O0lBR2FNLGdCOzs7Ozs7Ozs7OztFQUF5Qk4sUSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBCYW1FcnJvciBleHRlbmRzIEVycm9yIHt9XG5cbi8qKiBFcnJvciBjYXVzZWQgYnkgZW5jb3VudGVyaW5nIGEgcGFydCBvZiB0aGUgQkFNIHNwZWMgdGhhdCBoYXMgbm90IHlldCBiZWVuIGltcGxlbWVudGVkICovXG5leHBvcnQgY2xhc3MgQmFtVW5pbXBsZW1lbnRlZEVycm9yIGV4dGVuZHMgRXJyb3Ige31cblxuLyoqIEFuIGVycm9yIGNhdXNlZCBieSBtYWxmb3JtZWQgZGF0YS4gICovXG5leHBvcnQgY2xhc3MgQmFtTWFsZm9ybWVkRXJyb3IgZXh0ZW5kcyBCYW1FcnJvciB7fVxuXG4vKipcbiAqIEFuIGVycm9yIGNhdXNlZCBieSBhdHRlbXB0aW5nIHRvIHJlYWQgYmV5b25kIHRoZSBlbmQgb2YgdGhlIGRlZmluZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhbUJ1ZmZlck92ZXJydW5FcnJvciBleHRlbmRzIEJhbU1hbGZvcm1lZEVycm9yIHt9XG5cbi8qKlxuICogQW4gZXJyb3IgY2F1c2VkIGJ5IGRhdGEgYmVpbmcgdG9vIGJpZywgZXhjZWVkaW5nIGEgc2l6ZSBsaW1pdC5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhbVNpemVMaW1pdEVycm9yIGV4dGVuZHMgQmFtRXJyb3Ige31cblxuLyoqXG4gKiBBbiBpbnZhbGlkIGFyZ3VtZW50IHdhcyBzdXBwbGllZCB0byBhIGJhbS1qcyBtZXRob2Qgb3Igb2JqZWN0LlxuICovXG5leHBvcnQgY2xhc3MgQmFtQXJndW1lbnRFcnJvciBleHRlbmRzIEJhbUVycm9yIHt9XG4iXX0=