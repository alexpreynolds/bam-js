/// <reference types="node" />
import Chunk from './chunk';
import IndexFile from './indexFile';
import { BaseOpts } from './util';
export default class BAI extends IndexFile {
    parsePseudoBin(bytes: Buffer, offset: number): {
        lineCount: number;
    };
    lineCount(refId: number, opts?: BaseOpts): Promise<any>;
    _parse(opts?: BaseOpts): Promise<{
        [key: string]: any;
    }>;
    indexCov(seqId: number, start?: number, end?: number, opts?: BaseOpts): Promise<{
        start: number;
        end: number;
        score: number;
    }[]>;
    /**
     * calculate the list of bins that may overlap with region [beg,end) (zero-based half-open)
     * @returns {Array[number]}
     */
    reg2bins(beg: number, end: number): number[][];
    blocksForRange(refId: number, min: number, max: number, opts?: BaseOpts): Promise<Chunk[]>;
}
