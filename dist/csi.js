"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bgzf_filehandle_1 = require("@gmod/bgzf-filehandle");
const virtualOffset_1 = __importStar(require("./virtualOffset"));
const chunk_1 = __importDefault(require("./chunk"));
const util_1 = require("./util");
const indexFile_1 = __importDefault(require("./indexFile"));
const CSI1_MAGIC = 21582659; // CSI\1
const CSI2_MAGIC = 38359875; // CSI\2
function lshift(num, bits) {
    return num * Math.pow(2, bits);
}
function rshift(num, bits) {
    return Math.floor(num / Math.pow(2, bits));
}
class CSI extends indexFile_1.default {
    constructor() {
        super(...arguments);
        this.maxBinNumber = 0;
        this.depth = 0;
        this.minShift = 0;
    }
    lineCount(refId, opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const indexData = yield this.parse(opts);
            return ((_b = (_a = indexData.indices[refId]) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.lineCount) || 0;
        });
    }
    indexCov() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    parseAuxData(bytes, offset) {
        const formatFlags = bytes.readInt32LE(offset);
        const coordinateType = formatFlags & 0x10000 ? 'zero-based-half-open' : '1-based-closed';
        const format = { 0: 'generic', 1: 'SAM', 2: 'VCF' }[formatFlags & 0xf];
        if (!format) {
            throw new Error(`invalid Tabix preset format flags ${formatFlags}`);
        }
        const columnNumbers = {
            ref: bytes.readInt32LE(offset + 4),
            start: bytes.readInt32LE(offset + 8),
            end: bytes.readInt32LE(offset + 12),
        };
        const metaValue = bytes.readInt32LE(offset + 16);
        const metaChar = metaValue ? String.fromCharCode(metaValue) : '';
        const skipLines = bytes.readInt32LE(offset + 20);
        const nameSectionLength = bytes.readInt32LE(offset + 24);
        return Object.assign({ columnNumbers,
            coordinateType,
            metaValue,
            metaChar,
            skipLines,
            format,
            formatFlags }, (0, util_1.parseNameBytes)(bytes.subarray(offset + 28, offset + 28 + nameSectionLength), this.renameRefSeq));
    }
    // fetch and parse the index
    _parse(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.filehandle.readFile(opts);
            const bytes = yield (0, bgzf_filehandle_1.unzip)(buffer);
            let csiVersion;
            // check TBI magic numbers
            if (bytes.readUInt32LE(0) === CSI1_MAGIC) {
                csiVersion = 1;
            }
            else if (bytes.readUInt32LE(0) === CSI2_MAGIC) {
                csiVersion = 2;
            }
            else {
                throw new Error('Not a CSI file');
                // TODO: do we need to support big-endian CSI files?
            }
            this.minShift = bytes.readInt32LE(4);
            this.depth = bytes.readInt32LE(8);
            this.maxBinNumber = ((1 << ((this.depth + 1) * 3)) - 1) / 7;
            const auxLength = bytes.readInt32LE(12);
            const aux = auxLength >= 30 ? this.parseAuxData(bytes, 16) : undefined;
            const refCount = bytes.readInt32LE(16 + auxLength);
            // read the indexes for each reference sequence
            let curr = 16 + auxLength + 4;
            let firstDataLine;
            const indices = new Array(refCount);
            for (let i = 0; i < refCount; i++) {
                // the binning index
                const binCount = bytes.readInt32LE(curr);
                curr += 4;
                const binIndex = {};
                let stats; // < provided by parsing a pseudo-bin, if present
                for (let j = 0; j < binCount; j++) {
                    const bin = bytes.readUInt32LE(curr);
                    curr += 4;
                    if (bin > this.maxBinNumber) {
                        stats = (0, util_1.parsePseudoBin)(bytes, curr + 28);
                        curr += 28 + 16;
                    }
                    else {
                        firstDataLine = (0, util_1.findFirstData)(firstDataLine, (0, virtualOffset_1.fromBytes)(bytes, curr));
                        curr += 8;
                        const chunkCount = bytes.readInt32LE(curr);
                        curr += 4;
                        const chunks = new Array(chunkCount);
                        for (let k = 0; k < chunkCount; k += 1) {
                            const u = (0, virtualOffset_1.fromBytes)(bytes, curr);
                            curr += 8;
                            const v = (0, virtualOffset_1.fromBytes)(bytes, curr);
                            curr += 8;
                            firstDataLine = (0, util_1.findFirstData)(firstDataLine, u);
                            chunks[k] = new chunk_1.default(u, v, bin);
                        }
                        binIndex[bin] = chunks;
                    }
                }
                indices[i] = { binIndex, stats };
            }
            return Object.assign({ csiVersion,
                firstDataLine,
                indices,
                refCount, csi: true, maxBlockSize: 1 << 16 }, aux);
        });
    }
    blocksForRange(refId, min, max, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (min < 0) {
                min = 0;
            }
            const indexData = yield this.parse(opts);
            const ba = indexData === null || indexData === void 0 ? void 0 : indexData.indices[refId];
            if (!ba) {
                return [];
            }
            const overlappingBins = this.reg2bins(min, max);
            if (overlappingBins.length === 0) {
                return [];
            }
            const chunks = [];
            // Find chunks in overlapping bins.  Leaf bins (< 4681) are not pruned
            for (const [start, end] of overlappingBins) {
                for (let bin = start; bin <= end; bin++) {
                    if (ba.binIndex[bin]) {
                        const binChunks = ba.binIndex[bin];
                        for (const c of binChunks) {
                            chunks.push(c);
                        }
                    }
                }
            }
            return (0, util_1.optimizeChunks)(chunks, new virtualOffset_1.default(0, 0));
        });
    }
    /**
     * calculate the list of bins that may overlap with region [beg,end)
     * (zero-based half-open)
     */
    reg2bins(beg, end) {
        beg -= 1; // < convert to 1-based closed
        if (beg < 1) {
            beg = 1;
        }
        if (end > Math.pow(2, 50)) {
            end = Math.pow(2, 34);
        } // 17 GiB ought to be enough for anybody
        end -= 1;
        let l = 0;
        let t = 0;
        let s = this.minShift + this.depth * 3;
        const bins = [];
        for (; l <= this.depth; s -= 3, t += lshift(1, l * 3), l += 1) {
            const b = t + rshift(beg, s);
            const e = t + rshift(end, s);
            if (e - b + bins.length > this.maxBinNumber) {
                throw new Error(`query ${beg}-${end} is too large for current binning scheme (shift ${this.minShift}, depth ${this.depth}), try a smaller query or a coarser index binning scheme`);
            }
            bins.push([b, e]);
        }
        return bins;
    }
    parse(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.setupP) {
                this.setupP = this._parse(opts).catch(e => {
                    this.setupP = undefined;
                    throw e;
                });
            }
            return this.setupP;
        });
    }
    hasRefSeq(seqId, opts = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const header = yield this.parse(opts);
            return !!((_a = header.indices[seqId]) === null || _a === void 0 ? void 0 : _a.binIndex);
        });
    }
}
exports.default = CSI;
//# sourceMappingURL=csi.js.map