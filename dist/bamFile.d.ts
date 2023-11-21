/// <reference types="node" />
import { Buffer } from 'buffer';
import { GenericFilehandle } from 'generic-filehandle';
import BAI from './bai';
import CSI from './csi';
import Chunk from './chunk';
import BAMFeature from './record';
import { BamOpts, BaseOpts } from './util';
export declare const BAM_MAGIC = 21840194;
export default class BamFile {
    renameRefSeq: (a: string) => string;
    bam: GenericFilehandle;
    header?: string;
    chrToIndex?: Record<string, number>;
    indexToChr?: {
        refName: string;
        length: number;
    }[];
    yieldThreadTime: number;
    index?: BAI | CSI;
    htsget: boolean;
    headerP?: ReturnType<BamFile['getHeaderPre']>;
    private featureCache;
    constructor({ bamFilehandle, bamPath, bamUrl, baiPath, baiFilehandle, baiUrl, csiPath, csiFilehandle, csiUrl, htsget, yieldThreadTime, renameRefSeqs, }: {
        bamFilehandle?: GenericFilehandle;
        bamPath?: string;
        bamUrl?: string;
        baiPath?: string;
        baiFilehandle?: GenericFilehandle;
        baiUrl?: string;
        csiPath?: string;
        csiFilehandle?: GenericFilehandle;
        csiUrl?: string;
        renameRefSeqs?: (a: string) => string;
        yieldThreadTime?: number;
        htsget?: boolean;
    });
    getHeaderPre(origOpts?: BaseOpts): Promise<{
        tag: string;
        data: {
            tag: string;
            value: string;
        }[];
    }[] | undefined>;
    getHeader(opts?: BaseOpts): Promise<{
        tag: string;
        data: {
            tag: string;
            value: string;
        }[];
    }[] | undefined>;
    getHeaderText(opts?: BaseOpts): Promise<string | undefined>;
    _readRefSeqs(start: number, refSeqBytes: number, opts?: BaseOpts): Promise<{
        chrToIndex: {
            [key: string]: number;
        };
        indexToChr: {
            refName: string;
            length: number;
        }[];
    }>;
    getRecordsForRange(chr: string, min: number, max: number, opts?: BamOpts): Promise<BAMFeature[]>;
    streamRecordsForRange(chr: string, min: number, max: number, opts?: BamOpts): AsyncGenerator<BAMFeature[], void, unknown>;
    _fetchChunkFeatures(chunks: Chunk[], chrId: number, min: number, max: number, opts?: BamOpts): AsyncGenerator<BAMFeature[], void, unknown>;
    fetchPairs(chrId: number, feats: BAMFeature[][], opts: BamOpts): Promise<BAMFeature[]>;
    _readRegion(position: number, size: number, opts?: BaseOpts): Promise<Buffer>;
    _readChunk({ chunk, opts }: {
        chunk: Chunk;
        opts: BaseOpts;
    }): Promise<{
        data: Buffer;
        cpositions: number[];
        dpositions: number[];
        chunk: Chunk;
    }>;
    readBamFeatures(ba: Buffer, cpositions: number[], dpositions: number[], chunk: Chunk): Promise<BAMFeature[]>;
    hasRefSeq(seqName: string): Promise<boolean | undefined>;
    lineCount(seqName: string): Promise<number>;
    indexCov(seqName: string, start?: number, end?: number): Promise<{
        start: number;
        end: number;
        score: number;
    }[]>;
    blocksForRange(seqName: string, start: number, end: number, opts?: BaseOpts): Promise<Chunk[]>;
}
