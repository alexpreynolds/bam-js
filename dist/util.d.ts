/// <reference types="node" />
import Long from 'long';
import Chunk from './chunk';
import VirtualOffset from './virtualOffset';
export declare function timeout(ms: number): Promise<unknown>;
export declare function longToNumber(long: Long): number;
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
export declare function checkAbortSignal(signal?: AbortSignal): void;
/**
 * Skips to the next tick, then runs `checkAbortSignal`.
 * Await this to inside an otherwise synchronous loop to
 * provide a place to break when an abort signal is received.
 * @param {AbortSignal} signal
 */
export declare function abortBreakPoint(signal?: AbortSignal): Promise<void>;
export declare function canMergeBlocks(chunk1: Chunk, chunk2: Chunk): boolean;
export interface BamOpts {
    viewAsPairs?: boolean;
    pairAcrossChr?: boolean;
    maxInsertSize?: number;
    signal?: AbortSignal;
    maxSampleSize?: number;
}
export interface BaseOpts {
    signal?: AbortSignal;
}
export declare function makeOpts(obj?: AbortSignal | BaseOpts): BaseOpts;
export declare function optimizeChunks(chunks: Chunk[], lowest?: VirtualOffset): Chunk[];
export declare function parsePseudoBin(bytes: Buffer, offset: number): {
    lineCount: number;
};
export declare function findFirstData(firstDataLine: VirtualOffset | undefined, virtualOffset: VirtualOffset): VirtualOffset;
export declare function parseNameBytes(namesBytes: Buffer, renameRefSeq?: (arg: string) => string): {
    refNameToId: {
        [key: string]: number;
    };
    refIdToName: string[];
};