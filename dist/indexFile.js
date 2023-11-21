"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _abortablePromiseCache = _interopRequireDefault(require("abortable-promise-cache"));

var _quickLru = _interopRequireDefault(require("quick-lru"));

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context3; (0, _forEach.default)(_context3 = ownKeys(Object(source), true)).call(_context3, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context4; (0, _forEach.default)(_context4 = ownKeys(Object(source))).call(_context4, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var IndexFile = /*#__PURE__*/function () {
  /**
   * @param {filehandle} filehandle
   * @param {function} [renameRefSeqs]
   */
  function IndexFile(_ref) {
    var filehandle = _ref.filehandle,
        _ref$renameRefSeq = _ref.renameRefSeq,
        renameRefSeq = _ref$renameRefSeq === void 0 ? function (n) {
      return n;
    } : _ref$renameRefSeq;
    (0, _classCallCheck2.default)(this, IndexFile);
    (0, _defineProperty3.default)(this, "filehandle", void 0);
    (0, _defineProperty3.default)(this, "renameRefSeq", void 0);
    (0, _defineProperty3.default)(this, "_parseCache", void 0);
    this.filehandle = filehandle;
    this.renameRefSeq = renameRefSeq;
  }

  (0, _createClass2.default)(IndexFile, [{
    key: "_findFirstData",
    value: function _findFirstData(data, virtualOffset) {
      var currentFdl = data.firstDataLine;

      if (currentFdl) {
        data.firstDataLine = currentFdl.compareTo(virtualOffset) > 0 ? virtualOffset : currentFdl;
      } else {
        data.firstDataLine = virtualOffset;
      }
    }
  }, {
    key: "parse",
    value: function () {
      var _parse2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _this = this;

        var opts,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};

                if (!this._parseCache) {
                  this._parseCache = new _abortablePromiseCache.default({
                    cache: new _quickLru.default({
                      maxSize: 1
                    }),
                    fill: function fill(opts, signal) {
                      return _this._parse(_objectSpread(_objectSpread({}, opts), {}, {
                        signal: signal
                      }));
                    }
                  });
                }

                return _context.abrupt("return", this._parseCache.get('index', opts, opts.signal));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parse() {
        return _parse2.apply(this, arguments);
      }

      return parse;
    }()
  }, {
    key: "hasRefSeq",
    value: function () {
      var _hasRefSeq = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(seqId) {
        var opts,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                opts = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                _context2.next = 3;
                return this.parse(opts);

              case 3:
                _context2.t1 = seqId;
                _context2.t0 = _context2.sent.indices[_context2.t1];

                if (_context2.t0) {
                  _context2.next = 7;
                  break;
                }

                _context2.t0 = {};

              case 7:
                return _context2.abrupt("return", !!_context2.t0.binIndex);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function hasRefSeq(_x) {
        return _hasRefSeq.apply(this, arguments);
      }

      return hasRefSeq;
    }()
  }]);
  return IndexFile;
}();

exports.default = IndexFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleEZpbGUudHMiXSwibmFtZXMiOlsiSW5kZXhGaWxlIiwiZmlsZWhhbmRsZSIsInJlbmFtZVJlZlNlcSIsIm4iLCJkYXRhIiwidmlydHVhbE9mZnNldCIsImN1cnJlbnRGZGwiLCJmaXJzdERhdGFMaW5lIiwiY29tcGFyZVRvIiwib3B0cyIsIl9wYXJzZUNhY2hlIiwiQWJvcnRhYmxlUHJvbWlzZUNhY2hlIiwiY2FjaGUiLCJRdWlja0xSVSIsIm1heFNpemUiLCJmaWxsIiwic2lnbmFsIiwiX3BhcnNlIiwiZ2V0Iiwic2VxSWQiLCJwYXJzZSIsImluZGljZXMiLCJiaW5JbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0lBTThCQSxTO0FBSzVCOzs7O0FBSUEsMkJBTUc7QUFBQSxRQUxEQyxVQUtDLFFBTERBLFVBS0M7QUFBQSxpQ0FKREMsWUFJQztBQUFBLFFBSkRBLFlBSUMsa0NBSmMsVUFBQ0MsQ0FBRDtBQUFBLGFBQWVBLENBQWY7QUFBQSxLQUlkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRCxTQUFLRixVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0Q7Ozs7bUNBZWNFLEksRUFBV0MsYSxFQUE4QjtBQUN0RCxVQUFNQyxVQUFVLEdBQUdGLElBQUksQ0FBQ0csYUFBeEI7O0FBQ0EsVUFBSUQsVUFBSixFQUFnQjtBQUNkRixRQUFBQSxJQUFJLENBQUNHLGFBQUwsR0FBcUJELFVBQVUsQ0FBQ0UsU0FBWCxDQUFxQkgsYUFBckIsSUFBc0MsQ0FBdEMsR0FBMENBLGFBQTFDLEdBQTBEQyxVQUEvRTtBQUNELE9BRkQsTUFFTztBQUNMRixRQUFBQSxJQUFJLENBQUNHLGFBQUwsR0FBcUJGLGFBQXJCO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs7OztBQUVXSSxnQkFBQUEsSSwyREFBaUIsRTs7QUFDM0Isb0JBQUksQ0FBQyxLQUFLQyxXQUFWLEVBQXVCO0FBQ3JCLHVCQUFLQSxXQUFMLEdBQW1CLElBQUlDLDhCQUFKLENBQTBCO0FBQzNDQyxvQkFBQUEsS0FBSyxFQUFFLElBQUlDLGlCQUFKLENBQWE7QUFBRUMsc0JBQUFBLE9BQU8sRUFBRTtBQUFYLHFCQUFiLENBRG9DO0FBRTNDQyxvQkFBQUEsSUFBSSxFQUFFLGNBQUNOLElBQUQsRUFBaUJPLE1BQWpCLEVBQTBDO0FBQzlDLDZCQUFPLEtBQUksQ0FBQ0MsTUFBTCxpQ0FBaUJSLElBQWpCO0FBQXVCTyx3QkFBQUEsTUFBTSxFQUFOQTtBQUF2Qix5QkFBUDtBQUNEO0FBSjBDLG1CQUExQixDQUFuQjtBQU1EOztpREFDTSxLQUFLTixXQUFMLENBQWlCUSxHQUFqQixDQUFxQixPQUFyQixFQUE4QlQsSUFBOUIsRUFBb0NBLElBQUksQ0FBQ08sTUFBekMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpSEFHT0csSzs7Ozs7OztBQUFlVixnQkFBQUEsSSw4REFBaUIsRTs7dUJBQzdCLEtBQUtXLEtBQUwsQ0FBV1gsSUFBWCxDOzs7K0JBQTBCVSxLOzhDQUFSRSxPOzs7Ozs7OytCQUFrQixFOzs7aUVBQUlDLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJvcnRhYmxlUHJvbWlzZUNhY2hlIGZyb20gJ2Fib3J0YWJsZS1wcm9taXNlLWNhY2hlJ1xuaW1wb3J0IFF1aWNrTFJVIGZyb20gJ3F1aWNrLWxydSdcbmltcG9ydCB7IEdlbmVyaWNGaWxlaGFuZGxlIH0gZnJvbSAnZ2VuZXJpYy1maWxlaGFuZGxlJ1xuaW1wb3J0IFZpcnR1YWxPZmZzZXQgZnJvbSAnLi92aXJ0dWFsT2Zmc2V0J1xuaW1wb3J0IENodW5rIGZyb20gJy4vY2h1bmsnXG5pbXBvcnQgeyBCYXNlT3B0cyB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgSW5kZXhGaWxlIHtcbiAgcHVibGljIGZpbGVoYW5kbGU6IEdlbmVyaWNGaWxlaGFuZGxlXG4gIHB1YmxpYyByZW5hbWVSZWZTZXE6IEZ1bmN0aW9uXG4gIHByaXZhdGUgX3BhcnNlQ2FjaGU6IGFueVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2ZpbGVoYW5kbGV9IGZpbGVoYW5kbGVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW3JlbmFtZVJlZlNlcXNdXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgZmlsZWhhbmRsZSxcbiAgICByZW5hbWVSZWZTZXEgPSAobjogc3RyaW5nKSA9PiBuLFxuICB9OiB7XG4gICAgZmlsZWhhbmRsZTogR2VuZXJpY0ZpbGVoYW5kbGVcbiAgICByZW5hbWVSZWZTZXE/OiAoYTogc3RyaW5nKSA9PiBzdHJpbmdcbiAgfSkge1xuICAgIHRoaXMuZmlsZWhhbmRsZSA9IGZpbGVoYW5kbGVcbiAgICB0aGlzLnJlbmFtZVJlZlNlcSA9IHJlbmFtZVJlZlNlcVxuICB9XG4gIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBsaW5lQ291bnQocmVmSWQ6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPlxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgX3BhcnNlKG9wdHM/OiBCYXNlT3B0cyk6IFByb21pc2U8YW55PlxuICBwdWJsaWMgYWJzdHJhY3QgYXN5bmMgaW5kZXhDb3YoXG4gICAgcmVmSWQ6IG51bWJlcixcbiAgICBzdGFydD86IG51bWJlcixcbiAgICBlbmQ/OiBudW1iZXIsXG4gICk6IFByb21pc2U8eyBzdGFydDogbnVtYmVyOyBlbmQ6IG51bWJlcjsgc2NvcmU6IG51bWJlciB9W10+XG4gIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBibG9ja3NGb3JSYW5nZShcbiAgICBjaHJJZDogbnVtYmVyLFxuICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgZW5kOiBudW1iZXIsXG4gICAgb3B0czogQmFzZU9wdHMsXG4gICk6IFByb21pc2U8Q2h1bmtbXT5cblxuICBfZmluZEZpcnN0RGF0YShkYXRhOiBhbnksIHZpcnR1YWxPZmZzZXQ6IFZpcnR1YWxPZmZzZXQpIHtcbiAgICBjb25zdCBjdXJyZW50RmRsID0gZGF0YS5maXJzdERhdGFMaW5lXG4gICAgaWYgKGN1cnJlbnRGZGwpIHtcbiAgICAgIGRhdGEuZmlyc3REYXRhTGluZSA9IGN1cnJlbnRGZGwuY29tcGFyZVRvKHZpcnR1YWxPZmZzZXQpID4gMCA/IHZpcnR1YWxPZmZzZXQgOiBjdXJyZW50RmRsXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEuZmlyc3REYXRhTGluZSA9IHZpcnR1YWxPZmZzZXRcbiAgICB9XG4gIH1cblxuICBhc3luYyBwYXJzZShvcHRzOiBCYXNlT3B0cyA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLl9wYXJzZUNhY2hlKSB7XG4gICAgICB0aGlzLl9wYXJzZUNhY2hlID0gbmV3IEFib3J0YWJsZVByb21pc2VDYWNoZSh7XG4gICAgICAgIGNhY2hlOiBuZXcgUXVpY2tMUlUoeyBtYXhTaXplOiAxIH0pLFxuICAgICAgICBmaWxsOiAob3B0czogQmFzZU9wdHMsIHNpZ25hbD86IEFib3J0U2lnbmFsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlKHsgLi4ub3B0cywgc2lnbmFsIH0pXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcGFyc2VDYWNoZS5nZXQoJ2luZGV4Jywgb3B0cywgb3B0cy5zaWduYWwpXG4gIH1cblxuICBhc3luYyBoYXNSZWZTZXEoc2VxSWQ6IG51bWJlciwgb3B0czogQmFzZU9wdHMgPSB7fSkge1xuICAgIHJldHVybiAhISgoYXdhaXQgdGhpcy5wYXJzZShvcHRzKSkuaW5kaWNlc1tzZXFJZF0gfHwge30pLmJpbkluZGV4XG4gIH1cbn1cbiJdfQ==