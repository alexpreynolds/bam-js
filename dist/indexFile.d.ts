import { GenericFilehandle } from 'generic-filehandle';
import VirtualOffset from './virtualOffset';
import Chunk from './chunk';
import { BaseOpts } from './util';
export default abstract class IndexFile {
    filehandle: GenericFilehandle;
    renameRefSeq: Function;
    private _parseCache;
    /**
     * @param {filehandle} filehandle
     * @param {function} [renameRefSeqs]
     */
    constructor({ filehandle, renameRefSeq, }: {
        filehandle: GenericFilehandle;
        renameRefSeq?: (a: string) => string;
    });
    abstract lineCount(refId: number): Promise<number>;
    protected abstract _parse(opts?: BaseOpts): Promise<any>;
    abstract indexCov(refId: number, start?: number, end?: number): Promise<{
        start: number;
        end: number;
        score: number;
    }[]>;
    abstract blocksForRange(chrId: number, start: number, end: number, opts: BaseOpts): Promise<Chunk[]>;
    _findFirstData(data: any, virtualOffset: VirtualOffset): void;
    parse(opts?: BaseOpts): Promise<any>;
    hasRefSeq(seqId: number, opts?: BaseOpts): Promise<boolean>;
}
