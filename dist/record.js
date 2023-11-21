"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _flags2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flags"));

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _constants = _interopRequireDefault(require("./constants"));

var _context;

var SEQRET_DECODER = (0, _map.default)(_context = '=ACMGRSVTWYHKDBN'.split('')).call(_context, function (s) {
  return s.charCodeAt(0);
});
var CIGAR_DECODER = 'MIDNSHP=X???????'.split('');
/**
 * Class of each BAM record returned by this API.
 */

var BamRecord = /*#__PURE__*/function () {
  function BamRecord(args) {
    (0, _classCallCheck2.default)(this, BamRecord);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "bytes", void 0);
    (0, _defineProperty2.default)(this, "flags", void 0);
    (0, _defineProperty2.default)(this, "_id", void 0);
    (0, _defineProperty2.default)(this, "_refID", void 0);
    (0, _defineProperty2.default)(this, "_tagOffset", undefined);
    (0, _defineProperty2.default)(this, "_tagList", []);
    (0, _defineProperty2.default)(this, "_allTagsParsed", false);
    this.data = {};
    this.bytes = {
      start: args.bytes.start,
      end: args.bytes.end,
      byteArray: args.bytes.byteArray
    };
    this._id = args.fileOffset;
    var _this$bytes = this.bytes,
        start = _this$bytes.start,
        byteArray = _this$bytes.byteArray;
    this._refID = byteArray.readInt32LE(start + 4);
    this.data.start = byteArray.readInt32LE(start + 8);
    this.flags = (byteArray.readInt32LE(start + 16) & 0xffff0000) >> 16;
  }

  (0, _createClass2.default)(BamRecord, [{
    key: "get",
    value: function get(field) {
      //@ts-ignore
      if (this[field]) {
        //@ts-ignore
        if (this.data[field]) {
          return this.data[field];
        } //@ts-ignore


        this.data[field] = this[field]();
        return this.data[field];
      }

      return this._get(field.toLowerCase());
    }
  }, {
    key: "end",
    value: function end() {
      return this.get('start') + (this.get('length_on_ref') || this.get('seq_length') || undefined);
    }
  }, {
    key: "seq_id",
    value: function seq_id() {
      return this._refID;
    } // same as get(), except requires lower-case arguments.  used
    // internally to save lots of calls to field.toLowerCase()

  }, {
    key: "_get",
    value: function _get(field) {
      if (field in this.data) {
        return this.data[field];
      }

      this.data[field] = this._parseTag(field);
      return this.data[field];
    }
  }, {
    key: "_tags",
    value: function _tags() {
      var _context2,
          _this = this;

      this._parseAllTags();

      var tags = ['seq'];

      if (!this.isSegmentUnmapped()) {
        tags.push('start', 'end', 'strand', 'score', 'qual', 'MQ', 'CIGAR', 'length_on_ref', 'template_length');
      }

      if (this.isPaired()) {
        tags.push('next_segment_position', 'pair_orientation');
      }

      tags = (0, _concat.default)(tags).call(tags, this._tagList || []);
      (0, _forEach.default)(_context2 = (0, _keys.default)(this.data)).call(_context2, function (k) {
        if (k[0] !== '_' && k !== 'next_seq_id') {
          tags.push(k);
        }
      });
      var seen = {};
      tags = (0, _filter.default)(tags).call(tags, function (t) {
        if (t in _this.data && _this.data[t] === undefined || t === 'CG' || t === 'cg') {
          return false;
        }

        var lt = t.toLowerCase();
        var s = seen[lt];
        seen[lt] = true;
        return !s;
      });
      return tags;
    }
  }, {
    key: "parent",
    value: function parent() {
      return undefined;
    }
  }, {
    key: "children",
    value: function children() {
      return this.get('subfeatures');
    }
  }, {
    key: "id",
    value: function id() {
      return this._id;
    } // special parsers

    /**
     * Mapping quality score.
     */

  }, {
    key: "mq",
    value: function mq() {
      var mq = (this.get('_bin_mq_nl') & 0xff00) >> 8;
      return mq === 255 ? undefined : mq;
    }
  }, {
    key: "score",
    value: function score() {
      return this.get('mq');
    }
  }, {
    key: "qual",
    value: function qual() {
      var _this$qualRaw;

      return (_this$qualRaw = this.qualRaw()) === null || _this$qualRaw === void 0 ? void 0 : _this$qualRaw.join(' ');
    }
  }, {
    key: "qualRaw",
    value: function qualRaw() {
      if (this.isSegmentUnmapped()) {
        return undefined;
      }

      var byteArray = this.bytes.byteArray;
      var p = this.bytes.start + 36 + this.get('_l_read_name') + this.get('_n_cigar_op') * 4 + this.get('_seq_bytes');
      var lseq = this.get('seq_length');
      var qseq = Buffer.allocUnsafe(lseq);

      for (var j = 0; j < lseq; ++j) {
        qseq[j] = byteArray[p + j];
      }

      return qseq;
    }
  }, {
    key: "strand",
    value: function strand() {
      return this.isReverseComplemented() ? -1 : 1;
    }
  }, {
    key: "multi_segment_next_segment_strand",
    value: function multi_segment_next_segment_strand() {
      if (this.isMateUnmapped()) {
        return undefined;
      }

      return this.isMateReverseComplemented() ? -1 : 1;
    }
  }, {
    key: "name",
    value: function name() {
      return this.get('_read_name');
    }
  }, {
    key: "_read_name",
    value: function _read_name() {
      var nl = this.get('_l_read_name');
      return this.bytes.byteArray.toString('ascii', this.bytes.start + 36, this.bytes.start + 36 + nl - 1);
    }
    /**
     * Get the value of a tag, parsing the tags as far as necessary.
     * Only called if we have not already parsed that field.
     */

  }, {
    key: "_parseTag",
    value: function _parseTag(tagName) {
      // if all of the tags have been parsed and we're still being
      // called, we already know that we have no such tag, because
      // it would already have been cached.
      if (this._allTagsParsed) {
        return undefined;
      }

      var byteArray = this.bytes.byteArray;
      var p = this._tagOffset || this.bytes.start + 36 + this.get('_l_read_name') + this.get('_n_cigar_op') * 4 + this.get('_seq_bytes') + this.get('seq_length');
      var blockEnd = this.bytes.end;
      var lcTag;

      while (p < blockEnd && lcTag !== tagName) {
        var tag = String.fromCharCode(byteArray[p], byteArray[p + 1]);
        lcTag = tag.toLowerCase();
        var type = String.fromCharCode(byteArray[p + 2]);
        p += 3;
        var value = void 0;

        switch (type) {
          case 'A':
            value = String.fromCharCode(byteArray[p]);
            p += 1;
            break;

          case 'i':
            value = byteArray.readInt32LE(p);
            p += 4;
            break;

          case 'I':
            value = byteArray.readUInt32LE(p);
            p += 4;
            break;

          case 'c':
            value = byteArray.readInt8(p);
            p += 1;
            break;

          case 'C':
            value = byteArray.readUInt8(p);
            p += 1;
            break;

          case 's':
            value = byteArray.readInt16LE(p);
            p += 2;
            break;

          case 'S':
            value = byteArray.readUInt16LE(p);
            p += 2;
            break;

          case 'f':
            value = byteArray.readFloatLE(p);
            p += 4;
            break;

          case 'Z':
          case 'H':
            value = '';

            while (p <= blockEnd) {
              var cc = byteArray[p++];

              if (cc === 0) {
                break;
              } else {
                value += String.fromCharCode(cc);
              }
            }

            break;

          case 'B':
            {
              value = '';
              var _cc = byteArray[p++];
              var Btype = String.fromCharCode(_cc);
              var limit = byteArray.readInt32LE(p);
              p += 4;

              if (Btype === 'i') {
                if (tag === 'CG') {
                  for (var k = 0; k < limit; k++) {
                    var cigop = byteArray.readInt32LE(p);
                    var lop = cigop >> 4;
                    var op = CIGAR_DECODER[cigop & 0xf];
                    value += lop + op;
                    p += 4;
                  }
                } else {
                  for (var _k = 0; _k < limit; _k++) {
                    value += byteArray.readInt32LE(p);

                    if (_k + 1 < limit) {
                      value += ',';
                    }

                    p += 4;
                  }
                }
              }

              if (Btype === 'I') {
                if (tag === 'CG') {
                  for (var _k2 = 0; _k2 < limit; _k2++) {
                    var _cigop = byteArray.readUInt32LE(p);

                    var _lop = _cigop >> 4;

                    var _op = CIGAR_DECODER[_cigop & 0xf];
                    value += _lop + _op;
                    p += 4;
                  }
                } else {
                  for (var _k3 = 0; _k3 < limit; _k3++) {
                    value += byteArray.readUInt32LE(p);

                    if (_k3 + 1 < limit) {
                      value += ',';
                    }

                    p += 4;
                  }
                }
              }

              if (Btype === 's') {
                for (var _k4 = 0; _k4 < limit; _k4++) {
                  value += byteArray.readInt16LE(p);

                  if (_k4 + 1 < limit) {
                    value += ',';
                  }

                  p += 2;
                }
              }

              if (Btype === 'S') {
                for (var _k5 = 0; _k5 < limit; _k5++) {
                  value += byteArray.readUInt16LE(p);

                  if (_k5 + 1 < limit) {
                    value += ',';
                  }

                  p += 2;
                }
              }

              if (Btype === 'c') {
                for (var _k6 = 0; _k6 < limit; _k6++) {
                  value += byteArray.readInt8(p);

                  if (_k6 + 1 < limit) {
                    value += ',';
                  }

                  p += 1;
                }
              }

              if (Btype === 'C') {
                for (var _k7 = 0; _k7 < limit; _k7++) {
                  value += byteArray.readUInt8(p);

                  if (_k7 + 1 < limit) {
                    value += ',';
                  }

                  p += 1;
                }
              }

              if (Btype === 'f') {
                for (var _k8 = 0; _k8 < limit; _k8++) {
                  value += byteArray.readFloatLE(p);

                  if (_k8 + 1 < limit) {
                    value += ',';
                  }

                  p += 4;
                }
              }

              break;
            }

          default:
            console.warn("Unknown BAM tag type '".concat(type, "', tags may be incomplete"));
            value = undefined;
            p = blockEnd;
          // stop parsing tags
        }

        this._tagOffset = p;

        this._tagList.push(tag);

        if (lcTag === tagName) {
          return value;
        }

        this.data[lcTag] = value;
      }

      this._allTagsParsed = true;
      return undefined;
    }
  }, {
    key: "_parseAllTags",
    value: function _parseAllTags() {
      this._parseTag('');
    }
  }, {
    key: "_parseCigar",
    value: function _parseCigar(cigar) {
      var _context3;

      return (//@ts-ignore
        (0, _map.default)(_context3 = cigar.match(/\d+\D/g)).call(_context3, function (op) {
          return [op.match(/\D/)[0].toUpperCase(), (0, _parseInt2.default)(op, 10)];
        })
      );
    }
    /**
     * @returns {boolean} true if the read is paired, regardless of whether both segments are mapped
     */

  }, {
    key: "isPaired",
    value: function isPaired() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FPAIRED);
    }
    /** @returns {boolean} true if the read is paired, and both segments are mapped */

  }, {
    key: "isProperlyPaired",
    value: function isProperlyPaired() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FPROPER_PAIR);
    }
    /** @returns {boolean} true if the read itself is unmapped; conflictive with isProperlyPaired */

  }, {
    key: "isSegmentUnmapped",
    value: function isSegmentUnmapped() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FUNMAP);
    }
    /** @returns {boolean} true if the read itself is unmapped; conflictive with isProperlyPaired */

  }, {
    key: "isMateUnmapped",
    value: function isMateUnmapped() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FMUNMAP);
    }
    /** @returns {boolean} true if the read is mapped to the reverse strand */

  }, {
    key: "isReverseComplemented",
    value: function isReverseComplemented() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FREVERSE);
    }
    /** @returns {boolean} true if the mate is mapped to the reverse strand */

  }, {
    key: "isMateReverseComplemented",
    value: function isMateReverseComplemented() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FMREVERSE);
    }
    /** @returns {boolean} true if this is read number 1 in a pair */

  }, {
    key: "isRead1",
    value: function isRead1() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FREAD1);
    }
    /** @returns {boolean} true if this is read number 2 in a pair */

  }, {
    key: "isRead2",
    value: function isRead2() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FREAD2);
    }
    /** @returns {boolean} true if this is a secondary alignment */

  }, {
    key: "isSecondary",
    value: function isSecondary() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FSECONDARY);
    }
    /** @returns {boolean} true if this read has failed QC checks */

  }, {
    key: "isFailedQc",
    value: function isFailedQc() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FQCFAIL);
    }
    /** @returns {boolean} true if the read is an optical or PCR duplicate */

  }, {
    key: "isDuplicate",
    value: function isDuplicate() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FDUP);
    }
    /** @returns {boolean} true if this is a supplementary alignment */

  }, {
    key: "isSupplementary",
    value: function isSupplementary() {
      return !!((0, _flags2.default)(this) & _constants.default.BAM_FSUPPLEMENTARY);
    }
  }, {
    key: "cigar",
    value: function cigar() {
      if (this.isSegmentUnmapped()) {
        return undefined;
      }

      var _this$bytes2 = this.bytes,
          byteArray = _this$bytes2.byteArray,
          start = _this$bytes2.start;
      var numCigarOps = this.get('_n_cigar_op');
      var p = start + 36 + this.get('_l_read_name');
      var seqLen = this.get('seq_length');
      var cigar = '';
      var lref = 0; // check for CG tag by inspecting whether the CIGAR field
      // contains a clip that consumes entire seqLen

      var cigop = byteArray.readInt32LE(p);
      var lop = cigop >> 4;
      var op = CIGAR_DECODER[cigop & 0xf];

      if (op === 'S' && lop === seqLen) {
        // if there is a CG the second CIGAR field will
        // be a N tag the represents the length on ref
        p += 4;
        cigop = byteArray.readInt32LE(p);
        lop = cigop >> 4;
        op = CIGAR_DECODER[cigop & 0xf];

        if (op !== 'N') {
          console.warn('CG tag with no N tag');
        }

        this.data.length_on_ref = lop;
        return this.get('CG');
      } else {
        for (var c = 0; c < numCigarOps; ++c) {
          cigop = byteArray.readInt32LE(p);
          lop = cigop >> 4;
          op = CIGAR_DECODER[cigop & 0xf];
          cigar += lop + op; // soft clip, hard clip, and insertion don't count toward
          // the length on the reference

          if (op !== 'H' && op !== 'S' && op !== 'I') {
            lref += lop;
          }

          p += 4;
        }

        this.data.length_on_ref = lref;
        return cigar;
      }
    }
  }, {
    key: "_flags",
    value: function _flags() {}
  }, {
    key: "length_on_ref",
    value: function length_on_ref() {
      this.get('cigar'); // the length_on_ref is set as a
      // side effect of the CIGAR parsing

      return this.data.length_on_ref;
    }
  }, {
    key: "_n_cigar_op",
    value: function _n_cigar_op() {
      return this.get('_flag_nc') & 0xffff;
    }
  }, {
    key: "_l_read_name",
    value: function _l_read_name() {
      return this.get('_bin_mq_nl') & 0xff;
    }
    /**
     * number of bytes in the sequence field
     */

  }, {
    key: "_seq_bytes",
    value: function _seq_bytes() {
      return this.get('seq_length') + 1 >> 1;
    }
  }, {
    key: "getReadBases",
    value: function getReadBases() {
      return this.seq();
    }
  }, {
    key: "seq",
    value: function seq() {
      var byteArray = this.bytes.byteArray;
      var p = this.bytes.start + 36 + this.get('_l_read_name') + this.get('_n_cigar_op') * 4;
      var seqBytes = this.get('_seq_bytes');
      var len = this.get('seq_length');
      var buf = '';
      var i = 0;

      for (var j = 0; j < seqBytes; ++j) {
        var sb = byteArray[p + j];
        buf += String.fromCharCode(SEQRET_DECODER[(sb & 0xf0) >> 4]);
        i++;

        if (i < len) {
          buf += String.fromCharCode(SEQRET_DECODER[sb & 0x0f]);
          i++;
        }
      }

      return buf;
    } // adapted from igv.js

  }, {
    key: "getPairOrientation",
    value: function getPairOrientation() {
      if (!this.isSegmentUnmapped() && !this.isMateUnmapped() && this._refID === this._next_refid()) {
        var s1 = this.isReverseComplemented() ? 'R' : 'F';
        var s2 = this.isMateReverseComplemented() ? 'R' : 'F';
        var o1 = ' ';
        var o2 = ' ';

        if (this.isRead1()) {
          o1 = '1';
          o2 = '2';
        } else if (this.isRead2()) {
          o1 = '2';
          o2 = '1';
        }

        var tmp = [];
        var isize = this.template_length();

        if (isize > 0) {
          tmp[0] = s1;
          tmp[1] = o1;
          tmp[2] = s2;
          tmp[3] = o2;
        } else {
          tmp[2] = s1;
          tmp[3] = o1;
          tmp[0] = s2;
          tmp[1] = o2;
        }

        return tmp.join('');
      }

      return null;
    }
  }, {
    key: "_bin_mq_nl",
    value: function _bin_mq_nl() {
      return this.bytes.byteArray.readInt32LE(this.bytes.start + 12);
    }
  }, {
    key: "_flag_nc",
    value: function _flag_nc() {
      return this.bytes.byteArray.readInt32LE(this.bytes.start + 16);
    }
  }, {
    key: "seq_length",
    value: function seq_length() {
      return this.bytes.byteArray.readInt32LE(this.bytes.start + 20);
    }
  }, {
    key: "_next_refid",
    value: function _next_refid() {
      return this.bytes.byteArray.readInt32LE(this.bytes.start + 24);
    }
  }, {
    key: "_next_pos",
    value: function _next_pos() {
      return this.bytes.byteArray.readInt32LE(this.bytes.start + 28);
    }
  }, {
    key: "template_length",
    value: function template_length() {
      return this.bytes.byteArray.readInt32LE(this.bytes.start + 32);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var _context4,
          _this2 = this;

      var data = {};
      (0, _forEach.default)(_context4 = (0, _keys.default)(this)).call(_context4, function (k) {
        if (k.charAt(0) === '_' || k === 'bytes') {
          return;
        } //@ts-ignore


        data[k] = _this2[k];
      });
      return data;
    }
  }]);
  return BamRecord;
}();

exports.default = BamRecord;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWNvcmQudHMiXSwibmFtZXMiOlsiU0VRUkVUX0RFQ09ERVIiLCJzcGxpdCIsInMiLCJjaGFyQ29kZUF0IiwiQ0lHQVJfREVDT0RFUiIsIkJhbVJlY29yZCIsImFyZ3MiLCJ1bmRlZmluZWQiLCJkYXRhIiwiYnl0ZXMiLCJzdGFydCIsImVuZCIsImJ5dGVBcnJheSIsIl9pZCIsImZpbGVPZmZzZXQiLCJfcmVmSUQiLCJyZWFkSW50MzJMRSIsImZsYWdzIiwiZmllbGQiLCJfZ2V0IiwidG9Mb3dlckNhc2UiLCJnZXQiLCJfcGFyc2VUYWciLCJfcGFyc2VBbGxUYWdzIiwidGFncyIsImlzU2VnbWVudFVubWFwcGVkIiwicHVzaCIsImlzUGFpcmVkIiwiX3RhZ0xpc3QiLCJrIiwic2VlbiIsInQiLCJsdCIsIm1xIiwicXVhbFJhdyIsImpvaW4iLCJwIiwibHNlcSIsInFzZXEiLCJCdWZmZXIiLCJhbGxvY1Vuc2FmZSIsImoiLCJpc1JldmVyc2VDb21wbGVtZW50ZWQiLCJpc01hdGVVbm1hcHBlZCIsImlzTWF0ZVJldmVyc2VDb21wbGVtZW50ZWQiLCJubCIsInRvU3RyaW5nIiwidGFnTmFtZSIsIl9hbGxUYWdzUGFyc2VkIiwiX3RhZ09mZnNldCIsImJsb2NrRW5kIiwibGNUYWciLCJ0YWciLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkVUludDMyTEUiLCJyZWFkSW50OCIsInJlYWRVSW50OCIsInJlYWRJbnQxNkxFIiwicmVhZFVJbnQxNkxFIiwicmVhZEZsb2F0TEUiLCJjYyIsIkJ0eXBlIiwibGltaXQiLCJjaWdvcCIsImxvcCIsIm9wIiwiY29uc29sZSIsIndhcm4iLCJjaWdhciIsIm1hdGNoIiwidG9VcHBlckNhc2UiLCJDb25zdGFudHMiLCJCQU1fRlBBSVJFRCIsIkJBTV9GUFJPUEVSX1BBSVIiLCJCQU1fRlVOTUFQIiwiQkFNX0ZNVU5NQVAiLCJCQU1fRlJFVkVSU0UiLCJCQU1fRk1SRVZFUlNFIiwiQkFNX0ZSRUFEMSIsIkJBTV9GUkVBRDIiLCJCQU1fRlNFQ09OREFSWSIsIkJBTV9GUUNGQUlMIiwiQkFNX0ZEVVAiLCJCQU1fRlNVUFBMRU1FTlRBUlkiLCJudW1DaWdhck9wcyIsInNlcUxlbiIsImxyZWYiLCJsZW5ndGhfb25fcmVmIiwiYyIsInNlcSIsInNlcUJ5dGVzIiwibGVuIiwiYnVmIiwiaSIsInNiIiwiX25leHRfcmVmaWQiLCJzMSIsInMyIiwibzEiLCJvMiIsImlzUmVhZDEiLCJpc1JlYWQyIiwidG1wIiwiaXNpemUiLCJ0ZW1wbGF0ZV9sZW5ndGgiLCJjaGFyQXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7QUFFQSxJQUFNQSxjQUFjLEdBQUcsZ0RBQW1CQyxLQUFuQixDQUF5QixFQUF6QixrQkFBaUMsVUFBQUMsQ0FBQztBQUFBLFNBQUlBLENBQUMsQ0FBQ0MsVUFBRixDQUFhLENBQWIsQ0FBSjtBQUFBLENBQWxDLENBQXZCO0FBQ0EsSUFBTUMsYUFBYSxHQUFHLG1CQUFtQkgsS0FBbkIsQ0FBeUIsRUFBekIsQ0FBdEI7QUFFQTs7OztJQUdxQkksUztBQVNuQixxQkFBWUMsSUFBWixFQUF1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNEQUhrQkMsU0FHbEI7QUFBQSxvREFGTSxFQUVOO0FBQUEsMERBREUsS0FDRjtBQUNyQixTQUFLQyxJQUFMLEdBQVksRUFBWjtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxLQUFLLEVBQUVKLElBQUksQ0FBQ0csS0FBTCxDQUFXQyxLQURQO0FBRVhDLE1BQUFBLEdBQUcsRUFBRUwsSUFBSSxDQUFDRyxLQUFMLENBQVdFLEdBRkw7QUFHWEMsTUFBQUEsU0FBUyxFQUFFTixJQUFJLENBQUNHLEtBQUwsQ0FBV0c7QUFIWCxLQUFiO0FBS0EsU0FBS0MsR0FBTCxHQUFXUCxJQUFJLENBQUNRLFVBQWhCO0FBUHFCLHNCQVFRLEtBQUtMLEtBUmI7QUFBQSxRQVFiQyxLQVJhLGVBUWJBLEtBUmE7QUFBQSxRQVFORSxTQVJNLGVBUU5BLFNBUk07QUFTckIsU0FBS0csTUFBTCxHQUFjSCxTQUFTLENBQUNJLFdBQVYsQ0FBc0JOLEtBQUssR0FBRyxDQUE5QixDQUFkO0FBQ0EsU0FBS0YsSUFBTCxDQUFVRSxLQUFWLEdBQWtCRSxTQUFTLENBQUNJLFdBQVYsQ0FBc0JOLEtBQUssR0FBRyxDQUE5QixDQUFsQjtBQUNBLFNBQUtPLEtBQUwsR0FBYSxDQUFDTCxTQUFTLENBQUNJLFdBQVYsQ0FBc0JOLEtBQUssR0FBRyxFQUE5QixJQUFvQyxVQUFyQyxLQUFvRCxFQUFqRTtBQUNEOzs7O3dCQUVHUSxLLEVBQWU7QUFDakI7QUFDQSxVQUFJLEtBQUtBLEtBQUwsQ0FBSixFQUFpQjtBQUNmO0FBQ0EsWUFBSSxLQUFLVixJQUFMLENBQVVVLEtBQVYsQ0FBSixFQUFzQjtBQUNwQixpQkFBTyxLQUFLVixJQUFMLENBQVVVLEtBQVYsQ0FBUDtBQUNELFNBSmMsQ0FLZjs7O0FBQ0EsYUFBS1YsSUFBTCxDQUFVVSxLQUFWLElBQW1CLEtBQUtBLEtBQUwsR0FBbkI7QUFDQSxlQUFPLEtBQUtWLElBQUwsQ0FBVVUsS0FBVixDQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxLQUFLQyxJQUFMLENBQVVELEtBQUssQ0FBQ0UsV0FBTixFQUFWLENBQVA7QUFDRDs7OzBCQUVLO0FBQ0osYUFBTyxLQUFLQyxHQUFMLENBQVMsT0FBVCxLQUFxQixLQUFLQSxHQUFMLENBQVMsZUFBVCxLQUE2QixLQUFLQSxHQUFMLENBQVMsWUFBVCxDQUE3QixJQUF1RGQsU0FBNUUsQ0FBUDtBQUNEOzs7NkJBRVE7QUFDUCxhQUFPLEtBQUtRLE1BQVo7QUFDRCxLLENBRUQ7QUFDQTs7Ozt5QkFDS0csSyxFQUFlO0FBQ2xCLFVBQUlBLEtBQUssSUFBSSxLQUFLVixJQUFsQixFQUF3QjtBQUN0QixlQUFPLEtBQUtBLElBQUwsQ0FBVVUsS0FBVixDQUFQO0FBQ0Q7O0FBQ0QsV0FBS1YsSUFBTCxDQUFVVSxLQUFWLElBQW1CLEtBQUtJLFNBQUwsQ0FBZUosS0FBZixDQUFuQjtBQUNBLGFBQU8sS0FBS1YsSUFBTCxDQUFVVSxLQUFWLENBQVA7QUFDRDs7OzRCQUVPO0FBQUE7QUFBQTs7QUFDTixXQUFLSyxhQUFMOztBQUVBLFVBQUlDLElBQUksR0FBRyxDQUFDLEtBQUQsQ0FBWDs7QUFFQSxVQUFJLENBQUMsS0FBS0MsaUJBQUwsRUFBTCxFQUErQjtBQUM3QkQsUUFBQUEsSUFBSSxDQUFDRSxJQUFMLENBQ0UsT0FERixFQUVFLEtBRkYsRUFHRSxRQUhGLEVBSUUsT0FKRixFQUtFLE1BTEYsRUFNRSxJQU5GLEVBT0UsT0FQRixFQVFFLGVBUkYsRUFTRSxpQkFURjtBQVdEOztBQUNELFVBQUksS0FBS0MsUUFBTCxFQUFKLEVBQXFCO0FBQ25CSCxRQUFBQSxJQUFJLENBQUNFLElBQUwsQ0FBVSx1QkFBVixFQUFtQyxrQkFBbkM7QUFDRDs7QUFDREYsTUFBQUEsSUFBSSxHQUFHLHFCQUFBQSxJQUFJLE1BQUosQ0FBQUEsSUFBSSxFQUFRLEtBQUtJLFFBQUwsSUFBaUIsRUFBekIsQ0FBWDtBQUVBLDJEQUFZLEtBQUtwQixJQUFqQixtQkFBK0IsVUFBQXFCLENBQUMsRUFBSTtBQUNsQyxZQUFJQSxDQUFDLENBQUMsQ0FBRCxDQUFELEtBQVMsR0FBVCxJQUFnQkEsQ0FBQyxLQUFLLGFBQTFCLEVBQXlDO0FBQ3ZDTCxVQUFBQSxJQUFJLENBQUNFLElBQUwsQ0FBVUcsQ0FBVjtBQUNEO0FBQ0YsT0FKRDtBQU1BLFVBQU1DLElBQWdDLEdBQUcsRUFBekM7QUFDQU4sTUFBQUEsSUFBSSxHQUFHLHFCQUFBQSxJQUFJLE1BQUosQ0FBQUEsSUFBSSxFQUFRLFVBQUFPLENBQUMsRUFBSTtBQUN0QixZQUFLQSxDQUFDLElBQUksS0FBSSxDQUFDdkIsSUFBVixJQUFrQixLQUFJLENBQUNBLElBQUwsQ0FBVXVCLENBQVYsTUFBaUJ4QixTQUFwQyxJQUFrRHdCLENBQUMsS0FBSyxJQUF4RCxJQUFnRUEsQ0FBQyxLQUFLLElBQTFFLEVBQWdGO0FBQzlFLGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFNQyxFQUFFLEdBQUdELENBQUMsQ0FBQ1gsV0FBRixFQUFYO0FBQ0EsWUFBTWxCLENBQUMsR0FBRzRCLElBQUksQ0FBQ0UsRUFBRCxDQUFkO0FBQ0FGLFFBQUFBLElBQUksQ0FBQ0UsRUFBRCxDQUFKLEdBQVcsSUFBWDtBQUNBLGVBQU8sQ0FBQzlCLENBQVI7QUFDRCxPQVRVLENBQVg7QUFXQSxhQUFPc0IsSUFBUDtBQUNEOzs7NkJBRVE7QUFDUCxhQUFPakIsU0FBUDtBQUNEOzs7K0JBRVU7QUFDVCxhQUFPLEtBQUtjLEdBQUwsQ0FBUyxhQUFULENBQVA7QUFDRDs7O3lCQUVJO0FBQ0gsYUFBTyxLQUFLUixHQUFaO0FBQ0QsSyxDQUVEOztBQUNBOzs7Ozs7eUJBR0s7QUFDSCxVQUFNb0IsRUFBRSxHQUFHLENBQUMsS0FBS1osR0FBTCxDQUFTLFlBQVQsSUFBeUIsTUFBMUIsS0FBcUMsQ0FBaEQ7QUFDQSxhQUFPWSxFQUFFLEtBQUssR0FBUCxHQUFhMUIsU0FBYixHQUF5QjBCLEVBQWhDO0FBQ0Q7Ozs0QkFFTztBQUNOLGFBQU8sS0FBS1osR0FBTCxDQUFTLElBQVQsQ0FBUDtBQUNEOzs7MkJBRU07QUFBQTs7QUFDTCw4QkFBTyxLQUFLYSxPQUFMLEVBQVAsa0RBQU8sY0FBZ0JDLElBQWhCLENBQXFCLEdBQXJCLENBQVA7QUFDRDs7OzhCQUVTO0FBQ1IsVUFBSSxLQUFLVixpQkFBTCxFQUFKLEVBQThCO0FBQzVCLGVBQU9sQixTQUFQO0FBQ0Q7O0FBSE8sVUFLQUssU0FMQSxHQUtjLEtBQUtILEtBTG5CLENBS0FHLFNBTEE7QUFNUixVQUFNd0IsQ0FBQyxHQUNMLEtBQUszQixLQUFMLENBQVdDLEtBQVgsR0FDQSxFQURBLEdBRUEsS0FBS1csR0FBTCxDQUFTLGNBQVQsQ0FGQSxHQUdBLEtBQUtBLEdBQUwsQ0FBUyxhQUFULElBQTBCLENBSDFCLEdBSUEsS0FBS0EsR0FBTCxDQUFTLFlBQVQsQ0FMRjtBQU1BLFVBQU1nQixJQUFJLEdBQUcsS0FBS2hCLEdBQUwsQ0FBUyxZQUFULENBQWI7QUFDQSxVQUFNaUIsSUFBSSxHQUFHQyxNQUFNLENBQUNDLFdBQVAsQ0FBbUJILElBQW5CLENBQWI7O0FBQ0EsV0FBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixJQUFwQixFQUEwQixFQUFFSSxDQUE1QixFQUErQjtBQUM3QkgsUUFBQUEsSUFBSSxDQUFDRyxDQUFELENBQUosR0FBVTdCLFNBQVMsQ0FBQ3dCLENBQUMsR0FBR0ssQ0FBTCxDQUFuQjtBQUNEOztBQUNELGFBQU9ILElBQVA7QUFDRDs7OzZCQUVRO0FBQ1AsYUFBTyxLQUFLSSxxQkFBTCxLQUErQixDQUFDLENBQWhDLEdBQW9DLENBQTNDO0FBQ0Q7Ozt3REFFbUM7QUFDbEMsVUFBSSxLQUFLQyxjQUFMLEVBQUosRUFBMkI7QUFDekIsZUFBT3BDLFNBQVA7QUFDRDs7QUFDRCxhQUFPLEtBQUtxQyx5QkFBTCxLQUFtQyxDQUFDLENBQXBDLEdBQXdDLENBQS9DO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQU8sS0FBS3ZCLEdBQUwsQ0FBUyxZQUFULENBQVA7QUFDRDs7O2lDQUVZO0FBQ1gsVUFBTXdCLEVBQUUsR0FBRyxLQUFLeEIsR0FBTCxDQUFTLGNBQVQsQ0FBWDtBQUNBLGFBQU8sS0FBS1osS0FBTCxDQUFXRyxTQUFYLENBQXFCa0MsUUFBckIsQ0FDTCxPQURLLEVBRUwsS0FBS3JDLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixFQUZkLEVBR0wsS0FBS0QsS0FBTCxDQUFXQyxLQUFYLEdBQW1CLEVBQW5CLEdBQXdCbUMsRUFBeEIsR0FBNkIsQ0FIeEIsQ0FBUDtBQUtEO0FBRUQ7Ozs7Ozs7OEJBSVVFLE8sRUFBa0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsVUFBSSxLQUFLQyxjQUFULEVBQXlCO0FBQ3ZCLGVBQU96QyxTQUFQO0FBQ0Q7O0FBTnlCLFVBUWxCSyxTQVJrQixHQVFKLEtBQUtILEtBUkQsQ0FRbEJHLFNBUmtCO0FBUzFCLFVBQUl3QixDQUFDLEdBQ0gsS0FBS2EsVUFBTCxJQUNBLEtBQUt4QyxLQUFMLENBQVdDLEtBQVgsR0FDRSxFQURGLEdBRUUsS0FBS1csR0FBTCxDQUFTLGNBQVQsQ0FGRixHQUdFLEtBQUtBLEdBQUwsQ0FBUyxhQUFULElBQTBCLENBSDVCLEdBSUUsS0FBS0EsR0FBTCxDQUFTLFlBQVQsQ0FKRixHQUtFLEtBQUtBLEdBQUwsQ0FBUyxZQUFULENBUEo7QUFTQSxVQUFNNkIsUUFBUSxHQUFHLEtBQUt6QyxLQUFMLENBQVdFLEdBQTVCO0FBQ0EsVUFBSXdDLEtBQUo7O0FBQ0EsYUFBT2YsQ0FBQyxHQUFHYyxRQUFKLElBQWdCQyxLQUFLLEtBQUtKLE9BQWpDLEVBQTBDO0FBQ3hDLFlBQU1LLEdBQUcsR0FBR0MsTUFBTSxDQUFDQyxZQUFQLENBQW9CMUMsU0FBUyxDQUFDd0IsQ0FBRCxDQUE3QixFQUFrQ3hCLFNBQVMsQ0FBQ3dCLENBQUMsR0FBRyxDQUFMLENBQTNDLENBQVo7QUFDQWUsUUFBQUEsS0FBSyxHQUFHQyxHQUFHLENBQUNoQyxXQUFKLEVBQVI7QUFDQSxZQUFNbUMsSUFBSSxHQUFHRixNQUFNLENBQUNDLFlBQVAsQ0FBb0IxQyxTQUFTLENBQUN3QixDQUFDLEdBQUcsQ0FBTCxDQUE3QixDQUFiO0FBQ0FBLFFBQUFBLENBQUMsSUFBSSxDQUFMO0FBRUEsWUFBSW9CLEtBQUssU0FBVDs7QUFDQSxnQkFBUUQsSUFBUjtBQUNFLGVBQUssR0FBTDtBQUNFQyxZQUFBQSxLQUFLLEdBQUdILE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQjFDLFNBQVMsQ0FBQ3dCLENBQUQsQ0FBN0IsQ0FBUjtBQUNBQSxZQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBOztBQUNGLGVBQUssR0FBTDtBQUNFb0IsWUFBQUEsS0FBSyxHQUFHNUMsU0FBUyxDQUFDSSxXQUFWLENBQXNCb0IsQ0FBdEIsQ0FBUjtBQUNBQSxZQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBOztBQUNGLGVBQUssR0FBTDtBQUNFb0IsWUFBQUEsS0FBSyxHQUFHNUMsU0FBUyxDQUFDNkMsWUFBVixDQUF1QnJCLENBQXZCLENBQVI7QUFDQUEsWUFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDQTs7QUFDRixlQUFLLEdBQUw7QUFDRW9CLFlBQUFBLEtBQUssR0FBRzVDLFNBQVMsQ0FBQzhDLFFBQVYsQ0FBbUJ0QixDQUFuQixDQUFSO0FBQ0FBLFlBQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0E7O0FBQ0YsZUFBSyxHQUFMO0FBQ0VvQixZQUFBQSxLQUFLLEdBQUc1QyxTQUFTLENBQUMrQyxTQUFWLENBQW9CdkIsQ0FBcEIsQ0FBUjtBQUNBQSxZQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBOztBQUNGLGVBQUssR0FBTDtBQUNFb0IsWUFBQUEsS0FBSyxHQUFHNUMsU0FBUyxDQUFDZ0QsV0FBVixDQUFzQnhCLENBQXRCLENBQVI7QUFDQUEsWUFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDQTs7QUFDRixlQUFLLEdBQUw7QUFDRW9CLFlBQUFBLEtBQUssR0FBRzVDLFNBQVMsQ0FBQ2lELFlBQVYsQ0FBdUJ6QixDQUF2QixDQUFSO0FBQ0FBLFlBQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0E7O0FBQ0YsZUFBSyxHQUFMO0FBQ0VvQixZQUFBQSxLQUFLLEdBQUc1QyxTQUFTLENBQUNrRCxXQUFWLENBQXNCMUIsQ0FBdEIsQ0FBUjtBQUNBQSxZQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBOztBQUNGLGVBQUssR0FBTDtBQUNBLGVBQUssR0FBTDtBQUNFb0IsWUFBQUEsS0FBSyxHQUFHLEVBQVI7O0FBQ0EsbUJBQU9wQixDQUFDLElBQUljLFFBQVosRUFBc0I7QUFDcEIsa0JBQU1hLEVBQUUsR0FBR25ELFNBQVMsQ0FBQ3dCLENBQUMsRUFBRixDQUFwQjs7QUFDQSxrQkFBSTJCLEVBQUUsS0FBSyxDQUFYLEVBQWM7QUFDWjtBQUNELGVBRkQsTUFFTztBQUNMUCxnQkFBQUEsS0FBSyxJQUFJSCxNQUFNLENBQUNDLFlBQVAsQ0FBb0JTLEVBQXBCLENBQVQ7QUFDRDtBQUNGOztBQUNEOztBQUNGLGVBQUssR0FBTDtBQUFVO0FBQ1JQLGNBQUFBLEtBQUssR0FBRyxFQUFSO0FBQ0Esa0JBQU1PLEdBQUUsR0FBR25ELFNBQVMsQ0FBQ3dCLENBQUMsRUFBRixDQUFwQjtBQUNBLGtCQUFNNEIsS0FBSyxHQUFHWCxNQUFNLENBQUNDLFlBQVAsQ0FBb0JTLEdBQXBCLENBQWQ7QUFDQSxrQkFBTUUsS0FBSyxHQUFHckQsU0FBUyxDQUFDSSxXQUFWLENBQXNCb0IsQ0FBdEIsQ0FBZDtBQUNBQSxjQUFBQSxDQUFDLElBQUksQ0FBTDs7QUFDQSxrQkFBSTRCLEtBQUssS0FBSyxHQUFkLEVBQW1CO0FBQ2pCLG9CQUFJWixHQUFHLEtBQUssSUFBWixFQUFrQjtBQUNoQix1QkFBSyxJQUFJdkIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR29DLEtBQXBCLEVBQTJCcEMsQ0FBQyxFQUE1QixFQUFnQztBQUM5Qix3QkFBTXFDLEtBQUssR0FBR3RELFNBQVMsQ0FBQ0ksV0FBVixDQUFzQm9CLENBQXRCLENBQWQ7QUFDQSx3QkFBTStCLEdBQUcsR0FBR0QsS0FBSyxJQUFJLENBQXJCO0FBQ0Esd0JBQU1FLEVBQUUsR0FBR2hFLGFBQWEsQ0FBQzhELEtBQUssR0FBRyxHQUFULENBQXhCO0FBQ0FWLG9CQUFBQSxLQUFLLElBQUlXLEdBQUcsR0FBR0MsRUFBZjtBQUNBaEMsb0JBQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0Q7QUFDRixpQkFSRCxNQVFPO0FBQ0wsdUJBQUssSUFBSVAsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBR29DLEtBQXBCLEVBQTJCcEMsRUFBQyxFQUE1QixFQUFnQztBQUM5QjJCLG9CQUFBQSxLQUFLLElBQUk1QyxTQUFTLENBQUNJLFdBQVYsQ0FBc0JvQixDQUF0QixDQUFUOztBQUNBLHdCQUFJUCxFQUFDLEdBQUcsQ0FBSixHQUFRb0MsS0FBWixFQUFtQjtBQUNqQlQsc0JBQUFBLEtBQUssSUFBSSxHQUFUO0FBQ0Q7O0FBQ0RwQixvQkFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0Qsa0JBQUk0QixLQUFLLEtBQUssR0FBZCxFQUFtQjtBQUNqQixvQkFBSVosR0FBRyxLQUFLLElBQVosRUFBa0I7QUFDaEIsdUJBQUssSUFBSXZCLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdvQyxLQUFwQixFQUEyQnBDLEdBQUMsRUFBNUIsRUFBZ0M7QUFDOUIsd0JBQU1xQyxNQUFLLEdBQUd0RCxTQUFTLENBQUM2QyxZQUFWLENBQXVCckIsQ0FBdkIsQ0FBZDs7QUFDQSx3QkFBTStCLElBQUcsR0FBR0QsTUFBSyxJQUFJLENBQXJCOztBQUNBLHdCQUFNRSxHQUFFLEdBQUdoRSxhQUFhLENBQUM4RCxNQUFLLEdBQUcsR0FBVCxDQUF4QjtBQUNBVixvQkFBQUEsS0FBSyxJQUFJVyxJQUFHLEdBQUdDLEdBQWY7QUFDQWhDLG9CQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0YsaUJBUkQsTUFRTztBQUNMLHVCQUFLLElBQUlQLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdvQyxLQUFwQixFQUEyQnBDLEdBQUMsRUFBNUIsRUFBZ0M7QUFDOUIyQixvQkFBQUEsS0FBSyxJQUFJNUMsU0FBUyxDQUFDNkMsWUFBVixDQUF1QnJCLENBQXZCLENBQVQ7O0FBQ0Esd0JBQUlQLEdBQUMsR0FBRyxDQUFKLEdBQVFvQyxLQUFaLEVBQW1CO0FBQ2pCVCxzQkFBQUEsS0FBSyxJQUFJLEdBQVQ7QUFDRDs7QUFDRHBCLG9CQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxrQkFBSTRCLEtBQUssS0FBSyxHQUFkLEVBQW1CO0FBQ2pCLHFCQUFLLElBQUluQyxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHb0MsS0FBcEIsRUFBMkJwQyxHQUFDLEVBQTVCLEVBQWdDO0FBQzlCMkIsa0JBQUFBLEtBQUssSUFBSTVDLFNBQVMsQ0FBQ2dELFdBQVYsQ0FBc0J4QixDQUF0QixDQUFUOztBQUNBLHNCQUFJUCxHQUFDLEdBQUcsQ0FBSixHQUFRb0MsS0FBWixFQUFtQjtBQUNqQlQsb0JBQUFBLEtBQUssSUFBSSxHQUFUO0FBQ0Q7O0FBQ0RwQixrQkFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDRDtBQUNGOztBQUNELGtCQUFJNEIsS0FBSyxLQUFLLEdBQWQsRUFBbUI7QUFDakIscUJBQUssSUFBSW5DLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdvQyxLQUFwQixFQUEyQnBDLEdBQUMsRUFBNUIsRUFBZ0M7QUFDOUIyQixrQkFBQUEsS0FBSyxJQUFJNUMsU0FBUyxDQUFDaUQsWUFBVixDQUF1QnpCLENBQXZCLENBQVQ7O0FBQ0Esc0JBQUlQLEdBQUMsR0FBRyxDQUFKLEdBQVFvQyxLQUFaLEVBQW1CO0FBQ2pCVCxvQkFBQUEsS0FBSyxJQUFJLEdBQVQ7QUFDRDs7QUFDRHBCLGtCQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7O0FBQ0Qsa0JBQUk0QixLQUFLLEtBQUssR0FBZCxFQUFtQjtBQUNqQixxQkFBSyxJQUFJbkMsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR29DLEtBQXBCLEVBQTJCcEMsR0FBQyxFQUE1QixFQUFnQztBQUM5QjJCLGtCQUFBQSxLQUFLLElBQUk1QyxTQUFTLENBQUM4QyxRQUFWLENBQW1CdEIsQ0FBbkIsQ0FBVDs7QUFDQSxzQkFBSVAsR0FBQyxHQUFHLENBQUosR0FBUW9DLEtBQVosRUFBbUI7QUFDakJULG9CQUFBQSxLQUFLLElBQUksR0FBVDtBQUNEOztBQUNEcEIsa0JBQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0Q7QUFDRjs7QUFDRCxrQkFBSTRCLEtBQUssS0FBSyxHQUFkLEVBQW1CO0FBQ2pCLHFCQUFLLElBQUluQyxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHb0MsS0FBcEIsRUFBMkJwQyxHQUFDLEVBQTVCLEVBQWdDO0FBQzlCMkIsa0JBQUFBLEtBQUssSUFBSTVDLFNBQVMsQ0FBQytDLFNBQVYsQ0FBb0J2QixDQUFwQixDQUFUOztBQUNBLHNCQUFJUCxHQUFDLEdBQUcsQ0FBSixHQUFRb0MsS0FBWixFQUFtQjtBQUNqQlQsb0JBQUFBLEtBQUssSUFBSSxHQUFUO0FBQ0Q7O0FBQ0RwQixrQkFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDRDtBQUNGOztBQUNELGtCQUFJNEIsS0FBSyxLQUFLLEdBQWQsRUFBbUI7QUFDakIscUJBQUssSUFBSW5DLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdvQyxLQUFwQixFQUEyQnBDLEdBQUMsRUFBNUIsRUFBZ0M7QUFDOUIyQixrQkFBQUEsS0FBSyxJQUFJNUMsU0FBUyxDQUFDa0QsV0FBVixDQUFzQjFCLENBQXRCLENBQVQ7O0FBQ0Esc0JBQUlQLEdBQUMsR0FBRyxDQUFKLEdBQVFvQyxLQUFaLEVBQW1CO0FBQ2pCVCxvQkFBQUEsS0FBSyxJQUFJLEdBQVQ7QUFDRDs7QUFDRHBCLGtCQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7O0FBQ0Q7QUFDRDs7QUFDRDtBQUNFaUMsWUFBQUEsT0FBTyxDQUFDQyxJQUFSLGlDQUFzQ2YsSUFBdEM7QUFDQUMsWUFBQUEsS0FBSyxHQUFHakQsU0FBUjtBQUNBNkIsWUFBQUEsQ0FBQyxHQUFHYyxRQUFKO0FBQWE7QUEzSWpCOztBQThJQSxhQUFLRCxVQUFMLEdBQWtCYixDQUFsQjs7QUFFQSxhQUFLUixRQUFMLENBQWNGLElBQWQsQ0FBbUIwQixHQUFuQjs7QUFDQSxZQUFJRCxLQUFLLEtBQUtKLE9BQWQsRUFBdUI7QUFDckIsaUJBQU9TLEtBQVA7QUFDRDs7QUFFRCxhQUFLaEQsSUFBTCxDQUFVMkMsS0FBVixJQUFtQkssS0FBbkI7QUFDRDs7QUFDRCxXQUFLUixjQUFMLEdBQXNCLElBQXRCO0FBQ0EsYUFBT3pDLFNBQVA7QUFDRDs7O29DQUVlO0FBQ2QsV0FBS2UsU0FBTCxDQUFlLEVBQWY7QUFDRDs7O2dDQUVXaUQsSyxFQUFlO0FBQUE7O0FBQ3pCLGFBQ0U7QUFDQSxzQ0FBQUEsS0FBSyxDQUFDQyxLQUFOLENBQVksUUFBWixtQkFBMEIsVUFBQ0osRUFBRDtBQUFBLGlCQUFnQixDQUFDQSxFQUFFLENBQUNJLEtBQUgsQ0FBUyxJQUFULEVBQWUsQ0FBZixFQUFrQkMsV0FBbEIsRUFBRCxFQUFrQyx3QkFBU0wsRUFBVCxFQUFhLEVBQWIsQ0FBbEMsQ0FBaEI7QUFBQSxTQUExQjtBQUZGO0FBSUQ7QUFFRDs7Ozs7OytCQUdXO0FBQ1QsYUFBTyxDQUFDLEVBQUUsNkJBQWFNLG1CQUFVQyxXQUF6QixDQUFSO0FBQ0Q7QUFFRDs7Ozt1Q0FDbUI7QUFDakIsYUFBTyxDQUFDLEVBQUUsNkJBQWFELG1CQUFVRSxnQkFBekIsQ0FBUjtBQUNEO0FBRUQ7Ozs7d0NBQ29CO0FBQ2xCLGFBQU8sQ0FBQyxFQUFFLDZCQUFhRixtQkFBVUcsVUFBekIsQ0FBUjtBQUNEO0FBRUQ7Ozs7cUNBQ2lCO0FBQ2YsYUFBTyxDQUFDLEVBQUUsNkJBQWFILG1CQUFVSSxXQUF6QixDQUFSO0FBQ0Q7QUFFRDs7Ozs0Q0FDd0I7QUFDdEIsYUFBTyxDQUFDLEVBQUUsNkJBQWFKLG1CQUFVSyxZQUF6QixDQUFSO0FBQ0Q7QUFFRDs7OztnREFDNEI7QUFDMUIsYUFBTyxDQUFDLEVBQUUsNkJBQWFMLG1CQUFVTSxhQUF6QixDQUFSO0FBQ0Q7QUFFRDs7Ozs4QkFDVTtBQUNSLGFBQU8sQ0FBQyxFQUFFLDZCQUFhTixtQkFBVU8sVUFBekIsQ0FBUjtBQUNEO0FBRUQ7Ozs7OEJBQ1U7QUFDUixhQUFPLENBQUMsRUFBRSw2QkFBYVAsbUJBQVVRLFVBQXpCLENBQVI7QUFDRDtBQUVEOzs7O2tDQUNjO0FBQ1osYUFBTyxDQUFDLEVBQUUsNkJBQWFSLG1CQUFVUyxjQUF6QixDQUFSO0FBQ0Q7QUFFRDs7OztpQ0FDYTtBQUNYLGFBQU8sQ0FBQyxFQUFFLDZCQUFhVCxtQkFBVVUsV0FBekIsQ0FBUjtBQUNEO0FBRUQ7Ozs7a0NBQ2M7QUFDWixhQUFPLENBQUMsRUFBRSw2QkFBYVYsbUJBQVVXLFFBQXpCLENBQVI7QUFDRDtBQUVEOzs7O3NDQUNrQjtBQUNoQixhQUFPLENBQUMsRUFBRSw2QkFBYVgsbUJBQVVZLGtCQUF6QixDQUFSO0FBQ0Q7Ozs0QkFFTztBQUNOLFVBQUksS0FBSzdELGlCQUFMLEVBQUosRUFBOEI7QUFDNUIsZUFBT2xCLFNBQVA7QUFDRDs7QUFISyx5QkFLdUIsS0FBS0UsS0FMNUI7QUFBQSxVQUtFRyxTQUxGLGdCQUtFQSxTQUxGO0FBQUEsVUFLYUYsS0FMYixnQkFLYUEsS0FMYjtBQU1OLFVBQU02RSxXQUFXLEdBQUcsS0FBS2xFLEdBQUwsQ0FBUyxhQUFULENBQXBCO0FBQ0EsVUFBSWUsQ0FBQyxHQUFHMUIsS0FBSyxHQUFHLEVBQVIsR0FBYSxLQUFLVyxHQUFMLENBQVMsY0FBVCxDQUFyQjtBQUNBLFVBQU1tRSxNQUFNLEdBQUcsS0FBS25FLEdBQUwsQ0FBUyxZQUFULENBQWY7QUFDQSxVQUFJa0QsS0FBSyxHQUFHLEVBQVo7QUFDQSxVQUFJa0IsSUFBSSxHQUFHLENBQVgsQ0FWTSxDQVlOO0FBQ0E7O0FBQ0EsVUFBSXZCLEtBQUssR0FBR3RELFNBQVMsQ0FBQ0ksV0FBVixDQUFzQm9CLENBQXRCLENBQVo7QUFDQSxVQUFJK0IsR0FBRyxHQUFHRCxLQUFLLElBQUksQ0FBbkI7QUFDQSxVQUFJRSxFQUFFLEdBQUdoRSxhQUFhLENBQUM4RCxLQUFLLEdBQUcsR0FBVCxDQUF0Qjs7QUFDQSxVQUFJRSxFQUFFLEtBQUssR0FBUCxJQUFjRCxHQUFHLEtBQUtxQixNQUExQixFQUFrQztBQUNoQztBQUNBO0FBQ0FwRCxRQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBOEIsUUFBQUEsS0FBSyxHQUFHdEQsU0FBUyxDQUFDSSxXQUFWLENBQXNCb0IsQ0FBdEIsQ0FBUjtBQUNBK0IsUUFBQUEsR0FBRyxHQUFHRCxLQUFLLElBQUksQ0FBZjtBQUNBRSxRQUFBQSxFQUFFLEdBQUdoRSxhQUFhLENBQUM4RCxLQUFLLEdBQUcsR0FBVCxDQUFsQjs7QUFDQSxZQUFJRSxFQUFFLEtBQUssR0FBWCxFQUFnQjtBQUNkQyxVQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxzQkFBYjtBQUNEOztBQUNELGFBQUs5RCxJQUFMLENBQVVrRixhQUFWLEdBQTBCdkIsR0FBMUI7QUFDQSxlQUFPLEtBQUs5QyxHQUFMLENBQVMsSUFBVCxDQUFQO0FBQ0QsT0FaRCxNQVlPO0FBQ0wsYUFBSyxJQUFJc0UsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osV0FBcEIsRUFBaUMsRUFBRUksQ0FBbkMsRUFBc0M7QUFDcEN6QixVQUFBQSxLQUFLLEdBQUd0RCxTQUFTLENBQUNJLFdBQVYsQ0FBc0JvQixDQUF0QixDQUFSO0FBQ0ErQixVQUFBQSxHQUFHLEdBQUdELEtBQUssSUFBSSxDQUFmO0FBQ0FFLFVBQUFBLEVBQUUsR0FBR2hFLGFBQWEsQ0FBQzhELEtBQUssR0FBRyxHQUFULENBQWxCO0FBQ0FLLFVBQUFBLEtBQUssSUFBSUosR0FBRyxHQUFHQyxFQUFmLENBSm9DLENBTXBDO0FBQ0E7O0FBQ0EsY0FBSUEsRUFBRSxLQUFLLEdBQVAsSUFBY0EsRUFBRSxLQUFLLEdBQXJCLElBQTRCQSxFQUFFLEtBQUssR0FBdkMsRUFBNEM7QUFDMUNxQixZQUFBQSxJQUFJLElBQUl0QixHQUFSO0FBQ0Q7O0FBRUQvQixVQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNEOztBQUVELGFBQUs1QixJQUFMLENBQVVrRixhQUFWLEdBQTBCRCxJQUExQjtBQUNBLGVBQU9sQixLQUFQO0FBQ0Q7QUFDRjs7OzZCQUVRLENBQUU7OztvQ0FFSztBQUNkLFdBQUtsRCxHQUFMLENBQVMsT0FBVCxFQURjLENBQ0k7QUFDbEI7O0FBQ0EsYUFBTyxLQUFLYixJQUFMLENBQVVrRixhQUFqQjtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLEtBQUtyRSxHQUFMLENBQVMsVUFBVCxJQUF1QixNQUE5QjtBQUNEOzs7bUNBRWM7QUFDYixhQUFPLEtBQUtBLEdBQUwsQ0FBUyxZQUFULElBQXlCLElBQWhDO0FBQ0Q7QUFFRDs7Ozs7O2lDQUdhO0FBQ1gsYUFBUSxLQUFLQSxHQUFMLENBQVMsWUFBVCxJQUF5QixDQUExQixJQUFnQyxDQUF2QztBQUNEOzs7bUNBRWM7QUFDYixhQUFPLEtBQUt1RSxHQUFMLEVBQVA7QUFDRDs7OzBCQUVLO0FBQUEsVUFDSWhGLFNBREosR0FDa0IsS0FBS0gsS0FEdkIsQ0FDSUcsU0FESjtBQUVKLFVBQU13QixDQUFDLEdBQUcsS0FBSzNCLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixFQUFuQixHQUF3QixLQUFLVyxHQUFMLENBQVMsY0FBVCxDQUF4QixHQUFtRCxLQUFLQSxHQUFMLENBQVMsYUFBVCxJQUEwQixDQUF2RjtBQUNBLFVBQU13RSxRQUFRLEdBQUcsS0FBS3hFLEdBQUwsQ0FBUyxZQUFULENBQWpCO0FBQ0EsVUFBTXlFLEdBQUcsR0FBRyxLQUFLekUsR0FBTCxDQUFTLFlBQVQsQ0FBWjtBQUNBLFVBQUkwRSxHQUFHLEdBQUcsRUFBVjtBQUNBLFVBQUlDLENBQUMsR0FBRyxDQUFSOztBQUNBLFdBQUssSUFBSXZELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdvRCxRQUFwQixFQUE4QixFQUFFcEQsQ0FBaEMsRUFBbUM7QUFDakMsWUFBTXdELEVBQUUsR0FBR3JGLFNBQVMsQ0FBQ3dCLENBQUMsR0FBR0ssQ0FBTCxDQUFwQjtBQUNBc0QsUUFBQUEsR0FBRyxJQUFJMUMsTUFBTSxDQUFDQyxZQUFQLENBQW9CdEQsY0FBYyxDQUFDLENBQUNpRyxFQUFFLEdBQUcsSUFBTixLQUFlLENBQWhCLENBQWxDLENBQVA7QUFDQUQsUUFBQUEsQ0FBQzs7QUFDRCxZQUFJQSxDQUFDLEdBQUdGLEdBQVIsRUFBYTtBQUNYQyxVQUFBQSxHQUFHLElBQUkxQyxNQUFNLENBQUNDLFlBQVAsQ0FBb0J0RCxjQUFjLENBQUNpRyxFQUFFLEdBQUcsSUFBTixDQUFsQyxDQUFQO0FBQ0FELFVBQUFBLENBQUM7QUFDRjtBQUNGOztBQUNELGFBQU9ELEdBQVA7QUFDRCxLLENBRUQ7Ozs7eUNBQ3FCO0FBQ25CLFVBQUksQ0FBQyxLQUFLdEUsaUJBQUwsRUFBRCxJQUE2QixDQUFDLEtBQUtrQixjQUFMLEVBQTlCLElBQXVELEtBQUs1QixNQUFMLEtBQWdCLEtBQUttRixXQUFMLEVBQTNFLEVBQStGO0FBQzdGLFlBQU1DLEVBQUUsR0FBRyxLQUFLekQscUJBQUwsS0FBK0IsR0FBL0IsR0FBcUMsR0FBaEQ7QUFDQSxZQUFNMEQsRUFBRSxHQUFHLEtBQUt4RCx5QkFBTCxLQUFtQyxHQUFuQyxHQUF5QyxHQUFwRDtBQUNBLFlBQUl5RCxFQUFFLEdBQUcsR0FBVDtBQUNBLFlBQUlDLEVBQUUsR0FBRyxHQUFUOztBQUNBLFlBQUksS0FBS0MsT0FBTCxFQUFKLEVBQW9CO0FBQ2xCRixVQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNBQyxVQUFBQSxFQUFFLEdBQUcsR0FBTDtBQUNELFNBSEQsTUFHTyxJQUFJLEtBQUtFLE9BQUwsRUFBSixFQUFvQjtBQUN6QkgsVUFBQUEsRUFBRSxHQUFHLEdBQUw7QUFDQUMsVUFBQUEsRUFBRSxHQUFHLEdBQUw7QUFDRDs7QUFFRCxZQUFNRyxHQUFHLEdBQUcsRUFBWjtBQUNBLFlBQU1DLEtBQUssR0FBRyxLQUFLQyxlQUFMLEVBQWQ7O0FBQ0EsWUFBSUQsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRCxVQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVNOLEVBQVQ7QUFDQU0sVUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTSixFQUFUO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBU0wsRUFBVDtBQUNBSyxVQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVNILEVBQVQ7QUFDRCxTQUxELE1BS087QUFDTEcsVUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTTixFQUFUO0FBQ0FNLFVBQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBU0osRUFBVDtBQUNBSSxVQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVNMLEVBQVQ7QUFDQUssVUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTSCxFQUFUO0FBQ0Q7O0FBQ0QsZUFBT0csR0FBRyxDQUFDdEUsSUFBSixDQUFTLEVBQVQsQ0FBUDtBQUNEOztBQUNELGFBQU8sSUFBUDtBQUNEOzs7aUNBRVk7QUFDWCxhQUFPLEtBQUsxQixLQUFMLENBQVdHLFNBQVgsQ0FBcUJJLFdBQXJCLENBQWlDLEtBQUtQLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixFQUFwRCxDQUFQO0FBQ0Q7OzsrQkFFVTtBQUNULGFBQU8sS0FBS0QsS0FBTCxDQUFXRyxTQUFYLENBQXFCSSxXQUFyQixDQUFpQyxLQUFLUCxLQUFMLENBQVdDLEtBQVgsR0FBbUIsRUFBcEQsQ0FBUDtBQUNEOzs7aUNBRVk7QUFDWCxhQUFPLEtBQUtELEtBQUwsQ0FBV0csU0FBWCxDQUFxQkksV0FBckIsQ0FBaUMsS0FBS1AsS0FBTCxDQUFXQyxLQUFYLEdBQW1CLEVBQXBELENBQVA7QUFDRDs7O2tDQUVhO0FBQ1osYUFBTyxLQUFLRCxLQUFMLENBQVdHLFNBQVgsQ0FBcUJJLFdBQXJCLENBQWlDLEtBQUtQLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixFQUFwRCxDQUFQO0FBQ0Q7OztnQ0FFVztBQUNWLGFBQU8sS0FBS0QsS0FBTCxDQUFXRyxTQUFYLENBQXFCSSxXQUFyQixDQUFpQyxLQUFLUCxLQUFMLENBQVdDLEtBQVgsR0FBbUIsRUFBcEQsQ0FBUDtBQUNEOzs7c0NBRWlCO0FBQ2hCLGFBQU8sS0FBS0QsS0FBTCxDQUFXRyxTQUFYLENBQXFCSSxXQUFyQixDQUFpQyxLQUFLUCxLQUFMLENBQVdDLEtBQVgsR0FBbUIsRUFBcEQsQ0FBUDtBQUNEOzs7NkJBRVE7QUFBQTtBQUFBOztBQUNQLFVBQU1GLElBQTRCLEdBQUcsRUFBckM7QUFDQSwyREFBWSxJQUFaLG1CQUEwQixVQUFBcUIsQ0FBQyxFQUFJO0FBQzdCLFlBQUlBLENBQUMsQ0FBQytFLE1BQUYsQ0FBUyxDQUFULE1BQWdCLEdBQWhCLElBQXVCL0UsQ0FBQyxLQUFLLE9BQWpDLEVBQTBDO0FBQ3hDO0FBQ0QsU0FINEIsQ0FJN0I7OztBQUNBckIsUUFBQUEsSUFBSSxDQUFDcUIsQ0FBRCxDQUFKLEdBQVUsTUFBSSxDQUFDQSxDQUFELENBQWQ7QUFDRCxPQU5EO0FBUUEsYUFBT3JCLElBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9jYW1lbGNhc2UgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuaW1wb3J0IENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cydcblxuY29uc3QgU0VRUkVUX0RFQ09ERVIgPSAnPUFDTUdSU1ZUV1lIS0RCTicuc3BsaXQoJycpLm1hcChzID0+IHMuY2hhckNvZGVBdCgwKSlcbmNvbnN0IENJR0FSX0RFQ09ERVIgPSAnTUlETlNIUD1YPz8/Pz8/Pycuc3BsaXQoJycpXG5cbi8qKlxuICogQ2xhc3Mgb2YgZWFjaCBCQU0gcmVjb3JkIHJldHVybmVkIGJ5IHRoaXMgQVBJLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYW1SZWNvcmQge1xuICBwcml2YXRlIGRhdGE6IGFueVxuICBwcml2YXRlIGJ5dGVzOiBhbnlcbiAgcHJpdmF0ZSBmbGFnczogYW55XG4gIHByaXZhdGUgX2lkOiBudW1iZXJcbiAgcHJpdmF0ZSBfcmVmSUQ6IG51bWJlclxuICBwcml2YXRlIF90YWdPZmZzZXQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICBwcml2YXRlIF90YWdMaXN0OiBzdHJpbmdbXSA9IFtdXG4gIHByaXZhdGUgX2FsbFRhZ3NQYXJzZWQgPSBmYWxzZVxuICBjb25zdHJ1Y3RvcihhcmdzOiBhbnkpIHtcbiAgICB0aGlzLmRhdGEgPSB7fVxuICAgIHRoaXMuYnl0ZXMgPSB7XG4gICAgICBzdGFydDogYXJncy5ieXRlcy5zdGFydCxcbiAgICAgIGVuZDogYXJncy5ieXRlcy5lbmQsXG4gICAgICBieXRlQXJyYXk6IGFyZ3MuYnl0ZXMuYnl0ZUFycmF5LFxuICAgIH1cbiAgICB0aGlzLl9pZCA9IGFyZ3MuZmlsZU9mZnNldFxuICAgIGNvbnN0IHsgc3RhcnQsIGJ5dGVBcnJheSB9ID0gdGhpcy5ieXRlc1xuICAgIHRoaXMuX3JlZklEID0gYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHN0YXJ0ICsgNClcbiAgICB0aGlzLmRhdGEuc3RhcnQgPSBieXRlQXJyYXkucmVhZEludDMyTEUoc3RhcnQgKyA4KVxuICAgIHRoaXMuZmxhZ3MgPSAoYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHN0YXJ0ICsgMTYpICYgMHhmZmZmMDAwMCkgPj4gMTZcbiAgfVxuXG4gIGdldChmaWVsZDogc3RyaW5nKSB7XG4gICAgLy9AdHMtaWdub3JlXG4gICAgaWYgKHRoaXNbZmllbGRdKSB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGlmICh0aGlzLmRhdGFbZmllbGRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbZmllbGRdXG4gICAgICB9XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHRoaXMuZGF0YVtmaWVsZF0gPSB0aGlzW2ZpZWxkXSgpXG4gICAgICByZXR1cm4gdGhpcy5kYXRhW2ZpZWxkXVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZ2V0KGZpZWxkLnRvTG93ZXJDYXNlKCkpXG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdzdGFydCcpICsgKHRoaXMuZ2V0KCdsZW5ndGhfb25fcmVmJykgfHwgdGhpcy5nZXQoJ3NlcV9sZW5ndGgnKSB8fCB1bmRlZmluZWQpXG4gIH1cblxuICBzZXFfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZklEXG4gIH1cblxuICAvLyBzYW1lIGFzIGdldCgpLCBleGNlcHQgcmVxdWlyZXMgbG93ZXItY2FzZSBhcmd1bWVudHMuICB1c2VkXG4gIC8vIGludGVybmFsbHkgdG8gc2F2ZSBsb3RzIG9mIGNhbGxzIHRvIGZpZWxkLnRvTG93ZXJDYXNlKClcbiAgX2dldChmaWVsZDogc3RyaW5nKSB7XG4gICAgaWYgKGZpZWxkIGluIHRoaXMuZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YVtmaWVsZF1cbiAgICB9XG4gICAgdGhpcy5kYXRhW2ZpZWxkXSA9IHRoaXMuX3BhcnNlVGFnKGZpZWxkKVxuICAgIHJldHVybiB0aGlzLmRhdGFbZmllbGRdXG4gIH1cblxuICBfdGFncygpIHtcbiAgICB0aGlzLl9wYXJzZUFsbFRhZ3MoKVxuXG4gICAgbGV0IHRhZ3MgPSBbJ3NlcSddXG5cbiAgICBpZiAoIXRoaXMuaXNTZWdtZW50VW5tYXBwZWQoKSkge1xuICAgICAgdGFncy5wdXNoKFxuICAgICAgICAnc3RhcnQnLFxuICAgICAgICAnZW5kJyxcbiAgICAgICAgJ3N0cmFuZCcsXG4gICAgICAgICdzY29yZScsXG4gICAgICAgICdxdWFsJyxcbiAgICAgICAgJ01RJyxcbiAgICAgICAgJ0NJR0FSJyxcbiAgICAgICAgJ2xlbmd0aF9vbl9yZWYnLFxuICAgICAgICAndGVtcGxhdGVfbGVuZ3RoJyxcbiAgICAgIClcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNQYWlyZWQoKSkge1xuICAgICAgdGFncy5wdXNoKCduZXh0X3NlZ21lbnRfcG9zaXRpb24nLCAncGFpcl9vcmllbnRhdGlvbicpXG4gICAgfVxuICAgIHRhZ3MgPSB0YWdzLmNvbmNhdCh0aGlzLl90YWdMaXN0IHx8IFtdKVxuXG4gICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKGtbMF0gIT09ICdfJyAmJiBrICE9PSAnbmV4dF9zZXFfaWQnKSB7XG4gICAgICAgIHRhZ3MucHVzaChrKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBzZWVuOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9XG4gICAgdGFncyA9IHRhZ3MuZmlsdGVyKHQgPT4ge1xuICAgICAgaWYgKCh0IGluIHRoaXMuZGF0YSAmJiB0aGlzLmRhdGFbdF0gPT09IHVuZGVmaW5lZCkgfHwgdCA9PT0gJ0NHJyB8fCB0ID09PSAnY2cnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsdCA9IHQudG9Mb3dlckNhc2UoKVxuICAgICAgY29uc3QgcyA9IHNlZW5bbHRdXG4gICAgICBzZWVuW2x0XSA9IHRydWVcbiAgICAgIHJldHVybiAhc1xuICAgIH0pXG5cbiAgICByZXR1cm4gdGFnc1xuICB9XG5cbiAgcGFyZW50KCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGNoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLmdldCgnc3ViZmVhdHVyZXMnKVxuICB9XG5cbiAgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkXG4gIH1cblxuICAvLyBzcGVjaWFsIHBhcnNlcnNcbiAgLyoqXG4gICAqIE1hcHBpbmcgcXVhbGl0eSBzY29yZS5cbiAgICovXG4gIG1xKCkge1xuICAgIGNvbnN0IG1xID0gKHRoaXMuZ2V0KCdfYmluX21xX25sJykgJiAweGZmMDApID4+IDhcbiAgICByZXR1cm4gbXEgPT09IDI1NSA/IHVuZGVmaW5lZCA6IG1xXG4gIH1cblxuICBzY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ21xJylcbiAgfVxuXG4gIHF1YWwoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVhbFJhdygpPy5qb2luKCcgJylcbiAgfVxuXG4gIHF1YWxSYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZWdtZW50VW5tYXBwZWQoKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHsgYnl0ZUFycmF5IH0gPSB0aGlzLmJ5dGVzXG4gICAgY29uc3QgcCA9XG4gICAgICB0aGlzLmJ5dGVzLnN0YXJ0ICtcbiAgICAgIDM2ICtcbiAgICAgIHRoaXMuZ2V0KCdfbF9yZWFkX25hbWUnKSArXG4gICAgICB0aGlzLmdldCgnX25fY2lnYXJfb3AnKSAqIDQgK1xuICAgICAgdGhpcy5nZXQoJ19zZXFfYnl0ZXMnKVxuICAgIGNvbnN0IGxzZXEgPSB0aGlzLmdldCgnc2VxX2xlbmd0aCcpXG4gICAgY29uc3QgcXNlcSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsc2VxKVxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbHNlcTsgKytqKSB7XG4gICAgICBxc2VxW2pdID0gYnl0ZUFycmF5W3AgKyBqXVxuICAgIH1cbiAgICByZXR1cm4gcXNlcVxuICB9XG5cbiAgc3RyYW5kKCkge1xuICAgIHJldHVybiB0aGlzLmlzUmV2ZXJzZUNvbXBsZW1lbnRlZCgpID8gLTEgOiAxXG4gIH1cblxuICBtdWx0aV9zZWdtZW50X25leHRfc2VnbWVudF9zdHJhbmQoKSB7XG4gICAgaWYgKHRoaXMuaXNNYXRlVW5tYXBwZWQoKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pc01hdGVSZXZlcnNlQ29tcGxlbWVudGVkKCkgPyAtMSA6IDFcbiAgfVxuXG4gIG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdfcmVhZF9uYW1lJylcbiAgfVxuXG4gIF9yZWFkX25hbWUoKSB7XG4gICAgY29uc3QgbmwgPSB0aGlzLmdldCgnX2xfcmVhZF9uYW1lJylcbiAgICByZXR1cm4gdGhpcy5ieXRlcy5ieXRlQXJyYXkudG9TdHJpbmcoXG4gICAgICAnYXNjaWknLFxuICAgICAgdGhpcy5ieXRlcy5zdGFydCArIDM2LFxuICAgICAgdGhpcy5ieXRlcy5zdGFydCArIDM2ICsgbmwgLSAxLFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIGEgdGFnLCBwYXJzaW5nIHRoZSB0YWdzIGFzIGZhciBhcyBuZWNlc3NhcnkuXG4gICAqIE9ubHkgY2FsbGVkIGlmIHdlIGhhdmUgbm90IGFscmVhZHkgcGFyc2VkIHRoYXQgZmllbGQuXG4gICAqL1xuICBfcGFyc2VUYWcodGFnTmFtZT86IHN0cmluZykge1xuICAgIC8vIGlmIGFsbCBvZiB0aGUgdGFncyBoYXZlIGJlZW4gcGFyc2VkIGFuZCB3ZSdyZSBzdGlsbCBiZWluZ1xuICAgIC8vIGNhbGxlZCwgd2UgYWxyZWFkeSBrbm93IHRoYXQgd2UgaGF2ZSBubyBzdWNoIHRhZywgYmVjYXVzZVxuICAgIC8vIGl0IHdvdWxkIGFscmVhZHkgaGF2ZSBiZWVuIGNhY2hlZC5cbiAgICBpZiAodGhpcy5fYWxsVGFnc1BhcnNlZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHsgYnl0ZUFycmF5IH0gPSB0aGlzLmJ5dGVzXG4gICAgbGV0IHAgPVxuICAgICAgdGhpcy5fdGFnT2Zmc2V0IHx8XG4gICAgICB0aGlzLmJ5dGVzLnN0YXJ0ICtcbiAgICAgICAgMzYgK1xuICAgICAgICB0aGlzLmdldCgnX2xfcmVhZF9uYW1lJykgK1xuICAgICAgICB0aGlzLmdldCgnX25fY2lnYXJfb3AnKSAqIDQgK1xuICAgICAgICB0aGlzLmdldCgnX3NlcV9ieXRlcycpICtcbiAgICAgICAgdGhpcy5nZXQoJ3NlcV9sZW5ndGgnKVxuXG4gICAgY29uc3QgYmxvY2tFbmQgPSB0aGlzLmJ5dGVzLmVuZFxuICAgIGxldCBsY1RhZ1xuICAgIHdoaWxlIChwIDwgYmxvY2tFbmQgJiYgbGNUYWcgIT09IHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IHRhZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZUFycmF5W3BdLCBieXRlQXJyYXlbcCArIDFdKVxuICAgICAgbGNUYWcgPSB0YWcudG9Mb3dlckNhc2UoKVxuICAgICAgY29uc3QgdHlwZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZUFycmF5W3AgKyAyXSlcbiAgICAgIHAgKz0gM1xuXG4gICAgICBsZXQgdmFsdWVcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICB2YWx1ZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZUFycmF5W3BdKVxuICAgICAgICAgIHAgKz0gMVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2knOlxuICAgICAgICAgIHZhbHVlID0gYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHApXG4gICAgICAgICAgcCArPSA0XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnSSc6XG4gICAgICAgICAgdmFsdWUgPSBieXRlQXJyYXkucmVhZFVJbnQzMkxFKHApXG4gICAgICAgICAgcCArPSA0XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgdmFsdWUgPSBieXRlQXJyYXkucmVhZEludDgocClcbiAgICAgICAgICBwICs9IDFcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdDJzpcbiAgICAgICAgICB2YWx1ZSA9IGJ5dGVBcnJheS5yZWFkVUludDgocClcbiAgICAgICAgICBwICs9IDFcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICB2YWx1ZSA9IGJ5dGVBcnJheS5yZWFkSW50MTZMRShwKVxuICAgICAgICAgIHAgKz0gMlxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1MnOlxuICAgICAgICAgIHZhbHVlID0gYnl0ZUFycmF5LnJlYWRVSW50MTZMRShwKVxuICAgICAgICAgIHAgKz0gMlxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgIHZhbHVlID0gYnl0ZUFycmF5LnJlYWRGbG9hdExFKHApXG4gICAgICAgICAgcCArPSA0XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnWic6XG4gICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICAgIHZhbHVlID0gJydcbiAgICAgICAgICB3aGlsZSAocCA8PSBibG9ja0VuZCkge1xuICAgICAgICAgICAgY29uc3QgY2MgPSBieXRlQXJyYXlbcCsrXVxuICAgICAgICAgICAgaWYgKGNjID09PSAwKSB7XG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YWx1ZSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNjKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdCJzoge1xuICAgICAgICAgIHZhbHVlID0gJydcbiAgICAgICAgICBjb25zdCBjYyA9IGJ5dGVBcnJheVtwKytdXG4gICAgICAgICAgY29uc3QgQnR5cGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNjKVxuICAgICAgICAgIGNvbnN0IGxpbWl0ID0gYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHApXG4gICAgICAgICAgcCArPSA0XG4gICAgICAgICAgaWYgKEJ0eXBlID09PSAnaScpIHtcbiAgICAgICAgICAgIGlmICh0YWcgPT09ICdDRycpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaW1pdDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2lnb3AgPSBieXRlQXJyYXkucmVhZEludDMyTEUocClcbiAgICAgICAgICAgICAgICBjb25zdCBsb3AgPSBjaWdvcCA+PiA0XG4gICAgICAgICAgICAgICAgY29uc3Qgb3AgPSBDSUdBUl9ERUNPREVSW2NpZ29wICYgMHhmXVxuICAgICAgICAgICAgICAgIHZhbHVlICs9IGxvcCArIG9wXG4gICAgICAgICAgICAgICAgcCArPSA0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGltaXQ7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhbHVlICs9IGJ5dGVBcnJheS5yZWFkSW50MzJMRShwKVxuICAgICAgICAgICAgICAgIGlmIChrICsgMSA8IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSArPSAnLCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcCArPSA0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEJ0eXBlID09PSAnSScpIHtcbiAgICAgICAgICAgIGlmICh0YWcgPT09ICdDRycpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaW1pdDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2lnb3AgPSBieXRlQXJyYXkucmVhZFVJbnQzMkxFKHApXG4gICAgICAgICAgICAgICAgY29uc3QgbG9wID0gY2lnb3AgPj4gNFxuICAgICAgICAgICAgICAgIGNvbnN0IG9wID0gQ0lHQVJfREVDT0RFUltjaWdvcCAmIDB4Zl1cbiAgICAgICAgICAgICAgICB2YWx1ZSArPSBsb3AgKyBvcFxuICAgICAgICAgICAgICAgIHAgKz0gNFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpbWl0OyBrKyspIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSBieXRlQXJyYXkucmVhZFVJbnQzMkxFKHApXG4gICAgICAgICAgICAgICAgaWYgKGsgKyAxIDwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlICs9ICcsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwICs9IDRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoQnR5cGUgPT09ICdzJykge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaW1pdDsgaysrKSB7XG4gICAgICAgICAgICAgIHZhbHVlICs9IGJ5dGVBcnJheS5yZWFkSW50MTZMRShwKVxuICAgICAgICAgICAgICBpZiAoayArIDEgPCBsaW1pdCkge1xuICAgICAgICAgICAgICAgIHZhbHVlICs9ICcsJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHAgKz0gMlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoQnR5cGUgPT09ICdTJykge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaW1pdDsgaysrKSB7XG4gICAgICAgICAgICAgIHZhbHVlICs9IGJ5dGVBcnJheS5yZWFkVUludDE2TEUocClcbiAgICAgICAgICAgICAgaWYgKGsgKyAxIDwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAnLCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwICs9IDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEJ0eXBlID09PSAnYycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGltaXQ7IGsrKykge1xuICAgICAgICAgICAgICB2YWx1ZSArPSBieXRlQXJyYXkucmVhZEludDgocClcbiAgICAgICAgICAgICAgaWYgKGsgKyAxIDwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAnLCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwICs9IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEJ0eXBlID09PSAnQycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGltaXQ7IGsrKykge1xuICAgICAgICAgICAgICB2YWx1ZSArPSBieXRlQXJyYXkucmVhZFVJbnQ4KHApXG4gICAgICAgICAgICAgIGlmIChrICsgMSA8IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJywnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcCArPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChCdHlwZSA9PT0gJ2YnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpbWl0OyBrKyspIHtcbiAgICAgICAgICAgICAgdmFsdWUgKz0gYnl0ZUFycmF5LnJlYWRGbG9hdExFKHApXG4gICAgICAgICAgICAgIGlmIChrICsgMSA8IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJywnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcCArPSA0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLndhcm4oYFVua25vd24gQkFNIHRhZyB0eXBlICcke3R5cGV9JywgdGFncyBtYXkgYmUgaW5jb21wbGV0ZWApXG4gICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgICBwID0gYmxvY2tFbmQgLy8gc3RvcCBwYXJzaW5nIHRhZ3NcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdGFnT2Zmc2V0ID0gcFxuXG4gICAgICB0aGlzLl90YWdMaXN0LnB1c2godGFnKVxuICAgICAgaWYgKGxjVGFnID09PSB0YWdOYW1lKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfVxuXG4gICAgICB0aGlzLmRhdGFbbGNUYWddID0gdmFsdWVcbiAgICB9XG4gICAgdGhpcy5fYWxsVGFnc1BhcnNlZCA9IHRydWVcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBfcGFyc2VBbGxUYWdzKCkge1xuICAgIHRoaXMuX3BhcnNlVGFnKCcnKVxuICB9XG5cbiAgX3BhcnNlQ2lnYXIoY2lnYXI6IHN0cmluZykge1xuICAgIHJldHVybiAoXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGNpZ2FyLm1hdGNoKC9cXGQrXFxEL2cpLm1hcCgob3A6IHN0cmluZykgPT4gW29wLm1hdGNoKC9cXEQvKVswXS50b1VwcGVyQ2FzZSgpLCBwYXJzZUludChvcCwgMTApXSlcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHJlYWQgaXMgcGFpcmVkLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgYm90aCBzZWdtZW50cyBhcmUgbWFwcGVkXG4gICAqL1xuICBpc1BhaXJlZCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5mbGFncyAmIENvbnN0YW50cy5CQU1fRlBBSVJFRClcbiAgfVxuXG4gIC8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgcmVhZCBpcyBwYWlyZWQsIGFuZCBib3RoIHNlZ21lbnRzIGFyZSBtYXBwZWQgKi9cbiAgaXNQcm9wZXJseVBhaXJlZCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5mbGFncyAmIENvbnN0YW50cy5CQU1fRlBST1BFUl9QQUlSKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSByZWFkIGl0c2VsZiBpcyB1bm1hcHBlZDsgY29uZmxpY3RpdmUgd2l0aCBpc1Byb3Blcmx5UGFpcmVkICovXG4gIGlzU2VnbWVudFVubWFwcGVkKCkge1xuICAgIHJldHVybiAhISh0aGlzLmZsYWdzICYgQ29uc3RhbnRzLkJBTV9GVU5NQVApXG4gIH1cblxuICAvKiogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHJlYWQgaXRzZWxmIGlzIHVubWFwcGVkOyBjb25mbGljdGl2ZSB3aXRoIGlzUHJvcGVybHlQYWlyZWQgKi9cbiAgaXNNYXRlVW5tYXBwZWQoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuZmxhZ3MgJiBDb25zdGFudHMuQkFNX0ZNVU5NQVApXG4gIH1cblxuICAvKiogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHJlYWQgaXMgbWFwcGVkIHRvIHRoZSByZXZlcnNlIHN0cmFuZCAqL1xuICBpc1JldmVyc2VDb21wbGVtZW50ZWQoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuZmxhZ3MgJiBDb25zdGFudHMuQkFNX0ZSRVZFUlNFKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBtYXRlIGlzIG1hcHBlZCB0byB0aGUgcmV2ZXJzZSBzdHJhbmQgKi9cbiAgaXNNYXRlUmV2ZXJzZUNvbXBsZW1lbnRlZCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5mbGFncyAmIENvbnN0YW50cy5CQU1fRk1SRVZFUlNFKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoaXMgaXMgcmVhZCBudW1iZXIgMSBpbiBhIHBhaXIgKi9cbiAgaXNSZWFkMSgpIHtcbiAgICByZXR1cm4gISEodGhpcy5mbGFncyAmIENvbnN0YW50cy5CQU1fRlJFQUQxKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoaXMgaXMgcmVhZCBudW1iZXIgMiBpbiBhIHBhaXIgKi9cbiAgaXNSZWFkMigpIHtcbiAgICByZXR1cm4gISEodGhpcy5mbGFncyAmIENvbnN0YW50cy5CQU1fRlJFQUQyKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoaXMgaXMgYSBzZWNvbmRhcnkgYWxpZ25tZW50ICovXG4gIGlzU2Vjb25kYXJ5KCkge1xuICAgIHJldHVybiAhISh0aGlzLmZsYWdzICYgQ29uc3RhbnRzLkJBTV9GU0VDT05EQVJZKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoaXMgcmVhZCBoYXMgZmFpbGVkIFFDIGNoZWNrcyAqL1xuICBpc0ZhaWxlZFFjKCkge1xuICAgIHJldHVybiAhISh0aGlzLmZsYWdzICYgQ29uc3RhbnRzLkJBTV9GUUNGQUlMKVxuICB9XG5cbiAgLyoqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSByZWFkIGlzIGFuIG9wdGljYWwgb3IgUENSIGR1cGxpY2F0ZSAqL1xuICBpc0R1cGxpY2F0ZSgpIHtcbiAgICByZXR1cm4gISEodGhpcy5mbGFncyAmIENvbnN0YW50cy5CQU1fRkRVUClcbiAgfVxuXG4gIC8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGlzIGEgc3VwcGxlbWVudGFyeSBhbGlnbm1lbnQgKi9cbiAgaXNTdXBwbGVtZW50YXJ5KCkge1xuICAgIHJldHVybiAhISh0aGlzLmZsYWdzICYgQ29uc3RhbnRzLkJBTV9GU1VQUExFTUVOVEFSWSlcbiAgfVxuXG4gIGNpZ2FyKCkge1xuICAgIGlmICh0aGlzLmlzU2VnbWVudFVubWFwcGVkKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBjb25zdCB7IGJ5dGVBcnJheSwgc3RhcnQgfSA9IHRoaXMuYnl0ZXNcbiAgICBjb25zdCBudW1DaWdhck9wcyA9IHRoaXMuZ2V0KCdfbl9jaWdhcl9vcCcpXG4gICAgbGV0IHAgPSBzdGFydCArIDM2ICsgdGhpcy5nZXQoJ19sX3JlYWRfbmFtZScpXG4gICAgY29uc3Qgc2VxTGVuID0gdGhpcy5nZXQoJ3NlcV9sZW5ndGgnKVxuICAgIGxldCBjaWdhciA9ICcnXG4gICAgbGV0IGxyZWYgPSAwXG5cbiAgICAvLyBjaGVjayBmb3IgQ0cgdGFnIGJ5IGluc3BlY3Rpbmcgd2hldGhlciB0aGUgQ0lHQVIgZmllbGRcbiAgICAvLyBjb250YWlucyBhIGNsaXAgdGhhdCBjb25zdW1lcyBlbnRpcmUgc2VxTGVuXG4gICAgbGV0IGNpZ29wID0gYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHApXG4gICAgbGV0IGxvcCA9IGNpZ29wID4+IDRcbiAgICBsZXQgb3AgPSBDSUdBUl9ERUNPREVSW2NpZ29wICYgMHhmXVxuICAgIGlmIChvcCA9PT0gJ1MnICYmIGxvcCA9PT0gc2VxTGVuKSB7XG4gICAgICAvLyBpZiB0aGVyZSBpcyBhIENHIHRoZSBzZWNvbmQgQ0lHQVIgZmllbGQgd2lsbFxuICAgICAgLy8gYmUgYSBOIHRhZyB0aGUgcmVwcmVzZW50cyB0aGUgbGVuZ3RoIG9uIHJlZlxuICAgICAgcCArPSA0XG4gICAgICBjaWdvcCA9IGJ5dGVBcnJheS5yZWFkSW50MzJMRShwKVxuICAgICAgbG9wID0gY2lnb3AgPj4gNFxuICAgICAgb3AgPSBDSUdBUl9ERUNPREVSW2NpZ29wICYgMHhmXVxuICAgICAgaWYgKG9wICE9PSAnTicpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDRyB0YWcgd2l0aCBubyBOIHRhZycpXG4gICAgICB9XG4gICAgICB0aGlzLmRhdGEubGVuZ3RoX29uX3JlZiA9IGxvcFxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdDRycpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgbnVtQ2lnYXJPcHM7ICsrYykge1xuICAgICAgICBjaWdvcCA9IGJ5dGVBcnJheS5yZWFkSW50MzJMRShwKVxuICAgICAgICBsb3AgPSBjaWdvcCA+PiA0XG4gICAgICAgIG9wID0gQ0lHQVJfREVDT0RFUltjaWdvcCAmIDB4Zl1cbiAgICAgICAgY2lnYXIgKz0gbG9wICsgb3BcblxuICAgICAgICAvLyBzb2Z0IGNsaXAsIGhhcmQgY2xpcCwgYW5kIGluc2VydGlvbiBkb24ndCBjb3VudCB0b3dhcmRcbiAgICAgICAgLy8gdGhlIGxlbmd0aCBvbiB0aGUgcmVmZXJlbmNlXG4gICAgICAgIGlmIChvcCAhPT0gJ0gnICYmIG9wICE9PSAnUycgJiYgb3AgIT09ICdJJykge1xuICAgICAgICAgIGxyZWYgKz0gbG9wXG4gICAgICAgIH1cblxuICAgICAgICBwICs9IDRcbiAgICAgIH1cblxuICAgICAgdGhpcy5kYXRhLmxlbmd0aF9vbl9yZWYgPSBscmVmXG4gICAgICByZXR1cm4gY2lnYXJcbiAgICB9XG4gIH1cblxuICBfZmxhZ3MoKSB7fVxuXG4gIGxlbmd0aF9vbl9yZWYoKSB7XG4gICAgdGhpcy5nZXQoJ2NpZ2FyJykgLy8gdGhlIGxlbmd0aF9vbl9yZWYgaXMgc2V0IGFzIGFcbiAgICAvLyBzaWRlIGVmZmVjdCBvZiB0aGUgQ0lHQVIgcGFyc2luZ1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoX29uX3JlZlxuICB9XG5cbiAgX25fY2lnYXJfb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdfZmxhZ19uYycpICYgMHhmZmZmXG4gIH1cblxuICBfbF9yZWFkX25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdfYmluX21xX25sJykgJiAweGZmXG4gIH1cblxuICAvKipcbiAgICogbnVtYmVyIG9mIGJ5dGVzIGluIHRoZSBzZXF1ZW5jZSBmaWVsZFxuICAgKi9cbiAgX3NlcV9ieXRlcygpIHtcbiAgICByZXR1cm4gKHRoaXMuZ2V0KCdzZXFfbGVuZ3RoJykgKyAxKSA+PiAxXG4gIH1cblxuICBnZXRSZWFkQmFzZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VxKClcbiAgfVxuXG4gIHNlcSgpIHtcbiAgICBjb25zdCB7IGJ5dGVBcnJheSB9ID0gdGhpcy5ieXRlc1xuICAgIGNvbnN0IHAgPSB0aGlzLmJ5dGVzLnN0YXJ0ICsgMzYgKyB0aGlzLmdldCgnX2xfcmVhZF9uYW1lJykgKyB0aGlzLmdldCgnX25fY2lnYXJfb3AnKSAqIDRcbiAgICBjb25zdCBzZXFCeXRlcyA9IHRoaXMuZ2V0KCdfc2VxX2J5dGVzJylcbiAgICBjb25zdCBsZW4gPSB0aGlzLmdldCgnc2VxX2xlbmd0aCcpXG4gICAgbGV0IGJ1ZiA9ICcnXG4gICAgbGV0IGkgPSAwXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZXFCeXRlczsgKytqKSB7XG4gICAgICBjb25zdCBzYiA9IGJ5dGVBcnJheVtwICsgal1cbiAgICAgIGJ1ZiArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKFNFUVJFVF9ERUNPREVSWyhzYiAmIDB4ZjApID4+IDRdKVxuICAgICAgaSsrXG4gICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICBidWYgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShTRVFSRVRfREVDT0RFUltzYiAmIDB4MGZdKVxuICAgICAgICBpKytcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgLy8gYWRhcHRlZCBmcm9tIGlndi5qc1xuICBnZXRQYWlyT3JpZW50YXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLmlzU2VnbWVudFVubWFwcGVkKCkgJiYgIXRoaXMuaXNNYXRlVW5tYXBwZWQoKSAmJiB0aGlzLl9yZWZJRCA9PT0gdGhpcy5fbmV4dF9yZWZpZCgpKSB7XG4gICAgICBjb25zdCBzMSA9IHRoaXMuaXNSZXZlcnNlQ29tcGxlbWVudGVkKCkgPyAnUicgOiAnRidcbiAgICAgIGNvbnN0IHMyID0gdGhpcy5pc01hdGVSZXZlcnNlQ29tcGxlbWVudGVkKCkgPyAnUicgOiAnRidcbiAgICAgIGxldCBvMSA9ICcgJ1xuICAgICAgbGV0IG8yID0gJyAnXG4gICAgICBpZiAodGhpcy5pc1JlYWQxKCkpIHtcbiAgICAgICAgbzEgPSAnMSdcbiAgICAgICAgbzIgPSAnMidcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1JlYWQyKCkpIHtcbiAgICAgICAgbzEgPSAnMidcbiAgICAgICAgbzIgPSAnMSdcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG1wID0gW11cbiAgICAgIGNvbnN0IGlzaXplID0gdGhpcy50ZW1wbGF0ZV9sZW5ndGgoKVxuICAgICAgaWYgKGlzaXplID4gMCkge1xuICAgICAgICB0bXBbMF0gPSBzMVxuICAgICAgICB0bXBbMV0gPSBvMVxuICAgICAgICB0bXBbMl0gPSBzMlxuICAgICAgICB0bXBbM10gPSBvMlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wWzJdID0gczFcbiAgICAgICAgdG1wWzNdID0gbzFcbiAgICAgICAgdG1wWzBdID0gczJcbiAgICAgICAgdG1wWzFdID0gbzJcbiAgICAgIH1cbiAgICAgIHJldHVybiB0bXAuam9pbignJylcbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIF9iaW5fbXFfbmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnl0ZXMuYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHRoaXMuYnl0ZXMuc3RhcnQgKyAxMilcbiAgfVxuXG4gIF9mbGFnX25jKCkge1xuICAgIHJldHVybiB0aGlzLmJ5dGVzLmJ5dGVBcnJheS5yZWFkSW50MzJMRSh0aGlzLmJ5dGVzLnN0YXJ0ICsgMTYpXG4gIH1cblxuICBzZXFfbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmJ5dGVzLmJ5dGVBcnJheS5yZWFkSW50MzJMRSh0aGlzLmJ5dGVzLnN0YXJ0ICsgMjApXG4gIH1cblxuICBfbmV4dF9yZWZpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5ieXRlcy5ieXRlQXJyYXkucmVhZEludDMyTEUodGhpcy5ieXRlcy5zdGFydCArIDI0KVxuICB9XG5cbiAgX25leHRfcG9zKCkge1xuICAgIHJldHVybiB0aGlzLmJ5dGVzLmJ5dGVBcnJheS5yZWFkSW50MzJMRSh0aGlzLmJ5dGVzLnN0YXJ0ICsgMjgpXG4gIH1cblxuICB0ZW1wbGF0ZV9sZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnl0ZXMuYnl0ZUFycmF5LnJlYWRJbnQzMkxFKHRoaXMuYnl0ZXMuc3RhcnQgKyAzMilcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICBjb25zdCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge31cbiAgICBPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKGsuY2hhckF0KDApID09PSAnXycgfHwgayA9PT0gJ2J5dGVzJykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZGF0YVtrXSA9IHRoaXNba11cbiAgICB9KVxuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxufVxuIl19