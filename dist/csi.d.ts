/// <reference types="node" />
import Chunk from './chunk';
import { BaseOpts } from './util';
import IndexFile from './indexFile';
export default class CSI extends IndexFile {
    private maxBinNumber;
    private depth;
    private minShift;
    constructor(args: any);
    lineCount(refId: number): Promise<number>;
    indexCov(): Promise<never[]>;
    parseAuxData(bytes: Buffer, offset: number, auxLength: number): {
        [key: string]: any;
    };
    _parseNameBytes(namesBytes: Buffer): {
        refNameToId: {
            [key: string]: number;
        };
        refIdToName: string[];
    };
    _parse(opts: {
        signal?: AbortSignal;
    }): Promise<{
        [key: string]: any;
    }>;
    parsePseudoBin(bytes: Buffer, offset: number): {
        lineCount: number;
    };
    blocksForRange(refId: number, min: number, max: number, opts?: BaseOpts): Promise<Chunk[]>;
    /**
     * calculate the list of bins that may overlap with region [beg,end) (zero-based half-open)
     * @returns {Array[number]}
     */
    reg2bins(beg: number, end: number): number[][];
}
