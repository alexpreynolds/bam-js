"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var _default = {
  //  the read is paired in sequencing, no matter whether it is mapped in a pair
  BAM_FPAIRED: 1,
  //  the read is mapped in a proper pair
  BAM_FPROPER_PAIR: 2,
  //  the read itself is unmapped; conflictive with BAM_FPROPER_PAIR
  BAM_FUNMAP: 4,
  //  the mate is unmapped
  BAM_FMUNMAP: 8,
  //  the read is mapped to the reverse strand
  BAM_FREVERSE: 16,
  //  the mate is mapped to the reverse strand
  BAM_FMREVERSE: 32,
  //  this is read1
  BAM_FREAD1: 64,
  //  this is read2
  BAM_FREAD2: 128,
  //  not primary alignment
  BAM_FSECONDARY: 256,
  //  QC failure
  BAM_FQCFAIL: 512,
  //  optical or PCR duplicate
  BAM_FDUP: 1024,
  //  supplementary alignment
  BAM_FSUPPLEMENTARY: 2048
};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zdGFudHMudHMiXSwibmFtZXMiOlsiQkFNX0ZQQUlSRUQiLCJCQU1fRlBST1BFUl9QQUlSIiwiQkFNX0ZVTk1BUCIsIkJBTV9GTVVOTUFQIiwiQkFNX0ZSRVZFUlNFIiwiQkFNX0ZNUkVWRVJTRSIsIkJBTV9GUkVBRDEiLCJCQU1fRlJFQUQyIiwiQkFNX0ZTRUNPTkRBUlkiLCJCQU1fRlFDRkFJTCIsIkJBTV9GRFVQIiwiQkFNX0ZTVVBQTEVNRU5UQVJZIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7ZUFBZTtBQUNiO0FBQ0FBLEVBQUFBLFdBQVcsRUFBRSxDQUZBO0FBR2I7QUFDQUMsRUFBQUEsZ0JBQWdCLEVBQUUsQ0FKTDtBQUtiO0FBQ0FDLEVBQUFBLFVBQVUsRUFBRSxDQU5DO0FBT2I7QUFDQUMsRUFBQUEsV0FBVyxFQUFFLENBUkE7QUFTYjtBQUNBQyxFQUFBQSxZQUFZLEVBQUUsRUFWRDtBQVdiO0FBQ0FDLEVBQUFBLGFBQWEsRUFBRSxFQVpGO0FBYWI7QUFDQUMsRUFBQUEsVUFBVSxFQUFFLEVBZEM7QUFlYjtBQUNBQyxFQUFBQSxVQUFVLEVBQUUsR0FoQkM7QUFpQmI7QUFDQUMsRUFBQUEsY0FBYyxFQUFFLEdBbEJIO0FBbUJiO0FBQ0FDLEVBQUFBLFdBQVcsRUFBRSxHQXBCQTtBQXFCYjtBQUNBQyxFQUFBQSxRQUFRLEVBQUUsSUF0Qkc7QUF1QmI7QUFDQUMsRUFBQUEsa0JBQWtCLEVBQUU7QUF4QlAsQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gIHRoZSByZWFkIGlzIHBhaXJlZCBpbiBzZXF1ZW5jaW5nLCBubyBtYXR0ZXIgd2hldGhlciBpdCBpcyBtYXBwZWQgaW4gYSBwYWlyXG4gIEJBTV9GUEFJUkVEOiAxLFxuICAvLyAgdGhlIHJlYWQgaXMgbWFwcGVkIGluIGEgcHJvcGVyIHBhaXJcbiAgQkFNX0ZQUk9QRVJfUEFJUjogMixcbiAgLy8gIHRoZSByZWFkIGl0c2VsZiBpcyB1bm1hcHBlZDsgY29uZmxpY3RpdmUgd2l0aCBCQU1fRlBST1BFUl9QQUlSXG4gIEJBTV9GVU5NQVA6IDQsXG4gIC8vICB0aGUgbWF0ZSBpcyB1bm1hcHBlZFxuICBCQU1fRk1VTk1BUDogOCxcbiAgLy8gIHRoZSByZWFkIGlzIG1hcHBlZCB0byB0aGUgcmV2ZXJzZSBzdHJhbmRcbiAgQkFNX0ZSRVZFUlNFOiAxNixcbiAgLy8gIHRoZSBtYXRlIGlzIG1hcHBlZCB0byB0aGUgcmV2ZXJzZSBzdHJhbmRcbiAgQkFNX0ZNUkVWRVJTRTogMzIsXG4gIC8vICB0aGlzIGlzIHJlYWQxXG4gIEJBTV9GUkVBRDE6IDY0LFxuICAvLyAgdGhpcyBpcyByZWFkMlxuICBCQU1fRlJFQUQyOiAxMjgsXG4gIC8vICBub3QgcHJpbWFyeSBhbGlnbm1lbnRcbiAgQkFNX0ZTRUNPTkRBUlk6IDI1NixcbiAgLy8gIFFDIGZhaWx1cmVcbiAgQkFNX0ZRQ0ZBSUw6IDUxMixcbiAgLy8gIG9wdGljYWwgb3IgUENSIGR1cGxpY2F0ZVxuICBCQU1fRkRVUDogMTAyNCxcbiAgLy8gIHN1cHBsZW1lbnRhcnkgYWxpZ25tZW50XG4gIEJBTV9GU1VQUExFTUVOVEFSWTogMjA0OCxcbn1cbiJdfQ==