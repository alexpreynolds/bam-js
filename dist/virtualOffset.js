"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.fromBytes = fromBytes;
exports.default = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var VirtualOffset = /*#__PURE__*/function () {
  function VirtualOffset(blockPosition, dataPosition) {
    (0, _classCallCheck2.default)(this, VirtualOffset);
    (0, _defineProperty2.default)(this, "blockPosition", void 0);
    (0, _defineProperty2.default)(this, "dataPosition", void 0);
    this.blockPosition = blockPosition; // < offset of the compressed data block

    this.dataPosition = dataPosition; // < offset into the uncompressed data
  }

  (0, _createClass2.default)(VirtualOffset, [{
    key: "toString",
    value: function toString() {
      var _context;

      return (0, _concat.default)(_context = "".concat(this.blockPosition, ":")).call(_context, this.dataPosition);
    }
  }, {
    key: "compareTo",
    value: function compareTo(b) {
      return this.blockPosition - b.blockPosition || this.dataPosition - b.dataPosition;
    }
  }], [{
    key: "min",
    value: function min() {
      var min;
      var i = 0;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      for (; !min; i += 1) {
        min = args[i];
      }

      for (; i < args.length; i += 1) {
        if (min.compareTo(args[i]) > 0) {
          min = args[i];
        }
      }

      return min;
    }
  }]);
  return VirtualOffset;
}();

exports.default = VirtualOffset;

function fromBytes(bytes) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var bigendian = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (bigendian) {
    throw new Error('big-endian virtual file offsets not implemented');
  }

  return new VirtualOffset(bytes[offset + 7] * 0x10000000000 + bytes[offset + 6] * 0x100000000 + bytes[offset + 5] * 0x1000000 + bytes[offset + 4] * 0x10000 + bytes[offset + 3] * 0x100 + bytes[offset + 2], bytes[offset + 1] << 8 | bytes[offset]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy92aXJ0dWFsT2Zmc2V0LnRzIl0sIm5hbWVzIjpbIlZpcnR1YWxPZmZzZXQiLCJibG9ja1Bvc2l0aW9uIiwiZGF0YVBvc2l0aW9uIiwiYiIsIm1pbiIsImkiLCJhcmdzIiwibGVuZ3RoIiwiY29tcGFyZVRvIiwiZnJvbUJ5dGVzIiwiYnl0ZXMiLCJvZmZzZXQiLCJiaWdlbmRpYW4iLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQXFCQSxhO0FBR25CLHlCQUFZQyxhQUFaLEVBQW1DQyxZQUFuQyxFQUF5RDtBQUFBO0FBQUE7QUFBQTtBQUN2RCxTQUFLRCxhQUFMLEdBQXFCQSxhQUFyQixDQUR1RCxDQUNwQjs7QUFDbkMsU0FBS0MsWUFBTCxHQUFvQkEsWUFBcEIsQ0FGdUQsQ0FFdEI7QUFDbEM7Ozs7K0JBRVU7QUFBQTs7QUFDVCx1REFBVSxLQUFLRCxhQUFmLHVCQUFnQyxLQUFLQyxZQUFyQztBQUNEOzs7OEJBRVNDLEMsRUFBa0I7QUFDMUIsYUFBTyxLQUFLRixhQUFMLEdBQXFCRSxDQUFDLENBQUNGLGFBQXZCLElBQXdDLEtBQUtDLFlBQUwsR0FBb0JDLENBQUMsQ0FBQ0QsWUFBckU7QUFDRDs7OzBCQUVvQztBQUNuQyxVQUFJRSxHQUFKO0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLENBQVI7O0FBRm1DLHdDQUF2QkMsSUFBdUI7QUFBdkJBLFFBQUFBLElBQXVCO0FBQUE7O0FBR25DLGFBQU8sQ0FBQ0YsR0FBUixFQUFhQyxDQUFDLElBQUksQ0FBbEIsRUFBcUI7QUFDbkJELFFBQUFBLEdBQUcsR0FBR0UsSUFBSSxDQUFDRCxDQUFELENBQVY7QUFDRDs7QUFDRCxhQUFPQSxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsTUFBaEIsRUFBd0JGLENBQUMsSUFBSSxDQUE3QixFQUFnQztBQUM5QixZQUFJRCxHQUFHLENBQUNJLFNBQUosQ0FBY0YsSUFBSSxDQUFDRCxDQUFELENBQWxCLElBQXlCLENBQTdCLEVBQWdDO0FBQzlCRCxVQUFBQSxHQUFHLEdBQUdFLElBQUksQ0FBQ0QsQ0FBRCxDQUFWO0FBQ0Q7QUFDRjs7QUFDRCxhQUFPRCxHQUFQO0FBQ0Q7Ozs7Ozs7QUFFSSxTQUFTSyxTQUFULENBQW1CQyxLQUFuQixFQUFpRTtBQUFBLE1BQS9CQyxNQUErQix1RUFBdEIsQ0FBc0I7QUFBQSxNQUFuQkMsU0FBbUIsdUVBQVAsS0FBTzs7QUFDdEUsTUFBSUEsU0FBSixFQUFlO0FBQ2IsVUFBTSxJQUFJQyxLQUFKLENBQVUsaURBQVYsQ0FBTjtBQUNEOztBQUVELFNBQU8sSUFBSWIsYUFBSixDQUNMVSxLQUFLLENBQUNDLE1BQU0sR0FBRyxDQUFWLENBQUwsR0FBb0IsYUFBcEIsR0FDRUQsS0FBSyxDQUFDQyxNQUFNLEdBQUcsQ0FBVixDQUFMLEdBQW9CLFdBRHRCLEdBRUVELEtBQUssQ0FBQ0MsTUFBTSxHQUFHLENBQVYsQ0FBTCxHQUFvQixTQUZ0QixHQUdFRCxLQUFLLENBQUNDLE1BQU0sR0FBRyxDQUFWLENBQUwsR0FBb0IsT0FIdEIsR0FJRUQsS0FBSyxDQUFDQyxNQUFNLEdBQUcsQ0FBVixDQUFMLEdBQW9CLEtBSnRCLEdBS0VELEtBQUssQ0FBQ0MsTUFBTSxHQUFHLENBQVYsQ0FORixFQU9KRCxLQUFLLENBQUNDLE1BQU0sR0FBRyxDQUFWLENBQUwsSUFBcUIsQ0FBdEIsR0FBMkJELEtBQUssQ0FBQ0MsTUFBRCxDQVAzQixDQUFQO0FBU0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBWaXJ0dWFsT2Zmc2V0IHtcbiAgcHVibGljIGJsb2NrUG9zaXRpb246IG51bWJlclxuICBwdWJsaWMgZGF0YVBvc2l0aW9uOiBudW1iZXJcbiAgY29uc3RydWN0b3IoYmxvY2tQb3NpdGlvbjogbnVtYmVyLCBkYXRhUG9zaXRpb246IG51bWJlcikge1xuICAgIHRoaXMuYmxvY2tQb3NpdGlvbiA9IGJsb2NrUG9zaXRpb24gLy8gPCBvZmZzZXQgb2YgdGhlIGNvbXByZXNzZWQgZGF0YSBibG9ja1xuICAgIHRoaXMuZGF0YVBvc2l0aW9uID0gZGF0YVBvc2l0aW9uIC8vIDwgb2Zmc2V0IGludG8gdGhlIHVuY29tcHJlc3NlZCBkYXRhXG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ibG9ja1Bvc2l0aW9ufToke3RoaXMuZGF0YVBvc2l0aW9ufWBcbiAgfVxuXG4gIGNvbXBhcmVUbyhiOiBWaXJ0dWFsT2Zmc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tQb3NpdGlvbiAtIGIuYmxvY2tQb3NpdGlvbiB8fCB0aGlzLmRhdGFQb3NpdGlvbiAtIGIuZGF0YVBvc2l0aW9uXG4gIH1cblxuICBzdGF0aWMgbWluKC4uLmFyZ3M6IFZpcnR1YWxPZmZzZXRbXSkge1xuICAgIGxldCBtaW5cbiAgICBsZXQgaSA9IDBcbiAgICBmb3IgKDsgIW1pbjsgaSArPSAxKSB7XG4gICAgICBtaW4gPSBhcmdzW2ldXG4gICAgfVxuICAgIGZvciAoOyBpIDwgYXJncy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG1pbi5jb21wYXJlVG8oYXJnc1tpXSkgPiAwKSB7XG4gICAgICAgIG1pbiA9IGFyZ3NbaV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1pblxuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVzKGJ5dGVzOiBCdWZmZXIsIG9mZnNldCA9IDAsIGJpZ2VuZGlhbiA9IGZhbHNlKSB7XG4gIGlmIChiaWdlbmRpYW4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JpZy1lbmRpYW4gdmlydHVhbCBmaWxlIG9mZnNldHMgbm90IGltcGxlbWVudGVkJylcbiAgfVxuXG4gIHJldHVybiBuZXcgVmlydHVhbE9mZnNldChcbiAgICBieXRlc1tvZmZzZXQgKyA3XSAqIDB4MTAwMDAwMDAwMDAgK1xuICAgICAgYnl0ZXNbb2Zmc2V0ICsgNl0gKiAweDEwMDAwMDAwMCArXG4gICAgICBieXRlc1tvZmZzZXQgKyA1XSAqIDB4MTAwMDAwMCArXG4gICAgICBieXRlc1tvZmZzZXQgKyA0XSAqIDB4MTAwMDAgK1xuICAgICAgYnl0ZXNbb2Zmc2V0ICsgM10gKiAweDEwMCArXG4gICAgICBieXRlc1tvZmZzZXQgKyAyXSxcbiAgICAoYnl0ZXNbb2Zmc2V0ICsgMV0gPDwgOCkgfCBieXRlc1tvZmZzZXRdLFxuICApXG59XG4iXX0=