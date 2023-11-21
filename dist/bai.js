"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _long = _interopRequireDefault(require("long"));

var _virtualOffset = require("./virtualOffset");

var _chunk = _interopRequireDefault(require("./chunk"));

var _indexFile = _interopRequireDefault(require("./indexFile"));

var _util = require("./util");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = (0, _getIterator2.default)(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context7; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context7 = Object.prototype.toString.call(o)).call(_context7, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context5; (0, _forEach.default)(_context5 = ownKeys(Object(source), true)).call(_context5, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context6; (0, _forEach.default)(_context6 = ownKeys(Object(source))).call(_context6, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var BAI_MAGIC = 21578050; // BAI\1

function roundDown(n, multiple) {
  return n - n % multiple;
}

function roundUp(n, multiple) {
  return n - n % multiple + multiple;
}

var BAI = /*#__PURE__*/function (_IndexFile) {
  (0, _inherits2.default)(BAI, _IndexFile);

  var _super = _createSuper(BAI);

  function BAI() {
    (0, _classCallCheck2.default)(this, BAI);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(BAI, [{
    key: "parsePseudoBin",
    value: function parsePseudoBin(bytes, offset) {
      var lineCount = (0, _util.longToNumber)(_long.default.fromBytesLE((0, _slice.default)(Array.prototype).call(bytes, offset + 16, offset + 24), true));
      return {
        lineCount: lineCount
      };
    }
  }, {
    key: "lineCount",
    value: function () {
      var _lineCount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(refId) {
        var opts,
            prom,
            index,
            ret,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                _context.next = 3;
                return this.parse(opts);

              case 3:
                prom = _context.sent;
                index = prom.indices[refId];

                if (index) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", -1);

              case 7:
                ret = index.stats || {};
                return _context.abrupt("return", ret.lineCount === undefined ? -1 : ret.lineCount);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function lineCount(_x) {
        return _lineCount.apply(this, arguments);
      }

      return lineCount;
    }() // fetch and parse the index

  }, {
    key: "_parse",
    value: function () {
      var _parse2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var opts,
            data,
            bytes,
            depth,
            binLimit,
            currOffset,
            i,
            binCount,
            stats,
            binIndex,
            j,
            bin,
            chunkCount,
            chunks,
            k,
            u,
            v,
            linearCount,
            linearIndex,
            _k,
            _args2 = arguments;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                opts = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                data = {
                  bai: true,
                  maxBlockSize: 1 << 16
                };
                _context2.next = 4;
                return this.filehandle.readFile(opts);

              case 4:
                bytes = _context2.sent;

                if (!(bytes.readUInt32LE(0) !== BAI_MAGIC)) {
                  _context2.next = 7;
                  break;
                }

                throw new Error('Not a BAI file');

              case 7:
                data.refCount = bytes.readInt32LE(4);
                depth = 5;
                binLimit = ((1 << (depth + 1) * 3) - 1) / 7; // read the indexes for each reference sequence

                data.indices = new Array(data.refCount);
                currOffset = 8;
                i = 0;

              case 13:
                if (!(i < data.refCount)) {
                  _context2.next = 50;
                  break;
                }

                _context2.next = 16;
                return (0, _util.abortBreakPoint)(opts.signal);

              case 16:
                // the binning index
                binCount = bytes.readInt32LE(currOffset);
                stats = void 0;
                currOffset += 4;
                binIndex = {};
                j = 0;

              case 21:
                if (!(j < binCount)) {
                  _context2.next = 42;
                  break;
                }

                bin = bytes.readUInt32LE(currOffset);
                currOffset += 4;

                if (!(bin === binLimit + 1)) {
                  _context2.next = 30;
                  break;
                }

                currOffset += 4;
                stats = this.parsePseudoBin(bytes, currOffset);
                currOffset += 32;
                _context2.next = 39;
                break;

              case 30:
                if (!(bin > binLimit + 1)) {
                  _context2.next = 34;
                  break;
                }

                throw new Error('bai index contains too many bins, please use CSI');

              case 34:
                chunkCount = bytes.readInt32LE(currOffset);
                currOffset += 4;
                chunks = new Array(chunkCount);

                for (k = 0; k < chunkCount; k += 1) {
                  u = (0, _virtualOffset.fromBytes)(bytes, currOffset);
                  v = (0, _virtualOffset.fromBytes)(bytes, currOffset + 8);
                  currOffset += 16;

                  this._findFirstData(data, u);

                  chunks[k] = new _chunk.default(u, v, bin);
                }

                binIndex[bin] = chunks;

              case 39:
                j += 1;
                _context2.next = 21;
                break;

              case 42:
                linearCount = bytes.readInt32LE(currOffset);
                currOffset += 4; // as we're going through the linear index, figure out
                // the smallest virtual offset in the indexes, which
                // tells us where the BAM header ends

                linearIndex = new Array(linearCount);

                for (_k = 0; _k < linearCount; _k += 1) {
                  linearIndex[_k] = (0, _virtualOffset.fromBytes)(bytes, currOffset);
                  currOffset += 8;

                  this._findFirstData(data, linearIndex[_k]);
                }

                data.indices[i] = {
                  binIndex: binIndex,
                  linearIndex: linearIndex,
                  stats: stats
                };

              case 47:
                i += 1;
                _context2.next = 13;
                break;

              case 50:
                return _context2.abrupt("return", data);

              case 51:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _parse() {
        return _parse2.apply(this, arguments);
      }

      return _parse;
    }()
  }, {
    key: "indexCov",
    value: function () {
      var _indexCov = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(seqId, start, end) {
        var opts,
            v,
            range,
            indexData,
            seqIdx,
            _seqIdx$linearIndex,
            linearIndex,
            stats,
            e,
            s,
            depths,
            totalSize,
            currentPos,
            i,
            j,
            _args3 = arguments;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                opts = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
                v = 16384;
                range = start !== undefined;
                _context3.next = 5;
                return this.parse(opts);

              case 5:
                indexData = _context3.sent;
                seqIdx = indexData.indices[seqId];

                if (seqIdx) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", []);

              case 9:
                _seqIdx$linearIndex = seqIdx.linearIndex, linearIndex = _seqIdx$linearIndex === void 0 ? [] : _seqIdx$linearIndex, stats = seqIdx.stats;

                if (linearIndex.length) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt("return", []);

              case 12:
                e = end !== undefined ? roundUp(end, v) : (linearIndex.length - 1) * v;
                s = start !== undefined ? roundDown(start, v) : 0;

                if (range) {
                  depths = new Array((e - s) / v);
                } else {
                  depths = new Array(linearIndex.length - 1);
                }

                totalSize = linearIndex[linearIndex.length - 1].blockPosition;

                if (!(e > (linearIndex.length - 1) * v)) {
                  _context3.next = 18;
                  break;
                }

                throw new Error('query outside of range of linear index');

              case 18:
                currentPos = linearIndex[s / v].blockPosition;

                for (i = s / v, j = 0; i < e / v; i++, j++) {
                  depths[j] = {
                    score: linearIndex[i + 1].blockPosition - currentPos,
                    start: i * v,
                    end: i * v + v
                  };
                  currentPos = linearIndex[i + 1].blockPosition;
                }

                return _context3.abrupt("return", (0, _map.default)(depths).call(depths, function (d) {
                  return _objectSpread(_objectSpread({}, d), {}, {
                    score: d.score * stats.lineCount / totalSize
                  });
                }));

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function indexCov(_x2, _x3, _x4) {
        return _indexCov.apply(this, arguments);
      }

      return indexCov;
    }()
    /**
     * calculate the list of bins that may overlap with region [beg,end) (zero-based half-open)
     * @returns {Array[number]}
     */

  }, {
    key: "reg2bins",
    value: function reg2bins(beg, end) {
      end -= 1;
      return [[0, 0], [1 + (beg >> 26), 1 + (end >> 26)], [9 + (beg >> 23), 9 + (end >> 23)], [73 + (beg >> 20), 73 + (end >> 20)], [585 + (beg >> 17), 585 + (end >> 17)], [4681 + (beg >> 14), 4681 + (end >> 14)]];
    }
  }, {
    key: "blocksForRange",
    value: function () {
      var _blocksForRange = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(refId, min, max) {
        var opts,
            indexData,
            ba,
            overlappingBins,
            chunks,
            _iterator,
            _step,
            _step$value,
            start,
            end,
            bin,
            binChunks,
            c,
            nintv,
            lowest,
            minLin,
            maxLin,
            i,
            vp,
            _args4 = arguments;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                opts = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};

                if (min < 0) {
                  min = 0;
                }

                _context4.next = 4;
                return this.parse(opts);

              case 4:
                indexData = _context4.sent;

                if (indexData) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", []);

              case 7:
                ba = indexData.indices[refId];

                if (ba) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return", []);

              case 10:
                overlappingBins = this.reg2bins(min, max); // List of bin #s that overlap min, max

                chunks = []; // Find chunks in overlapping bins.  Leaf bins (< 4681) are not pruned

                _iterator = _createForOfIteratorHelper(overlappingBins);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    _step$value = (0, _slicedToArray2.default)(_step.value, 2), start = _step$value[0], end = _step$value[1];

                    for (bin = start; bin <= end; bin++) {
                      if (ba.binIndex[bin]) {
                        binChunks = ba.binIndex[bin];

                        for (c = 0; c < binChunks.length; ++c) {
                          chunks.push(new _chunk.default(binChunks[c].minv, binChunks[c].maxv, bin));
                        }
                      }
                    }
                  } // Use the linear index to find minimum file position of chunks that could contain alignments in the region

                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                nintv = ba.linearIndex.length;
                lowest = null;
                minLin = Math.min(min >> 14, nintv - 1);
                maxLin = Math.min(max >> 14, nintv - 1);

                for (i = minLin; i <= maxLin; ++i) {
                  vp = ba.linearIndex[i];

                  if (vp) {
                    if (!lowest || vp.compareTo(lowest) < 0) {
                      lowest = vp;
                    }
                  }
                }

                return _context4.abrupt("return", (0, _util.optimizeChunks)(chunks, lowest));

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function blocksForRange(_x5, _x6, _x7) {
        return _blocksForRange.apply(this, arguments);
      }

      return blocksForRange;
    }()
  }]);
  return BAI;
}(_indexFile.default);

exports.default = BAI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYWkudHMiXSwibmFtZXMiOlsiQkFJX01BR0lDIiwicm91bmREb3duIiwibiIsIm11bHRpcGxlIiwicm91bmRVcCIsIkJBSSIsImJ5dGVzIiwib2Zmc2V0IiwibGluZUNvdW50IiwiTG9uZyIsImZyb21CeXRlc0xFIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJjYWxsIiwicmVmSWQiLCJvcHRzIiwicGFyc2UiLCJwcm9tIiwiaW5kZXgiLCJpbmRpY2VzIiwicmV0Iiwic3RhdHMiLCJ1bmRlZmluZWQiLCJkYXRhIiwiYmFpIiwibWF4QmxvY2tTaXplIiwiZmlsZWhhbmRsZSIsInJlYWRGaWxlIiwicmVhZFVJbnQzMkxFIiwiRXJyb3IiLCJyZWZDb3VudCIsInJlYWRJbnQzMkxFIiwiZGVwdGgiLCJiaW5MaW1pdCIsImN1cnJPZmZzZXQiLCJpIiwic2lnbmFsIiwiYmluQ291bnQiLCJiaW5JbmRleCIsImoiLCJiaW4iLCJwYXJzZVBzZXVkb0JpbiIsImNodW5rQ291bnQiLCJjaHVua3MiLCJrIiwidSIsInYiLCJfZmluZEZpcnN0RGF0YSIsIkNodW5rIiwibGluZWFyQ291bnQiLCJsaW5lYXJJbmRleCIsInNlcUlkIiwic3RhcnQiLCJlbmQiLCJyYW5nZSIsImluZGV4RGF0YSIsInNlcUlkeCIsImxlbmd0aCIsImUiLCJzIiwiZGVwdGhzIiwidG90YWxTaXplIiwiYmxvY2tQb3NpdGlvbiIsImN1cnJlbnRQb3MiLCJzY29yZSIsImQiLCJiZWciLCJtaW4iLCJtYXgiLCJiYSIsIm92ZXJsYXBwaW5nQmlucyIsInJlZzJiaW5zIiwiYmluQ2h1bmtzIiwiYyIsInB1c2giLCJtaW52IiwibWF4diIsIm5pbnR2IiwibG93ZXN0IiwibWluTGluIiwiTWF0aCIsIm1heExpbiIsInZwIiwiY29tcGFyZVRvIiwiSW5kZXhGaWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q3pCcUIsZ0JBQUFBLE0sR0FBUyxJO0FBQ1BDLGdCQUFBQSxNLEdBQVNDLElBQUksQ0FBQ2IsR0FBTCxDQUFTQSxHQUFHLElBQUksRUFBaEIsRUFBb0JVLEtBQUssR0FBRyxDQUE1QixDO0FBQ1RJLGdCQUFBQSxNLEdBQVNELElBQUksQ0FBQ2IsR0FBTCxDQUFTQyxHQUFHLElBQUksRUFBaEIsRUFBb0JTLEtBQUssR0FBRyxDQUE1QixDOztBQUNmLHFCQUFTMUMsQ0FBVCxHQUFhNEMsTUFBYixFQUFxQjVDLENBQUMsSUFBSThDLE1BQTFCLEVBQWtDLEVBQUU5QyxDQUFwQyxFQUF1QztBQUMvQitDLGtCQUFBQSxFQUQrQixHQUMxQmIsRUFBRSxDQUFDbkIsV0FBSCxDQUFlZixDQUFmLENBRDBCOztBQUVyQyxzQkFBSStDLEVBQUosRUFBUTtBQUNOLHdCQUFJLENBQUNKLE1BQUQsSUFBV0ksRUFBRSxDQUFDQyxTQUFILENBQWFMLE1BQWIsSUFBdUIsQ0FBdEMsRUFBeUM7QUFDdkNBLHNCQUFBQSxNQUFNLEdBQUdJLEVBQVQ7QUFDRDtBQUNGO0FBQ0Y7O2tEQUVNLDBCQUFldkMsTUFBZixFQUF1Qm1DLE1BQXZCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTVMc0JNLGtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvbmcgZnJvbSAnbG9uZydcbmltcG9ydCB7IGZyb21CeXRlcyB9IGZyb20gJy4vdmlydHVhbE9mZnNldCdcbmltcG9ydCBDaHVuayBmcm9tICcuL2NodW5rJ1xuXG5pbXBvcnQgSW5kZXhGaWxlIGZyb20gJy4vaW5kZXhGaWxlJ1xuaW1wb3J0IHsgbG9uZ1RvTnVtYmVyLCBhYm9ydEJyZWFrUG9pbnQsIG9wdGltaXplQ2h1bmtzLCBCYXNlT3B0cyB9IGZyb20gJy4vdXRpbCdcblxuY29uc3QgQkFJX01BR0lDID0gMjE1NzgwNTAgLy8gQkFJXFwxXG5cbmZ1bmN0aW9uIHJvdW5kRG93bihuOiBudW1iZXIsIG11bHRpcGxlOiBudW1iZXIpIHtcbiAgcmV0dXJuIG4gLSAobiAlIG11bHRpcGxlKVxufVxuZnVuY3Rpb24gcm91bmRVcChuOiBudW1iZXIsIG11bHRpcGxlOiBudW1iZXIpIHtcbiAgcmV0dXJuIG4gLSAobiAlIG11bHRpcGxlKSArIG11bHRpcGxlXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJBSSBleHRlbmRzIEluZGV4RmlsZSB7XG4gIHBhcnNlUHNldWRvQmluKGJ5dGVzOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyKSB7XG4gICAgY29uc3QgbGluZUNvdW50ID0gbG9uZ1RvTnVtYmVyKFxuICAgICAgTG9uZy5mcm9tQnl0ZXNMRShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChieXRlcywgb2Zmc2V0ICsgMTYsIG9mZnNldCArIDI0KSwgdHJ1ZSksXG4gICAgKVxuICAgIHJldHVybiB7IGxpbmVDb3VudCB9XG4gIH1cblxuICBhc3luYyBsaW5lQ291bnQocmVmSWQ6IG51bWJlciwgb3B0czogQmFzZU9wdHMgPSB7fSkge1xuICAgIGNvbnN0IHByb20gPSBhd2FpdCB0aGlzLnBhcnNlKG9wdHMpXG4gICAgY29uc3QgaW5kZXggPSBwcm9tLmluZGljZXNbcmVmSWRdXG4gICAgaWYgKCFpbmRleCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGNvbnN0IHJldCA9IGluZGV4LnN0YXRzIHx8IHt9XG4gICAgcmV0dXJuIHJldC5saW5lQ291bnQgPT09IHVuZGVmaW5lZCA/IC0xIDogcmV0LmxpbmVDb3VudFxuICB9XG5cbiAgLy8gZmV0Y2ggYW5kIHBhcnNlIHRoZSBpbmRleFxuICBhc3luYyBfcGFyc2Uob3B0czogQmFzZU9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7IGJhaTogdHJ1ZSwgbWF4QmxvY2tTaXplOiAxIDw8IDE2IH1cbiAgICBjb25zdCBieXRlcyA9IChhd2FpdCB0aGlzLmZpbGVoYW5kbGUucmVhZEZpbGUob3B0cykpIGFzIEJ1ZmZlclxuXG4gICAgLy8gY2hlY2sgQkFJIG1hZ2ljIG51bWJlcnNcbiAgICBpZiAoYnl0ZXMucmVhZFVJbnQzMkxFKDApICE9PSBCQUlfTUFHSUMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgQkFJIGZpbGUnKVxuICAgIH1cblxuICAgIGRhdGEucmVmQ291bnQgPSBieXRlcy5yZWFkSW50MzJMRSg0KVxuICAgIGNvbnN0IGRlcHRoID0gNVxuICAgIGNvbnN0IGJpbkxpbWl0ID0gKCgxIDw8ICgoZGVwdGggKyAxKSAqIDMpKSAtIDEpIC8gN1xuXG4gICAgLy8gcmVhZCB0aGUgaW5kZXhlcyBmb3IgZWFjaCByZWZlcmVuY2Ugc2VxdWVuY2VcbiAgICBkYXRhLmluZGljZXMgPSBuZXcgQXJyYXkoZGF0YS5yZWZDb3VudClcbiAgICBsZXQgY3Vyck9mZnNldCA9IDhcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEucmVmQ291bnQ7IGkgKz0gMSkge1xuICAgICAgYXdhaXQgYWJvcnRCcmVha1BvaW50KG9wdHMuc2lnbmFsKVxuXG4gICAgICAvLyB0aGUgYmlubmluZyBpbmRleFxuICAgICAgY29uc3QgYmluQ291bnQgPSBieXRlcy5yZWFkSW50MzJMRShjdXJyT2Zmc2V0KVxuICAgICAgbGV0IHN0YXRzXG5cbiAgICAgIGN1cnJPZmZzZXQgKz0gNFxuICAgICAgY29uc3QgYmluSW5kZXg6IHsgW2tleTogbnVtYmVyXTogQ2h1bmtbXSB9ID0ge31cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYmluQ291bnQ7IGogKz0gMSkge1xuICAgICAgICBjb25zdCBiaW4gPSBieXRlcy5yZWFkVUludDMyTEUoY3Vyck9mZnNldClcbiAgICAgICAgY3Vyck9mZnNldCArPSA0XG4gICAgICAgIGlmIChiaW4gPT09IGJpbkxpbWl0ICsgMSkge1xuICAgICAgICAgIGN1cnJPZmZzZXQgKz0gNFxuICAgICAgICAgIHN0YXRzID0gdGhpcy5wYXJzZVBzZXVkb0JpbihieXRlcywgY3Vyck9mZnNldClcbiAgICAgICAgICBjdXJyT2Zmc2V0ICs9IDMyXG4gICAgICAgIH0gZWxzZSBpZiAoYmluID4gYmluTGltaXQgKyAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYWkgaW5kZXggY29udGFpbnMgdG9vIG1hbnkgYmlucywgcGxlYXNlIHVzZSBDU0knKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGNodW5rQ291bnQgPSBieXRlcy5yZWFkSW50MzJMRShjdXJyT2Zmc2V0KVxuICAgICAgICAgIGN1cnJPZmZzZXQgKz0gNFxuICAgICAgICAgIGNvbnN0IGNodW5rcyA9IG5ldyBBcnJheShjaHVua0NvdW50KVxuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgY2h1bmtDb3VudDsgayArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCB1ID0gZnJvbUJ5dGVzKGJ5dGVzLCBjdXJyT2Zmc2V0KVxuICAgICAgICAgICAgY29uc3QgdiA9IGZyb21CeXRlcyhieXRlcywgY3Vyck9mZnNldCArIDgpXG4gICAgICAgICAgICBjdXJyT2Zmc2V0ICs9IDE2XG4gICAgICAgICAgICB0aGlzLl9maW5kRmlyc3REYXRhKGRhdGEsIHUpXG4gICAgICAgICAgICBjaHVua3Nba10gPSBuZXcgQ2h1bmsodSwgdiwgYmluKVxuICAgICAgICAgIH1cbiAgICAgICAgICBiaW5JbmRleFtiaW5dID0gY2h1bmtzXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbGluZWFyQ291bnQgPSBieXRlcy5yZWFkSW50MzJMRShjdXJyT2Zmc2V0KVxuICAgICAgY3Vyck9mZnNldCArPSA0XG4gICAgICAvLyBhcyB3ZSdyZSBnb2luZyB0aHJvdWdoIHRoZSBsaW5lYXIgaW5kZXgsIGZpZ3VyZSBvdXRcbiAgICAgIC8vIHRoZSBzbWFsbGVzdCB2aXJ0dWFsIG9mZnNldCBpbiB0aGUgaW5kZXhlcywgd2hpY2hcbiAgICAgIC8vIHRlbGxzIHVzIHdoZXJlIHRoZSBCQU0gaGVhZGVyIGVuZHNcbiAgICAgIGNvbnN0IGxpbmVhckluZGV4ID0gbmV3IEFycmF5KGxpbmVhckNvdW50KVxuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaW5lYXJDb3VudDsgayArPSAxKSB7XG4gICAgICAgIGxpbmVhckluZGV4W2tdID0gZnJvbUJ5dGVzKGJ5dGVzLCBjdXJyT2Zmc2V0KVxuICAgICAgICBjdXJyT2Zmc2V0ICs9IDhcbiAgICAgICAgdGhpcy5fZmluZEZpcnN0RGF0YShkYXRhLCBsaW5lYXJJbmRleFtrXSlcbiAgICAgIH1cblxuICAgICAgZGF0YS5pbmRpY2VzW2ldID0geyBiaW5JbmRleCwgbGluZWFySW5kZXgsIHN0YXRzIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgYXN5bmMgaW5kZXhDb3YoXG4gICAgc2VxSWQ6IG51bWJlcixcbiAgICBzdGFydD86IG51bWJlcixcbiAgICBlbmQ/OiBudW1iZXIsXG4gICAgb3B0czogQmFzZU9wdHMgPSB7fSxcbiAgKTogUHJvbWlzZTx7IHN0YXJ0OiBudW1iZXI7IGVuZDogbnVtYmVyOyBzY29yZTogbnVtYmVyIH1bXT4ge1xuICAgIGNvbnN0IHYgPSAxNjM4NFxuICAgIGNvbnN0IHJhbmdlID0gc3RhcnQgIT09IHVuZGVmaW5lZFxuICAgIGNvbnN0IGluZGV4RGF0YSA9IGF3YWl0IHRoaXMucGFyc2Uob3B0cylcbiAgICBjb25zdCBzZXFJZHggPSBpbmRleERhdGEuaW5kaWNlc1tzZXFJZF1cbiAgICBpZiAoIXNlcUlkeCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGNvbnN0IHsgbGluZWFySW5kZXggPSBbXSwgc3RhdHMgfSA9IHNlcUlkeFxuICAgIGlmICghbGluZWFySW5kZXgubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY29uc3QgZSA9IGVuZCAhPT0gdW5kZWZpbmVkID8gcm91bmRVcChlbmQsIHYpIDogKGxpbmVhckluZGV4Lmxlbmd0aCAtIDEpICogdlxuICAgIGNvbnN0IHMgPSBzdGFydCAhPT0gdW5kZWZpbmVkID8gcm91bmREb3duKHN0YXJ0LCB2KSA6IDBcbiAgICBsZXQgZGVwdGhzXG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBkZXB0aHMgPSBuZXcgQXJyYXkoKGUgLSBzKSAvIHYpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlcHRocyA9IG5ldyBBcnJheShsaW5lYXJJbmRleC5sZW5ndGggLSAxKVxuICAgIH1cbiAgICBjb25zdCB0b3RhbFNpemUgPSBsaW5lYXJJbmRleFtsaW5lYXJJbmRleC5sZW5ndGggLSAxXS5ibG9ja1Bvc2l0aW9uXG4gICAgaWYgKGUgPiAobGluZWFySW5kZXgubGVuZ3RoIC0gMSkgKiB2KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1ZXJ5IG91dHNpZGUgb2YgcmFuZ2Ugb2YgbGluZWFyIGluZGV4JylcbiAgICB9XG4gICAgbGV0IGN1cnJlbnRQb3MgPSBsaW5lYXJJbmRleFtzIC8gdl0uYmxvY2tQb3NpdGlvblxuICAgIGZvciAobGV0IGkgPSBzIC8gdiwgaiA9IDA7IGkgPCBlIC8gdjsgaSsrLCBqKyspIHtcbiAgICAgIGRlcHRoc1tqXSA9IHtcbiAgICAgICAgc2NvcmU6IGxpbmVhckluZGV4W2kgKyAxXS5ibG9ja1Bvc2l0aW9uIC0gY3VycmVudFBvcyxcbiAgICAgICAgc3RhcnQ6IGkgKiB2LFxuICAgICAgICBlbmQ6IGkgKiB2ICsgdixcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRQb3MgPSBsaW5lYXJJbmRleFtpICsgMV0uYmxvY2tQb3NpdGlvblxuICAgIH1cbiAgICByZXR1cm4gZGVwdGhzLm1hcChkID0+IHtcbiAgICAgIHJldHVybiB7IC4uLmQsIHNjb3JlOiAoZC5zY29yZSAqIHN0YXRzLmxpbmVDb3VudCkgLyB0b3RhbFNpemUgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogY2FsY3VsYXRlIHRoZSBsaXN0IG9mIGJpbnMgdGhhdCBtYXkgb3ZlcmxhcCB3aXRoIHJlZ2lvbiBbYmVnLGVuZCkgKHplcm8tYmFzZWQgaGFsZi1vcGVuKVxuICAgKiBAcmV0dXJucyB7QXJyYXlbbnVtYmVyXX1cbiAgICovXG4gIHJlZzJiaW5zKGJlZzogbnVtYmVyLCBlbmQ6IG51bWJlcikge1xuICAgIGVuZCAtPSAxXG4gICAgcmV0dXJuIFtcbiAgICAgIFswLCAwXSxcbiAgICAgIFsxICsgKGJlZyA+PiAyNiksIDEgKyAoZW5kID4+IDI2KV0sXG4gICAgICBbOSArIChiZWcgPj4gMjMpLCA5ICsgKGVuZCA+PiAyMyldLFxuICAgICAgWzczICsgKGJlZyA+PiAyMCksIDczICsgKGVuZCA+PiAyMCldLFxuICAgICAgWzU4NSArIChiZWcgPj4gMTcpLCA1ODUgKyAoZW5kID4+IDE3KV0sXG4gICAgICBbNDY4MSArIChiZWcgPj4gMTQpLCA0NjgxICsgKGVuZCA+PiAxNCldLFxuICAgIF1cbiAgfVxuXG4gIGFzeW5jIGJsb2Nrc0ZvclJhbmdlKHJlZklkOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciwgb3B0czogQmFzZU9wdHMgPSB7fSkge1xuICAgIGlmIChtaW4gPCAwKSB7XG4gICAgICBtaW4gPSAwXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXhEYXRhID0gYXdhaXQgdGhpcy5wYXJzZShvcHRzKVxuICAgIGlmICghaW5kZXhEYXRhKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY29uc3QgYmEgPSBpbmRleERhdGEuaW5kaWNlc1tyZWZJZF1cbiAgICBpZiAoIWJhKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGFwcGluZ0JpbnMgPSB0aGlzLnJlZzJiaW5zKG1pbiwgbWF4KSAvLyBMaXN0IG9mIGJpbiAjcyB0aGF0IG92ZXJsYXAgbWluLCBtYXhcbiAgICBjb25zdCBjaHVua3M6IENodW5rW10gPSBbXVxuXG4gICAgLy8gRmluZCBjaHVua3MgaW4gb3ZlcmxhcHBpbmcgYmlucy4gIExlYWYgYmlucyAoPCA0NjgxKSBhcmUgbm90IHBydW5lZFxuICAgIGZvciAoY29uc3QgW3N0YXJ0LCBlbmRdIG9mIG92ZXJsYXBwaW5nQmlucykge1xuICAgICAgZm9yIChsZXQgYmluID0gc3RhcnQ7IGJpbiA8PSBlbmQ7IGJpbisrKSB7XG4gICAgICAgIGlmIChiYS5iaW5JbmRleFtiaW5dKSB7XG4gICAgICAgICAgY29uc3QgYmluQ2h1bmtzID0gYmEuYmluSW5kZXhbYmluXVxuICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYmluQ2h1bmtzLmxlbmd0aDsgKytjKSB7XG4gICAgICAgICAgICBjaHVua3MucHVzaChuZXcgQ2h1bmsoYmluQ2h1bmtzW2NdLm1pbnYsIGJpbkNodW5rc1tjXS5tYXh2LCBiaW4pKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVzZSB0aGUgbGluZWFyIGluZGV4IHRvIGZpbmQgbWluaW11bSBmaWxlIHBvc2l0aW9uIG9mIGNodW5rcyB0aGF0IGNvdWxkIGNvbnRhaW4gYWxpZ25tZW50cyBpbiB0aGUgcmVnaW9uXG4gICAgY29uc3QgbmludHYgPSBiYS5saW5lYXJJbmRleC5sZW5ndGhcbiAgICBsZXQgbG93ZXN0ID0gbnVsbFxuICAgIGNvbnN0IG1pbkxpbiA9IE1hdGgubWluKG1pbiA+PiAxNCwgbmludHYgLSAxKVxuICAgIGNvbnN0IG1heExpbiA9IE1hdGgubWluKG1heCA+PiAxNCwgbmludHYgLSAxKVxuICAgIGZvciAobGV0IGkgPSBtaW5MaW47IGkgPD0gbWF4TGluOyArK2kpIHtcbiAgICAgIGNvbnN0IHZwID0gYmEubGluZWFySW5kZXhbaV1cbiAgICAgIGlmICh2cCkge1xuICAgICAgICBpZiAoIWxvd2VzdCB8fCB2cC5jb21wYXJlVG8obG93ZXN0KSA8IDApIHtcbiAgICAgICAgICBsb3dlc3QgPSB2cFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGltaXplQ2h1bmtzKGNodW5rcywgbG93ZXN0KVxuICB9XG59XG4iXX0=