/// <reference types="node" />
import Chunk from './chunk';
import { GenericFilehandle } from 'generic-filehandle';
import BAMFeature from './record';
import { BamOpts, BaseOpts } from './util';
export declare const BAM_MAGIC = 21840194;
export default class BamFile {
    private renameRefSeq;
    private bam;
    private index;
    private chunkSizeLimit;
    private fetchSizeLimit;
    private header;
    protected featureCache: any;
    protected chrToIndex: any;
    protected indexToChr: any;
    private yieldThreadTime;
    /**
     * @param {object} args
     * @param {string} [args.bamPath]
     * @param {FileHandle} [args.bamFilehandle]
     * @param {string} [args.baiPath]
     * @param {FileHandle} [args.baiFilehandle]
     */
    constructor({ bamFilehandle, bamPath, bamUrl, baiPath, baiFilehandle, baiUrl, csiPath, csiFilehandle, csiUrl, cacheSize, fetchSizeLimit, chunkSizeLimit, yieldThreadTime, renameRefSeqs, }: {
        bamFilehandle?: GenericFilehandle;
        bamPath?: string;
        bamUrl?: string;
        baiPath?: string;
        baiFilehandle?: GenericFilehandle;
        baiUrl?: string;
        csiPath?: string;
        csiFilehandle?: GenericFilehandle;
        csiUrl?: string;
        cacheSize?: number;
        fetchSizeLimit?: number;
        chunkSizeLimit?: number;
        renameRefSeqs?: (a: string) => string;
        yieldThreadTime?: number;
    });
    getHeader(origOpts?: AbortSignal | BaseOpts): Promise<{
        tag: string;
        data: {
            tag: string;
            value: string;
        }[];
    }[]>;
    getHeaderText(opts?: BaseOpts): Promise<any>;
    _readRefSeqs(start: number, refSeqBytes: number, opts?: BaseOpts): Promise<{
        chrToIndex: {
            [key: string]: number;
        };
        indexToChr: {
            refName: string;
            length: number;
        }[];
    }>;
    getRecordsForRangeSample(chr: string, min: number, max: number, opts?: BamOpts): Promise<any>;
    getRecordsForRange(chr: string, min: number, max: number, opts?: BamOpts): Promise<BAMFeature[]>;
    streamRecordsForRangeSample(chr: string, min: number, max: number, opts?: BamOpts): Promise<any>;
    streamRecordsForRange(chr: string, min: number, max: number, opts?: BamOpts): AsyncGenerator<BAMFeature[], void, unknown>;
    _fetchChunkFeatures(chunks: Chunk[], chrId: number, min: number, max: number, opts: BamOpts): AsyncGenerator<BAMFeature[], void, unknown>;
    fetchPairs(chrId: number, featPromises: Promise<BAMFeature[]>[], opts: BamOpts): Promise<BAMFeature[]>;
    _readChunk({ chunk, opts }: {
        chunk: unknown;
        opts: BaseOpts;
    }, abortSignal?: AbortSignal): Promise<never[] | {
        data: any;
        cpositions: any;
        dpositions: any;
        chunk: unknown;
    }>;
    readBamFeatures(ba: Buffer, cpositions: number[], dpositions: number[], chunk: Chunk): Promise<BAMFeature[]>;
    hasRefSeq(seqName: string): Promise<boolean>;
    lineCount(seqName: string): Promise<number>;
    indexCov(seqName: string, start?: number, end?: number): Promise<{
        start: number;
        end: number;
        score: number;
    }[]>;
}
