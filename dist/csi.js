"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _long = _interopRequireDefault(require("long"));

var _bgzfFilehandle = require("@gmod/bgzf-filehandle");

var _virtualOffset = _interopRequireWildcard(require("./virtualOffset"));

var _chunk = _interopRequireDefault(require("./chunk"));

var _util = require("./util");

var _indexFile = _interopRequireDefault(require("./indexFile"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = (0, _getIterator2.default)(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context8; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context8 = Object.prototype.toString.call(o)).call(_context8, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var CSI1_MAGIC = 21582659; // CSI\1

var CSI2_MAGIC = 38359875; // CSI\2

function lshift(num, bits) {
  return num * Math.pow(2, bits);
}

function rshift(num, bits) {
  return Math.floor(num / Math.pow(2, bits));
}

var CSI = /*#__PURE__*/function (_IndexFile) {
  (0, _inherits2.default)(CSI, _IndexFile);

  var _super = _createSuper(CSI);

  function CSI(args) {
    var _this;

    (0, _classCallCheck2.default)(this, CSI);
    _this = _super.call(this, args);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "maxBinNumber", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "depth", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "minShift", void 0);
    _this.maxBinNumber = 0;
    _this.depth = 0;
    _this.minShift = 0;
    return _this;
  }

  (0, _createClass2.default)(CSI, [{
    key: "lineCount",
    value: function () {
      var _lineCount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(refId) {
        var indexData, idx, stats;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.parse();

              case 2:
                indexData = _context.sent;

                if (indexData) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", -1);

              case 5:
                idx = indexData.indices[refId];

                if (idx) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", -1);

              case 8:
                stats = indexData.indices[refId].stats;

                if (!stats) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", stats.lineCount);

              case 11:
                return _context.abrupt("return", -1);

              case 12:
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
    }()
  }, {
    key: "indexCov",
    value: function () {
      var _indexCov = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", []);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function indexCov() {
        return _indexCov.apply(this, arguments);
      }

      return indexCov;
    }()
  }, {
    key: "parseAuxData",
    value: function parseAuxData(bytes, offset, auxLength) {
      if (auxLength < 30) {
        return {};
      }

      var data = {};
      data.formatFlags = bytes.readInt32LE(offset);
      data.coordinateType = data.formatFlags & 0x10000 ? 'zero-based-half-open' : '1-based-closed';
      data.format = {
        0: 'generic',
        1: 'SAM',
        2: 'VCF'
      }[data.formatFlags & 0xf];

      if (!data.format) {
        throw new Error("invalid Tabix preset format flags ".concat(data.formatFlags));
      }

      data.columnNumbers = {
        ref: bytes.readInt32LE(offset + 4),
        start: bytes.readInt32LE(offset + 8),
        end: bytes.readInt32LE(offset + 12)
      };
      data.metaValue = bytes.readInt32LE(offset + 16);
      data.metaChar = data.metaValue ? String.fromCharCode(data.metaValue) : '';
      data.skipLines = bytes.readInt32LE(offset + 20);
      var nameSectionLength = bytes.readInt32LE(offset + 24);
      (0, _assign.default)(data, this._parseNameBytes((0, _slice.default)(bytes).call(bytes, offset + 28, offset + 28 + nameSectionLength)));
      return data;
    }
  }, {
    key: "_parseNameBytes",
    value: function _parseNameBytes(namesBytes) {
      var currRefId = 0;
      var currNameStart = 0;
      var refIdToName = [];
      var refNameToId = {};

      for (var i = 0; i < namesBytes.length; i += 1) {
        if (!namesBytes[i]) {
          if (currNameStart < i) {
            var refName = namesBytes.toString('utf8', currNameStart, i);
            refName = this.renameRefSeq(refName);
            refIdToName[currRefId] = refName;
            refNameToId[refName] = currRefId;
          }

          currNameStart = i + 1;
          currRefId += 1;
        }
      }

      return {
        refNameToId: refNameToId,
        refIdToName: refIdToName
      };
    } // fetch and parse the index

  }, {
    key: "_parse",
    value: function () {
      var _parse2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(opts) {
        var data, buffer, bytes, auxLength, currOffset, i, binCount, binIndex, stats, j, bin, loffset, chunkCount, chunks, k, u, v;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = {
                  csi: true,
                  maxBlockSize: 1 << 16
                };
                _context3.next = 3;
                return this.filehandle.readFile(opts);

              case 3:
                buffer = _context3.sent;
                _context3.next = 6;
                return (0, _bgzfFilehandle.unzip)(buffer);

              case 6:
                bytes = _context3.sent;

                if (!(bytes.readUInt32LE(0) === CSI1_MAGIC)) {
                  _context3.next = 11;
                  break;
                }

                data.csiVersion = 1;
                _context3.next = 16;
                break;

              case 11:
                if (!(bytes.readUInt32LE(0) === CSI2_MAGIC)) {
                  _context3.next = 15;
                  break;
                }

                data.csiVersion = 2;
                _context3.next = 16;
                break;

              case 15:
                throw new Error('Not a CSI file');

              case 16:
                this.minShift = bytes.readInt32LE(4);
                this.depth = bytes.readInt32LE(8);
                this.maxBinNumber = ((1 << (this.depth + 1) * 3) - 1) / 7;
                auxLength = bytes.readInt32LE(12);

                if (auxLength) {
                  (0, _assign.default)(data, this.parseAuxData(bytes, 16, auxLength));
                }

                data.refCount = bytes.readInt32LE(16 + auxLength); // read the indexes for each reference sequence

                data.indices = new Array(data.refCount);
                currOffset = 16 + auxLength + 4;
                i = 0;

              case 25:
                if (!(i < data.refCount)) {
                  _context3.next = 37;
                  break;
                }

                _context3.next = 28;
                return (0, _util.abortBreakPoint)(opts.signal);

              case 28:
                // the binning index
                binCount = bytes.readInt32LE(currOffset);
                currOffset += 4;
                binIndex = {};
                stats = void 0; // < provided by parsing a pseudo-bin, if present

                for (j = 0; j < binCount; j += 1) {
                  bin = bytes.readUInt32LE(currOffset);

                  if (bin > this.maxBinNumber) {
                    // this is a fake bin that actually has stats information
                    // about the reference sequence in it
                    stats = this.parsePseudoBin(bytes, currOffset + 4);
                    currOffset += 4 + 8 + 4 + 16 + 16;
                  } else {
                    loffset = (0, _virtualOffset.fromBytes)(bytes, currOffset + 4);

                    this._findFirstData(data, loffset);

                    chunkCount = bytes.readInt32LE(currOffset + 12);
                    currOffset += 16;
                    chunks = new Array(chunkCount);

                    for (k = 0; k < chunkCount; k += 1) {
                      u = (0, _virtualOffset.fromBytes)(bytes, currOffset);
                      v = (0, _virtualOffset.fromBytes)(bytes, currOffset + 8);
                      currOffset += 16; // this._findFirstData(data, u)

                      chunks[k] = new _chunk.default(u, v, bin);
                    }

                    binIndex[bin] = chunks;
                  }
                }

                data.indices[i] = {
                  binIndex: binIndex,
                  stats: stats
                };

              case 34:
                i += 1;
                _context3.next = 25;
                break;

              case 37:
                return _context3.abrupt("return", data);

              case 38:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _parse(_x2) {
        return _parse2.apply(this, arguments);
      }

      return _parse;
    }()
  }, {
    key: "parsePseudoBin",
    value: function parsePseudoBin(bytes, offset) {
      // const one = Long.fromBytesLE(bytes.slice(offset + 4, offset + 12), true)
      // const two = Long.fromBytesLE(bytes.slice(offset + 12, offset + 20), true)
      // const three = longToNumber(
      //   Long.fromBytesLE(bytes.slice(offset + 20, offset + 28), true),
      // )
      var lineCount = (0, _util.longToNumber)(_long.default.fromBytesLE((0, _slice.default)(Array.prototype).call(bytes, offset + 28, offset + 36), true));
      return {
        lineCount: lineCount
      };
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
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                return _context4.abrupt("return", (0, _util.optimizeChunks)(chunks, new _virtualOffset.default(0, 0)));

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function blocksForRange(_x3, _x4, _x5) {
        return _blocksForRange.apply(this, arguments);
      }

      return blocksForRange;
    }()
    /**
     * calculate the list of bins that may overlap with region [beg,end) (zero-based half-open)
     * @returns {Array[number]}
     */

  }, {
    key: "reg2bins",
    value: function reg2bins(beg, end) {
      beg -= 1; // < convert to 1-based closed

      if (beg < 1) {
        beg = 1;
      }

      if (end > Math.pow(2, 50)) {
        end = Math.pow(2, 34);
      } // 17 GiB ought to be enough for anybody


      end -= 1;
      var l = 0;
      var t = 0;
      var s = this.minShift + this.depth * 3;
      var bins = [];

      for (; l <= this.depth; s -= 3, t += lshift(1, l * 3), l += 1) {
        var b = t + rshift(beg, s);
        var e = t + rshift(end, s);

        if (e - b + bins.length > this.maxBinNumber) {
          var _context5, _context6, _context7;

          throw new Error((0, _concat.default)(_context5 = (0, _concat.default)(_context6 = (0, _concat.default)(_context7 = "query ".concat(beg, "-")).call(_context7, end, " is too large for current binning scheme (shift ")).call(_context6, this.minShift, ", depth ")).call(_context5, this.depth, "), try a smaller query or a coarser index binning scheme"));
        }

        bins.push([b, e]);
      }

      return bins;
    }
  }]);
  return CSI;
}(_indexFile.default);

exports.default = CSI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jc2kudHMiXSwibmFtZXMiOlsiQ1NJMV9NQUdJQyIsIkNTSTJfTUFHSUMiLCJsc2hpZnQiLCJudW0iLCJiaXRzIiwicnNoaWZ0IiwiTWF0aCIsImZsb29yIiwiQ1NJIiwiYXJncyIsIm1heEJpbk51bWJlciIsImRlcHRoIiwibWluU2hpZnQiLCJyZWZJZCIsInBhcnNlIiwiaW5kZXhEYXRhIiwiaWR4IiwiaW5kaWNlcyIsInN0YXRzIiwibGluZUNvdW50IiwiYnl0ZXMiLCJvZmZzZXQiLCJhdXhMZW5ndGgiLCJkYXRhIiwiZm9ybWF0RmxhZ3MiLCJyZWFkSW50MzJMRSIsImNvb3JkaW5hdGVUeXBlIiwiZm9ybWF0IiwiRXJyb3IiLCJjb2x1bW5OdW1iZXJzIiwicmVmIiwic3RhcnQiLCJlbmQiLCJtZXRhVmFsdWUiLCJtZXRhQ2hhciIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInNraXBMaW5lcyIsIm5hbWVTZWN0aW9uTGVuZ3RoIiwiX3BhcnNlTmFtZUJ5dGVzIiwibmFtZXNCeXRlcyIsImN1cnJSZWZJZCIsImN1cnJOYW1lU3RhcnQiLCJyZWZJZFRvTmFtZSIsInJlZk5hbWVUb0lkIiwiaSIsImxlbmd0aCIsInJlZk5hbWUiLCJ0b1N0cmluZyIsInJlbmFtZVJlZlNlcSIsIm9wdHMiLCJjc2kiLCJtYXhCbG9ja1NpemUiLCJmaWxlaGFuZGxlIiwicmVhZEZpbGUiLCJidWZmZXIiLCJyZWFkVUludDMyTEUiLCJjc2lWZXJzaW9uIiwicGFyc2VBdXhEYXRhIiwicmVmQ291bnQiLCJBcnJheSIsImN1cnJPZmZzZXQiLCJzaWduYWwiLCJiaW5Db3VudCIsImJpbkluZGV4IiwiaiIsImJpbiIsInBhcnNlUHNldWRvQmluIiwibG9mZnNldCIsIl9maW5kRmlyc3REYXRhIiwiY2h1bmtDb3VudCIsImNodW5rcyIsImsiLCJ1IiwidiIsIkNodW5rIiwiTG9uZyIsImZyb21CeXRlc0xFIiwicHJvdG90eXBlIiwiY2FsbCIsIm1pbiIsIm1heCIsImJhIiwib3ZlcmxhcHBpbmdCaW5zIiwicmVnMmJpbnMiLCJiaW5DaHVua3MiLCJjIiwicHVzaCIsIm1pbnYiLCJtYXh2IiwiVmlydHVhbE9mZnNldCIsImJlZyIsImwiLCJ0IiwicyIsImJpbnMiLCJiIiwiZSIsIkluZGV4RmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUcsUUFBbkIsQyxDQUE0Qjs7QUFDNUIsSUFBTUMsVUFBVSxHQUFHLFFBQW5CLEMsQ0FBNEI7O0FBRTVCLFNBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLEVBQTZCQyxJQUE3QixFQUEyQztBQUN6QyxTQUFPRCxHQUFHLFlBQUcsQ0FBSCxFQUFRQyxJQUFSLENBQVY7QUFDRDs7QUFDRCxTQUFTQyxNQUFULENBQWdCRixHQUFoQixFQUE2QkMsSUFBN0IsRUFBMkM7QUFDekMsU0FBT0UsSUFBSSxDQUFDQyxLQUFMLENBQVdKLEdBQUcsWUFBRyxDQUFILEVBQVFDLElBQVIsQ0FBZCxDQUFQO0FBQ0Q7O0lBRW9CSSxHOzs7OztBQUluQixlQUFZQyxJQUFaLEVBQXVCO0FBQUE7O0FBQUE7QUFDckIsOEJBQU1BLElBQU47QUFEcUI7QUFBQTtBQUFBO0FBRXJCLFVBQUtDLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxVQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFVBQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFKcUI7QUFLdEI7Ozs7O2dIQUNlQyxLOzs7Ozs7O3VCQUNVLEtBQUtDLEtBQUwsRTs7O0FBQWxCQyxnQkFBQUEsUzs7b0JBQ0RBLFM7Ozs7O2lEQUNJLENBQUMsQzs7O0FBRUpDLGdCQUFBQSxHLEdBQU1ELFNBQVMsQ0FBQ0UsT0FBVixDQUFrQkosS0FBbEIsQzs7b0JBQ1BHLEc7Ozs7O2lEQUNJLENBQUMsQzs7O0FBRUZFLGdCQUFBQSxLLEdBQVVILFNB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QUQsRUFBSTBGLENBQUMsR0FBRyxDQUFSLENBQW5CLEVBQStCQSxDQUFDLElBQUksQ0FBNUQsRUFBK0Q7QUFDN0QsWUFBTUksQ0FBQyxHQUFHSCxDQUFDLEdBQUd4RixNQUFNLENBQUNzRixHQUFELEVBQU1HLENBQU4sQ0FBcEI7QUFDQSxZQUFNRyxDQUFDLEdBQUdKLENBQUMsR0FBR3hGLE1BQU0sQ0FBQzJCLEdBQUQsRUFBTThELENBQU4sQ0FBcEI7O0FBQ0EsWUFBSUcsQ0FBQyxHQUFHRCxDQUFKLEdBQVFELElBQUksQ0FBQ2pELE1BQWIsR0FBc0IsS0FBS3BDLFlBQS9CLEVBQTZDO0FBQUE7O0FBQzNDLGdCQUFNLElBQUlrQixLQUFKLG9IQUNLK0QsR0FETCx3QkFDWTNELEdBRFosdUVBQ2tFLEtBQUtwQixRQUR2RSwrQkFDMEYsS0FBS0QsS0FEL0YsOERBQU47QUFHRDs7QUFDRG9GLFFBQUFBLElBQUksQ0FBQ1IsSUFBTCxDQUFVLENBQUNTLENBQUQsRUFBSUMsQ0FBSixDQUFWO0FBQ0Q7O0FBQ0QsYUFBT0YsSUFBUDtBQUNEOzs7RUExTjhCRyxrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb25nIGZyb20gJ2xvbmcnXG5pbXBvcnQgeyB1bnppcCB9IGZyb20gJ0BnbW9kL2JnemYtZmlsZWhhbmRsZSdcbmltcG9ydCBWaXJ0dWFsT2Zmc2V0LCB7IGZyb21CeXRlcyB9IGZyb20gJy4vdmlydHVhbE9mZnNldCdcbmltcG9ydCBDaHVuayBmcm9tICcuL2NodW5rJ1xuaW1wb3J0IHsgbG9uZ1RvTnVtYmVyLCBhYm9ydEJyZWFrUG9pbnQsIG9wdGltaXplQ2h1bmtzLCBCYXNlT3B0cyB9IGZyb20gJy4vdXRpbCdcblxuaW1wb3J0IEluZGV4RmlsZSBmcm9tICcuL2luZGV4RmlsZSdcblxuY29uc3QgQ1NJMV9NQUdJQyA9IDIxNTgyNjU5IC8vIENTSVxcMVxuY29uc3QgQ1NJMl9NQUdJQyA9IDM4MzU5ODc1IC8vIENTSVxcMlxuXG5mdW5jdGlvbiBsc2hpZnQobnVtOiBudW1iZXIsIGJpdHM6IG51bWJlcikge1xuICByZXR1cm4gbnVtICogMiAqKiBiaXRzXG59XG5mdW5jdGlvbiByc2hpZnQobnVtOiBudW1iZXIsIGJpdHM6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC5mbG9vcihudW0gLyAyICoqIGJpdHMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENTSSBleHRlbmRzIEluZGV4RmlsZSB7XG4gIHByaXZhdGUgbWF4QmluTnVtYmVyOiBudW1iZXJcbiAgcHJpdmF0ZSBkZXB0aDogbnVtYmVyXG4gIHByaXZhdGUgbWluU2hpZnQ6IG51bWJlclxuICBjb25zdHJ1Y3RvcihhcmdzOiBhbnkpIHtcbiAgICBzdXBlcihhcmdzKVxuICAgIHRoaXMubWF4QmluTnVtYmVyID0gMFxuICAgIHRoaXMuZGVwdGggPSAwXG4gICAgdGhpcy5taW5TaGlmdCA9IDBcbiAgfVxuICBhc3luYyBsaW5lQ291bnQocmVmSWQ6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3QgaW5kZXhEYXRhID0gYXdhaXQgdGhpcy5wYXJzZSgpXG4gICAgaWYgKCFpbmRleERhdGEpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICBjb25zdCBpZHggPSBpbmRleERhdGEuaW5kaWNlc1tyZWZJZF1cbiAgICBpZiAoIWlkeCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIGNvbnN0IHsgc3RhdHMgfSA9IGluZGV4RGF0YS5pbmRpY2VzW3JlZklkXVxuICAgIGlmIChzdGF0cykge1xuICAgICAgcmV0dXJuIHN0YXRzLmxpbmVDb3VudFxuICAgIH1cbiAgICByZXR1cm4gLTFcbiAgfVxuXG4gIGFzeW5jIGluZGV4Q292KCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgcGFyc2VBdXhEYXRhKGJ5dGVzOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBhdXhMZW5ndGg6IG51bWJlcikge1xuICAgIGlmIChhdXhMZW5ndGggPCAzMCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9XG4gICAgZGF0YS5mb3JtYXRGbGFncyA9IGJ5dGVzLnJlYWRJbnQzMkxFKG9mZnNldClcbiAgICBkYXRhLmNvb3JkaW5hdGVUeXBlID0gZGF0YS5mb3JtYXRGbGFncyAmIDB4MTAwMDAgPyAnemVyby1iYXNlZC1oYWxmLW9wZW4nIDogJzEtYmFzZWQtY2xvc2VkJ1xuICAgIGRhdGEuZm9ybWF0ID0gKHsgMDogJ2dlbmVyaWMnLCAxOiAnU0FNJywgMjogJ1ZDRicgfSBhcyB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9KVtcbiAgICAgIGRhdGEuZm9ybWF0RmxhZ3MgJiAweGZcbiAgICBdXG4gICAgaWYgKCFkYXRhLmZvcm1hdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIFRhYml4IHByZXNldCBmb3JtYXQgZmxhZ3MgJHtkYXRhLmZvcm1hdEZsYWdzfWApXG4gICAgfVxuICAgIGRhdGEuY29sdW1uTnVtYmVycyA9IHtcbiAgICAgIHJlZjogYnl0ZXMucmVhZEludDMyTEUob2Zmc2V0ICsgNCksXG4gICAgICBzdGFydDogYnl0ZXMucmVhZEludDMyTEUob2Zmc2V0ICsgOCksXG4gICAgICBlbmQ6IGJ5dGVzLnJlYWRJbnQzMkxFKG9mZnNldCArIDEyKSxcbiAgICB9XG4gICAgZGF0YS5tZXRhVmFsdWUgPSBieXRlcy5yZWFkSW50MzJMRShvZmZzZXQgKyAxNilcbiAgICBkYXRhLm1ldGFDaGFyID0gZGF0YS5tZXRhVmFsdWUgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGEubWV0YVZhbHVlKSA6ICcnXG4gICAgZGF0YS5za2lwTGluZXMgPSBieXRlcy5yZWFkSW50MzJMRShvZmZzZXQgKyAyMClcbiAgICBjb25zdCBuYW1lU2VjdGlvbkxlbmd0aCA9IGJ5dGVzLnJlYWRJbnQzMkxFKG9mZnNldCArIDI0KVxuXG4gICAgT2JqZWN0LmFzc2lnbihcbiAgICAgIGRhdGEsXG4gICAgICB0aGlzLl9wYXJzZU5hbWVCeXRlcyhieXRlcy5zbGljZShvZmZzZXQgKyAyOCwgb2Zmc2V0ICsgMjggKyBuYW1lU2VjdGlvbkxlbmd0aCkpLFxuICAgIClcbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgX3BhcnNlTmFtZUJ5dGVzKG5hbWVzQnl0ZXM6IEJ1ZmZlcikge1xuICAgIGxldCBjdXJyUmVmSWQgPSAwXG4gICAgbGV0IGN1cnJOYW1lU3RhcnQgPSAwXG4gICAgY29uc3QgcmVmSWRUb05hbWUgPSBbXVxuICAgIGNvbnN0IHJlZk5hbWVUb0lkOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge31cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzQnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmICghbmFtZXNCeXRlc1tpXSkge1xuICAgICAgICBpZiAoY3Vyck5hbWVTdGFydCA8IGkpIHtcbiAgICAgICAgICBsZXQgcmVmTmFtZSA9IG5hbWVzQnl0ZXMudG9TdHJpbmcoJ3V0ZjgnLCBjdXJyTmFtZVN0YXJ0LCBpKVxuICAgICAgICAgIHJlZk5hbWUgPSB0aGlzLnJlbmFtZVJlZlNlcShyZWZOYW1lKVxuICAgICAgICAgIHJlZklkVG9OYW1lW2N1cnJSZWZJZF0gPSByZWZOYW1lXG4gICAgICAgICAgcmVmTmFtZVRvSWRbcmVmTmFtZV0gPSBjdXJyUmVmSWRcbiAgICAgICAgfVxuICAgICAgICBjdXJyTmFtZVN0YXJ0ID0gaSArIDFcbiAgICAgICAgY3VyclJlZklkICs9IDFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgcmVmTmFtZVRvSWQsIHJlZklkVG9OYW1lIH1cbiAgfVxuXG4gIC8vIGZldGNoIGFuZCBwYXJzZSB0aGUgaW5kZXhcbiAgYXN5bmMgX3BhcnNlKG9wdHM6IHsgc2lnbmFsPzogQWJvcnRTaWduYWwgfSkge1xuICAgIGNvbnN0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7IGNzaTogdHJ1ZSwgbWF4QmxvY2tTaXplOiAxIDw8IDE2IH1cbiAgICBjb25zdCBidWZmZXIgPSAoYXdhaXQgdGhpcy5maWxlaGFuZGxlLnJlYWRGaWxlKG9wdHMpKSBhcyBCdWZmZXJcbiAgICBjb25zdCBieXRlcyA9IGF3YWl0IHVuemlwKGJ1ZmZlcilcblxuICAgIC8vIGNoZWNrIFRCSSBtYWdpYyBudW1iZXJzXG4gICAgaWYgKGJ5dGVzLnJlYWRVSW50MzJMRSgwKSA9PT0gQ1NJMV9NQUdJQykge1xuICAgICAgZGF0YS5jc2lWZXJzaW9uID0gMVxuICAgIH0gZWxzZSBpZiAoYnl0ZXMucmVhZFVJbnQzMkxFKDApID09PSBDU0kyX01BR0lDKSB7XG4gICAgICBkYXRhLmNzaVZlcnNpb24gPSAyXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgQ1NJIGZpbGUnKVxuICAgICAgLy8gVE9ETzogZG8gd2UgbmVlZCB0byBzdXBwb3J0IGJpZy1lbmRpYW4gQ1NJIGZpbGVzP1xuICAgIH1cblxuICAgIHRoaXMubWluU2hpZnQgPSBieXRlcy5yZWFkSW50MzJMRSg0KVxuICAgIHRoaXMuZGVwdGggPSBieXRlcy5yZWFkSW50MzJMRSg4KVxuICAgIHRoaXMubWF4QmluTnVtYmVyID0gKCgxIDw8ICgodGhpcy5kZXB0aCArIDEpICogMykpIC0gMSkgLyA3XG4gICAgY29uc3QgYXV4TGVuZ3RoID0gYnl0ZXMucmVhZEludDMyTEUoMTIpXG4gICAgaWYgKGF1eExlbmd0aCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLCB0aGlzLnBhcnNlQXV4RGF0YShieXRlcywgMTYsIGF1eExlbmd0aCkpXG4gICAgfVxuICAgIGRhdGEucmVmQ291bnQgPSBieXRlcy5yZWFkSW50MzJMRSgxNiArIGF1eExlbmd0aClcblxuICAgIC8vIHJlYWQgdGhlIGluZGV4ZXMgZm9yIGVhY2ggcmVmZXJlbmNlIHNlcXVlbmNlXG4gICAgZGF0YS5pbmRpY2VzID0gbmV3IEFycmF5KGRhdGEucmVmQ291bnQpXG4gICAgbGV0IGN1cnJPZmZzZXQgPSAxNiArIGF1eExlbmd0aCArIDRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEucmVmQ291bnQ7IGkgKz0gMSkge1xuICAgICAgYXdhaXQgYWJvcnRCcmVha1BvaW50KG9wdHMuc2lnbmFsKVxuICAgICAgLy8gdGhlIGJpbm5pbmcgaW5kZXhcbiAgICAgIGNvbnN0IGJpbkNvdW50ID0gYnl0ZXMucmVhZEludDMyTEUoY3Vyck9mZnNldClcbiAgICAgIGN1cnJPZmZzZXQgKz0gNFxuICAgICAgY29uc3QgYmluSW5kZXg6IHsgW2tleTogc3RyaW5nXTogQ2h1bmtbXSB9ID0ge31cbiAgICAgIGxldCBzdGF0cyAvLyA8IHByb3ZpZGVkIGJ5IHBhcnNpbmcgYSBwc2V1ZG8tYmluLCBpZiBwcmVzZW50XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJpbkNvdW50OyBqICs9IDEpIHtcbiAgICAgICAgY29uc3QgYmluID0gYnl0ZXMucmVhZFVJbnQzMkxFKGN1cnJPZmZzZXQpXG4gICAgICAgIGlmIChiaW4gPiB0aGlzLm1heEJpbk51bWJlcikge1xuICAgICAgICAgIC8vIHRoaXMgaXMgYSBmYWtlIGJpbiB0aGF0IGFjdHVhbGx5IGhhcyBzdGF0cyBpbmZvcm1hdGlvblxuICAgICAgICAgIC8vIGFib3V0IHRoZSByZWZlcmVuY2Ugc2VxdWVuY2UgaW4gaXRcbiAgICAgICAgICBzdGF0cyA9IHRoaXMucGFyc2VQc2V1ZG9CaW4oYnl0ZXMsIGN1cnJPZmZzZXQgKyA0KVxuICAgICAgICAgIGN1cnJPZmZzZXQgKz0gNCArIDggKyA0ICsgMTYgKyAxNlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGxvZmZzZXQgPSBmcm9tQnl0ZXMoYnl0ZXMsIGN1cnJPZmZzZXQgKyA0KVxuICAgICAgICAgIHRoaXMuX2ZpbmRGaXJzdERhdGEoZGF0YSwgbG9mZnNldClcbiAgICAgICAgICBjb25zdCBjaHVua0NvdW50ID0gYnl0ZXMucmVhZEludDMyTEUoY3Vyck9mZnNldCArIDEyKVxuICAgICAgICAgIGN1cnJPZmZzZXQgKz0gMTZcbiAgICAgICAgICBjb25zdCBjaHVua3MgPSBuZXcgQXJyYXkoY2h1bmtDb3VudClcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNodW5rQ291bnQ7IGsgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgdSA9IGZyb21CeXRlcyhieXRlcywgY3Vyck9mZnNldClcbiAgICAgICAgICAgIGNvbnN0IHYgPSBmcm9tQnl0ZXMoYnl0ZXMsIGN1cnJPZmZzZXQgKyA4KVxuICAgICAgICAgICAgY3Vyck9mZnNldCArPSAxNlxuICAgICAgICAgICAgLy8gdGhpcy5fZmluZEZpcnN0RGF0YShkYXRhLCB1KVxuICAgICAgICAgICAgY2h1bmtzW2tdID0gbmV3IENodW5rKHUsIHYsIGJpbilcbiAgICAgICAgICB9XG4gICAgICAgICAgYmluSW5kZXhbYmluXSA9IGNodW5rc1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRhdGEuaW5kaWNlc1tpXSA9IHsgYmluSW5kZXgsIHN0YXRzIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgcGFyc2VQc2V1ZG9CaW4oYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICAvLyBjb25zdCBvbmUgPSBMb25nLmZyb21CeXRlc0xFKGJ5dGVzLnNsaWNlKG9mZnNldCArIDQsIG9mZnNldCArIDEyKSwgdHJ1ZSlcbiAgICAvLyBjb25zdCB0d28gPSBMb25nLmZyb21CeXRlc0xFKGJ5dGVzLnNsaWNlKG9mZnNldCArIDEyLCBvZmZzZXQgKyAyMCksIHRydWUpXG4gICAgLy8gY29uc3QgdGhyZWUgPSBsb25nVG9OdW1iZXIoXG4gICAgLy8gICBMb25nLmZyb21CeXRlc0xFKGJ5dGVzLnNsaWNlKG9mZnNldCArIDIwLCBvZmZzZXQgKyAyOCksIHRydWUpLFxuICAgIC8vIClcbiAgICBjb25zdCBsaW5lQ291bnQgPSBsb25nVG9OdW1iZXIoXG4gICAgICBMb25nLmZyb21CeXRlc0xFKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJ5dGVzLCBvZmZzZXQgKyAyOCwgb2Zmc2V0ICsgMzYpLCB0cnVlKSxcbiAgICApXG4gICAgcmV0dXJuIHsgbGluZUNvdW50IH1cbiAgfVxuXG4gIGFzeW5jIGJsb2Nrc0ZvclJhbmdlKHJlZklkOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciwgb3B0czogQmFzZU9wdHMgPSB7fSkge1xuICAgIGlmIChtaW4gPCAwKSB7XG4gICAgICBtaW4gPSAwXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXhEYXRhID0gYXdhaXQgdGhpcy5wYXJzZShvcHRzKVxuICAgIGlmICghaW5kZXhEYXRhKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY29uc3QgYmEgPSBpbmRleERhdGEuaW5kaWNlc1tyZWZJZF1cbiAgICBpZiAoIWJhKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGFwcGluZ0JpbnMgPSB0aGlzLnJlZzJiaW5zKG1pbiwgbWF4KSAvLyBMaXN0IG9mIGJpbiAjcyB0aGF0IG92ZXJsYXAgbWluLCBtYXhcbiAgICBjb25zdCBjaHVua3M6IENodW5rW10gPSBbXVxuXG4gICAgLy8gRmluZCBjaHVua3MgaW4gb3ZlcmxhcHBpbmcgYmlucy4gIExlYWYgYmlucyAoPCA0NjgxKSBhcmUgbm90IHBydW5lZFxuICAgIGZvciAoY29uc3QgW3N0YXJ0LCBlbmRdIG9mIG92ZXJsYXBwaW5nQmlucykge1xuICAgICAgZm9yIChsZXQgYmluID0gc3RhcnQ7IGJpbiA8PSBlbmQ7IGJpbisrKSB7XG4gICAgICAgIGlmIChiYS5iaW5JbmRleFtiaW5dKSB7XG4gICAgICAgICAgY29uc3QgYmluQ2h1bmtzID0gYmEuYmluSW5kZXhbYmluXVxuICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgYmluQ2h1bmtzLmxlbmd0aDsgKytjKSB7XG4gICAgICAgICAgICBjaHVua3MucHVzaChuZXcgQ2h1bmsoYmluQ2h1bmtzW2NdLm1pbnYsIGJpbkNodW5rc1tjXS5tYXh2LCBiaW4pKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpbWl6ZUNodW5rcyhjaHVua3MsIG5ldyBWaXJ0dWFsT2Zmc2V0KDAsIDApKVxuICB9XG5cbiAgLyoqXG4gICAqIGNhbGN1bGF0ZSB0aGUgbGlzdCBvZiBiaW5zIHRoYXQgbWF5IG92ZXJsYXAgd2l0aCByZWdpb24gW2JlZyxlbmQpICh6ZXJvLWJhc2VkIGhhbGYtb3BlbilcbiAgICogQHJldHVybnMge0FycmF5W251bWJlcl19XG4gICAqL1xuICByZWcyYmlucyhiZWc6IG51bWJlciwgZW5kOiBudW1iZXIpIHtcbiAgICBiZWcgLT0gMSAvLyA8IGNvbnZlcnQgdG8gMS1iYXNlZCBjbG9zZWRcbiAgICBpZiAoYmVnIDwgMSkge1xuICAgICAgYmVnID0gMVxuICAgIH1cbiAgICBpZiAoZW5kID4gMiAqKiA1MCkge1xuICAgICAgZW5kID0gMiAqKiAzNFxuICAgIH0gLy8gMTcgR2lCIG91Z2h0IHRvIGJlIGVub3VnaCBmb3IgYW55Ym9keVxuICAgIGVuZCAtPSAxXG4gICAgbGV0IGwgPSAwXG4gICAgbGV0IHQgPSAwXG4gICAgbGV0IHMgPSB0aGlzLm1pblNoaWZ0ICsgdGhpcy5kZXB0aCAqIDNcbiAgICBjb25zdCBiaW5zID0gW11cbiAgICBmb3IgKDsgbCA8PSB0aGlzLmRlcHRoOyBzIC09IDMsIHQgKz0gbHNoaWZ0KDEsIGwgKiAzKSwgbCArPSAxKSB7XG4gICAgICBjb25zdCBiID0gdCArIHJzaGlmdChiZWcsIHMpXG4gICAgICBjb25zdCBlID0gdCArIHJzaGlmdChlbmQsIHMpXG4gICAgICBpZiAoZSAtIGIgKyBiaW5zLmxlbmd0aCA+IHRoaXMubWF4QmluTnVtYmVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgcXVlcnkgJHtiZWd9LSR7ZW5kfSBpcyB0b28gbGFyZ2UgZm9yIGN1cnJlbnQgYmlubmluZyBzY2hlbWUgKHNoaWZ0ICR7dGhpcy5taW5TaGlmdH0sIGRlcHRoICR7dGhpcy5kZXB0aH0pLCB0cnkgYSBzbWFsbGVyIHF1ZXJ5IG9yIGEgY29hcnNlciBpbmRleCBiaW5uaW5nIHNjaGVtZWAsXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGJpbnMucHVzaChbYiwgZV0pXG4gICAgfVxuICAgIHJldHVybiBiaW5zXG4gIH1cbn1cbiJdfQ==