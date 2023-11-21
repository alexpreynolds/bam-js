"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.timeout = timeout;
exports.longToNumber = longToNumber;
exports.checkAbortSignal = checkAbortSignal;
exports.abortBreakPoint = abortBreakPoint;
exports.canMergeBlocks = canMergeBlocks;
exports.makeOpts = makeOpts;
exports.optimizeChunks = optimizeChunks;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _minSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/min-safe-integer"));

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

function timeout(ms) {
  return new _promise.default(function (resolve) {
    return (0, _setTimeout2.default)(resolve, ms);
  });
}

function longToNumber(long) {
  if (long.greaterThan(_maxSafeInteger.default) || long.lessThan(_minSafeInteger.default)) {
    throw new Error('integer overflow');
  }

  return long.toNumber();
}
/**
 * Properly check if the given AbortSignal is aborted.
 * Per the standard, if the signal reads as aborted,
 * this function throws either a DOMException AbortError, or a regular error
 * with a `code` attribute set to `ERR_ABORTED`.
 *
 * For convenience, passing `undefined` is a no-op
 *
 * @param {AbortSignal} [signal] an AbortSignal, or anything with an `aborted` attribute
 * @returns nothing
 */


function checkAbortSignal(signal) {
  if (!signal) {
    return;
  }

  if (signal.aborted) {
    // console.log('bam aborted!')
    if (typeof DOMException !== 'undefined') {
      throw new DOMException('aborted', 'AbortError');
    } else {
      var e = new Error('aborted'); //@ts-ignore

      e.code = 'ERR_ABORTED';
      throw e;
    }
  }
}
/**
 * Skips to the next tick, then runs `checkAbortSignal`.
 * Await this to inside an otherwise synchronous loop to
 * provide a place to break when an abort signal is received.
 * @param {AbortSignal} signal
 */


function abortBreakPoint(_x) {
  return _abortBreakPoint.apply(this, arguments);
}

function _abortBreakPoint() {
  _abortBreakPoint = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(signal) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _promise.default.resolve();

          case 2:
            checkAbortSignal(signal);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _abortBreakPoint.apply(this, arguments);
}

function canMergeBlocks(chunk1, chunk2) {
  return chunk2.minv.blockPosition - chunk1.maxv.blockPosition < 65000 && chunk2.maxv.blockPosition - chunk1.minv.blockPosition < 5000000;
}

function makeOpts() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return 'aborted' in obj ? {
    signal: obj
  } : obj;
}

function optimizeChunks(chunks, lowest) {
  var mergedChunks = [];
  var lastChunk = null;

  if (chunks.length === 0) {
    return chunks;
  }

  (0, _sort.default)(chunks).call(chunks, function (c0, c1) {
    var dif = c0.minv.blockPosition - c1.minv.blockPosition;

    if (dif !== 0) {
      return dif;
    } else {
      return c0.minv.dataPosition - c1.minv.dataPosition;
    }
  });
  (0, _forEach.default)(chunks).call(chunks, function (chunk) {
    if (!lowest || chunk.maxv.compareTo(lowest) > 0) {
      if (lastChunk === null) {
        mergedChunks.push(chunk);
        lastChunk = chunk;
      } else {
        if (canMergeBlocks(lastChunk, chunk)) {
          if (chunk.maxv.compareTo(lastChunk.maxv) > 0) {
            lastChunk.maxv = chunk.maxv;
          }
        } else {
          mergedChunks.push(chunk);
          lastChunk = chunk;
        }
      }
    }
  });
  return mergedChunks;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbInRpbWVvdXQiLCJtcyIsInJlc29sdmUiLCJsb25nVG9OdW1iZXIiLCJsb25nIiwiZ3JlYXRlclRoYW4iLCJsZXNzVGhhbiIsIkVycm9yIiwidG9OdW1iZXIiLCJjaGVja0Fib3J0U2lnbmFsIiwic2lnbmFsIiwiYWJvcnRlZCIsIkRPTUV4Y2VwdGlvbiIsImUiLCJjb2RlIiwiYWJvcnRCcmVha1BvaW50IiwiY2FuTWVyZ2VCbG9ja3MiLCJjaHVuazEiLCJjaHVuazIiLCJtaW52IiwiYmxvY2tQb3NpdGlvbiIsIm1heHYiLCJtYWtlT3B0cyIsIm9iaiIsIm9wdGltaXplQ2h1bmtzIiwiY2h1bmtzIiwibG93ZXN0IiwibWVyZ2VkQ2h1bmtzIiwibGFzdENodW5rIiwibGVuZ3RoIiwiYzAiLCJjMSIsImRpZiIsImRhdGFQb3NpdGlvbiIsImNodW5rIiwiY29tcGFyZVRvIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdPLFNBQVNBLE9BQVQsQ0FBaUJDLEVBQWpCLEVBQTZCO0FBQ2xDLFNBQU8scUJBQVksVUFBQUMsT0FBTztBQUFBLFdBQUksMEJBQVdBLE9BQVgsRUFBb0JELEVBQXBCLENBQUo7QUFBQSxHQUFuQixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0UsWUFBVCxDQUFzQkMsSUFBdEIsRUFBa0M7QUFDdkMsTUFBSUEsSUFBSSxDQUFDQyxXQUFMLDZCQUE2Q0QsSUFBSSxDQUFDRSxRQUFMLHlCQUFqRCxFQUF5RjtBQUN2RixVQUFNLElBQUlDLEtBQUosQ0FBVSxrQkFBVixDQUFOO0FBQ0Q7O0FBQ0QsU0FBT0gsSUFBSSxDQUFDSSxRQUFMLEVBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7O0FBV08sU0FBU0MsZ0JBQVQsQ0FBMEJDLE1BQTFCLEVBQWdEO0FBQ3JELE1BQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1g7QUFDRDs7QUFFRCxNQUFJQSxNQUFNLENBQUND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RDtBQUNGO0FBQ0Y7QUFDRixHQWhCSyxDQUFOO0FBa0JBLFNBQU9QLFlBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDaHVuayBmcm9tICcuL2NodW5rJ1xuaW1wb3J0IFZpcnR1YWxPZmZzZXQgZnJvbSAnLi92aXJ0dWFsT2Zmc2V0J1xuXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dChtczogbnVtYmVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9uZ1RvTnVtYmVyKGxvbmc6IExvbmcpIHtcbiAgaWYgKGxvbmcuZ3JlYXRlclRoYW4oTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHx8IGxvbmcubGVzc1RoYW4oTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnRlZ2VyIG92ZXJmbG93JylcbiAgfVxuICByZXR1cm4gbG9uZy50b051bWJlcigpXG59XG5cbi8qKlxuICogUHJvcGVybHkgY2hlY2sgaWYgdGhlIGdpdmVuIEFib3J0U2lnbmFsIGlzIGFib3J0ZWQuXG4gKiBQZXIgdGhlIHN0YW5kYXJkLCBpZiB0aGUgc2lnbmFsIHJlYWRzIGFzIGFib3J0ZWQsXG4gKiB0aGlzIGZ1bmN0aW9uIHRocm93cyBlaXRoZXIgYSBET01FeGNlcHRpb24gQWJvcnRFcnJvciwgb3IgYSByZWd1bGFyIGVycm9yXG4gKiB3aXRoIGEgYGNvZGVgIGF0dHJpYnV0ZSBzZXQgdG8gYEVSUl9BQk9SVEVEYC5cbiAqXG4gKiBGb3IgY29udmVuaWVuY2UsIHBhc3NpbmcgYHVuZGVmaW5lZGAgaXMgYSBuby1vcFxuICpcbiAqIEBwYXJhbSB7QWJvcnRTaWduYWx9IFtzaWduYWxdIGFuIEFib3J0U2lnbmFsLCBvciBhbnl0aGluZyB3aXRoIGFuIGBhYm9ydGVkYCBhdHRyaWJ1dGVcbiAqIEByZXR1cm5zIG5vdGhpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQWJvcnRTaWduYWwoc2lnbmFsPzogQWJvcnRTaWduYWwpIHtcbiAgaWYgKCFzaWduYWwpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdiYW0gYWJvcnRlZCEnKVxuICAgIGlmICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IERPTUV4Y2VwdGlvbignYWJvcnRlZCcsICdBYm9ydEVycm9yJylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZSA9IG5ldyBFcnJvcignYWJvcnRlZCcpXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGUuY29kZSA9ICdFUlJfQUJPUlRFRCdcbiAgICAgIHRocm93IGVcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTa2lwcyB0byB0aGUgbmV4dCB0aWNrLCB0aGVuIHJ1bnMgYGNoZWNrQWJvcnRTaWduYWxgLlxuICogQXdhaXQgdGhpcyB0byBpbnNpZGUgYW4gb3RoZXJ3aXNlIHN5bmNocm9ub3VzIGxvb3AgdG9cbiAqIHByb3ZpZGUgYSBwbGFjZSB0byBicmVhayB3aGVuIGFuIGFib3J0IHNpZ25hbCBpcyByZWNlaXZlZC5cbiAqIEBwYXJhbSB7QWJvcnRTaWduYWx9IHNpZ25hbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWJvcnRCcmVha1BvaW50KHNpZ25hbD86IEFib3J0U2lnbmFsKSB7XG4gIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpXG4gIGNoZWNrQWJvcnRTaWduYWwoc2lnbmFsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuTWVyZ2VCbG9ja3MoY2h1bmsxOiBDaHVuaywgY2h1bmsyOiBDaHVuaykge1xuICByZXR1cm4gKFxuICAgIGNodW5rMi5taW52LmJsb2NrUG9zaXRpb24gLSBjaHVuazEubWF4di5ibG9ja1Bvc2l0aW9uIDwgNjUwMDAgJiZcbiAgICBjaHVuazIubWF4di5ibG9ja1Bvc2l0aW9uIC0gY2h1bmsxLm1pbnYuYmxvY2tQb3NpdGlvbiA8IDUwMDAwMDBcbiAgKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJhbU9wdHMge1xuICB2aWV3QXNQYWlycz86IGJvb2xlYW5cbiAgcGFpckFjcm9zc0Nocj86IGJvb2xlYW5cbiAgbWF4SW5zZXJ0U2l6ZT86IG51bWJlclxuICBzaWduYWw/OiBBYm9ydFNpZ25hbFxuICBtYXhTYW1wbGVTaXplPzogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZU9wdHMge1xuICBzaWduYWw/OiBBYm9ydFNpZ25hbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9wdHMob2JqOiBBYm9ydFNpZ25hbCB8IEJhc2VPcHRzID0ge30pOiBCYXNlT3B0cyB7XG4gIHJldHVybiAnYWJvcnRlZCcgaW4gb2JqID8gKHsgc2lnbmFsOiBvYmogfSBhcyBCYXNlT3B0cykgOiAob2JqIGFzIEJhc2VPcHRzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3B0aW1pemVDaHVua3MoY2h1bmtzOiBDaHVua1tdLCBsb3dlc3Q6IFZpcnR1YWxPZmZzZXQpIHtcbiAgY29uc3QgbWVyZ2VkQ2h1bmtzOiBDaHVua1tdID0gW11cbiAgbGV0IGxhc3RDaHVuazogQ2h1bmsgfCBudWxsID0gbnVsbFxuXG4gIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGNodW5rc1xuICB9XG5cbiAgY2h1bmtzLnNvcnQoZnVuY3Rpb24oYzAsIGMxKSB7XG4gICAgY29uc3QgZGlmID0gYzAubWludi5ibG9ja1Bvc2l0aW9uIC0gYzEubWludi5ibG9ja1Bvc2l0aW9uXG4gICAgaWYgKGRpZiAhPT0gMCkge1xuICAgICAgcmV0dXJuIGRpZlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYzAubWludi5kYXRhUG9zaXRpb24gLSBjMS5taW52LmRhdGFQb3NpdGlvblxuICAgIH1cbiAgfSlcblxuICBjaHVua3MuZm9yRWFjaChjaHVuayA9PiB7XG4gICAgaWYgKCFsb3dlc3QgfHwgY2h1bmsubWF4di5jb21wYXJlVG8obG93ZXN0KSA+IDApIHtcbiAgICAgIGlmIChsYXN0Q2h1bmsgPT09IG51bGwpIHtcbiAgICAgICAgbWVyZ2VkQ2h1bmtzLnB1c2goY2h1bmspXG4gICAgICAgIGxhc3RDaHVuayA9IGNodW5rXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2FuTWVyZ2VCbG9ja3MobGFzdENodW5rLCBjaHVuaykpIHtcbiAgICAgICAgICBpZiAoY2h1bmsubWF4di5jb21wYXJlVG8obGFzdENodW5rLm1heHYpID4gMCkge1xuICAgICAgICAgICAgbGFzdENodW5rLm1heHYgPSBjaHVuay5tYXh2XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZENodW5rcy5wdXNoKGNodW5rKVxuICAgICAgICAgIGxhc3RDaHVuayA9IGNodW5rXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIG1lcmdlZENodW5rc1xufVxuIl19