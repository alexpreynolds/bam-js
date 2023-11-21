"use strict";
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
const virtualOffset_1 = require("./virtualOffset");
const chunk_1 = __importDefault(require("./chunk"));
const util_1 = require("./util");
const indexFile_1 = __importDefault(require("./indexFile"));
const BAI_MAGIC = 21578050; // BAI\1
function roundDown(n, multiple) {
    return n - (n % multiple);
}
function roundUp(n, multiple) {
    return n - (n % multiple) + multiple;
}
function reg2bins(beg, end) {
    end -= 1;
    return [
        [0, 0],
        [1 + (beg >> 26), 1 + (end >> 26)],
        [9 + (beg >> 23), 9 + (end >> 23)],
        [73 + (beg >> 20), 73 + (end >> 20)],
        [585 + (beg >> 17), 585 + (end >> 17)],
        [4681 + (beg >> 14), 4681 + (end >> 14)],
    ];
}
class BAI extends indexFile_1.default {
    lineCount(refId, opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const indexData = yield this.parse(opts);
            return ((_b = (_a = indexData.indices[refId]) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.lineCount) || 0;
        });
    }
    // fetch and parse the index
    _parse(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = (yield this.filehandle.readFile(opts));
            // check BAI magic numbers
            if (bytes.readUInt32LE(0) !== BAI_MAGIC) {
                throw new Error('Not a BAI file');
            }
            const refCount = bytes.readInt32LE(4);
            const depth = 5;
            const binLimit = ((1 << ((depth + 1) * 3)) - 1) / 7;
            // read the indexes for each reference sequence
            let curr = 8;
            let firstDataLine;
            const indices = new Array(refCount);
            for (let i = 0; i < refCount; i++) {
                // the binning index
                const binCount = bytes.readInt32LE(curr);
                let stats;
                curr += 4;
                const binIndex = {};
                for (let j = 0; j < binCount; j += 1) {
                    const bin = bytes.readUInt32LE(curr);
                    curr += 4;
                    if (bin === binLimit + 1) {
                        curr += 4;
                        stats = (0, util_1.parsePseudoBin)(bytes, curr + 16);
                        curr += 32;
                    }
                    else if (bin > binLimit + 1) {
                        throw new Error('bai index contains too many bins, please use CSI');
                    }
                    else {
                        const chunkCount = bytes.readInt32LE(curr);
                        curr += 4;
                        const chunks = new Array(chunkCount);
                        for (let k = 0; k < chunkCount; k++) {
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
                const linearCount = bytes.readInt32LE(curr);
                curr += 4;
                // as we're going through the linear index, figure out the smallest
                // virtual offset in the indexes, which tells us where the BAM header
                // ends
                const linearIndex = new Array(linearCount);
                for (let j = 0; j < linearCount; j++) {
                    const offset = (0, virtualOffset_1.fromBytes)(bytes, curr);
                    curr += 8;
                    firstDataLine = (0, util_1.findFirstData)(firstDataLine, offset);
                    linearIndex[j] = offset;
                }
                indices[i] = { binIndex, linearIndex, stats };
            }
            return {
                bai: true,
                firstDataLine,
                maxBlockSize: 1 << 16,
                indices,
                refCount,
            };
        });
    }
    indexCov(seqId, start, end, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = 16384;
            const range = start !== undefined;
            const indexData = yield this.parse(opts);
            const seqIdx = indexData.indices[seqId];
            if (!seqIdx) {
                return [];
            }
            const { linearIndex = [], stats } = seqIdx;
            if (linearIndex.length === 0) {
                return [];
            }
            const e = end === undefined ? (linearIndex.length - 1) * v : roundUp(end, v);
            const s = start === undefined ? 0 : roundDown(start, v);
            const depths = range
                ? new Array((e - s) / v)
                : new Array(linearIndex.length - 1);
            const totalSize = linearIndex[linearIndex.length - 1].blockPosition;
            if (e > (linearIndex.length - 1) * v) {
                throw new Error('query outside of range of linear index');
            }
            let currentPos = linearIndex[s / v].blockPosition;
            for (let i = s / v, j = 0; i < e / v; i++, j++) {
                depths[j] = {
                    score: linearIndex[i + 1].blockPosition - currentPos,
                    start: i * v,
                    end: i * v + v,
                };
                currentPos = linearIndex[i + 1].blockPosition;
            }
            return depths.map(d => (Object.assign(Object.assign({}, d), { score: (d.score * ((stats === null || stats === void 0 ? void 0 : stats.lineCount) || 0)) / totalSize })));
        });
    }
    blocksForRange(refId, min, max, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (min < 0) {
                min = 0;
            }
            const indexData = yield this.parse(opts);
            if (!indexData) {
                return [];
            }
            const ba = indexData.indices[refId];
            if (!ba) {
                return [];
            }
            // List of bin #s that overlap min, max
            const overlappingBins = reg2bins(min, max);
            const chunks = [];
            // Find chunks in overlapping bins.  Leaf bins (< 4681) are not pruned
            for (const [start, end] of overlappingBins) {
                for (let bin = start; bin <= end; bin++) {
                    if (ba.binIndex[bin]) {
                        const binChunks = ba.binIndex[bin];
                        for (const binChunk of binChunks) {
                            chunks.push(binChunk);
                        }
                    }
                }
            }
            // Use the linear index to find minimum file position of chunks that could
            // contain alignments in the region
            const nintv = ba.linearIndex.length;
            let lowest;
            const minLin = Math.min(min >> 14, nintv - 1);
            const maxLin = Math.min(max >> 14, nintv - 1);
            for (let i = minLin; i <= maxLin; ++i) {
                const vp = ba.linearIndex[i];
                if (vp && (!lowest || vp.compareTo(lowest) < 0)) {
                    lowest = vp;
                }
            }
            return (0, util_1.optimizeChunks)(chunks, lowest);
        });
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
exports.default = BAI;
//# sourceMappingURL=bai.js.map