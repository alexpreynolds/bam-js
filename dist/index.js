"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtsgetFile = exports.BamRecord = exports.CSI = exports.BamFile = exports.BAI = void 0;
var bai_1 = require("./bai");
Object.defineProperty(exports, "BAI", { enumerable: true, get: function () { return __importDefault(bai_1).default; } });
var bamFile_1 = require("./bamFile");
Object.defineProperty(exports, "BamFile", { enumerable: true, get: function () { return __importDefault(bamFile_1).default; } });
var csi_1 = require("./csi");
Object.defineProperty(exports, "CSI", { enumerable: true, get: function () { return __importDefault(csi_1).default; } });
var record_1 = require("./record");
Object.defineProperty(exports, "BamRecord", { enumerable: true, get: function () { return __importDefault(record_1).default; } });
var htsget_1 = require("./htsget");
Object.defineProperty(exports, "HtsgetFile", { enumerable: true, get: function () { return __importDefault(htsget_1).default; } });
//# sourceMappingURL=index.js.map