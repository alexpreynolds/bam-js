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
exports.parseNameBytes = exports.findFirstData = exports.parsePseudoBin = exports.optimizeChunks = exports.makeOpts = exports.canMergeBlocks = exports.abortBreakPoint = exports.checkAbortSignal = exports.longToNumber = exports.timeout = void 0;
const long_1 = __importDefault(require("long"));
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.timeout = timeout;
function longToNumber(long) {
    if (long.greaterThan(Number.MAX_SAFE_INTEGER) ||
        long.lessThan(Number.MIN_SAFE_INTEGER)) {
        throw new Error('integer overflow');
    }
    return long.toNumber();
}
exports.longToNumber = longToNumber;
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
        if (typeof DOMException === 'undefined') {
            const e = new Error('aborted');
            //@ts-ignore
            e.code = 'ERR_ABORTED';
            throw e;
        }
        else {
            throw new DOMException('aborted', 'AbortError');
        }
    }
}
exports.checkAbortSignal = checkAbortSignal;
/**
 * Skips to the next tick, then runs `checkAbortSignal`.
 * Await this to inside an otherwise synchronous loop to
 * provide a place to break when an abort signal is received.
 * @param {AbortSignal} signal
 */
function abortBreakPoint(signal) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.resolve();
        checkAbortSignal(signal);
    });
}
exports.abortBreakPoint = abortBreakPoint;
function canMergeBlocks(chunk1, chunk2) {
    return (chunk2.minv.blockPosition - chunk1.maxv.blockPosition < 65000 &&
        chunk2.maxv.blockPosition - chunk1.minv.blockPosition < 5000000);
}
exports.canMergeBlocks = canMergeBlocks;
function makeOpts(obj = {}) {
    return 'aborted' in obj ? { signal: obj } : obj;
}
exports.makeOpts = makeOpts;
function optimizeChunks(chunks, lowest) {
    const mergedChunks = [];
    let lastChunk;
    if (chunks.length === 0) {
        return chunks;
    }
    chunks.sort((c0, c1) => {
        const dif = c0.minv.blockPosition - c1.minv.blockPosition;
        return dif === 0 ? c0.minv.dataPosition - c1.minv.dataPosition : dif;
    });
    for (const chunk of chunks) {
        if (!lowest || chunk.maxv.compareTo(lowest) > 0) {
            if (lastChunk === undefined) {
                mergedChunks.push(chunk);
                lastChunk = chunk;
            }
            else {
                if (canMergeBlocks(lastChunk, chunk)) {
                    if (chunk.maxv.compareTo(lastChunk.maxv) > 0) {
                        lastChunk.maxv = chunk.maxv;
                    }
                }
                else {
                    mergedChunks.push(chunk);
                    lastChunk = chunk;
                }
            }
        }
    }
    return mergedChunks;
}
exports.optimizeChunks = optimizeChunks;
function parsePseudoBin(bytes, offset) {
    const lineCount = longToNumber(long_1.default.fromBytesLE(Array.prototype.slice.call(bytes, offset, offset + 8), true));
    return { lineCount };
}
exports.parsePseudoBin = parsePseudoBin;
function findFirstData(firstDataLine, virtualOffset) {
    return firstDataLine
        ? firstDataLine.compareTo(virtualOffset) > 0
            ? virtualOffset
            : firstDataLine
        : virtualOffset;
}
exports.findFirstData = findFirstData;
function parseNameBytes(namesBytes, renameRefSeq = s => s) {
    let currRefId = 0;
    let currNameStart = 0;
    const refIdToName = [];
    const refNameToId = {};
    for (let i = 0; i < namesBytes.length; i += 1) {
        if (!namesBytes[i]) {
            if (currNameStart < i) {
                let refName = namesBytes.toString('utf8', currNameStart, i);
                refName = renameRefSeq(refName);
                refIdToName[currRefId] = refName;
                refNameToId[refName] = currRefId;
            }
            currNameStart = i + 1;
            currRefId += 1;
        }
    }
    return { refNameToId, refIdToName };
}
exports.parseNameBytes = parseNameBytes;
//# sourceMappingURL=util.js.map