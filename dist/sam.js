"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.parseHeaderText = parseHeaderText;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _toArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toArray"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

function parseHeaderText(text) {
  var lines = text.split(/\r?\n/);
  var data = [];
  (0, _forEach.default)(lines).call(lines, function (line) {
    var _line$split = line.split(/\t/),
        _line$split2 = (0, _toArray2.default)(_line$split),
        tag = _line$split2[0],
        fields = (0, _slice.default)(_line$split2).call(_line$split2, 1);

    var parsedFields = (0, _map.default)(fields).call(fields, function (f) {
      var _f$split = f.split(':', 2),
          _f$split2 = (0, _slicedToArray2.default)(_f$split, 2),
          fieldTag = _f$split2[0],
          value = _f$split2[1];

      return {
        tag: fieldTag,
        value: value
      };
    });

    if (tag) {
      data.push({
        tag: tag.substr(1),
        data: parsedFields
      });
    }
  });
  return data;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zYW0udHMiXSwibmFtZXMiOlsicGFyc2VIZWFkZXJUZXh0IiwidGV4dCIsImxpbmVzIiwic3BsaXQiLCJkYXRhIiwibGluZSIsInRhZyIsImZpZWxkcyIsInBhcnNlZEZpZWxkcyIsImYiLCJmaWVsZFRhZyIsInZhbHVlIiwicHVzaCIsInN1YnN0ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLGVBQVQsQ0FBeUJDLElBQXpCLEVBQXVDO0FBQzVDLE1BQU1DLEtBQUssR0FBR0QsSUFBSSxDQUFDRSxLQUFMLENBQVcsT0FBWCxDQUFkO0FBQ0EsTUFBTUMsSUFBK0QsR0FBRyxFQUF4RTtBQUNBLHdCQUFBRixLQUFLLE1BQUwsQ0FBQUEsS0FBSyxFQUFTLFVBQUFHLElBQUksRUFBSTtBQUFBLHNCQUNLQSxJQUFJLENBQUNGLEtBQUwsQ0FBVyxJQUFYLENBREw7QUFBQTtBQUFBLFFBQ2JHLEdBRGE7QUFBQSxRQUNMQyxNQURLOztBQUVwQixRQUFNQyxZQUFZLEdBQUcsa0JBQUFELE1BQU0sTUFBTixDQUFBQSxNQUFNLEVBQUssVUFBQUUsQ0FBQyxFQUFJO0FBQUEscUJBQ1RBLENBQUMsQ0FBQ04sS0FBRixDQUFRLEdBQVIsRUFBYSxDQUFiLENBRFM7QUFBQTtBQUFBLFVBQzVCTyxRQUQ0QjtBQUFBLFVBQ2xCQyxLQURrQjs7QUFFbkMsYUFBTztBQUFFTCxRQUFBQSxHQUFHLEVBQUVJLFFBQVA7QUFBaUJDLFFBQUFBLEtBQUssRUFBTEE7QUFBakIsT0FBUDtBQUNELEtBSDBCLENBQTNCOztBQUlBLFFBQUlMLEdBQUosRUFBUztBQUNQRixNQUFBQSxJQUFJLENBQUNRLElBQUwsQ0FBVTtBQUFFTixRQUFBQSxHQUFHLEVBQUVBLEdBQUcsQ0FBQ08sTUFBSixDQUFXLENBQVgsQ0FBUDtBQUFzQlQsUUFBQUEsSUFBSSxFQUFFSTtBQUE1QixPQUFWO0FBQ0Q7QUFDRixHQVRJLENBQUw7QUFVQSxTQUFPSixJQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gcGFyc2VIZWFkZXJUZXh0KHRleHQ6IHN0cmluZykge1xuICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoL1xccj9cXG4vKVxuICBjb25zdCBkYXRhOiB7IHRhZzogc3RyaW5nOyBkYXRhOiB7IHRhZzogc3RyaW5nOyB2YWx1ZTogc3RyaW5nIH1bXSB9W10gPSBbXVxuICBsaW5lcy5mb3JFYWNoKGxpbmUgPT4ge1xuICAgIGNvbnN0IFt0YWcsIC4uLmZpZWxkc10gPSBsaW5lLnNwbGl0KC9cXHQvKVxuICAgIGNvbnN0IHBhcnNlZEZpZWxkcyA9IGZpZWxkcy5tYXAoZiA9PiB7XG4gICAgICBjb25zdCBbZmllbGRUYWcsIHZhbHVlXSA9IGYuc3BsaXQoJzonLCAyKVxuICAgICAgcmV0dXJuIHsgdGFnOiBmaWVsZFRhZywgdmFsdWUgfVxuICAgIH0pXG4gICAgaWYgKHRhZykge1xuICAgICAgZGF0YS5wdXNoKHsgdGFnOiB0YWcuc3Vic3RyKDEpLCBkYXRhOiBwYXJzZWRGaWVsZHMgfSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBkYXRhXG59XG4iXX0=