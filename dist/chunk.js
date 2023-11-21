"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

// little class representing a chunk in the index
var Chunk = /*#__PURE__*/function () {
  /**
   * @param {VirtualOffset} minv
   * @param {VirtualOffset} maxv
   * @param {number} bin
   * @param {number} [fetchedSize]
   */
  function Chunk(minv, maxv, bin) {
    var fetchedSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    (0, _classCallCheck2.default)(this, Chunk);
    (0, _defineProperty2.default)(this, "minv", void 0);
    (0, _defineProperty2.default)(this, "maxv", void 0);
    (0, _defineProperty2.default)(this, "bin", void 0);
    (0, _defineProperty2.default)(this, "_fetchedSize", void 0);
    this.minv = minv;
    this.maxv = maxv;
    this.bin = bin;
    this._fetchedSize = fetchedSize;
  }

  (0, _createClass2.default)(Chunk, [{
    key: "toUniqueString",
    value: function toUniqueString() {
      var _context, _context2, _context3;

      return (0, _concat.default)(_context = (0, _concat.default)(_context2 = (0, _concat.default)(_context3 = "".concat(this.minv, "..")).call(_context3, this.maxv, " (bin ")).call(_context2, this.bin, ", fetchedSize ")).call(_context, this.fetchedSize(), ")");
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.toUniqueString();
    }
  }, {
    key: "compareTo",
    value: function compareTo(b) {
      return this.minv.compareTo(b.minv) || this.maxv.compareTo(b.maxv) || this.bin - b.bin;
    }
  }, {
    key: "fetchedSize",
    value: function fetchedSize() {
      if (this._fetchedSize !== undefined) {
        return this._fetchedSize;
      }

      return this.maxv.blockPosition + (1 << 16) - this.minv.blockPosition;
    }
  }]);
  return Chunk;
}();

exports.default = Chunk;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jaHVuay50cyJdLCJuYW1lcyI6WyJDaHVuayIsIm1pbnYiLCJtYXh2IiwiYmluIiwiZmV0Y2hlZFNpemUiLCJ1bmRlZmluZWQiLCJfZmV0Y2hlZFNpemUiLCJ0b1VuaXF1ZVN0cmluZyIsImIiLCJjb21wYXJlVG8iLCJibG9ja1Bvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ3FCQSxLO0FBTW5COzs7Ozs7QUFNQSxpQkFBWUMsSUFBWixFQUFpQ0MsSUFBakMsRUFBc0RDLEdBQXRELEVBQTRGO0FBQUEsUUFBekJDLFdBQXlCLHVFQUFYQyxTQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMxRixTQUFLSixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxHQUFMLEdBQVdBLEdBQVg7QUFDQSxTQUFLRyxZQUFMLEdBQW9CRixXQUFwQjtBQUNEOzs7O3FDQUVnQjtBQUFBOztBQUNmLHlIQUFVLEtBQUtILElBQWYseUJBQXdCLEtBQUtDLElBQTdCLDZCQUEwQyxLQUFLQyxHQUEvQyxvQ0FBbUUsS0FBS0MsV0FBTCxFQUFuRTtBQUNEOzs7K0JBRVU7QUFDVCxhQUFPLEtBQUtHLGNBQUwsRUFBUDtBQUNEOzs7OEJBRVNDLEMsRUFBVTtBQUNsQixhQUFPLEtBQUtQLElBQUwsQ0FBVVEsU0FBVixDQUFvQkQsQ0FBQyxDQUFDUCxJQUF0QixLQUErQixLQUFLQyxJQUFMLENBQVVPLFNBQVYsQ0FBb0JELENBQUMsQ0FBQ04sSUFBdEIsQ0FBL0IsSUFBOEQsS0FBS0MsR0FBTCxHQUFXSyxDQUFDLENBQUNMLEdBQWxGO0FBQ0Q7OztrQ0FFYTtBQUNaLFVBQUksS0FBS0csWUFBTCxLQUFzQkQsU0FBMUIsRUFBcUM7QUFDbkMsZUFBTyxLQUFLQyxZQUFaO0FBQ0Q7O0FBQ0QsYUFBTyxLQUFLSixJQUFMLENBQVVRLGFBQVYsSUFBMkIsS0FBSyxFQUFoQyxJQUFzQyxLQUFLVCxJQUFMLENBQVVTLGFBQXZEO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlydHVhbE9mZnNldCBmcm9tICcuL3ZpcnR1YWxPZmZzZXQnXG5cbi8vIGxpdHRsZSBjbGFzcyByZXByZXNlbnRpbmcgYSBjaHVuayBpbiB0aGUgaW5kZXhcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENodW5rIHtcbiAgcHVibGljIG1pbnY6IFZpcnR1YWxPZmZzZXRcbiAgcHVibGljIG1heHY6IFZpcnR1YWxPZmZzZXRcbiAgcHVibGljIGJpbjogbnVtYmVyXG4gIHB1YmxpYyBfZmV0Y2hlZFNpemU/OiBudW1iZXJcblxuICAvKipcbiAgICogQHBhcmFtIHtWaXJ0dWFsT2Zmc2V0fSBtaW52XG4gICAqIEBwYXJhbSB7VmlydHVhbE9mZnNldH0gbWF4dlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmluXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZmV0Y2hlZFNpemVdXG4gICAqL1xuICBjb25zdHJ1Y3RvcihtaW52OiBWaXJ0dWFsT2Zmc2V0LCBtYXh2OiBWaXJ0dWFsT2Zmc2V0LCBiaW46IG51bWJlciwgZmV0Y2hlZFNpemUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm1pbnYgPSBtaW52XG4gICAgdGhpcy5tYXh2ID0gbWF4dlxuICAgIHRoaXMuYmluID0gYmluXG4gICAgdGhpcy5fZmV0Y2hlZFNpemUgPSBmZXRjaGVkU2l6ZVxuICB9XG5cbiAgdG9VbmlxdWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMubWludn0uLiR7dGhpcy5tYXh2fSAoYmluICR7dGhpcy5iaW59LCBmZXRjaGVkU2l6ZSAke3RoaXMuZmV0Y2hlZFNpemUoKX0pYFxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9VbmlxdWVTdHJpbmcoKVxuICB9XG5cbiAgY29tcGFyZVRvKGI6IENodW5rKSB7XG4gICAgcmV0dXJuIHRoaXMubWludi5jb21wYXJlVG8oYi5taW52KSB8fCB0aGlzLm1heHYuY29tcGFyZVRvKGIubWF4dikgfHwgdGhpcy5iaW4gLSBiLmJpblxuICB9XG5cbiAgZmV0Y2hlZFNpemUoKSB7XG4gICAgaWYgKHRoaXMuX2ZldGNoZWRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9mZXRjaGVkU2l6ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tYXh2LmJsb2NrUG9zaXRpb24gKyAoMSA8PCAxNikgLSB0aGlzLm1pbnYuYmxvY2tQb3NpdGlvblxuICB9XG59XG4iXX0=