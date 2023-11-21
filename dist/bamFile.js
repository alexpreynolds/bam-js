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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAM_MAGIC = void 0;
const buffer_1 = require("buffer");
const buffer_crc32_1 = __importDefault(require("buffer-crc32"));
const bgzf_filehandle_1 = require("@gmod/bgzf-filehandle");
const generic_filehandle_1 = require("generic-filehandle");
const abortable_promise_cache_1 = __importDefault(require("abortable-promise-cache"));
const quick_lru_1 = __importDefault(require("quick-lru"));
const reservoir_1 = __importDefault(require("reservoir"));
// locals
const bai_1 = __importDefault(require("./bai"));
const csi_1 = __importDefault(require("./csi"));
const record_1 = __importDefault(require("./record"));
const sam_1 = require("./sam");
const util_1 = require("./util");
exports.BAM_MAGIC = 21840194;
const blockLen = 1 << 16;
function gen2array(gen) {
    var _a, gen_1, gen_1_1;
    var _b, e_1, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let out = [];
        try {
            for (_a = true, gen_1 = __asyncValues(gen); gen_1_1 = yield gen_1.next(), _b = gen_1_1.done, !_b;) {
                _d = gen_1_1.value;
                _a = false;
                try {
                    const x = _d;
                    out = out.concat(x);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = gen_1.return)) yield _c.call(gen_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return out;
    });
}
class NullFilehandle {
    read() {
        throw new Error('never called');
    }
    stat() {
        throw new Error('never called');
    }
    readFile() {
        throw new Error('never called');
    }
    close() {
        throw new Error('never called');
    }
}
class BamFile {
    constructor({ bamFilehandle, bamPath, bamUrl, baiPath, baiFilehandle, baiUrl, csiPath, csiFilehandle, csiUrl, htsget, yieldThreadTime = 100, renameRefSeqs = n => n, }) {
        this.htsget = false;
        this.featureCache = new abortable_promise_cache_1.default({
            cache: new quick_lru_1.default({
                maxSize: 50,
            }),
            fill: (args, signal) => __awaiter(this, void 0, void 0, function* () {
                const { chunk, opts } = args;
                const { data, cpositions, dpositions } = yield this._readChunk({
                    chunk,
                    opts: Object.assign(Object.assign({}, opts), { signal }),
                });
                return this.readBamFeatures(data, cpositions, dpositions, chunk);
            }),
        });
        this.renameRefSeq = renameRefSeqs;
        if (bamFilehandle) {
            this.bam = bamFilehandle;
        }
        else if (bamPath) {
            this.bam = new generic_filehandle_1.LocalFile(bamPath);
        }
        else if (bamUrl) {
            this.bam = new generic_filehandle_1.RemoteFile(bamUrl);
        }
        else if (htsget) {
            this.htsget = true;
            this.bam = new NullFilehandle();
        }
        else {
            throw new Error('unable to initialize bam');
        }
        if (csiFilehandle) {
            this.index = new csi_1.default({ filehandle: csiFilehandle });
        }
        else if (csiPath) {
            this.index = new csi_1.default({ filehandle: new generic_filehandle_1.LocalFile(csiPath) });
        }
        else if (csiUrl) {
            this.index = new csi_1.default({ filehandle: new generic_filehandle_1.RemoteFile(csiUrl) });
        }
        else if (baiFilehandle) {
            this.index = new bai_1.default({ filehandle: baiFilehandle });
        }
        else if (baiPath) {
            this.index = new bai_1.default({ filehandle: new generic_filehandle_1.LocalFile(baiPath) });
        }
        else if (baiUrl) {
            this.index = new bai_1.default({ filehandle: new generic_filehandle_1.RemoteFile(baiUrl) });
        }
        else if (bamPath) {
            this.index = new bai_1.default({ filehandle: new generic_filehandle_1.LocalFile(`${bamPath}.bai`) });
        }
        else if (bamUrl) {
            this.index = new bai_1.default({ filehandle: new generic_filehandle_1.RemoteFile(`${bamUrl}.bai`) });
        }
        else if (htsget) {
            this.htsget = true;
        }
        else {
            throw new Error('unable to infer index format');
        }
        this.yieldThreadTime = yieldThreadTime;
    }
    getHeaderPre(origOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = (0, util_1.makeOpts)(origOpts);
            if (!this.index) {
                return;
            }
            const indexData = yield this.index.parse(opts);
            const ret = indexData.firstDataLine
                ? indexData.firstDataLine.blockPosition + 65535
                : undefined;
            let buffer;
            if (ret) {
                const s = ret + blockLen;
                const res = yield this.bam.read(buffer_1.Buffer.alloc(s), 0, s, 0, opts);
                if (!res.bytesRead) {
                    throw new Error('Error reading header');
                }
                buffer = res.buffer.subarray(0, Math.min(res.bytesRead, ret));
            }
            else {
                buffer = (yield this.bam.readFile(opts));
            }
            const uncba = yield (0, bgzf_filehandle_1.unzip)(buffer);
            if (uncba.readInt32LE(0) !== exports.BAM_MAGIC) {
                throw new Error('Not a BAM file');
            }
            const headLen = uncba.readInt32LE(4);
            this.header = uncba.toString('utf8', 8, 8 + headLen);
            const { chrToIndex, indexToChr } = yield this._readRefSeqs(headLen + 8, 65535, opts);
            this.chrToIndex = chrToIndex;
            this.indexToChr = indexToChr;
            return (0, sam_1.parseHeaderText)(this.header);
        });
    }
    getHeader(opts) {
        if (!this.headerP) {
            this.headerP = this.getHeaderPre(opts).catch(e => {
                this.headerP = undefined;
                throw e;
            });
        }
        return this.headerP;
    }
    getHeaderText(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getHeader(opts);
            return this.header;
        });
    }
    // the full length of the refseq block is not given in advance so this grabs
    // a chunk and doubles it if all refseqs haven't been processed
    _readRefSeqs(start, refSeqBytes, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (start > refSeqBytes) {
                return this._readRefSeqs(start, refSeqBytes * 2, opts);
            }
            const size = refSeqBytes + blockLen;
            const { bytesRead, buffer } = yield this.bam.read(buffer_1.Buffer.alloc(size), 0, refSeqBytes, 0, opts);
            if (!bytesRead) {
                throw new Error('Error reading refseqs from header');
            }
            const uncba = yield (0, bgzf_filehandle_1.unzip)(buffer.subarray(0, Math.min(bytesRead, refSeqBytes)));
            const nRef = uncba.readInt32LE(start);
            let p = start + 4;
            const chrToIndex = {};
            const indexToChr = [];
            for (let i = 0; i < nRef; i += 1) {
                const lName = uncba.readInt32LE(p);
                const refName = this.renameRefSeq(uncba.toString('utf8', p + 4, p + 4 + lName - 1));
                const lRef = uncba.readInt32LE(p + lName + 4);
                chrToIndex[refName] = i;
                indexToChr.push({ refName, length: lRef });
                p = p + 8 + lName;
                if (p > uncba.length) {
                    console.warn(`BAM header is very big.  Re-fetching ${refSeqBytes} bytes.`);
                    return this._readRefSeqs(start, refSeqBytes * 2, opts);
                }
            }
            return { chrToIndex, indexToChr };
        });
    }
    getRecordsForRangeSample(chr, min, max, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts) {
                return this.getRecordsForRange(chr, min, max, opts);
            }
            if (opts.maxSampleSize) {
                const allRecords = yield gen2array(this.streamRecordsForRange(chr, min, max, opts));
                const resSize = +opts.maxSampleSize;
                const res = new reservoir_1.default(resSize);
                for (const record of allRecords) {
                    res.pushSome(record);
                }
                return res;
            }
            return this.getRecordsForRange(chr, min, max, opts);
        });
    }
    getRecordsForRange(chr, min, max, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return gen2array(this.streamRecordsForRange(chr, min, max, opts));
        });
    }
    streamRecordsForRangeSample(chr, min, max, opts) {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts) {
                return this.getRecordsForRange(chr, min, max, opts);
            }
            if (opts.maxSampleSize) {
                const resSize = +opts.maxSampleSize;
                const res = new reservoir_1.default(resSize);
                try {
                    for (var _d = true, _e = __asyncValues(this.streamRecordsForRange(chr, min, max, opts)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const chunk = _c;
                            for (const record of chunk) {
                                res.pushSome(record);
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return res;
            }
            return this.getRecordsForRange(chr, min, max, opts);
        });
    }
    streamRecordsForRange(chr, min, max, opts) {
        var _a;
        return __asyncGenerator(this, arguments, function* streamRecordsForRange_1() {
            yield __await(this.getHeader(opts));
            const chrId = (_a = this.chrToIndex) === null || _a === void 0 ? void 0 : _a[chr];
            if (chrId === undefined || !this.index) {
                yield yield __await([]);
            }
            else {
                const chunks = yield __await(this.index.blocksForRange(chrId, min - 1, max, opts));
                yield __await(yield* __asyncDelegator(__asyncValues(this._fetchChunkFeatures(chunks, chrId, min, max, opts))));
            }
        });
    }
    _fetchChunkFeatures(chunks, chrId, min, max, opts = {}) {
        return __asyncGenerator(this, arguments, function* _fetchChunkFeatures_1() {
            const { viewAsPairs } = opts;
            const feats = [];
            let done = false;
            for (const chunk of chunks) {
                const records = yield __await(this.featureCache.get(chunk.toString(), { chunk, opts }, opts.signal));
                const recs = [];
                for (const feature of records) {
                    if (feature.seq_id() === chrId) {
                        if (feature.get('start') >= max) {
                            // past end of range, can stop iterating
                            done = true;
                            break;
                        }
                        else if (feature.get('end') >= min) {
                            // must be in range
                            recs.push(feature);
                        }
                    }
                }
                feats.push(recs);
                yield yield __await(recs);
                if (done) {
                    break;
                }
            }
            (0, util_1.checkAbortSignal)(opts.signal);
            if (viewAsPairs) {
                yield yield __await(this.fetchPairs(chrId, feats, opts));
            }
        });
    }
    fetchPairs(chrId, feats, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pairAcrossChr, maxInsertSize = 200000 } = opts;
            const unmatedPairs = {};
            const readIds = {};
            feats.map(ret => {
                const readNames = {};
                for (const element of ret) {
                    const name = element.name();
                    const id = element.id();
                    if (!readNames[name]) {
                        readNames[name] = 0;
                    }
                    readNames[name]++;
                    readIds[id] = 1;
                }
                for (const [k, v] of Object.entries(readNames)) {
                    if (v === 1) {
                        unmatedPairs[k] = true;
                    }
                }
            });
            const matePromises = [];
            feats.map(ret => {
                for (const f of ret) {
                    const name = f.name();
                    const start = f.get('start');
                    const pnext = f._next_pos();
                    const rnext = f._next_refid();
                    if (this.index &&
                        unmatedPairs[name] &&
                        (pairAcrossChr ||
                            (rnext === chrId && Math.abs(start - pnext) < maxInsertSize))) {
                        matePromises.push(this.index.blocksForRange(rnext, pnext, pnext + 1, opts));
                    }
                }
            });
            // filter out duplicate chunks (the blocks are lists of chunks, blocks are
            // concatenated, then filter dup chunks)
            const map = new Map();
            const res = yield Promise.all(matePromises);
            for (const m of res.flat()) {
                if (!map.has(m.toString())) {
                    map.set(m.toString(), m);
                }
            }
            const mateFeatPromises = yield Promise.all([...map.values()].map((c) => __awaiter(this, void 0, void 0, function* () {
                const { data, cpositions, dpositions, chunk } = yield this._readChunk({
                    chunk: c,
                    opts,
                });
                const mateRecs = [];
                for (const feature of yield this.readBamFeatures(data, cpositions, dpositions, chunk)) {
                    if (unmatedPairs[feature.get('name')] && !readIds[feature.id()]) {
                        mateRecs.push(feature);
                    }
                }
                return mateRecs;
            })));
            return mateFeatPromises.flat();
        });
    }
    _readRegion(position, size, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bytesRead, buffer } = yield this.bam.read(buffer_1.Buffer.alloc(size), 0, size, position, opts);
            return buffer.subarray(0, Math.min(bytesRead, size));
        });
    }
    _readChunk({ chunk, opts }) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this._readRegion(chunk.minv.blockPosition, chunk.fetchedSize(), opts);
            const { buffer: data, cpositions, dpositions, } = yield (0, bgzf_filehandle_1.unzipChunkSlice)(buffer, chunk);
            return { data, cpositions, dpositions, chunk };
        });
    }
    readBamFeatures(ba, cpositions, dpositions, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            let blockStart = 0;
            const sink = [];
            let pos = 0;
            let last = +Date.now();
            while (blockStart + 4 < ba.length) {
                const blockSize = ba.readInt32LE(blockStart);
                const blockEnd = blockStart + 4 + blockSize - 1;
                // increment position to the current decompressed status
                if (dpositions) {
                    while (blockStart + chunk.minv.dataPosition >= dpositions[pos++]) { }
                    pos--;
                }
                // only try to read the feature if we have all the bytes for it
                if (blockEnd < ba.length) {
                    const feature = new record_1.default({
                        bytes: {
                            byteArray: ba,
                            start: blockStart,
                            end: blockEnd,
                        },
                        // the below results in an automatically calculated file-offset based
                        // ID if the info for that is available, otherwise crc32 of the
                        // features
                        //
                        // cpositions[pos] refers to actual file offset of a bgzip block
                        // boundaries
                        //
                        // we multiply by (1 <<8) in order to make sure each block has a
                        // "unique" address space so that data in that block could never
                        // overlap
                        //
                        // then the blockStart-dpositions is an uncompressed file offset from
                        // that bgzip block boundary, and since the cpositions are multiplied
                        // by (1 << 8) these uncompressed offsets get a unique space
                        //
                        // this has an extra chunk.minv.dataPosition added on because it
                        // blockStart starts at 0 instead of chunk.minv.dataPosition
                        //
                        // the +1 is just to avoid any possible uniqueId 0 but this does not
                        // realistically happen
                        fileOffset: cpositions.length > 0
                            ? cpositions[pos] * (1 << 8) +
                                (blockStart - dpositions[pos]) +
                                chunk.minv.dataPosition +
                                1
                            : // must be slice, not subarray for buffer polyfill on web
                                buffer_crc32_1.default.signed(ba.slice(blockStart, blockEnd)),
                    });
                    sink.push(feature);
                    if (this.yieldThreadTime && +Date.now() - last > this.yieldThreadTime) {
                        yield (0, util_1.timeout)(1);
                        last = +Date.now();
                    }
                }
                blockStart = blockEnd + 1;
            }
            return sink;
        });
    }
    hasRefSeq(seqName) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const seqId = (_a = this.chrToIndex) === null || _a === void 0 ? void 0 : _a[seqName];
            return seqId === undefined ? false : (_b = this.index) === null || _b === void 0 ? void 0 : _b.hasRefSeq(seqId);
        });
    }
    lineCount(seqName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const seqId = (_a = this.chrToIndex) === null || _a === void 0 ? void 0 : _a[seqName];
            return seqId === undefined || !this.index ? 0 : this.index.lineCount(seqId);
        });
    }
    indexCov(seqName, start, end) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.index) {
                return [];
            }
            yield this.index.parse();
            const seqId = (_a = this.chrToIndex) === null || _a === void 0 ? void 0 : _a[seqName];
            return seqId === undefined ? [] : this.index.indexCov(seqId, start, end);
        });
    }
    blocksForRange(seqName, start, end, opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.index) {
                return [];
            }
            yield this.index.parse();
            const seqId = (_a = this.chrToIndex) === null || _a === void 0 ? void 0 : _a[seqName];
            return seqId === undefined
                ? []
                : this.index.blocksForRange(seqId, start, end, opts);
        });
    }
}
exports.default = BamFile;
//# sourceMappingURL=bamFile.js.map