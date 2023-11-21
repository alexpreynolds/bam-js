import VirtualOffset from './virtualOffset';
import Chunk from './chunk';
import { BaseOpts } from './util';
import IndexFile from './indexFile';
export default class BAI extends IndexFile {
    setupP?: ReturnType<BAI['_parse']>;
    lineCount(refId: number, opts?: BaseOpts): Promise<number>;
    _parse(opts?: BaseOpts): Promise<{
        bai: boolean;
        firstDataLine: VirtualOffset | undefined;
        maxBlockSize: number;
        indices: {
            binIndex: {
                [key: string]: Chunk[];
            };
            linearIndex: VirtualOffset[];
            stats?: {
                lineCount: number;
            } | undefined;
        }[];
        refCount: number;
    }>;
    indexCov(seqId: number, start?: number, end?: number, opts?: BaseOpts): Promise<{
        start: number;
        end: number;
        score: number;
    }[]>;
    blocksForRange(refId: number, min: number, max: number, opts?: BaseOpts): Promise<Chunk[]>;
    parse(opts?: BaseOpts): Promise<{
        bai: boolean;
        firstDataLine: VirtualOffset | undefined;
        maxBlockSize: number;
        indices: {
            binIndex: {
                [key: string]: Chunk[];
            };
            linearIndex: VirtualOffset[];
            stats?: {
                lineCount: number;
            } | undefined;
        }[];
        refCount: number;
    }>;
    hasRefSeq(seqId: number, opts?: BaseOpts): Promise<boolean>;
}
