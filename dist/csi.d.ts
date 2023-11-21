/// <reference types="node" />
import VirtualOffset from './virtualOffset';
import Chunk from './chunk';
import { BaseOpts } from './util';
import IndexFile from './indexFile';
export default class CSI extends IndexFile {
    private maxBinNumber;
    private depth;
    private minShift;
    setupP?: ReturnType<CSI['_parse']>;
    lineCount(refId: number, opts?: BaseOpts): Promise<number>;
    indexCov(): Promise<never[]>;
    parseAuxData(bytes: Buffer, offset: number): {
        refNameToId: {
            [key: string]: number;
        };
        refIdToName: string[];
        columnNumbers: {
            ref: number;
            start: number;
            end: number;
        };
        coordinateType: string;
        metaValue: number;
        metaChar: string;
        skipLines: number;
        format: string;
        formatFlags: number;
    };
    _parse(opts: {
        signal?: AbortSignal;
    }): Promise<{
        refNameToId?: {
            [key: string]: number;
        } | undefined;
        refIdToName?: string[] | undefined;
        columnNumbers?: {
            ref: number;
            start: number;
            end: number;
        } | undefined;
        coordinateType?: string | undefined;
        metaValue?: number | undefined;
        metaChar?: string | undefined;
        skipLines?: number | undefined;
        format?: string | undefined;
        formatFlags?: number | undefined;
        csiVersion: number;
        firstDataLine: VirtualOffset | undefined;
        indices: {
            binIndex: {
                [key: string]: Chunk[];
            };
            stats?: {
                lineCount: number;
            } | undefined;
        }[];
        refCount: number;
        csi: boolean;
        maxBlockSize: number;
    }>;
    blocksForRange(refId: number, min: number, max: number, opts?: BaseOpts): Promise<Chunk[]>;
    /**
     * calculate the list of bins that may overlap with region [beg,end)
     * (zero-based half-open)
     */
    reg2bins(beg: number, end: number): number[][];
    parse(opts?: BaseOpts): Promise<{
        refNameToId?: {
            [key: string]: number;
        } | undefined;
        refIdToName?: string[] | undefined;
        columnNumbers?: {
            ref: number;
            start: number;
            end: number;
        } | undefined;
        coordinateType?: string | undefined;
        metaValue?: number | undefined;
        metaChar?: string | undefined;
        skipLines?: number | undefined;
        format?: string | undefined;
        formatFlags?: number | undefined;
        csiVersion: number;
        firstDataLine: VirtualOffset | undefined;
        indices: {
            binIndex: {
                [key: string]: Chunk[];
            };
            stats?: {
                lineCount: number;
            } | undefined;
        }[];
        refCount: number;
        csi: boolean;
        maxBlockSize: number;
    }>;
    hasRefSeq(seqId: number, opts?: BaseOpts): Promise<boolean>;
}
