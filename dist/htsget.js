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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const bgzf_filehandle_1 = require("@gmod/bgzf-filehandle");
const buffer_1 = require("buffer");
const bamFile_1 = __importStar(require("./bamFile"));
const sam_1 = require("./sam");
function concat(arr, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield Promise.all(arr.map((chunk) => __awaiter(this, void 0, void 0, function* () {
            const { url, headers } = chunk;
            if (url.startsWith('data:')) {
                return buffer_1.Buffer.from(url.split(',')[1], 'base64');
            }
            else {
                //remove referer header, it is not even allowed to be specified
                // @ts-expect-error
                //eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { referer } = headers, rest = __rest(headers, ["referer"]);
                const res = yield fetch(url, Object.assign(Object.assign({}, opts), { headers: Object.assign(Object.assign({}, opts === null || opts === void 0 ? void 0 : opts.headers), rest) }));
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} fetching ${url}: ${yield res.text()}`);
                }
                return buffer_1.Buffer.from(yield res.arrayBuffer());
            }
        })));
        return buffer_1.Buffer.concat(yield Promise.all(res.map(elt => (0, bgzf_filehandle_1.unzip)(elt))));
    });
}
class HtsgetFile extends bamFile_1.default {
    constructor(args) {
        super({ htsget: true });
        this.baseUrl = args.baseUrl;
        this.trackId = args.trackId;
    }
    streamRecordsForRange(chr, min, max, opts) {
        var _a;
        return __asyncGenerator(this, arguments, function* streamRecordsForRange_1() {
            const base = `${this.baseUrl}/${this.trackId}`;
            const url = `${base}?referenceName=${chr}&start=${min}&end=${max}&format=BAM`;
            const chrId = (_a = this.chrToIndex) === null || _a === void 0 ? void 0 : _a[chr];
            if (chrId === undefined) {
                yield yield __await([]);
            }
            else {
                const result = yield __await(fetch(url, Object.assign({}, opts)));
                if (!result.ok) {
                    throw new Error(`HTTP ${result.status} fetching ${url}: ${yield __await(result.text())}`);
                }
                const data = yield __await(result.json());
                const uncba = yield __await(concat(data.htsget.urls.slice(1), opts));
                yield __await(yield* __asyncDelegator(__asyncValues(this._fetchChunkFeatures([
                    // fake stuff to pretend to be a Chunk
                    {
                        buffer: uncba,
                        _fetchedSize: undefined,
                        bin: 0,
                        compareTo() {
                            return 0;
                        },
                        toUniqueString() {
                            return `${chr}_${min}_${max}`;
                        },
                        fetchedSize() {
                            return 0;
                        },
                        minv: {
                            dataPosition: 0,
                            blockPosition: 0,
                            compareTo: () => 0,
                        },
                        maxv: {
                            dataPosition: Number.MAX_SAFE_INTEGER,
                            blockPosition: 0,
                            compareTo: () => 0,
                        },
                        toString() {
                            return `${chr}_${min}_${max}`;
                        },
                    },
                ], chrId, min, max, opts))));
            }
        });
    }
    _readChunk({ chunk }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chunk.buffer) {
                throw new Error('expected chunk.buffer in htsget');
            }
            return { data: chunk.buffer, cpositions: [], dpositions: [], chunk };
        });
    }
    getHeader(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/${this.trackId}?referenceName=na&class=header`;
            const result = yield fetch(url, opts);
            if (!result.ok) {
                throw new Error(`HTTP ${result.status} fetching ${url}: ${yield result.text()}`);
            }
            const data = yield result.json();
            const uncba = yield concat(data.htsget.urls, opts);
            if (uncba.readInt32LE(0) !== bamFile_1.BAM_MAGIC) {
                throw new Error('Not a BAM file');
            }
            const headLen = uncba.readInt32LE(4);
            const headerText = uncba.toString('utf8', 8, 8 + headLen);
            const samHeader = (0, sam_1.parseHeaderText)(headerText);
            // use the @SQ lines in the header to figure out the
            // mapping between ref ref ID numbers and names
            const idToName = [];
            const nameToId = {};
            const sqLines = samHeader.filter(l => l.tag === 'SQ');
            for (const [refId, sqLine] of sqLines.entries()) {
                let refName = '';
                let length = 0;
                for (const item of sqLine.data) {
                    if (item.tag === 'SN') {
                        refName = item.value;
                    }
                    else if (item.tag === 'LN') {
                        length = +item.value;
                    }
                }
                nameToId[refName] = refId;
                idToName[refId] = { refName, length };
            }
            this.chrToIndex = nameToId;
            this.indexToChr = idToName;
            return samHeader;
        });
    }
}
exports.default = HtsgetFile;
//# sourceMappingURL=htsget.js.map