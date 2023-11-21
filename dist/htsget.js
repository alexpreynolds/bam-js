"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _concat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapAsyncGenerator"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/awaitAsyncGenerator"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncIterator"));

var _asyncGeneratorDelegate2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncGeneratorDelegate"));

var _bamFile = _interopRequireWildcard(require("./bamFile"));

require("cross-fetch/polyfill");

var _bgzfFilehandle = require("@gmod/bgzf-filehandle");

var _sam = require("./sam");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context13; (0, _forEach.default)(_context13 = ownKeys(Object(source), true)).call(_context13, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context14; (0, _forEach.default)(_context14 = ownKeys(Object(source))).call(_context14, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function concat(_x, _x2) {
  return _concat.apply(this, arguments);
}

function _concat() {
  _concat = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(arr, opts) {
    var res;
    return _regenerator.default.wrap(function _callee5$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _promise.default.all((0, _map.default)(arr).call(arr, /*#__PURE__*/function () {
              var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(chunk) {
                var url, headers, referer, rest, _res;

                return _regenerator.default.wrap(function _callee4$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        url = chunk.url, headers = chunk.headers;

                        if (!(0, _startsWith.default)(url).call(url, 'data:')) {
                          _context15.next = 5;
                          break;
                        }

                        return _context15.abrupt("return", Buffer.from(url.split(',')[1], 'base64'));

                      case 5:
                        //remove referer header, it is not even allowed to be specified
                        //@ts-ignore
                        //eslint-disable-next-line @typescript-eslint/no-unused-vars
                        referer = headers.referer, rest = (0, _objectWithoutProperties2.default)(headers, ["referer"]);
                        _context15.next = 8;
                        return fetch(url, _objectSpread(_objectSpread({}, opts), {}, {
                          headers: _objectSpread(_objectSpread({}, opts.headers), rest)
                        }));

                      case 8:
                        _res = _context15.sent;

                        if (_res.ok) {
                          _context15.next = 11;
                          break;
                        }

                        throw new Error("Failed to fetch ".concat(_res.statusText));

                      case 11:
                        _context15.t0 = Buffer;
                        _context15.next = 14;
                        return _res.arrayBuffer();

                      case 14:
                        _context15.t1 = _context15.sent;
                        return _context15.abrupt("return", _context15.t0.from.call(_context15.t0, _context15.t1));

                      case 16:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref.apply(this, arguments);
              };
            }()));

          case 2:
            res = _context16.sent;
            _context16.t0 = (0, _concat2.default)(Buffer);
            _context16.t1 = Buffer;
            _context16.next = 7;
            return _promise.default.all((0, _map.default)(res).call(res, function (elt) {
              return (0, _bgzfFilehandle.unzip)(elt);
            }));

          case 7:
            _context16.t2 = _context16.sent;
            return _context16.abrupt("return", _context16.t0.call.call(_context16.t0, _context16.t1, _context16.t2));

          case 9:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee5);
  }));
  return _concat.apply(this, arguments);
}

var HtsgetFile = /*#__PURE__*/function (_BamFile) {
  (0, _inherits2.default)(HtsgetFile, _BamFile);

  var _super = _createSuper(HtsgetFile);

  function HtsgetFile(args) {
    var _this2;

    (0, _classCallCheck2.default)(this, HtsgetFile);
    // @ts-ignore override bam defaults
    _this2 = _super.call(this, {
      bamFilehandle: '?',
      baiFilehandle: '?'
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this2), "baseUrl", void 0);
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this2), "trackId", void 0);
    _this2.baseUrl = args.baseUrl;
    _this2.trackId = args.trackId;
    return _this2;
  }

  (0, _createClass2.default)(HtsgetFile, [{
    key: "streamRecordsForRange",
    value: function streamRecordsForRange(chr, min, max) {
      var _this = this;

      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        viewAsPairs: false,
        pairAcrossChr: false,
        maxInsertSize: 200000
      };
      return (0, _wrapAsyncGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _context, _context2, _context3, _context4, _context5;

        var base, url, chrId, result, data, uncba, chunk;
        return _regenerator.default.wrap(function _callee$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                base = (0, _concat2.default)(_context = "".concat(_this.baseUrl, "/")).call(_context, _this.trackId);
                url = (0, _concat2.default)(_context2 = (0, _concat2.default)(_context3 = (0, _concat2.default)(_context4 = "".concat(base, "?referenceName=")).call(_context4, chr, "&start=")).call(_context3, min, "&end=")).call(_context2, max, "&format=BAM");
                chrId = _this.chrToIndex && _this.chrToIndex[chr];
                _context8.next = 5;
                return (0, _awaitAsyncGenerator2.default)(fetch(url, _objectSpread({}, opts)));

              case 5:
                result = _context8.sent;

                if (result.ok) {
                  _context8.next = 8;
                  break;
                }

                throw new Error(result.statusText);

              case 8:
                _context8.next = 10;
                return (0, _awaitAsyncGenerator2.default)(result.json());

              case 10:
                data = _context8.sent;
                _context8.next = 13;
                return (0, _awaitAsyncGenerator2.default)(concat((0, _slice.default)(_context5 = data.htsget.urls).call(_context5, 1), opts));

              case 13:
                uncba = _context8.sent;
                chunk = {
                  buffer: uncba,
                  chunk: {
                    minv: {
                      dataPosition: 0
                    }
                  },
                  toString: function toString() {
                    var _context6, _context7;

                    return (0, _concat2.default)(_context6 = (0, _concat2.default)(_context7 = "".concat(chr, "_")).call(_context7, min, "_")).call(_context6, max);
                  }
                };
                return _context8.delegateYield((0, _asyncGeneratorDelegate2.default)((0, _asyncIterator2.default)(_this._fetchChunkFeatures( // @ts-ignore
                [chunk], chrId, min, max, opts)), _awaitAsyncGenerator2.default), "t0", 16);

              case 16:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee);
      }))();
    } //@ts-ignore

  }, {
    key: "_readChunk",
    value: function () {
      var _readChunk2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(params) {
        var chunk, buffer, c2;
        return _regenerator.default.wrap(function _callee2$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                chunk = params.chunk;
                buffer = chunk.buffer, c2 = chunk.chunk;
                return _context9.abrupt("return", {
                  data: buffer,
                  cpositions: null,
                  dpositions: null,
                  chunk: c2
                });

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee2);
      }));

      function _readChunk(_x3) {
        return _readChunk2.apply(this, arguments);
      }

      return _readChunk;
    }()
  }, {
    key: "getHeader",
    value: function () {
      var _getHeader = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var _context10;

        var opts,
            url,
            result,
            data,
            uncba,
            headLen,
            headerText,
            samHeader,
            idToName,
            nameToId,
            sqLines,
            _args3 = arguments;
        return _regenerator.default.wrap(function _callee3$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                opts = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
                url = (0, _concat2.default)(_context10 = "".concat(this.baseUrl, "/")).call(_context10, this.trackId, "?referenceName=na&class=header");
                _context12.next = 4;
                return fetch(url, opts);

              case 4:
                result = _context12.sent;

                if (result.ok) {
                  _context12.next = 7;
                  break;
                }

                throw new Error("Failed to fetch ".concat(result.statusText));

              case 7:
                _context12.next = 9;
                return result.json();

              case 9:
                data = _context12.sent;
                _context12.next = 12;
                return concat(data.htsget.urls, opts);

              case 12:
                uncba = _context12.sent;

                if (!(uncba.readInt32LE(0) !== _bamFile.BAM_MAGIC)) {
                  _context12.next = 15;
                  break;
                }

                throw new Error('Not a BAM file');

              case 15:
                headLen = uncba.readInt32LE(4);
                headerText = uncba.toString('utf8', 8, 8 + headLen);
                samHeader = (0, _sam.parseHeaderText)(headerText); // use the @SQ lines in the header to figure out the
                // mapping between ref ref ID numbers and names

                idToName = [];
                nameToId = {};
                sqLines = (0, _filter.default)(samHeader).call(samHeader, function (l) {
                  return l.tag === 'SQ';
                });
                (0, _forEach.default)(sqLines).call(sqLines, function (sqLine, refId) {
                  var _context11;

                  (0, _forEach.default)(_context11 = sqLine.data).call(_context11, function (item) {
                    if (item.tag === 'SN') {
                      // this is the ref name
                      var refName = item.value;
                      nameToId[refName] = refId;
                      idToName[refId] = refName;
                    }
                  });
                });
                this.chrToIndex = nameToId;
                this.indexToChr = idToName;
                return _context12.abrupt("return", samHeader);

              case 25:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee3, this);
      }));

      function getHeader() {
        return _getHeader.apply(this, arguments);
      }

      return getHeader;
    }()
  }]);
  return HtsgetFile;
}(_bamFile.default);

exports.default = HtsgetFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odHNnZXQudHMiXSwibmFtZXMiOlsiY29uY2F0IiwiYXJyIiwib3B0cyIsImFsbCIsImNodW5rIiwidXJsIiwiaGVhZGVycyIsIkJ1ZmZlciIsImZyb20iLCJzcGxpdCIsInJlZmVyZXIiLCJyZXN0IiwiZmV0Y2giLCJyZXMiLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsImFycmF5QnVmZmVyIiwiZWx0IiwiSHRzZ2V0RmlsZSIsImFyZ3MiLCJiYW1GaWxlaGFuZGxlIiwiYmFpRmlsZWhhbmRsZSIsImJhc2VVcmwiLCJ0cmFja0lkIiwiY2hyIiwibWluIiwibWF4Iiwidmlld0FzUGFpcnMiLCJwYWlyQWNyb3NzQ2hyIiwibWF4SW5zZXJ0U2l6ZSIsImJhc2UiLCJjaHJJZCIsImNoclRvSW5kZXgiLCJyZXN1bHQiLCJqc29uIiwiZGF0YSIsImh0c2dldCIsInVybHMiLCJ1bmNiYSIsImJ1ZmZlciIsIm1pbnYiLCJkYXRhUG9zaXRpb24iLCJ0b1N0cmluZyIsIl9mZXRjaENodW5rRmVhdHVyZXMiLCJwYXJhbXMiLCJjMiIsImNwb3NpdGlvbnMiLCJkcG9zaXRpb25zIiwicmVhZEludDMyTEUiLCJCQU1fTUFHSUMiLCJoZWFkTGVuIiwiaGVhZGVyVGV4dCIsInNhbUhlYWRlciIsImlkVG9OYW1lIiwibmFtZVRvSWQiLCJzcUxpbmVzIiwibCIsInRhZyIsInNxTGluZSIsInJlZklkIiwiaXRlbSIsInJlZk5hbWUiLCJ2YWx1ZSIsImluZGV4VG9DaHIiLCJCYW1GaWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7U0FXZUEsTTs7Ozs7b0ZBQWYsa0JBQXNCQyxHQUF0QixFQUE4Q0MsSUFBOUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDb0IsaUJBQVFDLEdB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LENBQUN2QixJQUFQLG1CQUFvQixVQUFDeUIsSUFBRCxFQUFzQjtBQUN4Qyx3QkFBSUEsSUFBSSxDQUFDSCxHQUFMLEtBQWEsSUFBakIsRUFBdUI7QUFDckI7QUFDQSwwQkFBTUksT0FBTyxHQUFHRCxJQUFJLENBQUNFLEtBQXJCO0FBQ0FSLHNCQUFBQSxRQUFRLENBQUNPLE9BQUQsQ0FBUixHQUFvQkYsS0FBcEI7QUFDQU4sc0JBQUFBLFFBQVEsQ0FBQ00sS0FBRCxDQUFSLEdBQWtCRSxPQUFsQjtBQUNEO0FBQ0YsbUJBUEQ7QUFRRCxpQkFUTSxDQUFQO0FBVUEscUJBQUs3QixVQUFMLEdBQWtCc0IsUUFBbEI7QUFDQSxxQkFBS1MsVUFBTCxHQUFrQlYsUUFBbEI7bURBQ09ELFM7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXRGNkJZLGdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZU9wdHMsIEJhbU9wdHMgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgQmFtRmlsZSwgeyBCQU1fTUFHSUMgfSBmcm9tICcuL2JhbUZpbGUnXG5pbXBvcnQgJ2Nyb3NzLWZldGNoL3BvbHlmaWxsJ1xuaW1wb3J0IENodW5rIGZyb20gJy4vY2h1bmsnXG5pbXBvcnQgeyB1bnppcCB9IGZyb20gJ0BnbW9kL2JnemYtZmlsZWhhbmRsZSdcbmltcG9ydCB7IHBhcnNlSGVhZGVyVGV4dCB9IGZyb20gJy4vc2FtJ1xuXG5pbnRlcmZhY2UgSGVhZGVyTGluZSB7XG4gIHRhZzogc3RyaW5nXG4gIHZhbHVlOiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIEh0c2dldENodW5rIHtcbiAgdXJsOiBzdHJpbmdcbiAgaGVhZGVycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbn1cbmFzeW5jIGZ1bmN0aW9uIGNvbmNhdChhcnI6IHsgdXJsOiBzdHJpbmcgfVtdLCBvcHRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGFyci5tYXAoYXN5bmMgKGNodW5rOiBIdHNnZXRDaHVuaykgPT4ge1xuICAgICAgY29uc3QgeyB1cmwsIGhlYWRlcnMgfSA9IGNodW5rXG4gICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJ2RhdGE6JykpIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHVybC5zcGxpdCgnLCcpWzFdLCAnYmFzZTY0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vcmVtb3ZlIHJlZmVyZXIgaGVhZGVyLCBpdCBpcyBub3QgZXZlbiBhbGxvd2VkIHRvIGJlIHNwZWNpZmllZFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgICAgIGNvbnN0IHsgcmVmZXJlciwgLi4ucmVzdCB9ID0gaGVhZGVyc1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHsgLi4ub3B0cywgaGVhZGVyczogeyAuLi5vcHRzLmhlYWRlcnMsIC4uLnJlc3QgfSB9KVxuICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZldGNoICR7cmVzLnN0YXR1c1RleHR9YClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oYXdhaXQgcmVzLmFycmF5QnVmZmVyKCkpXG4gICAgICB9XG4gICAgfSksXG4gIClcblxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChhd2FpdCBQcm9taXNlLmFsbChyZXMubWFwKGVsdCA9PiB1bnppcChlbHQpKSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0c2dldEZpbGUgZXh0ZW5kcyBCYW1GaWxlIHtcbiAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmdcblxuICBwcml2YXRlIHRyYWNrSWQ6IHN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IHsgdHJhY2tJZDogc3RyaW5nOyBiYXNlVXJsOiBzdHJpbmcgfSkge1xuICAgIC8vIEB0cy1pZ25vcmUgb3ZlcnJpZGUgYmFtIGRlZmF1bHRzXG4gICAgc3VwZXIoeyBiYW1GaWxlaGFuZGxlOiAnPycsIGJhaUZpbGVoYW5kbGU6ICc/JyB9KVxuICAgIHRoaXMuYmFzZVVybCA9IGFyZ3MuYmFzZVVybFxuICAgIHRoaXMudHJhY2tJZCA9IGFyZ3MudHJhY2tJZFxuICB9XG5cbiAgYXN5bmMgKnN0cmVhbVJlY29yZHNGb3JSYW5nZShcbiAgICBjaHI6IHN0cmluZyxcbiAgICBtaW46IG51bWJlcixcbiAgICBtYXg6IG51bWJlcixcbiAgICBvcHRzOiBCYW1PcHRzID0geyB2aWV3QXNQYWlyczogZmFsc2UsIHBhaXJBY3Jvc3NDaHI6IGZhbHNlLCBtYXhJbnNlcnRTaXplOiAyMDAwMDAgfSxcbiAgKSB7XG4gICAgY29uc3QgYmFzZSA9IGAke3RoaXMuYmFzZVVybH0vJHt0aGlzLnRyYWNrSWR9YFxuICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9P3JlZmVyZW5jZU5hbWU9JHtjaHJ9JnN0YXJ0PSR7bWlufSZlbmQ9JHttYXh9JmZvcm1hdD1CQU1gXG4gICAgY29uc3QgY2hySWQgPSB0aGlzLmNoclRvSW5kZXggJiYgdGhpcy5jaHJUb0luZGV4W2Nocl1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaCh1cmwsIHsgLi4ub3B0cyB9KVxuICAgIGlmICghcmVzdWx0Lm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LnN0YXR1c1RleHQpXG4gICAgfVxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXN1bHQuanNvbigpXG4gICAgY29uc3QgdW5jYmEgPSBhd2FpdCBjb25jYXQoZGF0YS5odHNnZXQudXJscy5zbGljZSgxKSwgb3B0cylcbiAgICBjb25zdCBjaHVuayA9IHtcbiAgICAgIGJ1ZmZlcjogdW5jYmEsXG4gICAgICBjaHVuazogeyBtaW52OiB7IGRhdGFQb3NpdGlvbjogMCB9IH0sXG4gICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke2Nocn1fJHttaW59XyR7bWF4fWBcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgeWllbGQqIHRoaXMuX2ZldGNoQ2h1bmtGZWF0dXJlcyhcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIFtjaHVua10sXG4gICAgICBjaHJJZCxcbiAgICAgIG1pbixcbiAgICAgIG1heCxcbiAgICAgIG9wdHMsXG4gICAgKVxuICB9XG5cbiAgLy9AdHMtaWdub3JlXG4gIGFzeW5jIF9yZWFkQ2h1bmsocGFyYW1zOiB7IGNodW5rOiB7IGJ1ZmZlcjogQnVmZmVyOyBjaHVuazogQ2h1bmsgfTsgb3B0czogQmFzZU9wdHMgfSkge1xuICAgIGNvbnN0IHsgY2h1bmsgfSA9IHBhcmFtc1xuICAgIGNvbnN0IHsgYnVmZmVyLCBjaHVuazogYzIgfSA9IGNodW5rXG4gICAgcmV0dXJuIHsgZGF0YTogYnVmZmVyLCBjcG9zaXRpb25zOiBudWxsLCBkcG9zaXRpb25zOiBudWxsLCBjaHVuazogYzIgfVxuICB9XG5cbiAgYXN5bmMgZ2V0SGVhZGVyKG9wdHM6IEJhc2VPcHRzID0ge30pIHtcbiAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmJhc2VVcmx9LyR7dGhpcy50cmFja0lkfT9yZWZlcmVuY2VOYW1lPW5hJmNsYXNzPWhlYWRlcmBcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaCh1cmwsIG9wdHMpXG4gICAgaWYgKCFyZXN1bHQub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZldGNoICR7cmVzdWx0LnN0YXR1c1RleHR9YClcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKClcbiAgICBjb25zdCB1bmNiYSA9IGF3YWl0IGNvbmNhdChkYXRhLmh0c2dldC51cmxzLCBvcHRzKVxuXG4gICAgaWYgKHVuY2JhLnJlYWRJbnQzMkxFKDApICE9PSBCQU1fTUFHSUMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgQkFNIGZpbGUnKVxuICAgIH1cbiAgICBjb25zdCBoZWFkTGVuID0gdW5jYmEucmVhZEludDMyTEUoNClcblxuICAgIGNvbnN0IGhlYWRlclRleHQgPSB1bmNiYS50b1N0cmluZygndXRmOCcsIDgsIDggKyBoZWFkTGVuKVxuICAgIGNvbnN0IHNhbUhlYWRlciA9IHBhcnNlSGVhZGVyVGV4dChoZWFkZXJUZXh0KVxuXG4gICAgLy8gdXNlIHRoZSBAU1EgbGluZXMgaW4gdGhlIGhlYWRlciB0byBmaWd1cmUgb3V0IHRoZVxuICAgIC8vIG1hcHBpbmcgYmV0d2VlbiByZWYgcmVmIElEIG51bWJlcnMgYW5kIG5hbWVzXG4gICAgY29uc3QgaWRUb05hbWU6IHN0cmluZ1tdID0gW11cbiAgICBjb25zdCBuYW1lVG9JZDogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9XG4gICAgY29uc3Qgc3FMaW5lcyA9IHNhbUhlYWRlci5maWx0ZXIoKGw6IHsgdGFnOiBzdHJpbmcgfSkgPT4gbC50YWcgPT09ICdTUScpXG4gICAgc3FMaW5lcy5mb3JFYWNoKChzcUxpbmU6IHsgZGF0YTogSGVhZGVyTGluZVtdIH0sIHJlZklkOiBudW1iZXIpID0+IHtcbiAgICAgIHNxTGluZS5kYXRhLmZvckVhY2goKGl0ZW06IEhlYWRlckxpbmUpID0+IHtcbiAgICAgICAgaWYgKGl0ZW0udGFnID09PSAnU04nKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyB0aGUgcmVmIG5hbWVcbiAgICAgICAgICBjb25zdCByZWZOYW1lID0gaXRlbS52YWx1ZVxuICAgICAgICAgIG5hbWVUb0lkW3JlZk5hbWVdID0gcmVmSWRcbiAgICAgICAgICBpZFRvTmFtZVtyZWZJZF0gPSByZWZOYW1lXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLmNoclRvSW5kZXggPSBuYW1lVG9JZFxuICAgIHRoaXMuaW5kZXhUb0NociA9IGlkVG9OYW1lXG4gICAgcmV0dXJuIHNhbUhlYWRlclxuICB9XG59XG4iXX0=