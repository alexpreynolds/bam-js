"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = exports.BAM_MAGIC = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapAsyncGenerator"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/awaitAsyncGenerator"));

var _asyncGeneratorDelegate2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncGeneratorDelegate"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncIterator"));

var _abortablePromiseCache = _interopRequireDefault(require("abortable-promise-cache"));

var _bai = _interopRequireDefault(require("./bai"));

var _csi = _interopRequireDefault(require("./csi"));

var _bufferCrc = _interopRequireDefault(require("buffer-crc32"));

var _reservoir = _interopRequireDefault(require("reservoir"));

var _bgzfFilehandle = require("@gmod/bgzf-filehandle");

var _object = _interopRequireDefault(require("object.entries-ponyfill"));

var _quickLru = _interopRequireDefault(require("quick-lru"));

var _genericFilehandle = require("generic-filehandle");

var _record = _interopRequireDefault(require("./record"));

var _sam = require("./sam");

var _util = require("./util");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = (0, _getIterator2.default)(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context26; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context26 = Object.prototype.toString.call(o)).call(_context26, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var BAM_MAGIC = 21840194;
exports.BAM_MAGIC = BAM_MAGIC;
var blockLen = 1 << 16;

var BamFile = /*#__PURE__*/function () {
  /**
   * @param {object} args
   * @param {string} [args.bamPath]
   * @param {FileHandle} [args.bamFilehandle]
   * @param {string} [args.baiPath]
   * @param {FileHandle} [args.baiFilehandle]
   */
  function BamFile(_ref) {
    var _context;

    var bamFilehandle = _ref.bamFilehandle,
        bamPath = _ref.bamPath,
        bamUrl = _ref.bamUrl,
        baiPath = _ref.baiPath,
        baiFilehandle = _ref.baiFilehandle,
        baiUrl = _ref.baiUrl,
        csiPath = _ref.csiPath,
        csiFilehandle = _ref.csiFilehandle,
        csiUrl = _ref.csiUrl,
        cacheSize = _ref.cacheSize,
        fetchSizeLimit = _ref.fetchSizeLimit,
        chunkSizeLimit = _ref.chunkSizeLimit,
        _ref$yieldThreadTime = _ref.yieldThreadTime,
        yieldThreadTime = _ref$yieldThreadTime === void 0 ? 100 : _ref$yieldThreadTime,
        _ref$renameRefSeqs = _ref.renameRefSeqs,
        renameRefSeqs = _ref$renameRefSeqs === void 0 ? function (n) {
      return n;
    } : _ref$renameRefSeqs;
    (0, _classCallCheck2.default)(this, BamFile);
    (0, _defineProperty2.default)(this, "renameRefSeq", void 0);
    (0, _defineProperty2.default)(this, "bam", void 0);
    (0, _defineProperty2.default)(this, "index", void 0);
    (0, _defineProperty2.default)(this, "chunkSizeLimit", void 0);
    (0, _defineProperty2.default)(this, "fetchSizeLimit", void 0);
    (0, _defineProperty2.default)(this, "header", void 0);
    (0, _defineProperty2.default)(this, "featureCache", void 0);
    (0, _defineProperty2.default)(this, "chrToIndex", void 0);
    (0, _defineProperty2.default)(this, "indexToChr", void 0);
    (0, _defineProperty2.default)(this, "yieldThreadTime", void 0);
    this.renameRefSeq = renameRefSeqs;

    if (bamFilehandle) {
      this.bam = bamFilehandle;
    } else if (bamPath) {
      this.bam = new _genericFilehandle.LocalFile(bamPath);
    } else if (bamUrl) {
      this.bam = new _genericFilehandle.RemoteFile(bamUrl);
    } else {
      throw new Error('unable to initialize bam');
    }

    if (csiFilehandle) {
      this.index = new _csi.default({
        filehandle: csiFilehandle
      });
    } else if (csiPath) {
      this.index = new _csi.default({
        filehandle: new _genericFilehandle.LocalFile(csiPath)
      });
    } else if (csiUrl) {
      this.index = new _csi.default({
        filehandle: new _genericFilehandle.RemoteFile(csiUrl)
      });
    } else if (baiFilehandle) {
      this.index = new _bai.default({
        filehandle: baiFilehandle
      });
    } else if (baiPath) {
      this.index = new _bai.default({
        filehandle: new _genericFilehandle.LocalFile(baiPath)
      });
    } else if (baiUrl) {
      this.index = new _bai.default({
        filehandle: new _genericFilehandle.RemoteFile(baiUrl)
      });
    } else if (bamPath) {
      this.index = new _bai.default({
        filehandle: new _genericFilehandle.LocalFile("".concat(bamPath, ".bai"))
      });
    } else if (bamUrl) {
      this.index = new _bai.default({
        filehandle: new _genericFilehandle.RemoteFile("".concat(bamUrl, ".bai"))
      });
    } else {
      throw new Error('unable to infer index format');
    }

    this.featureCache = new _abortablePromiseCache.default({
      cache: new _quickLru.default({
        maxSize: cacheSize !== undefined ? cacheSize : 50
      }),
      fill: (0, _bind.default)(_context = this._readChunk).call(_context, this)
    });
    this.fetchSizeLimit = fetchSizeLimit || 500000000; // 500MB

    this.chunkSizeLimit = chunkSizeLimit || 300000000; // 300MB

    this.yieldThreadTime = yieldThreadTime;
  }

  (0, _createClass2.default)(BamFile, [{
    key: "getHeader",
    value: function () {
      var _getHeader = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var origOpts,
            opts,
            indexData,
            ret,
            buffer,
            res,
            bytesRead,
            uncba,
            headLen,
            _yield$this$_readRefS,
            chrToIndex,
            indexToChr,
            _args = arguments;

        return _regenerator.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                origOpts = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                opts = (0, _util.makeOpts)(origOpts);
                _context2.next = 4;
                return this.index.parse(opts);

              case 4:
                indexData = _context2.sent;
                ret = indexData.firstDataLine ? indexData.firstDataLine.blockPosition + 65535 : undefined;

                if (!ret) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 9;
                return this.bam.read(Buffer.alloc(ret + blockLen), 0, ret + blockLen, 0, opts);

              case 9:
                res = _context2.sent;
                bytesRead = res.bytesRead;
                buffer = res.buffer;

                if (bytesRead) {
                  _context2.next = 14;
                  break;
                }

                throw new Error('Error reading header');

              case 14:
                if (bytesRead < ret) {
                  buffer = (0, _slice.default)(buffer).call(buffer, 0, bytesRead);
                } else {
                  buffer = (0, _slice.default)(buffer).call(buffer, 0, ret);
                }

                _context2.next = 20;
                break;

              case 17:
                _context2.next = 19;
                return this.bam.readFile(opts);

              case 19:
                buffer = _context2.sent;

              case 20:
                _context2.next = 22;
                return (0, _bgzfFilehandle.unzip)(buffer);

              case 22:
                uncba = _context2.sent;

                if (!(uncba.readInt32LE(0) !== BAM_MAGIC)) {
                  _context2.next = 25;
                  break;
                }

                throw new Error('Not a BAM file');

              case 25:
                headLen = uncba.readInt32LE(4);
                this.header = uncba.toString('utf8', 8, 8 + headLen);
                _context2.next = 29;
                return this._readRefSeqs(headLen + 8, 65535, opts);

              case 29:
                _yield$this$_readRefS = _context2.sent;
                chrToIndex = _yield$this$_readRefS.chrToIndex;
                indexToChr = _yield$this$_readRefS.indexToChr;
                this.chrToIndex = chrToIndex;
                this.indexToChr = indexToChr;
                return _context2.abrupt("return", (0, _sam.parseHeaderText)(this.header));

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function getHeader() {
        return _getHeader.apply(this, arguments);
      }

      return getHeader;
    }()
  }, {
    key: "getHeaderText",
    value: function () {
      var _getHeaderText = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var opts,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                opts = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                _context3.next = 3;
                return this.getHeader(opts);

              case 3:
                return _context3.abrupt("return", this.header);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));

      function getHeaderText() {
        return _getHeaderText.apply(this, arguments);
      }

      return getHeaderText;
    }() // the full length of the refseq block is not given in advance so this grabs a chunk and
    // doubles it if all refseqs haven't been processed

  }, {
    key: "_readRefSeqs",
    value: function () {
      var _readRefSeqs2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(start, refSeqBytes) {
        var opts,
            res,
            bytesRead,
            buffer,
            uncba,
            nRef,
            p,
            chrToIndex,
            indexToChr,
            i,
            lName,
            refName,
            lRef,
            _args3 = arguments;
        return _regenerator.default.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                opts = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};

                if (!(start > refSeqBytes)) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt("return", this._readRefSeqs(start, refSeqBytes * 2, opts));

              case 3:
                _context4.next = 5;
                return this.bam.read(Buffer.alloc(refSeqBytes + blockLen), 0, refSeqBytes, 0, opts);

              case 5:
                res = _context4.sent;
                bytesRead = res.bytesRead;
                buffer = res.buffer;

                if (bytesRead) {
                  _context4.next = 10;
                  break;
                }

                throw new Error('Error reading refseqs from header');

              case 10:
                if (bytesRead < refSeqBytes) {
                  buffer = (0, _slice.default)(buffer).call(buffer, 0, bytesRead);
                } else {
                  buffer = (0, _slice.default)(buffer).call(buffer, 0, refSeqBytes);
                }

                _context4.next = 13;
                return (0, _bgzfFilehandle.unzip)(buffer);

              case 13:
                uncba = _context4.sent;
                nRef = uncba.readInt32LE(start);
                p = start + 4;
                chrToIndex = {};
                indexToChr = [];
                i = 0;

              case 19:
                if (!(i < nRef)) {
                  _context4.next = 35;
                  break;
                }

                _context4.next = 22;
                return (0, _util.abortBreakPoint)(opts.signal);

              case 22:
                lName = uncba.readInt32LE(p);
                refName = uncba.toString('utf8', p + 4, p + 4 + lName - 1);
                refName = this.renameRefSeq(refName);
                lRef = uncba.readInt32LE(p + lName + 4);
                chrToIndex[refName] = i;
                indexToChr.push({
                  refName: refName,
                  length: lRef
                });
                p = p + 8 + lName;

                if (!(p > uncba.length)) {
                  _context4.next = 32;
                  break;
                }

                console.warn("BAM header is very big.  Re-fetching ".concat(refSeqBytes, " bytes."));
                return _context4.abrupt("return", this._readRefSeqs(start, refSeqBytes * 2, opts));

              case 32:
                i += 1;
                _context4.next = 19;
                break;

              case 35:
                return _context4.abrupt("return", {
                  chrToIndex: chrToIndex,
                  indexToChr: indexToChr
                });

              case 36:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, this);
      }));

      function _readRefSeqs(_x, _x2) {
        return _readRefSeqs2.apply(this, arguments);
      }

      return _readRefSeqs;
    }()
  }, {
    key: "getRecordsForRangeSample",
    value: function () {
      var _getRecordsForRangeSample = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(chr, min, max) {
        var opts,
            allRecords,
            resSize,
            res,
            _iterator3,
            _step3,
            record,
            _args4 = arguments;

        return _regenerator.default.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                opts = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {
                  viewAsPairs: false,
                  pairAcrossChr: false,
                  maxInsertSize: 200000,
                  maxSampleSize: 1000
                };

                if (opts) {
                  _context5.next = 5;
                  break;
                }

                _context5.next = 4;
                return this.getRecordsForRange(chr, min, max, opts);

              case 4:
                return _context5.abrupt("return", _context5.sent);

              case 5:
                if (!opts.maxSampleSize) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 8;
                return this.getRecordsForRange(chr, min, max, opts);

              case 8:
                allRecords = _context5.sent;
                resSize = +opts.maxSampleSize;
                res = new _reservoir.default(resSize);
                _iterator3 = _createForOfIteratorHelper(allRecords);

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    record = _step3.value;
                    res.pushSome(record);
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

                return _context5.abrupt("return", res);

              case 14:
                _context5.next = 16;
                return this.getRecordsForRange(chr, min, max, opts);

              case 16:
                return _context5.abrupt("return", _context5.sent);

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      function getRecordsForRangeSample(_x3, _x4, _x5) {
        return _getRecordsForRangeSample.apply(this, arguments);
      }

      return getRecordsForRangeSample;
    }()
  }, {
    key: "getRecordsForRange",
    value: function () {
      var _getRecordsForRange = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(chr, min, max) {
        var opts,
            records,
            _iteratorNormalCompletion,
            _didIteratorError,
            _iteratorError,
            _iterator,
            _step,
            _value,
            chunk,
            _args5 = arguments;

        return _regenerator.default.wrap(function _callee5$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                opts = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {
                  viewAsPairs: false,
                  pairAcrossChr: false,
                  maxInsertSize: 200000,
                  maxSampleSize: 1000
                };
                records = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context6.prev = 4;
                _iterator = (0, _asyncIterator2.default)(this.streamRecordsForRange(chr, min, max, opts));

              case 6:
                _context6.next = 8;
                return _iterator.next();

              case 8:
                _step = _context6.sent;
                _iteratorNormalCompletion = _step.done;
                _context6.next = 12;
                return _step.value;

              case 12:
                _value = _context6.sent;

                if (_iteratorNormalCompletion) {
                  _context6.next = 19;
                  break;
                }

                chunk = _value;
                records = (0, _concat.default)(records).call(records, chunk);

              case 16:
                _iteratorNormalCompletion = true;
                _context6.next = 6;
                break;

              case 19:
                _context6.next = 25;
                break;

              case 21:
                _context6.prev = 21;
                _context6.t0 = _context6["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context6.t0;

              case 25:
                _context6.prev = 25;
                _context6.prev = 26;

                if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                  _context6.next = 30;
                  break;
                }

                _context6.next = 30;
                return _iterator.return();

              case 30:
                _context6.prev = 30;

                if (!_didIteratorError) {
                  _context6.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context6.finish(30);

              case 34:
                return _context6.finish(25);

              case 35:
                return _context6.abrupt("return", records);

              case 36:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee5, this, [[4, 21, 25, 35], [26,, 30, 34]]);
      }));

      function getRecordsForRange(_x6, _x7, _x8) {
        return _getRecordsForRange.apply(this, arguments);
      }

      return getRecordsForRange;
    }()
  }, {
    key: "streamRecordsForRangeSample",
    value: function () {
      var _streamRecordsForRangeSample = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(chr, min, max) {
        var opts,
            resSize,
            res,
            _iteratorNormalCompletion2,
            _didIteratorError2,
            _iteratorError2,
            _iterator2,
            _step2,
            _value2,
            chunk,
            _iterator4,
            _step4,
            record,
            _args6 = arguments;

        return _regenerator.default.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                opts = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {
                  viewAsPairs: false,
                  pairAcrossChr: false,
                  maxInsertSize: 200000,
                  maxSampleSize: 1000
                };

                if (opts) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return", this.getRecordsForRange(chr, min, max, opts));

              case 3:
                if (!opts.maxSampleSize) {
                  _context7.next = 41;
                  break;
                }

                resSize = +opts.maxSampleSize;
                res = new _reservoir.default(resSize);
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context7.prev = 8;
                _iterator2 = (0, _asyncIterator2.default)(this.streamRecordsForRange(chr, min, max, opts));

              case 10:
                _context7.next = 12;
                return _iterator2.next();

              case 12:
                _step2 = _context7.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context7.next = 16;
                return _step2.value;

              case 16:
                _value2 = _context7.sent;

                if (_iteratorNormalCompletion2) {
                  _context7.next = 24;
                  break;
                }

                chunk = _value2;
                _iterator4 = _createForOfIteratorHelper(chunk);

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    record = _step4.value;
                    res.pushSome(record);
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }

              case 21:
                _iteratorNormalCompletion2 = true;
                _context7.next = 10;
                break;

              case 24:
                _context7.next = 30;
                break;

              case 26:
                _context7.prev = 26;
                _context7.t0 = _context7["catch"](8);
                _didIteratorError2 = true;
                _iteratorError2 = _context7.t0;

              case 30:
                _context7.prev = 30;
                _context7.prev = 31;

                if (!(!_iteratorNormalCompletion2 && _iterator2.return != null)) {
                  _context7.next = 35;
                  break;
                }

                _context7.next = 35;
                return _iterator2.return();

              case 35:
                _context7.prev = 35;

                if (!_didIteratorError2) {
                  _context7.next = 38;
                  break;
                }

                throw _iteratorError2;

              case 38:
                return _context7.finish(35);

              case 39:
                return _context7.finish(30);

              case 40:
                return _context7.abrupt("return", res);

              case 41:
                return _context7.abrupt("return", this.getRecordsForRange(chr, min, max, opts));

              case 42:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee6, this, [[8, 26, 30, 40], [31,, 35, 39]]);
      }));

      function streamRecordsForRangeSample(_x9, _x10, _x11) {
        return _streamRecordsForRangeSample.apply(this, arguments);
      }

      return streamRecordsForRangeSample;
    }()
  }, {
    key: "streamRecordsForRange",
    value: function streamRecordsForRange(chr, min, max) {
      var _this = this;

      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        viewAsPairs: false,
        pairAcrossChr: false,
        maxInsertSize: 200000,
        maxSampleSize: 1000
      };
      return (0, _wrapAsyncGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var _context9;

        var chrId, chunks, i, size, _context8, totalSize, _context10;

        return _regenerator.default.wrap(function _callee7$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                // todo regularize refseq names
                opts.viewAsPairs = opts.viewAsPairs || false;
                opts.pairAcrossChr = opts.pairAcrossChr || false;
                opts.maxInsertSize = opts.maxInsertSize !== undefined ? opts.maxInsertSize : 200000;
                opts.maxSampleSize = opts.maxSampleSize !== undefined ? opts.maxSampleSize : 1000;
                chrId = _this.chrToIndex && _this.chrToIndex[chr];

                if (chrId >= 0) {
                  _context11.next = 9;
                  break;
                }

                chunks = [];
                _context11.next = 14;
                break;

              case 9:
                _context11.next = 11;
                return (0, _awaitAsyncGenerator2.default)(_this.index.blocksForRange(chrId, min - 1, max, opts));

              case 11:
                chunks = _context11.sent;

                if (chunks) {
                  _context11.next = 14;
                  break;
                }

                throw new Error('Error in index fetch');

              case 14:
                i = 0;

              case 15:
                if (!(i < chunks.length)) {
                  _context11.next = 24;
                  break;
                }

                _context11.next = 18;
                return (0, _awaitAsyncGenerator2.default)((0, _util.abortBreakPoint)(opts.signal));

              case 18:
                size = chunks[i].fetchedSize();

                if (!(size > _this.chunkSizeLimit)) {
                  _context11.next = 21;
                  break;
                }

                throw new Error((0, _concat.default)(_context8 = "Too many BAM features. BAM chunk size ".concat(size, " bytes exceeds chunkSizeLimit of ")).call(_context8, _this.chunkSizeLimit));

              case 21:
                i += 1;
                _context11.next = 15;
                break;

              case 24:
                totalSize = (0, _reduce.default)(_context9 = (0, _map.default)(chunks).call(chunks, function (s) {
                  return s.fetchedSize();
                })).call(_context9, function (a, b) {
                  return a + b;
                }, 0);

                if (!(totalSize > _this.fetchSizeLimit)) {
                  _context11.next = 27;
                  break;
                }

                throw new Error((0, _concat.default)(_context10 = "data size of ".concat(totalSize.toLocaleString(), " bytes exceeded fetch size limit of ")).call(_context10, _this.fetchSizeLimit.toLocaleString(), " bytes"));

              case 27:
                return _context11.delegateYield((0, _asyncGeneratorDelegate2.default)((0, _asyncIterator2.default)(_this._fetchChunkFeatures(chunks, chrId, min, max, opts)), _awaitAsyncGenerator2.default), "t0", 28);

              case 28:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee7);
      }))();
    }
  }, {
    key: "_fetchChunkFeatures",
    value: function _fetchChunkFeatures(chunks, chrId, min, max, opts) {
      var _this2 = this;

      return (0, _wrapAsyncGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var featPromises, done, i, c, _yield$_awaitAsyncGen, data, cpositions, dpositions, chunk, promise, _i2;

        return _regenerator.default.wrap(function _callee8$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                featPromises = [];
                done = false;
                i = 0;

              case 3:
                if (!(i < chunks.length)) {
                  _context12.next = 21;
                  break;
                }

                c = chunks[i];
                _context12.next = 7;
                return (0, _awaitAsyncGenerator2.default)(_this2.featureCache.get(c.toString(), {
                  chunk: c,
                  opts: opts
                }, opts.signal));

              case 7:
                _yield$_awaitAsyncGen = _context12.sent;
                data = _yield$_awaitAsyncGen.data;
                cpositions = _yield$_awaitAsyncGen.cpositions;
                dpositions = _yield$_awaitAsyncGen.dpositions;
                chunk = _yield$_awaitAsyncGen.chunk;
                promise = _this2.readBamFeatures(data, cpositions, dpositions, chunk).then(function (records) {
                  var recs = [];

                  for (var _i = 0; _i < records.length; _i += 1) {
                    var feature = records[_i];

                    if (feature.seq_id() === chrId) {
                      if (feature.get('start') >= max) {
                        // past end of range, can stop iterating
                        done = true;
                        break;
                      } else if (feature.get('end') >= min) {
                        // must be in range
                        recs.push(feature);
                      }
                    }
                  }

                  return recs;
                });
                featPromises.push(promise);
                _context12.next = 16;
                return (0, _awaitAsyncGenerator2.default)(promise);

              case 16:
                if (!done) {
                  _context12.next = 18;
                  break;
                }

                return _context12.abrupt("break", 21);

              case 18:
                i++;
                _context12.next = 3;
                break;

              case 21:
                (0, _util.checkAbortSignal)(opts.signal);
                _i2 = 0;

              case 23:
                if (!(_i2 < featPromises.length)) {
                  _context12.next = 29;
                  break;
                }

                _context12.next = 26;
                return featPromises[_i2];

              case 26:
                _i2++;
                _context12.next = 23;
                break;

              case 29:
                (0, _util.checkAbortSignal)(opts.signal);

                if (!opts.viewAsPairs) {
                  _context12.next = 33;
                  break;
                }

                _context12.next = 33;
                return _this2.fetchPairs(chrId, featPromises, opts);

              case 33:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee8);
      }))();
    }
  }, {
    key: "fetchPairs",
    value: function () {
      var _fetchPairs = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(chrId, featPromises, opts) {
        var _this3 = this,
            _context16,
            _context17;

        var unmatedPairs, readIds, matePromises, mateBlocks, mateChunks, i, mateTotalSize, _context18, mateFeatPromises, newMateFeats, featuresRet, newMates;

        return _regenerator.default.wrap(function _callee12$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                unmatedPairs = {};
                readIds = {};
                _context20.next = 4;
                return _promise.default.all((0, _map.default)(featPromises).call(featPromises, /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(f) {
                    var _context13;

                    var ret, readNames, i, name, id;
                    return _regenerator.default.wrap(function _callee9$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            _context14.next = 2;
                            return f;

                          case 2:
                            ret = _context14.sent;
                            readNames = {};

                            for (i = 0; i < ret.length; i++) {
                              name = ret[i].name();
                              id = ret[i].id();

                              if (!readNames[name]) {
                                readNames[name] = 0;
                              }

                              readNames[name]++;
                              readIds[id] = 1;
                            }

                            (0, _forEach.default)(_context13 = (0, _object.default)(readNames)).call(_context13, function (_ref3) {
                              var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
                                  k = _ref4[0],
                                  v = _ref4[1];

                              if (v === 1) {
                                unmatedPairs[k] = true;
                              }
                            });

                          case 6:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x15) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 4:
                matePromises = [];
                _context20.next = 7;
                return _promise.default.all((0, _map.default)(featPromises).call(featPromises, /*#__PURE__*/function () {
                  var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(f) {
                    var ret, i, name;
                    return _regenerator.default.wrap(function _callee10$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            _context15.next = 2;
                            return f;

                          case 2:
                            ret = _context15.sent;

                            for (i = 0; i < ret.length; i++) {
                              name = ret[i].name();

                              if (unmatedPairs[name] && (opts.pairAcrossChr || ret[i]._next_refid() === chrId && Math.abs(ret[i].get('start') - ret[i]._next_pos()) < (opts.maxInsertSize || 200000))) {
                                matePromises.push(_this3.index.blocksForRange(ret[i]._next_refid(), ret[i]._next_pos(), ret[i]._next_pos() + 1, opts));
                              }
                            }

                          case 4:
                          case "end":
                            return _context15.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function (_x16) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 7:
                _context20.next = 9;
                return _promise.default.all(matePromises);

              case 9:
                mateBlocks = _context20.sent;
                mateChunks = [];

                for (i = 0; i < mateBlocks.length; i++) {
                  mateChunks = (0, _concat.default)(mateChunks).call(mateChunks, mateBlocks[i]);
                } // filter out duplicate chunks (the blocks are lists of chunks, blocks are concatenated, then filter dup chunks)


                mateChunks = (0, _filter.default)(_context16 = (0, _sort.default)(mateChunks).call(mateChunks)).call(_context16, function (item, pos, ary) {
                  return !pos || item.toString() !== ary[pos - 1].toString();
                });
                mateTotalSize = (0, _reduce.default)(_context17 = (0, _map.default)(mateChunks).call(mateChunks, function (s) {
                  return s.fetchedSize();
                })).call(_context17, function (a, b) {
                  return a + b;
                }, 0);

                if (!(mateTotalSize > this.fetchSizeLimit)) {
                  _context20.next = 16;
                  break;
                }

                throw new Error((0, _concat.default)(_context18 = "data size of ".concat(mateTotalSize.toLocaleString(), " bytes exceeded fetch size limit of ")).call(_context18, this.fetchSizeLimit.toLocaleString(), " bytes"));

              case 16:
                mateFeatPromises = (0, _map.default)(mateChunks).call(mateChunks, /*#__PURE__*/function () {
                  var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(c) {
                    var _yield$_this3$feature, data, cpositions, dpositions, chunk, feats, mateRecs, _i3, feature;

                    return _regenerator.default.wrap(function _callee11$(_context19) {
                      while (1) {
                        switch (_context19.prev = _context19.next) {
                          case 0:
                            _context19.next = 2;
                            return _this3.featureCache.get(c.toString(), {
                              chunk: c,
                              opts: opts
                            }, opts.signal);

                          case 2:
                            _yield$_this3$feature = _context19.sent;
                            data = _yield$_this3$feature.data;
                            cpositions = _yield$_this3$feature.cpositions;
                            dpositions = _yield$_this3$feature.dpositions;
                            chunk = _yield$_this3$feature.chunk;
                            _context19.next = 9;
                            return _this3.readBamFeatures(data, cpositions, dpositions, chunk);

                          case 9:
                            feats = _context19.sent;
                            mateRecs = [];

                            for (_i3 = 0; _i3 < feats.length; _i3 += 1) {
                              feature = feats[_i3];

                              if (unmatedPairs[feature.get('name')] && !readIds[feature.id()]) {
                                mateRecs.push(feature);
                              }
                            }

                            return _context19.abrupt("return", mateRecs);

                          case 13:
                          case "end":
                            return _context19.stop();
                        }
                      }
                    }, _callee11);
                  }));

                  return function (_x17) {
                    return _ref6.apply(this, arguments);
                  };
                }());
                _context20.next = 19;
                return _promise.default.all(mateFeatPromises);

              case 19:
                newMateFeats = _context20.sent;
                featuresRet = [];

                if (newMateFeats.length) {
                  newMates = (0, _reduce.default)(newMateFeats).call(newMateFeats, function (result, current) {
                    return (0, _concat.default)(result).call(result, current);
                  });
                  featuresRet = (0, _concat.default)(featuresRet).call(featuresRet, newMates);
                }

                return _context20.abrupt("return", featuresRet);

              case 23:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee12, this);
      }));

      function fetchPairs(_x12, _x13, _x14) {
        return _fetchPairs.apply(this, arguments);
      }

      return fetchPairs;
    }()
  }, {
    key: "_readChunk",
    value: function () {
      var _readChunk2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(_ref7, abortSignal) {
        var chunk, opts, c, bufsize, res, bytesRead, buffer, _yield$unzipChunkSlic, data, cpositions, dpositions;

        return _regenerator.default.wrap(function _callee13$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                chunk = _ref7.chunk, opts = _ref7.opts;
                c = chunk;
                bufsize = c.fetchedSize();
                _context21.next = 5;
                return this.bam.read(Buffer.alloc(bufsize), 0, bufsize, c.minv.blockPosition, opts);

              case 5:
                res = _context21.sent;
                bytesRead = res.bytesRead;
                buffer = res.buffer;
                (0, _util.checkAbortSignal)(abortSignal);

                if (bytesRead) {
                  _context21.next = 11;
                  break;
                }

                return _context21.abrupt("return", []);

              case 11:
                if (bytesRead < bufsize) {
                  buffer = (0, _slice.default)(buffer).call(buffer, 0, bytesRead);
                } else {
                  buffer = (0, _slice.default)(buffer).call(buffer, 0, bufsize);
                }

                _context21.next = 14;
                return (0, _bgzfFilehandle.unzipChunkSlice)(buffer, chunk);

              case 14:
                _yield$unzipChunkSlic = _context21.sent;
                data = _yield$unzipChunkSlic.buffer;
                cpositions = _yield$unzipChunkSlic.cpositions;
                dpositions = _yield$unzipChunkSlic.dpositions;
                (0, _util.checkAbortSignal)(abortSignal);
                return _context21.abrupt("return", {
                  data: data,
                  cpositions: cpositions,
                  dpositions: dpositions,
                  chunk: chunk
                });

              case 20:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee13, this);
      }));

      function _readChunk(_x18, _x19) {
        return _readChunk2.apply(this, arguments);
      }

      return _readChunk;
    }()
  }, {
    key: "readBamFeatures",
    value: function () {
      var _readBamFeatures = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(ba, cpositions, dpositions, chunk) {
        var blockStart, sink, pos, last, blockSize, blockEnd, feature;
        return _regenerator.default.wrap(function _callee14$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                blockStart = 0;
                sink = [];
                pos = 0;
                last = +(0, _now.default)();

              case 4:
                if (!(blockStart + 4 < ba.length)) {
                  _context22.next = 18;
                  break;
                }

                blockSize = ba.readInt32LE(blockStart);
                blockEnd = blockStart + 4 + blockSize - 1; // increment position to the current decompressed status

                if (dpositions) {
                  while (blockStart + chunk.minv.dataPosition >= dpositions[pos++]) {}

                  pos--;
                } // only try to read the feature if we have all the bytes for it


                if (!(blockEnd < ba.length)) {
                  _context22.next = 15;
                  break;
                }

                feature = new _record.default({
                  bytes: {
                    byteArray: ba,
                    start: blockStart,
                    end: blockEnd
                  },
                  // the below results in an automatically calculated file-offset based ID
                  // if the info for that is available, otherwise crc32 of the features
                  //
                  // cpositions[pos] refers to actual file offset of a bgzip block boundaries
                  //
                  // we multiply by (1 <<8) in order to make sure each block has a "unique"
                  // address space so that data in that block could never overlap
                  //
                  // then the blockStart-dpositions is an uncompressed file offset from
                  // that bgzip block boundary, and since the cpositions are multiplied by
                  // (1 << 8) these uncompressed offsets get a unique space
                  //
                  // this has an extra chunk.minv.dataPosition added on because it blockStart
                  // starts at 0 instead of chunk.minv.dataPosition
                  //
                  // the +1 is just to avoid any possible uniqueId 0 but this does not realistically happen
                  fileOffset: cpositions ? cpositions[pos] * (1 << 8) + (blockStart - dpositions[pos]) + chunk.minv.dataPosition + 1 : _bufferCrc.default.signed((0, _slice.default)(ba).call(ba, blockStart, blockEnd))
                });
                sink.push(feature);

                if (!(this.yieldThreadTime && +(0, _now.default)() - last > this.yieldThreadTime)) {
                  _context22.next = 15;
                  break;
                }

                _context22.next = 14;
                return (0, _util.timeout)(1);

              case 14:
                last = +(0, _now.default)();

              case 15:
                blockStart = blockEnd + 1;
                _context22.next = 4;
                break;

              case 18:
                return _context22.abrupt("return", sink);

              case 19:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee14, this);
      }));

      function readBamFeatures(_x20, _x21, _x22, _x23) {
        return _readBamFeatures.apply(this, arguments);
      }

      return readBamFeatures;
    }()
  }, {
    key: "hasRefSeq",
    value: function () {
      var _hasRefSeq = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(seqName) {
        var refId;
        return _regenerator.default.wrap(function _callee15$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                refId = this.chrToIndex && this.chrToIndex[seqName];
                return _context23.abrupt("return", this.index.hasRefSeq(refId));

              case 2:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee15, this);
      }));

      function hasRefSeq(_x24) {
        return _hasRefSeq.apply(this, arguments);
      }

      return hasRefSeq;
    }()
  }, {
    key: "lineCount",
    value: function () {
      var _lineCount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(seqName) {
        var refId;
        return _regenerator.default.wrap(function _callee16$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                refId = this.chrToIndex && this.chrToIndex[seqName];
                return _context24.abrupt("return", this.index.lineCount(refId));

              case 2:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee16, this);
      }));

      function lineCount(_x25) {
        return _lineCount.apply(this, arguments);
      }

      return lineCount;
    }()
  }, {
    key: "indexCov",
    value: function () {
      var _indexCov = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17(seqName, start, end) {
        var seqId;
        return _regenerator.default.wrap(function _callee17$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return this.index.parse();

              case 2:
                seqId = this.chrToIndex && this.chrToIndex[seqName];
                return _context25.abrupt("return", this.index.indexCov(seqId, start, end));

              case 4:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee17, this);
      }));

      function indexCov(_x26, _x27, _x28) {
        return _indexCov.apply(this, arguments);
      }

      return indexCov;
    }()
  }]);
  return BamFile;
}();

exports.default = BamFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYW1GaWxlLnRzIl0sIm5hbWVzIjpbIkJBTV9NQUdJQyIsImJsb2NrTGVuIiwiQmFtRmlsZSIsImJhbUZpbGVoYW5kbGUiLCJiYW1QYXRoIiwiYmFtVXJsIiwiYmFpUGF0aCIsImJhaUZpbGVoYW5kbGUiLCJiYWlVcmwiLCJjc2lQYXRoIiwiY3NpRmlsZWhhbmRsZSIsImNzaVVybCIsImNhY2hlU2l6ZSIsImZldGNoU2l6ZUxpbWl0IiwiY2h1bmtTaXplTGltaXQiLCJ5aWVsZFRocmVhZFRpbWUiLCJyZW5hbWVSZWZTZXFzIiwibiIsInJlbmFtZVJlZlNlcSIsImJhbSIsIkxvY2FsRmlsZSIsIlJlbW90ZUZpbGUiLCJFcnJvciIsImluZGV4IiwiQ1NJIiwiZmlsZWhhbmRsZSIsIkJBSSIsImZlYXR1cmVDYWNoZSIsIkFib3J0YWJsZVByb21pc2VDYWNoZSIsImNhY2hlIiwiTFJVIiwibWF4U2l6ZSIsInVuZGVmaW5lZCIsImZpbGwiLCJfcmVhZENodW5rIiwib3JpZ09wdHMiLCJvcHRzIiwicGFyc2UiLCJpbmRleERhdGEiLCJyZXQiLCJmaXJzdERhdGFMaW5lIiwiYmxvY2tQb3NpdGlvbiIsInJlYWQiLCJCdWZmZXIiLCJhbGxvYyIsInJlcyIsImJ5dGVzUmVhZCIsImJ1ZmZlciIsInJlYWRGaWxlIiwidW5jYmEiLCJyZWFkSW50MzJMRSIsImhlYWRMZW4iLCJoZWFkZXIiLCJ0b1N0cmluZyIsIl9yZWFkUmVmU2VxcyIsImNoclRvSW5kZXgiLCJpbmRleFRvQ2hyIiwiZ2V0SGVhZGVyIiwic3RhcnQiLCJyZWZTZXFCeXRlcyIsIm5SZWYiLCJwIiwiaSIsInNpZ25hbCIsImxOYW1lIiwicmVmTmFtZSIsImxSZWYiLCJwdXNoIiwibGVuZ3RoIiwiY29uc29sZSIsIndhcm4iLCJjaHIiLCJtaW4iLCJtYXgiLCJ2aWV3QXNQYWlycyIsInBhaXJBY3Jvc3NDaHIiLCJtYXhJbnNlcnRTaXplIiwibWF4U2FtcGxlU2l6ZSIsImdldFJlY29yZHNGb3JSYW5nZSIsImFsbFJlY29yZHMiLCJyZXNTaXplIiwiUmVzZXJ2b2lyIiwicmVjb3JkIiwicHVzaFNvbWUiLCJyZWNvcmRzIiwic3RyZWFtUmVjb3Jkc0ZvclJhbmdlIiwiY2h1bmsiLCJjaHJJZCIsImNodW5rcyIsImJsb2Nrc0ZvclJhbmdlIiwic2l6ZSIsImZldGNoZWRTaXplIiwidG90YWxTaXplIiwicyIsImEiLCJiIiwidG9Mb2NhbGVTdHJpbmciLCJfZmV0Y2hDaHVua0ZlYXR1cmVzIiwiZmVhdFByb21pc2VzIiwiZG9uZSIsImMiLCJnZXQiLCJkYXRhIiwiY3Bvc2l0aW9ucyIsImRwb3NpdGlvbnMiLCJwcm9taXNlIiwicmVhZEJhbUZlYXR1cmVzIiwidGhlbiIsInJlY3MiLCJmZWF0dXJlIiwic2VxX2lkIiwiZmV0Y2hQYWlycyIsInVubWF0ZWRQYWlycyIsInJlYWRJZHMiLCJhbGwiLCJmIiwicmVhZE5hbWVzIiwibmFtZSIsImlkIiwiayIsInYiLCJtYXRlUHJvbWlzZXMiLCJfbmV4dF9yZWZpZCIsIk1hdGgiLCJhYnMiLCJfbmV4dF9wb3MiLCJtYXRlQmxvY2tzIiwibWF0ZUNodW5rcyIsIml0ZW0iLCJwb3MiLCJhcnkiLCJtYXRlVG90YWxTaXplIiwibWF0ZUZlYXRQcm9taXNlcyIsImZlYXRzIiwibWF0ZVJlY3MiLCJuZXdNYXRlRmVhdHMiLCJmZWF0dXJlc1JldCIsIm5ld01hdGVzIiwicmVzdWx0IiwiY3VycmVudCIsImFib3J0U2lnbmFsIiwiYnVmc2l6ZSIsIm1pbnYiLCJiYSIsImJsb2NrU3RhcnQiLCJzaW5rIiwibGFzdCIsImJsb2NrU2l6ZSIsImJsb2NrRW5kIiwiZGF0YVBvc2l0aW9uIiwiQkFNRmVhdHVyZSIsImJ5dGVzIiwiYnl0ZUFycmF5IiwiZW5kIiwiZmlsZU9mZnNldCIsImNyYzMyIiwic2lnbmVkIiwic2VxTmFtZSIsInJlZklkIiwiaGFzUmVmU2VxIiwibGluZUNvdW50Iiwic2VxSWQiLCJpbmRleENvdiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7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aUJBQWYsQztBQThCaEJILGdCQUFBQSxJQUFJLENBQUM5RSxJQUFMLENBQVUwQyxPQUFWOztzQkFDSSxLQUFLOUYsZUFBTCxJQUF3QixDQUFDLG1CQUFELEdBQWNtSSxJQUFkLEdBQXFCLEtBQUtuSSxlOzs7Ozs7dUJBQzlDLG1CQUFRLENBQVIsQzs7O0FBQ05tSSxnQkFBQUEsSUFBSSxHQUFHLENBQUMsbUJBQVI7OztBQUlKRixnQkFBQUEsVUFBVSxHQUFHSSxRQUFRLEdBQUcsQ0FBeEI7Ozs7O21EQUVLSCxJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tIQUdPWSxPOzs7Ozs7QUFDUkMsZ0JBQUFBLEssR0FBUSxLQUFLdkcsVUFBTCxJQUFtQixLQUFLQSxVQUFMLENBQWdCc0csT0FBaEIsQzttREFDMUIsS0FBS3RJLEtBQUwsQ0FBV3dJLFNBQVgsQ0FBcUJELEtBQXJCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0hBR09ELE87Ozs7OztBQUNSQyxnQkFBQUEsSyxHQUFRLEtBQUt2RyxVQUFMLElBQW1CLEtBQUtBLFVBQUwsQ0FBZ0JzRyxPQUFoQixDO21EQUMxQixLQUFLdEksS0FBTCxDQUFXeUksU0FBWCxDQUFxQkYsS0FBckIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpSEFHTUQsTyxFQUFpQm5HLEssRUFBZ0IrRixHOzs7Ozs7O3VCQUN4QyxLQUFLbEksS0FBTCxDQUFXYyxLQUFYLEU7OztBQUNBNEgsZ0JBQUFBLEssR0FBUSxLQUFLMUcsVUFBTCxJQUFtQixLQUFLQSxVQUFMLENBQWdCc0csT0FBaEIsQzttREFDMUIsS0FBS3RJLEtBQUwsQ0FBVzJJLFFBQVgsQ0FBb0JELEtBQXBCLEVBQTJCdkcsS0FBM0IsRUFBa0MrRixHQUFsQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFib3J0YWJsZVByb21pc2VDYWNoZSBmcm9tICdhYm9ydGFibGUtcHJvbWlzZS1jYWNoZSdcbmltcG9ydCBCQUkgZnJvbSAnLi9iYWknXG5pbXBvcnQgQ1NJIGZyb20gJy4vY3NpJ1xuaW1wb3J0IENodW5rIGZyb20gJy4vY2h1bmsnXG5pbXBvcnQgY3JjMzIgZnJvbSAnYnVmZmVyLWNyYzMyJ1xuaW1wb3J0IFJlc2Vydm9pciBmcm9tICdyZXNlcnZvaXInXG5cbmltcG9ydCB7IHVuemlwLCB1bnppcENodW5rU2xpY2UgfSBmcm9tICdAZ21vZC9iZ3pmLWZpbGVoYW5kbGUnXG5cbmltcG9ydCBlbnRyaWVzIGZyb20gJ29iamVjdC5lbnRyaWVzLXBvbnlmaWxsJ1xuaW1wb3J0IExSVSBmcm9tICdxdWljay1scnUnXG5pbXBvcnQgeyBMb2NhbEZpbGUsIFJlbW90ZUZpbGUsIEdlbmVyaWNGaWxlaGFuZGxlIH0gZnJvbSAnZ2VuZXJpYy1maWxlaGFuZGxlJ1xuaW1wb3J0IEJBTUZlYXR1cmUgZnJvbSAnLi9yZWNvcmQnXG5pbXBvcnQgSW5kZXhGaWxlIGZyb20gJy4vaW5kZXhGaWxlJ1xuaW1wb3J0IHsgcGFyc2VIZWFkZXJUZXh0IH0gZnJvbSAnLi9zYW0nXG5pbXBvcnQgeyBhYm9ydEJyZWFrUG9pbnQsIGNoZWNrQWJvcnRTaWduYWwsIHRpbWVvdXQsIG1ha2VPcHRzLCBCYW1PcHRzLCBCYXNlT3B0cyB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGNvbnN0IEJBTV9NQUdJQyA9IDIxODQwMTk0XG5cbmNvbnN0IGJsb2NrTGVuID0gMSA8PCAxNlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYW1GaWxlIHtcbiAgcHJpdmF0ZSByZW5hbWVSZWZTZXE6IChhOiBzdHJpbmcpID0+IHN0cmluZ1xuICBwcml2YXRlIGJhbTogR2VuZXJpY0ZpbGVoYW5kbGVcbiAgcHJpdmF0ZSBpbmRleDogSW5kZXhGaWxlXG4gIHByaXZhdGUgY2h1bmtTaXplTGltaXQ6IG51bWJlclxuICBwcml2YXRlIGZldGNoU2l6ZUxpbWl0OiBudW1iZXJcbiAgcHJpdmF0ZSBoZWFkZXI6IGFueVxuICBwcm90ZWN0ZWQgZmVhdHVyZUNhY2hlOiBhbnlcbiAgcHJvdGVjdGVkIGNoclRvSW5kZXg6IGFueVxuICBwcm90ZWN0ZWQgaW5kZXhUb0NocjogYW55XG4gIHByaXZhdGUgeWllbGRUaHJlYWRUaW1lOiBudW1iZXJcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGFyZ3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmJhbVBhdGhdXG4gICAqIEBwYXJhbSB7RmlsZUhhbmRsZX0gW2FyZ3MuYmFtRmlsZWhhbmRsZV1cbiAgICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmJhaVBhdGhdXG4gICAqIEBwYXJhbSB7RmlsZUhhbmRsZX0gW2FyZ3MuYmFpRmlsZWhhbmRsZV1cbiAgICovXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBiYW1GaWxlaGFuZGxlLFxuICAgIGJhbVBhdGgsXG4gICAgYmFtVXJsLFxuICAgIGJhaVBhdGgsXG4gICAgYmFpRmlsZWhhbmRsZSxcbiAgICBiYWlVcmwsXG4gICAgY3NpUGF0aCxcbiAgICBjc2lGaWxlaGFuZGxlLFxuICAgIGNzaVVybCxcbiAgICBjYWNoZVNpemUsXG4gICAgZmV0Y2hTaXplTGltaXQsXG4gICAgY2h1bmtTaXplTGltaXQsXG4gICAgeWllbGRUaHJlYWRUaW1lID0gMTAwLFxuICAgIHJlbmFtZVJlZlNlcXMgPSBuID0+IG4sXG4gIH06IHtcbiAgICBiYW1GaWxlaGFuZGxlPzogR2VuZXJpY0ZpbGVoYW5kbGVcbiAgICBiYW1QYXRoPzogc3RyaW5nXG4gICAgYmFtVXJsPzogc3RyaW5nXG4gICAgYmFpUGF0aD86IHN0cmluZ1xuICAgIGJhaUZpbGVoYW5kbGU/OiBHZW5lcmljRmlsZWhhbmRsZVxuICAgIGJhaVVybD86IHN0cmluZ1xuICAgIGNzaVBhdGg/OiBzdHJpbmdcbiAgICBjc2lGaWxlaGFuZGxlPzogR2VuZXJpY0ZpbGVoYW5kbGVcbiAgICBjc2lVcmw/OiBzdHJpbmdcbiAgICBjYWNoZVNpemU/OiBudW1iZXJcbiAgICBmZXRjaFNpemVMaW1pdD86IG51bWJlclxuICAgIGNodW5rU2l6ZUxpbWl0PzogbnVtYmVyXG4gICAgcmVuYW1lUmVmU2Vxcz86IChhOiBzdHJpbmcpID0+IHN0cmluZ1xuICAgIHlpZWxkVGhyZWFkVGltZT86IG51bWJlclxuICB9KSB7XG4gICAgdGhpcy5yZW5hbWVSZWZTZXEgPSByZW5hbWVSZWZTZXFzXG5cbiAgICBpZiAoYmFtRmlsZWhhbmRsZSkge1xuICAgICAgdGhpcy5iYW0gPSBiYW1GaWxlaGFuZGxlXG4gICAgfSBlbHNlIGlmIChiYW1QYXRoKSB7XG4gICAgICB0aGlzLmJhbSA9IG5ldyBMb2NhbEZpbGUoYmFtUGF0aClcbiAgICB9IGVsc2UgaWYgKGJhbVVybCkge1xuICAgICAgdGhpcy5iYW0gPSBuZXcgUmVtb3RlRmlsZShiYW1VcmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGluaXRpYWxpemUgYmFtJylcbiAgICB9XG4gICAgaWYgKGNzaUZpbGVoYW5kbGUpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBuZXcgQ1NJKHsgZmlsZWhhbmRsZTogY3NpRmlsZWhhbmRsZSB9KVxuICAgIH0gZWxzZSBpZiAoY3NpUGF0aCkge1xuICAgICAgdGhpcy5pbmRleCA9IG5ldyBDU0koeyBmaWxlaGFuZGxlOiBuZXcgTG9jYWxGaWxlKGNzaVBhdGgpIH0pXG4gICAgfSBlbHNlIGlmIChjc2lVcmwpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBuZXcgQ1NJKHsgZmlsZWhhbmRsZTogbmV3IFJlbW90ZUZpbGUoY3NpVXJsKSB9KVxuICAgIH0gZWxzZSBpZiAoYmFpRmlsZWhhbmRsZSkge1xuICAgICAgdGhpcy5pbmRleCA9IG5ldyBCQUkoeyBmaWxlaGFuZGxlOiBiYWlGaWxlaGFuZGxlIH0pXG4gICAgfSBlbHNlIGlmIChiYWlQYXRoKSB7XG4gICAgICB0aGlzLmluZGV4ID0gbmV3IEJBSSh7IGZpbGVoYW5kbGU6IG5ldyBMb2NhbEZpbGUoYmFpUGF0aCkgfSlcbiAgICB9IGVsc2UgaWYgKGJhaVVybCkge1xuICAgICAgdGhpcy5pbmRleCA9IG5ldyBCQUkoeyBmaWxlaGFuZGxlOiBuZXcgUmVtb3RlRmlsZShiYWlVcmwpIH0pXG4gICAgfSBlbHNlIGlmIChiYW1QYXRoKSB7XG4gICAgICB0aGlzLmluZGV4ID0gbmV3IEJBSSh7IGZpbGVoYW5kbGU6IG5ldyBMb2NhbEZpbGUoYCR7YmFtUGF0aH0uYmFpYCkgfSlcbiAgICB9IGVsc2UgaWYgKGJhbVVybCkge1xuICAgICAgdGhpcy5pbmRleCA9IG5ldyBCQUkoeyBmaWxlaGFuZGxlOiBuZXcgUmVtb3RlRmlsZShgJHtiYW1Vcmx9LmJhaWApIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGluZmVyIGluZGV4IGZvcm1hdCcpXG4gICAgfVxuICAgIHRoaXMuZmVhdHVyZUNhY2hlID0gbmV3IEFib3J0YWJsZVByb21pc2VDYWNoZSh7XG4gICAgICBjYWNoZTogbmV3IExSVSh7XG4gICAgICAgIG1heFNpemU6IGNhY2hlU2l6ZSAhPT0gdW5kZWZpbmVkID8gY2FjaGVTaXplIDogNTAsXG4gICAgICB9KSxcbiAgICAgIGZpbGw6IHRoaXMuX3JlYWRDaHVuay5iaW5kKHRoaXMpLFxuICAgIH0pXG4gICAgdGhpcy5mZXRjaFNpemVMaW1pdCA9IGZldGNoU2l6ZUxpbWl0IHx8IDUwMDAwMDAwMCAvLyA1MDBNQlxuICAgIHRoaXMuY2h1bmtTaXplTGltaXQgPSBjaHVua1NpemVMaW1pdCB8fCAzMDAwMDAwMDAgLy8gMzAwTUJcbiAgICB0aGlzLnlpZWxkVGhyZWFkVGltZSA9IHlpZWxkVGhyZWFkVGltZVxuICB9XG5cbiAgYXN5bmMgZ2V0SGVhZGVyKG9yaWdPcHRzOiBBYm9ydFNpZ25hbCB8IEJhc2VPcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRzID0gbWFrZU9wdHMob3JpZ09wdHMpXG4gICAgY29uc3QgaW5kZXhEYXRhID0gYXdhaXQgdGhpcy5pbmRleC5wYXJzZShvcHRzKVxuICAgIGNvbnN0IHJldCA9IGluZGV4RGF0YS5maXJzdERhdGFMaW5lID8gaW5kZXhEYXRhLmZpcnN0RGF0YUxpbmUuYmxvY2tQb3NpdGlvbiArIDY1NTM1IDogdW5kZWZpbmVkXG4gICAgbGV0IGJ1ZmZlclxuICAgIGlmIChyZXQpIHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuYmFtLnJlYWQoQnVmZmVyLmFsbG9jKHJldCArIGJsb2NrTGVuKSwgMCwgcmV0ICsgYmxvY2tMZW4sIDAsIG9wdHMpXG5cbiAgICAgIGNvbnN0IHsgYnl0ZXNSZWFkIH0gPSByZXNcbiAgICAgIDsoeyBidWZmZXIgfSA9IHJlcylcbiAgICAgIGlmICghYnl0ZXNSZWFkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcmVhZGluZyBoZWFkZXInKVxuICAgICAgfVxuICAgICAgaWYgKGJ5dGVzUmVhZCA8IHJldCkge1xuICAgICAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoMCwgYnl0ZXNSZWFkKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKDAsIHJldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyID0gKGF3YWl0IHRoaXMuYmFtLnJlYWRGaWxlKG9wdHMpKSBhcyBCdWZmZXJcbiAgICB9XG5cbiAgICBjb25zdCB1bmNiYSA9IGF3YWl0IHVuemlwKGJ1ZmZlcilcblxuICAgIGlmICh1bmNiYS5yZWFkSW50MzJMRSgwKSAhPT0gQkFNX01BR0lDKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIEJBTSBmaWxlJylcbiAgICB9XG4gICAgY29uc3QgaGVhZExlbiA9IHVuY2JhLnJlYWRJbnQzMkxFKDQpXG5cbiAgICB0aGlzLmhlYWRlciA9IHVuY2JhLnRvU3RyaW5nKCd1dGY4JywgOCwgOCArIGhlYWRMZW4pXG4gICAgY29uc3QgeyBjaHJUb0luZGV4LCBpbmRleFRvQ2hyIH0gPSBhd2FpdCB0aGlzLl9yZWFkUmVmU2VxcyhoZWFkTGVuICsgOCwgNjU1MzUsIG9wdHMpXG4gICAgdGhpcy5jaHJUb0luZGV4ID0gY2hyVG9JbmRleFxuICAgIHRoaXMuaW5kZXhUb0NociA9IGluZGV4VG9DaHJcblxuICAgIHJldHVybiBwYXJzZUhlYWRlclRleHQodGhpcy5oZWFkZXIpXG4gIH1cblxuICBhc3luYyBnZXRIZWFkZXJUZXh0KG9wdHM6IEJhc2VPcHRzID0ge30pIHtcbiAgICBhd2FpdCB0aGlzLmdldEhlYWRlcihvcHRzKVxuICAgIHJldHVybiB0aGlzLmhlYWRlclxuICB9XG5cbiAgLy8gdGhlIGZ1bGwgbGVuZ3RoIG9mIHRoZSByZWZzZXEgYmxvY2sgaXMgbm90IGdpdmVuIGluIGFkdmFuY2Ugc28gdGhpcyBncmFicyBhIGNodW5rIGFuZFxuICAvLyBkb3VibGVzIGl0IGlmIGFsbCByZWZzZXFzIGhhdmVuJ3QgYmVlbiBwcm9jZXNzZWRcbiAgYXN5bmMgX3JlYWRSZWZTZXFzKFxuICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgcmVmU2VxQnl0ZXM6IG51bWJlcixcbiAgICBvcHRzOiBCYXNlT3B0cyA9IHt9LFxuICApOiBQcm9taXNlPHtcbiAgICBjaHJUb0luZGV4OiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9XG4gICAgaW5kZXhUb0NocjogeyByZWZOYW1lOiBzdHJpbmc7IGxlbmd0aDogbnVtYmVyIH1bXVxuICB9PiB7XG4gICAgaWYgKHN0YXJ0ID4gcmVmU2VxQnl0ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWFkUmVmU2VxcyhzdGFydCwgcmVmU2VxQnl0ZXMgKiAyLCBvcHRzKVxuICAgIH1cbiAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLmJhbS5yZWFkKEJ1ZmZlci5hbGxvYyhyZWZTZXFCeXRlcyArIGJsb2NrTGVuKSwgMCwgcmVmU2VxQnl0ZXMsIDAsIG9wdHMpXG4gICAgY29uc3QgeyBieXRlc1JlYWQgfSA9IHJlc1xuICAgIGxldCB7IGJ1ZmZlciB9ID0gcmVzXG4gICAgaWYgKCFieXRlc1JlYWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcmVhZGluZyByZWZzZXFzIGZyb20gaGVhZGVyJylcbiAgICB9XG4gICAgaWYgKGJ5dGVzUmVhZCA8IHJlZlNlcUJ5dGVzKSB7XG4gICAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoMCwgYnl0ZXNSZWFkKVxuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoMCwgcmVmU2VxQnl0ZXMpXG4gICAgfVxuICAgIGNvbnN0IHVuY2JhID0gYXdhaXQgdW56aXAoYnVmZmVyKVxuICAgIGNvbnN0IG5SZWYgPSB1bmNiYS5yZWFkSW50MzJMRShzdGFydClcbiAgICBsZXQgcCA9IHN0YXJ0ICsgNFxuICAgIGNvbnN0IGNoclRvSW5kZXg6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fVxuICAgIGNvbnN0IGluZGV4VG9DaHI6IHsgcmVmTmFtZTogc3RyaW5nOyBsZW5ndGg6IG51bWJlciB9W10gPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgblJlZjsgaSArPSAxKSB7XG4gICAgICBhd2FpdCBhYm9ydEJyZWFrUG9pbnQob3B0cy5zaWduYWwpXG4gICAgICBjb25zdCBsTmFtZSA9IHVuY2JhLnJlYWRJbnQzMkxFKHApXG4gICAgICBsZXQgcmVmTmFtZSA9IHVuY2JhLnRvU3RyaW5nKCd1dGY4JywgcCArIDQsIHAgKyA0ICsgbE5hbWUgLSAxKVxuICAgICAgcmVmTmFtZSA9IHRoaXMucmVuYW1lUmVmU2VxKHJlZk5hbWUpXG4gICAgICBjb25zdCBsUmVmID0gdW5jYmEucmVhZEludDMyTEUocCArIGxOYW1lICsgNClcblxuICAgICAgY2hyVG9JbmRleFtyZWZOYW1lXSA9IGlcbiAgICAgIGluZGV4VG9DaHIucHVzaCh7IHJlZk5hbWUsIGxlbmd0aDogbFJlZiB9KVxuXG4gICAgICBwID0gcCArIDggKyBsTmFtZVxuICAgICAgaWYgKHAgPiB1bmNiYS5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBCQU0gaGVhZGVyIGlzIHZlcnkgYmlnLiAgUmUtZmV0Y2hpbmcgJHtyZWZTZXFCeXRlc30gYnl0ZXMuYClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRSZWZTZXFzKHN0YXJ0LCByZWZTZXFCeXRlcyAqIDIsIG9wdHMpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IGNoclRvSW5kZXgsIGluZGV4VG9DaHIgfVxuICB9XG5cbiAgYXN5bmMgZ2V0UmVjb3Jkc0ZvclJhbmdlU2FtcGxlKFxuICAgIGNocjogc3RyaW5nLFxuICAgIG1pbjogbnVtYmVyLFxuICAgIG1heDogbnVtYmVyLFxuICAgIG9wdHM6IEJhbU9wdHMgPSB7XG4gICAgICB2aWV3QXNQYWlyczogZmFsc2UsXG4gICAgICBwYWlyQWNyb3NzQ2hyOiBmYWxzZSxcbiAgICAgIG1heEluc2VydFNpemU6IDIwMDAwMCxcbiAgICAgIG1heFNhbXBsZVNpemU6IDEwMDAsXG4gICAgfSxcbiAgKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRSZWNvcmRzRm9yUmFuZ2UoY2hyLCBtaW4sIG1heCwgb3B0cylcbiAgICB9XG4gICAgaWYgKG9wdHMubWF4U2FtcGxlU2l6ZSkge1xuICAgICAgY29uc3QgYWxsUmVjb3JkcyA9IGF3YWl0IHRoaXMuZ2V0UmVjb3Jkc0ZvclJhbmdlKGNociwgbWluLCBtYXgsIG9wdHMpXG4gICAgICBjb25zdCByZXNTaXplID0gK29wdHMubWF4U2FtcGxlU2l6ZVxuICAgICAgY29uc3QgcmVzID0gbmV3IChSZXNlcnZvaXIgYXMgYW55KShyZXNTaXplKVxuICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgYWxsUmVjb3Jkcykge1xuICAgICAgICByZXMucHVzaFNvbWUocmVjb3JkKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRSZWNvcmRzRm9yUmFuZ2UoY2hyLCBtaW4sIG1heCwgb3B0cylcbiAgfVxuXG4gIGFzeW5jIGdldFJlY29yZHNGb3JSYW5nZShcbiAgICBjaHI6IHN0cmluZyxcbiAgICBtaW46IG51bWJlcixcbiAgICBtYXg6IG51bWJlcixcbiAgICBvcHRzOiBCYW1PcHRzID0ge1xuICAgICAgdmlld0FzUGFpcnM6IGZhbHNlLFxuICAgICAgcGFpckFjcm9zc0NocjogZmFsc2UsXG4gICAgICBtYXhJbnNlcnRTaXplOiAyMDAwMDAsXG4gICAgICBtYXhTYW1wbGVTaXplOiAxMDAwLFxuICAgIH0sXG4gICkge1xuICAgIGxldCByZWNvcmRzOiBCQU1GZWF0dXJlW10gPSBbXVxuICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgdGhpcy5zdHJlYW1SZWNvcmRzRm9yUmFuZ2UoY2hyLCBtaW4sIG1heCwgb3B0cykpIHtcbiAgICAgIHJlY29yZHMgPSByZWNvcmRzLmNvbmNhdChjaHVuaylcbiAgICB9XG4gICAgcmV0dXJuIHJlY29yZHNcbiAgfVxuXG4gIGFzeW5jIHN0cmVhbVJlY29yZHNGb3JSYW5nZVNhbXBsZShcbiAgICBjaHI6IHN0cmluZyxcbiAgICBtaW46IG51bWJlcixcbiAgICBtYXg6IG51bWJlcixcbiAgICBvcHRzOiBCYW1PcHRzID0ge1xuICAgICAgdmlld0FzUGFpcnM6IGZhbHNlLFxuICAgICAgcGFpckFjcm9zc0NocjogZmFsc2UsXG4gICAgICBtYXhJbnNlcnRTaXplOiAyMDAwMDAsXG4gICAgICBtYXhTYW1wbGVTaXplOiAxMDAwLFxuICAgIH0sXG4gICkge1xuICAgIGlmICghb3B0cykge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjb3Jkc0ZvclJhbmdlKGNociwgbWluLCBtYXgsIG9wdHMpXG4gICAgfVxuICAgIGlmIChvcHRzLm1heFNhbXBsZVNpemUpIHtcbiAgICAgIGNvbnN0IHJlc1NpemUgPSArb3B0cy5tYXhTYW1wbGVTaXplXG4gICAgICBjb25zdCByZXMgPSBuZXcgKFJlc2Vydm9pciBhcyBhbnkpKHJlc1NpemUpXG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHRoaXMuc3RyZWFtUmVjb3Jkc0ZvclJhbmdlKGNociwgbWluLCBtYXgsIG9wdHMpKSB7XG4gICAgICAgIGZvciAoY29uc3QgcmVjb3JkIG9mIGNodW5rKSB7XG4gICAgICAgICAgcmVzLnB1c2hTb21lKHJlY29yZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRSZWNvcmRzRm9yUmFuZ2UoY2hyLCBtaW4sIG1heCwgb3B0cylcbiAgfVxuXG4gIGFzeW5jICpzdHJlYW1SZWNvcmRzRm9yUmFuZ2UoXG4gICAgY2hyOiBzdHJpbmcsXG4gICAgbWluOiBudW1iZXIsXG4gICAgbWF4OiBudW1iZXIsXG4gICAgb3B0czogQmFtT3B0cyA9IHtcbiAgICAgIHZpZXdBc1BhaXJzOiBmYWxzZSxcbiAgICAgIHBhaXJBY3Jvc3NDaHI6IGZhbHNlLFxuICAgICAgbWF4SW5zZXJ0U2l6ZTogMjAwMDAwLFxuICAgICAgbWF4U2FtcGxlU2l6ZTogMTAwMCxcbiAgICB9LFxuICApIHtcbiAgICAvLyB0b2RvIHJlZ3VsYXJpemUgcmVmc2VxIG5hbWVzXG4gICAgb3B0cy52aWV3QXNQYWlycyA9IG9wdHMudmlld0FzUGFpcnMgfHwgZmFsc2VcbiAgICBvcHRzLnBhaXJBY3Jvc3NDaHIgPSBvcHRzLnBhaXJBY3Jvc3NDaHIgfHwgZmFsc2VcbiAgICBvcHRzLm1heEluc2VydFNpemUgPSBvcHRzLm1heEluc2VydFNpemUgIT09IHVuZGVmaW5lZCA/IG9wdHMubWF4SW5zZXJ0U2l6ZSA6IDIwMDAwMFxuICAgIG9wdHMubWF4U2FtcGxlU2l6ZSA9IG9wdHMubWF4U2FtcGxlU2l6ZSAhPT0gdW5kZWZpbmVkID8gb3B0cy5tYXhTYW1wbGVTaXplIDogMTAwMFxuICAgIGNvbnN0IGNocklkID0gdGhpcy5jaHJUb0luZGV4ICYmIHRoaXMuY2hyVG9JbmRleFtjaHJdXG4gICAgbGV0IGNodW5rczogQ2h1bmtbXVxuICAgIGlmICghKGNocklkID49IDApKSB7XG4gICAgICBjaHVua3MgPSBbXVxuICAgIH0gZWxzZSB7XG4gICAgICBjaHVua3MgPSBhd2FpdCB0aGlzLmluZGV4LmJsb2Nrc0ZvclJhbmdlKGNocklkLCBtaW4gLSAxLCBtYXgsIG9wdHMpXG5cbiAgICAgIGlmICghY2h1bmtzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgaW4gaW5kZXggZmV0Y2gnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhd2FpdCBhYm9ydEJyZWFrUG9pbnQob3B0cy5zaWduYWwpXG4gICAgICBjb25zdCBzaXplID0gY2h1bmtzW2ldLmZldGNoZWRTaXplKClcbiAgICAgIGlmIChzaXplID4gdGhpcy5jaHVua1NpemVMaW1pdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRvbyBtYW55IEJBTSBmZWF0dXJlcy4gQkFNIGNodW5rIHNpemUgJHtzaXplfSBieXRlcyBleGNlZWRzIGNodW5rU2l6ZUxpbWl0IG9mICR7dGhpcy5jaHVua1NpemVMaW1pdH1gLFxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWxTaXplID0gY2h1bmtzXG4gICAgICAubWFwKChzOiBDaHVuaykgPT4gcy5mZXRjaGVkU2l6ZSgpKVxuICAgICAgLnJlZHVjZSgoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IGEgKyBiLCAwKVxuICAgIGlmICh0b3RhbFNpemUgPiB0aGlzLmZldGNoU2l6ZUxpbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBkYXRhIHNpemUgb2YgJHt0b3RhbFNpemUudG9Mb2NhbGVTdHJpbmcoKX0gYnl0ZXMgZXhjZWVkZWQgZmV0Y2ggc2l6ZSBsaW1pdCBvZiAke3RoaXMuZmV0Y2hTaXplTGltaXQudG9Mb2NhbGVTdHJpbmcoKX0gYnl0ZXNgLFxuICAgICAgKVxuICAgIH1cbiAgICB5aWVsZCogdGhpcy5fZmV0Y2hDaHVua0ZlYXR1cmVzKGNodW5rcywgY2hySWQsIG1pbiwgbWF4LCBvcHRzKVxuICB9XG5cbiAgYXN5bmMgKl9mZXRjaENodW5rRmVhdHVyZXMoXG4gICAgY2h1bmtzOiBDaHVua1tdLFxuICAgIGNocklkOiBudW1iZXIsXG4gICAgbWluOiBudW1iZXIsXG4gICAgbWF4OiBudW1iZXIsXG4gICAgb3B0czogQmFtT3B0cyxcbiAgKSB7XG4gICAgY29uc3QgZmVhdFByb21pc2VzID0gW11cbiAgICBsZXQgZG9uZSA9IGZhbHNlXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYyA9IGNodW5rc1tpXVxuICAgICAgY29uc3QgeyBkYXRhLCBjcG9zaXRpb25zLCBkcG9zaXRpb25zLCBjaHVuayB9ID0gYXdhaXQgdGhpcy5mZWF0dXJlQ2FjaGUuZ2V0KFxuICAgICAgICBjLnRvU3RyaW5nKCksXG4gICAgICAgIHsgY2h1bms6IGMsIG9wdHMgfSxcbiAgICAgICAgb3B0cy5zaWduYWwsXG4gICAgICApXG4gICAgICBjb25zdCBwcm9taXNlID0gdGhpcy5yZWFkQmFtRmVhdHVyZXMoZGF0YSwgY3Bvc2l0aW9ucywgZHBvc2l0aW9ucywgY2h1bmspLnRoZW4ocmVjb3JkcyA9PiB7XG4gICAgICAgIGNvbnN0IHJlY3MgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlY29yZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBmZWF0dXJlID0gcmVjb3Jkc1tpXVxuICAgICAgICAgIGlmIChmZWF0dXJlLnNlcV9pZCgpID09PSBjaHJJZCkge1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUuZ2V0KCdzdGFydCcpID49IG1heCkge1xuICAgICAgICAgICAgICAvLyBwYXN0IGVuZCBvZiByYW5nZSwgY2FuIHN0b3AgaXRlcmF0aW5nXG4gICAgICAgICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZlYXR1cmUuZ2V0KCdlbmQnKSA+PSBtaW4pIHtcbiAgICAgICAgICAgICAgLy8gbXVzdCBiZSBpbiByYW5nZVxuICAgICAgICAgICAgICByZWNzLnB1c2goZmVhdHVyZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlY3NcbiAgICAgIH0pXG4gICAgICBmZWF0UHJvbWlzZXMucHVzaChwcm9taXNlKVxuICAgICAgYXdhaXQgcHJvbWlzZVxuICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0Fib3J0U2lnbmFsKG9wdHMuc2lnbmFsKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZWF0UHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHlpZWxkIGZlYXRQcm9taXNlc1tpXVxuICAgIH1cbiAgICBjaGVja0Fib3J0U2lnbmFsKG9wdHMuc2lnbmFsKVxuICAgIGlmIChvcHRzLnZpZXdBc1BhaXJzKSB7XG4gICAgICB5aWVsZCB0aGlzLmZldGNoUGFpcnMoY2hySWQsIGZlYXRQcm9taXNlcywgb3B0cylcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaFBhaXJzKGNocklkOiBudW1iZXIsIGZlYXRQcm9taXNlczogUHJvbWlzZTxCQU1GZWF0dXJlW10+W10sIG9wdHM6IEJhbU9wdHMpIHtcbiAgICBjb25zdCB1bm1hdGVkUGFpcnM6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge31cbiAgICBjb25zdCByZWFkSWRzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge31cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGZlYXRQcm9taXNlcy5tYXAoYXN5bmMgZiA9PiB7XG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IGZcbiAgICAgICAgY29uc3QgcmVhZE5hbWVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge31cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gcmV0W2ldLm5hbWUoKVxuICAgICAgICAgIGNvbnN0IGlkID0gcmV0W2ldLmlkKClcbiAgICAgICAgICBpZiAoIXJlYWROYW1lc1tuYW1lXSkge1xuICAgICAgICAgICAgcmVhZE5hbWVzW25hbWVdID0gMFxuICAgICAgICAgIH1cbiAgICAgICAgICByZWFkTmFtZXNbbmFtZV0rK1xuICAgICAgICAgIHJlYWRJZHNbaWRdID0gMVxuICAgICAgICB9XG4gICAgICAgIGVudHJpZXMocmVhZE5hbWVzKS5mb3JFYWNoKChbaywgdl06IFtzdHJpbmcsIG51bWJlcl0pID0+IHtcbiAgICAgICAgICBpZiAodiA9PT0gMSkge1xuICAgICAgICAgICAgdW5tYXRlZFBhaXJzW2tdID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pLFxuICAgIClcblxuICAgIGNvbnN0IG1hdGVQcm9taXNlczogUHJvbWlzZTxDaHVua1tdPltdID0gW11cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGZlYXRQcm9taXNlcy5tYXAoYXN5bmMgZiA9PiB7XG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IGZcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gcmV0W2ldLm5hbWUoKVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHVubWF0ZWRQYWlyc1tuYW1lXSAmJlxuICAgICAgICAgICAgKG9wdHMucGFpckFjcm9zc0NociB8fFxuICAgICAgICAgICAgICAocmV0W2ldLl9uZXh0X3JlZmlkKCkgPT09IGNocklkICYmXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMocmV0W2ldLmdldCgnc3RhcnQnKSAtIHJldFtpXS5fbmV4dF9wb3MoKSkgPFxuICAgICAgICAgICAgICAgICAgKG9wdHMubWF4SW5zZXJ0U2l6ZSB8fCAyMDAwMDApKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG1hdGVQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICB0aGlzLmluZGV4LmJsb2Nrc0ZvclJhbmdlKFxuICAgICAgICAgICAgICAgIHJldFtpXS5fbmV4dF9yZWZpZCgpLFxuICAgICAgICAgICAgICAgIHJldFtpXS5fbmV4dF9wb3MoKSxcbiAgICAgICAgICAgICAgICByZXRbaV0uX25leHRfcG9zKCkgKyAxLFxuICAgICAgICAgICAgICAgIG9wdHMsXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApXG5cbiAgICBjb25zdCBtYXRlQmxvY2tzID0gYXdhaXQgUHJvbWlzZS5hbGwobWF0ZVByb21pc2VzKVxuICAgIGxldCBtYXRlQ2h1bmtzOiBDaHVua1tdID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGVCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIG1hdGVDaHVua3MgPSBtYXRlQ2h1bmtzLmNvbmNhdChtYXRlQmxvY2tzW2ldKVxuICAgIH1cbiAgICAvLyBmaWx0ZXIgb3V0IGR1cGxpY2F0ZSBjaHVua3MgKHRoZSBibG9ja3MgYXJlIGxpc3RzIG9mIGNodW5rcywgYmxvY2tzIGFyZSBjb25jYXRlbmF0ZWQsIHRoZW4gZmlsdGVyIGR1cCBjaHVua3MpXG4gICAgbWF0ZUNodW5rcyA9IG1hdGVDaHVua3NcbiAgICAgIC5zb3J0KClcbiAgICAgIC5maWx0ZXIoKGl0ZW0sIHBvcywgYXJ5KSA9PiAhcG9zIHx8IGl0ZW0udG9TdHJpbmcoKSAhPT0gYXJ5W3BvcyAtIDFdLnRvU3RyaW5nKCkpXG5cbiAgICBjb25zdCBtYXRlVG90YWxTaXplID0gbWF0ZUNodW5rcy5tYXAocyA9PiBzLmZldGNoZWRTaXplKCkpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApXG4gICAgaWYgKG1hdGVUb3RhbFNpemUgPiB0aGlzLmZldGNoU2l6ZUxpbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBkYXRhIHNpemUgb2YgJHttYXRlVG90YWxTaXplLnRvTG9jYWxlU3RyaW5nKCl9IGJ5dGVzIGV4Y2VlZGVkIGZldGNoIHNpemUgbGltaXQgb2YgJHt0aGlzLmZldGNoU2l6ZUxpbWl0LnRvTG9jYWxlU3RyaW5nKCl9IGJ5dGVzYCxcbiAgICAgIClcbiAgICB9XG4gICAgY29uc3QgbWF0ZUZlYXRQcm9taXNlcyA9IG1hdGVDaHVua3MubWFwKGFzeW5jIGMgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhLCBjcG9zaXRpb25zLCBkcG9zaXRpb25zLCBjaHVuayB9ID0gYXdhaXQgdGhpcy5mZWF0dXJlQ2FjaGUuZ2V0KFxuICAgICAgICBjLnRvU3RyaW5nKCksXG4gICAgICAgIHsgY2h1bms6IGMsIG9wdHMgfSxcbiAgICAgICAgb3B0cy5zaWduYWwsXG4gICAgICApXG4gICAgICBjb25zdCBmZWF0cyA9IGF3YWl0IHRoaXMucmVhZEJhbUZlYXR1cmVzKGRhdGEsIGNwb3NpdGlvbnMsIGRwb3NpdGlvbnMsIGNodW5rKVxuICAgICAgY29uc3QgbWF0ZVJlY3MgPSBbXVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZWF0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBmZWF0dXJlID0gZmVhdHNbaV1cbiAgICAgICAgaWYgKHVubWF0ZWRQYWlyc1tmZWF0dXJlLmdldCgnbmFtZScpXSAmJiAhcmVhZElkc1tmZWF0dXJlLmlkKCldKSB7XG4gICAgICAgICAgbWF0ZVJlY3MucHVzaChmZWF0dXJlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0ZVJlY3NcbiAgICB9KVxuICAgIGNvbnN0IG5ld01hdGVGZWF0cyA9IGF3YWl0IFByb21pc2UuYWxsKG1hdGVGZWF0UHJvbWlzZXMpXG4gICAgbGV0IGZlYXR1cmVzUmV0OiBCQU1GZWF0dXJlW10gPSBbXVxuICAgIGlmIChuZXdNYXRlRmVhdHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBuZXdNYXRlcyA9IG5ld01hdGVGZWF0cy5yZWR1Y2UoKHJlc3VsdCwgY3VycmVudCkgPT4gcmVzdWx0LmNvbmNhdChjdXJyZW50KSlcbiAgICAgIGZlYXR1cmVzUmV0ID0gZmVhdHVyZXNSZXQuY29uY2F0KG5ld01hdGVzKVxuICAgIH1cbiAgICByZXR1cm4gZmVhdHVyZXNSZXRcbiAgfVxuXG4gIGFzeW5jIF9yZWFkQ2h1bmsoeyBjaHVuaywgb3B0cyB9OiB7IGNodW5rOiB1bmtub3duOyBvcHRzOiBCYXNlT3B0cyB9LCBhYm9ydFNpZ25hbD86IEFib3J0U2lnbmFsKSB7XG4gICAgY29uc3QgYyA9IGNodW5rIGFzIENodW5rXG4gICAgY29uc3QgYnVmc2l6ZSA9IGMuZmV0Y2hlZFNpemUoKVxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuYmFtLnJlYWQoQnVmZmVyLmFsbG9jKGJ1ZnNpemUpLCAwLCBidWZzaXplLCBjLm1pbnYuYmxvY2tQb3NpdGlvbiwgb3B0cylcbiAgICBjb25zdCB7IGJ5dGVzUmVhZCB9ID0gcmVzXG4gICAgbGV0IHsgYnVmZmVyIH0gPSByZXNcbiAgICBjaGVja0Fib3J0U2lnbmFsKGFib3J0U2lnbmFsKVxuICAgIGlmICghYnl0ZXNSZWFkKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgaWYgKGJ5dGVzUmVhZCA8IGJ1ZnNpemUpIHtcbiAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zbGljZSgwLCBieXRlc1JlYWQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zbGljZSgwLCBidWZzaXplKVxuICAgIH1cblxuICAgIGNvbnN0IHsgYnVmZmVyOiBkYXRhLCBjcG9zaXRpb25zLCBkcG9zaXRpb25zIH0gPSBhd2FpdCB1bnppcENodW5rU2xpY2UoYnVmZmVyLCBjaHVuaylcbiAgICBjaGVja0Fib3J0U2lnbmFsKGFib3J0U2lnbmFsKVxuICAgIHJldHVybiB7IGRhdGEsIGNwb3NpdGlvbnMsIGRwb3NpdGlvbnMsIGNodW5rIH1cbiAgfVxuXG4gIGFzeW5jIHJlYWRCYW1GZWF0dXJlcyhiYTogQnVmZmVyLCBjcG9zaXRpb25zOiBudW1iZXJbXSwgZHBvc2l0aW9uczogbnVtYmVyW10sIGNodW5rOiBDaHVuaykge1xuICAgIGxldCBibG9ja1N0YXJ0ID0gMFxuICAgIGNvbnN0IHNpbmsgPSBbXVxuICAgIGxldCBwb3MgPSAwXG4gICAgbGV0IGxhc3QgPSArRGF0ZS5ub3coKVxuXG4gICAgd2hpbGUgKGJsb2NrU3RhcnQgKyA0IDwgYmEubGVuZ3RoKSB7XG4gICAgICBjb25zdCBibG9ja1NpemUgPSBiYS5yZWFkSW50MzJMRShibG9ja1N0YXJ0KVxuICAgICAgY29uc3QgYmxvY2tFbmQgPSBibG9ja1N0YXJ0ICsgNCArIGJsb2NrU2l6ZSAtIDFcblxuICAgICAgLy8gaW5jcmVtZW50IHBvc2l0aW9uIHRvIHRoZSBjdXJyZW50IGRlY29tcHJlc3NlZCBzdGF0dXNcbiAgICAgIGlmIChkcG9zaXRpb25zKSB7XG4gICAgICAgIHdoaWxlIChibG9ja1N0YXJ0ICsgY2h1bmsubWludi5kYXRhUG9zaXRpb24gPj0gZHBvc2l0aW9uc1twb3MrK10pIHt9XG4gICAgICAgIHBvcy0tXG4gICAgICB9XG5cbiAgICAgIC8vIG9ubHkgdHJ5IHRvIHJlYWQgdGhlIGZlYXR1cmUgaWYgd2UgaGF2ZSBhbGwgdGhlIGJ5dGVzIGZvciBpdFxuICAgICAgaWYgKGJsb2NrRW5kIDwgYmEubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGZlYXR1cmUgPSBuZXcgQkFNRmVhdHVyZSh7XG4gICAgICAgICAgYnl0ZXM6IHtcbiAgICAgICAgICAgIGJ5dGVBcnJheTogYmEsXG4gICAgICAgICAgICBzdGFydDogYmxvY2tTdGFydCxcbiAgICAgICAgICAgIGVuZDogYmxvY2tFbmQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyB0aGUgYmVsb3cgcmVzdWx0cyBpbiBhbiBhdXRvbWF0aWNhbGx5IGNhbGN1bGF0ZWQgZmlsZS1vZmZzZXQgYmFzZWQgSURcbiAgICAgICAgICAvLyBpZiB0aGUgaW5mbyBmb3IgdGhhdCBpcyBhdmFpbGFibGUsIG90aGVyd2lzZSBjcmMzMiBvZiB0aGUgZmVhdHVyZXNcbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIGNwb3NpdGlvbnNbcG9zXSByZWZlcnMgdG8gYWN0dWFsIGZpbGUgb2Zmc2V0IG9mIGEgYmd6aXAgYmxvY2sgYm91bmRhcmllc1xuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gd2UgbXVsdGlwbHkgYnkgKDEgPDw4KSBpbiBvcmRlciB0byBtYWtlIHN1cmUgZWFjaCBibG9jayBoYXMgYSBcInVuaXF1ZVwiXG4gICAgICAgICAgLy8gYWRkcmVzcyBzcGFjZSBzbyB0aGF0IGRhdGEgaW4gdGhhdCBibG9jayBjb3VsZCBuZXZlciBvdmVybGFwXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyB0aGVuIHRoZSBibG9ja1N0YXJ0LWRwb3NpdGlvbnMgaXMgYW4gdW5jb21wcmVzc2VkIGZpbGUgb2Zmc2V0IGZyb21cbiAgICAgICAgICAvLyB0aGF0IGJnemlwIGJsb2NrIGJvdW5kYXJ5LCBhbmQgc2luY2UgdGhlIGNwb3NpdGlvbnMgYXJlIG11bHRpcGxpZWQgYnlcbiAgICAgICAgICAvLyAoMSA8PCA4KSB0aGVzZSB1bmNvbXByZXNzZWQgb2Zmc2V0cyBnZXQgYSB1bmlxdWUgc3BhY2VcbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIHRoaXMgaGFzIGFuIGV4dHJhIGNodW5rLm1pbnYuZGF0YVBvc2l0aW9uIGFkZGVkIG9uIGJlY2F1c2UgaXQgYmxvY2tTdGFydFxuICAgICAgICAgIC8vIHN0YXJ0cyBhdCAwIGluc3RlYWQgb2YgY2h1bmsubWludi5kYXRhUG9zaXRpb25cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIHRoZSArMSBpcyBqdXN0IHRvIGF2b2lkIGFueSBwb3NzaWJsZSB1bmlxdWVJZCAwIGJ1dCB0aGlzIGRvZXMgbm90IHJlYWxpc3RpY2FsbHkgaGFwcGVuXG4gICAgICAgICAgZmlsZU9mZnNldDogY3Bvc2l0aW9uc1xuICAgICAgICAgICAgPyBjcG9zaXRpb25zW3Bvc10gKiAoMSA8PCA4KSArXG4gICAgICAgICAgICAgIChibG9ja1N0YXJ0IC0gZHBvc2l0aW9uc1twb3NdKSArXG4gICAgICAgICAgICAgIGNodW5rLm1pbnYuZGF0YVBvc2l0aW9uICtcbiAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgOiBjcmMzMi5zaWduZWQoYmEuc2xpY2UoYmxvY2tTdGFydCwgYmxvY2tFbmQpKSxcbiAgICAgICAgfSlcblxuICAgICAgICBzaW5rLnB1c2goZmVhdHVyZSlcbiAgICAgICAgaWYgKHRoaXMueWllbGRUaHJlYWRUaW1lICYmICtEYXRlLm5vdygpIC0gbGFzdCA+IHRoaXMueWllbGRUaHJlYWRUaW1lKSB7XG4gICAgICAgICAgYXdhaXQgdGltZW91dCgxKVxuICAgICAgICAgIGxhc3QgPSArRGF0ZS5ub3coKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJsb2NrU3RhcnQgPSBibG9ja0VuZCArIDFcbiAgICB9XG4gICAgcmV0dXJuIHNpbmtcbiAgfVxuXG4gIGFzeW5jIGhhc1JlZlNlcShzZXFOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZWZJZCA9IHRoaXMuY2hyVG9JbmRleCAmJiB0aGlzLmNoclRvSW5kZXhbc2VxTmFtZV1cbiAgICByZXR1cm4gdGhpcy5pbmRleC5oYXNSZWZTZXEocmVmSWQpXG4gIH1cblxuICBhc3luYyBsaW5lQ291bnQoc2VxTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVmSWQgPSB0aGlzLmNoclRvSW5kZXggJiYgdGhpcy5jaHJUb0luZGV4W3NlcU5hbWVdXG4gICAgcmV0dXJuIHRoaXMuaW5kZXgubGluZUNvdW50KHJlZklkKVxuICB9XG5cbiAgYXN5bmMgaW5kZXhDb3Yoc2VxTmFtZTogc3RyaW5nLCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSB7XG4gICAgYXdhaXQgdGhpcy5pbmRleC5wYXJzZSgpXG4gICAgY29uc3Qgc2VxSWQgPSB0aGlzLmNoclRvSW5kZXggJiYgdGhpcy5jaHJUb0luZGV4W3NlcU5hbWVdXG4gICAgcmV0dXJuIHRoaXMuaW5kZXguaW5kZXhDb3Yoc2VxSWQsIHN0YXJ0LCBlbmQpXG4gIH1cbn1cbiJdfQ==